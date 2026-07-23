import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Star, ShoppingCart, ArrowLeft, Heart } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';
import { AuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { calculateStockConsumptionInBaseUnits } from '../utils/stockUtils';
import { ProductSection } from '../components/ProductSection';
import { launchImageLibrary } from 'react-native-image-picker';

export const ProductDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { addToCart } = useStore();
  const id = route.params?.id || route.params?.productId || null;

  const [product, setProduct] = useState<any>(route.params?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { user } = useContext(AuthContext);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState<any>(null);
  const [userReviewed, setUserReviewed] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({
    total_reviews: 0,
    average_rating: 0,
    five_star: 0,
    four_star: 0,
    three_star: 0,
    two_star: 0,
    one_star: 0,
  });

  const calculateStats = (reviewsArray: any[]) => {
    const total = reviewsArray.length;
    if (total === 0) {
      return { total_reviews: 0, average_rating: 0, five_star: 0, four_star: 0, three_star: 0, two_star: 0, one_star: 0 };
    }
    const stats = { total_reviews: total, average_rating: 0, five_star: 0, four_star: 0, three_star: 0, two_star: 0, one_star: 0 };
    let sum = 0;
    reviewsArray.forEach(r => {
      const rate = Number(r.rating);
      sum += rate;
      if (rate === 5) stats.five_star++;
      else if (rate === 4) stats.four_star++;
      else if (rate === 3) stats.three_star++;
      else if (rate === 2) stats.two_star++;
      else if (rate === 1) stats.one_star++;
    });
    stats.average_rating = Number((sum / total).toFixed(1));
    return stats;
  };

  const checkUserReview = async () => {
    try {
      const uId = user?.id || user?.user_id;
      if (!uId || !product?.customer_review) {
        setUserReviewed(false);
        return;
      }
      const hasReviewed = product.customer_review.some((r: any) => String(r.user_id) === String(uId));
      setUserReviewed(hasReviewed);
    } catch (err) {
      console.log("Review check error:", err);
      setUserReviewed(false);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Toast.show({ type: 'error', text1: 'Image picker error', text2: response.errorMessage });
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setReviewImage(`data:${asset.type};base64,${asset.base64}`);
      }
    });
  };

  const submitReview = async () => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Please login to submit a review' });
      return;
    }
    try {
      if (!rating) {
        Toast.show({ type: 'error', text1: 'Please select rating' });
        return;
      }
      const uId = user?.id || user?.user_id;

      await api.post(`/products/${product.id}/reviews`, {
        user_name: user?.username || user?.email?.split('@')[0] || 'User',
        user_email: user?.email,
        user_id: uId,
        rating: rating,
        comment: reviewText,
        review_image: reviewImage,
      });

      Toast.show({ type: 'success', text1: 'Review submitted successfully!' });

      setRating(0);
      setReviewText("");
      setReviewImage(null);
      setShowReviewForm(false);
      setUserReviewed(true);
      
      const res = await api.get(`/products/${id}`);
      if (res.data) {
         const data = res.data?.data || res.data;
         setProduct(data);
         const reviewsArr = data.customer_review || [];
         setReviews(reviewsArr);
         setReviewStats(calculateStats(reviewsArr));
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to submit review";
      Toast.show({ type: 'error', text1: errorMsg });

      if (errorMsg.includes("already submitted")) {
        setUserReviewed(true);
        setShowReviewForm(false);
      }
    }
  };

  const resolveImage = (url?: string | null) => {
    if (!url || typeof url !== 'string') return null;
    const t = url.trim();
    if (!t) return null;
    if (t.startsWith('http') || t.startsWith('data:')) return t;
    return t;
  };

  const normalizeImageList = (value: any) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [parsed].filter(Boolean);
      } catch {
        return [trimmed];
      }
    }
    return [value];
  };

  const getDisplayImages = (data: any) => {
    const candidates = [
      data?.variants?.[0]?.images,
      data?.thumbnail_image,
      data?.product_images,
      data?.images,
      data?.image,
      data?.image_url,
    ];

    const imgs = Array.from(
      new Set(
        candidates
          .flatMap((c: any) => normalizeImageList(c))
          .map(resolveImage)
          .filter(Boolean),
      ),
    );

    if (imgs.length > 0) return imgs;
    return [`https://ui-avatars.com/api/?name=${encodeURIComponent(data?.name || 'Product')}&background=random`];
  };

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      if (!id) return;
      if (!product) setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (!mounted) return;
        const data = res.data || res.data?.data || null;
        if (data) {
          setProduct(data);
          if (data?.variants?.length > 0 && !selectedVariant) {
            setSelectedVariant(data.variants[0]);
          }
          const reviewsArr = data.customer_review || [];
          setReviews(reviewsArr);
          setReviewStats(calculateStats(reviewsArr));
        }
        
        // Fetch related products
        try {
          const relRes = await api.get('/products');
          const relData = Array.isArray(relRes.data) ? relRes.data : (relRes.data?.products || relRes.data?.data || []);
          
          const catId = data?.category_id || data?.category || product?.category_id || product?.category;
          let filtered = relData.filter((p: any) => p.id !== id);
          
          if (catId) {
             const catFiltered = filtered.filter((p: any) => p.category_id == catId || p.category == catId);
             if (catFiltered.length > 0) {
                 filtered = catFiltered;
             }
          }
          
          setRelatedProducts(filtered.slice(0, 6));
        } catch (e) {
          console.error("Failed to fetch related products", e);
        }
        
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProduct();
    if (product && product.variants?.length > 0 && !selectedVariant) {
        setSelectedVariant(product.variants[0]);
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product?.variants && Array.isArray(product.variants) && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (user && product) {
      checkUserReview();
    }
  }, [user, product]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Product not found</Text>
      </View>
    );
  }

  const images = getDisplayImages(product);
  
  const currentItem = selectedVariant || product;
  const displayPrice = currentItem.offer_price || currentItem.sellingPrice || currentItem.selling_price || currentItem.price;
  const currentMrp = currentItem.mrp;
  const discount = currentMrp && displayPrice
    ? Math.round(((currentMrp - displayPrice) / currentMrp) * 100)
    : 0;

  const rawStock = Number(currentItem.total_stock ?? currentItem.stock_quantity ?? product.total_stock ?? product.stock_quantity ?? 0);
  const consumedStockForOne = calculateStockConsumptionInBaseUnits(
    currentItem?.weight_volume || currentItem?.weight || currentItem?.quantity || currentItem?.size || null,
    currentItem?.unit || currentItem?.measurementUnit || null,
    1
  );
  const finalConsumedForOne = consumedStockForOne > 0 ? consumedStockForOne : 1;
  const availableQty = finalConsumedForOne > 0 ? Math.floor(rawStock / finalConsumedForOne) : rawStock;
  const stock = availableQty;
  const isOutOfStock = stock < 1;
  const displayStock = Number.isInteger(rawStock) ? String(rawStock) : rawStock.toFixed(3).replace(/\.0+$/, '');
  const stockUnit = currentItem?.unit || product?.unit || "units";
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const insets = useSafeAreaInsets();
  
  let comboItems = [];
  try {
    if (Array.isArray(product.combo_items)) comboItems = product.combo_items;
    else if (typeof product.combo_items === 'string') comboItems = JSON.parse(product.combo_items || '[]');
  } catch (e) {
    comboItems = [];
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* Premium Header */}
      <View 
        className="bg-green-600 pb-5 px-4 rounded-b-[40px] z-20 shadow-sm shadow-green-700/20 flex-row items-center justify-between"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white pr-4">Product Details</Text>
        </View>
        <TouchableOpacity
          onPress={() => setWishlisted(!wishlisted)}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
        >
          <Heart size={20} color={wishlisted ? '#ef4444' : '#ffffff'} fill={wishlisted ? '#ef4444' : 'transparent'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false} className="pt-2">
        {/* Image Swiper */}
        <View className="h-64 bg-slate-100">
          <Swiper 
            ref={swiperRef}
            autoplay={false} 
            loop={false} 
            showsPagination={false} 
            onIndexChanged={(index) => setActiveIndex(index)}
          >
            {images.map((img: string, idx: number) => (
              <Image key={idx} source={{ uri: img }} className="w-full h-80" resizeMode="cover" />
            ))}
          </Swiper>
        </View>

        {/* Product Info Card */}
        <View className="bg-white rounded-t-[32px] -mt-6 px-5 pt-6 pb-32 z-10">
          
          {/* Thumbnail Images */}
          {images.length > 0 && (
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {images.map((img: string, idx: number) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => swiperRef.current?.scrollTo(idx)}
                    className={`mr-3 rounded-xl border-2 overflow-hidden ${activeIndex === idx ? 'border-green-500' : 'border-transparent'}`}
                  >
                    <Image source={{ uri: img }} className="w-16 h-16 bg-slate-100" resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Name & Rating */}
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-xl font-bold text-slate-900 flex-1 pr-2">{product.name}</Text>
            <View className="flex-row items-center bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              <Star size={13} color="#f59e0b" fill="#f59e0b" />
              <Text className="text-xs font-bold text-amber-700 ml-1">{product.rating || '0.0'}</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm mb-4">({product.review_count || 0} reviews)</Text>

          {/* Price Row */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-green-700 mr-3">₹{displayPrice}</Text>
              {currentMrp && (
                <Text className="text-base line-through text-slate-400 mr-2">₹{currentMrp}</Text>
              )}
              {discount > 0 && (
                <View className="bg-green-100 px-2 py-0.5 rounded-md">
                  <Text className="text-green-700 text-xs font-bold">{discount}% OFF</Text>
                </View>
              )}
            </View>
            
            <View className={`px-3 py-1 rounded-full ${!isOutOfStock ? (stock < 10 ? 'bg-orange-100' : 'bg-green-100') : 'bg-red-100'}`}>
               <Text className={`text-xs font-bold ${!isOutOfStock ? (stock < 10 ? 'text-orange-700' : 'text-green-700') : 'text-red-700'}`}>
                 {!isOutOfStock ? `Available: ${displayStock} ${stockUnit}` : 'Out of Stock'}
               </Text>
            </View>
          </View>

          {/* Variants Selector */}
          {variants.length > 0 && (
            <View className="mb-5">
              <Text className="text-sm font-bold text-slate-700 mb-2">Select Weight / Size</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {variants.map((v: any, idx: number) => {
                  const isSelected = selectedVariant === v;
                  const weightLabel = `${v.quantity || v.weight_volume || ''} ${v.unit || ''}`.trim();
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedVariant(v)}
                      className={`mr-3 px-5 py-2 rounded-xl border ${isSelected ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}`}
                    >
                      <Text className={`font-semibold ${isSelected ? 'text-green-700' : 'text-slate-600'}`}>
                        {weightLabel || 'Standard'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

           {/* Quantity */}
          <View className="flex-row items-center mb-4">
            <Text className="text-sm font-bold text-slate-700 flex-1">Quantity</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 items-center justify-center"
                disabled={stock === 0}
              >
                <Text className={`text-xl font-bold ${stock === 0 ? 'text-slate-300' : 'text-slate-600'}`}>−</Text>
              </TouchableOpacity>
              <View className="w-10 h-10 items-center justify-center border-l border-r border-slate-200">
                <Text className={`font-bold ${stock === 0 ? 'text-slate-400' : 'text-slate-800'}`}>{stock === 0 ? 0 : quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.min(stock, q + 1))}
                className="w-10 h-10 items-center justify-center"
                disabled={stock === 0 || quantity >= stock}
              >
                <Text className={`text-xl font-bold ${stock === 0 || quantity >= stock ? 'text-slate-300' : 'text-green-600'}`}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Combo Items */}
          {comboItems.length > 0 && (
            <View className="mb-5">
              <Text className="text-sm font-bold text-slate-700 mb-3">Combo Includes</Text>
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                {comboItems.map((item: any, idx: number) => {
                  const itemName = typeof item === 'string' ? item : (item.name || item.product_name || item.item_name || 'Item');
                  const itemQty = typeof item === 'object' && item.quantity ? ` x${item.quantity}` : '';
                  return (
                    <View key={idx} className={`flex-row items-center ${idx !== comboItems.length - 1 ? 'mb-2.5' : ''}`}>
                      <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3" />
                      <Text className="text-slate-600 flex-1 text-sm font-medium">{itemName}{itemQty}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View className="h-px bg-slate-100 mb-5" />

          {/* Description */}
          <Text className="text-sm font-bold text-slate-700 mb-2">Description</Text>
          <Text className="text-sm text-slate-500 leading-relaxed mb-5">
            {product.description || 'No description available.'}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-2 mb-6">
            <TouchableOpacity
              onPress={async () => {
                const itemToAdd = {
                  ...product,
                  ...currentItem,
                  id: product.id || product.product_id,
                  variant_size: currentItem !== product ? `${currentItem.quantity || currentItem.weight_volume || ''} ${currentItem.unit || ''}`.trim() : null
                };
                await addToCart(itemToAdd, quantity);
                Toast.show({ type: 'success', text1: 'Added to Cart', text2: `${product.name} x${quantity}` });
              }}
              disabled={stock === 0}
              className={`flex-1 flex-row items-center justify-center border py-3.5 rounded-2xl ${stock === 0 ? 'bg-slate-100 border-slate-200' : 'bg-green-50 border-green-500'}`}
            >
              <ShoppingCart size={18} color={stock === 0 ? "#94a3b8" : "#16a34a"} />
              <Text className={`font-bold ml-2 ${stock === 0 ? 'text-slate-400' : 'text-green-700'}`}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Checkout', {
                  product: product,
                  variant: selectedVariant,
                  quantity: quantity
                });
              }}
              disabled={stock === 0}
              className={`flex-1 py-3.5 rounded-2xl items-center justify-center ${stock === 0 ? 'bg-slate-200' : 'bg-green-600'}`}
            >
              <Text className={`font-bold text-base ${stock === 0 ? 'text-slate-400' : 'text-white'}`}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          {/* REVIEW SECTION */}
          <View className="mt-4 mb-8">
            <View className="flex-row items-center justify-between border-t border-slate-200 pt-8 mb-5">
              <Text className="text-xl font-bold text-slate-800">Reviews</Text>
              
              {userReviewed ? (
                <Text className="text-green-600 font-bold text-xs">You reviewed this</Text>
              ) : !user ? (
                <TouchableOpacity onPress={() => Toast.show({ type: 'error', text1: 'Please login to write a review' })} className="px-4 py-2 rounded-xl bg-slate-500">
                  <Text className="text-white font-bold text-xs">Login to Review</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 rounded-xl bg-green-600">
                  <Text className="text-white font-bold text-xs">{showReviewForm ? "Cancel" : "Write Review"}</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {showReviewForm && (
              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
                <Text className="text-lg font-bold mb-4 text-slate-800">Share your experience</Text>
                <Text className="font-bold text-slate-700 mb-2">Rating</Text>
                <View className="flex-row gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      <Star size={26} color={star <= rating ? "#facc15" : "#cbd5e1"} fill={star <= rating ? "#facc15" : "transparent"} />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text className="font-bold text-slate-700 mb-2">Review</Text>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Write your review here..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="w-full border border-slate-300 bg-white rounded-xl p-3 h-24 mb-4"
                />

                <Text className="font-bold text-slate-700 mb-2">Upload Image (optional)</Text>
                <TouchableOpacity onPress={handleImagePick} className="w-full border border-slate-300 border-dashed bg-white rounded-xl p-3 items-center justify-center mb-4">
                  <Text className="text-slate-500 font-semibold">{reviewImage ? "Change Image" : "Select an Image"}</Text>
                </TouchableOpacity>
                {reviewImage && (
                  <View className="relative w-24 h-24 mb-4">
                    <Image source={{ uri: reviewImage }} className="w-24 h-24 rounded-xl border border-slate-200" />
                    <TouchableOpacity onPress={() => setReviewImage(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white font-bold text-xs">X</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity onPress={submitReview} className="bg-green-600 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">Submit Review</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View className="mb-6">
              
              <View className="flex-row items-center gap-4 mb-6">
                <Text className="text-4xl font-bold text-slate-800">{reviewStats.average_rating}</Text>
                <View>
                  <View className="flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} color={star <= Math.round(reviewStats.average_rating) ? "#facc15" : "#e2e8f0"} fill={star <= Math.round(reviewStats.average_rating) ? "#facc15" : "transparent"} />
                    ))}
                  </View>
                  <Text className="text-xs text-slate-500 mt-1">Based on {reviewStats.total_reviews} reviews</Text>
                </View>
              </View>

              <View className="space-y-2 mb-8">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = (reviewStats as any)[`${star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one'}_star`] || 0;
                  const percentage = reviewStats.total_reviews > 0 ? (count / reviewStats.total_reviews) * 100 : 0;
                  return (
                    <View key={star} className="flex-row items-center gap-3">
                      <Text className="text-xs font-bold text-slate-600 w-3">{star}</Text>
                      <Star color="#facc15" fill="#facc15" size={12} />
                      <View className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <View className="h-full bg-green-500" style={{ width: `${percentage}%` }} />
                      </View>
                      <Text className="text-xs text-slate-500 w-6 text-right">{count}</Text>
                    </View>
                  );
                })}
              </View>
              
              {reviews.length > 0 ? (
                <View>
                  {reviews.map((review, idx) => (
                    <View key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4">
                      <View className="flex-row justify-between items-start mb-2">
                        <View>
                          <Text className="font-bold text-slate-800 text-base">{review.user_name}</Text>
                          <View className="flex-row gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} color={star <= review.rating ? "#facc15" : "#e2e8f0"} fill={star <= review.rating ? "#facc15" : "transparent"} />
                            ))}
                          </View>
                        </View>
                        <Text className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                          {new Date(review.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text className="text-slate-600 italic mt-2">{review.review || review.comment}</Text>
                      
                      {(review.review_image || review.image) && (
                        <Image source={{ uri: review.review_image || review.image }} className="w-24 h-24 rounded-xl mt-3 border border-slate-100" />
                      )}
                      
                      {review.admin_reply && (
                        <View className="mt-4 bg-green-50/50 p-3 rounded-xl border-l-4 border-green-500/30">
                          <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Response from Seller</Text>
                          <Text className="text-slate-600 text-sm italic">{review.admin_reply}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center py-8 bg-slate-50 rounded-2xl">
                  <Text className="text-slate-500 font-bold text-center">No reviews yet. Be the first to share your experience!</Text>
                </View>
              )}
            </View>
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View className="-mx-5 mt-2 bg-slate-50 pb-4">
              <ProductSection
                title="Related"
                highlight="Products"
                products={relatedProducts}
                itemWidth={170}
              />
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;


