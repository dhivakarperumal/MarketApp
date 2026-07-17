import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    Modal,
    Share,
    Platform,
    ScrollView,
} from 'react-native';
import { Star, ShoppingCart, Zap, TrendingUp, Heart, Plus, Share2, QrCode, ArrowRight } from 'lucide-react-native';

type Product = {
    id: number | string;
    name?: string;
    selling_price?: string;
    mrp?: string;
    offer?: string;
    thumbnail_image?: string;
    rating?: string;
    review_count?: number;
    status?: string;
    featured_product?: boolean;
    best_seller?: boolean;
    todays_deal?: boolean;
    delivery_time?: string;
    stock_quantity?: string;
    product_code?: string;
};

const resolveImage = (url?: string | null) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
    return trimmed;
};

const ProductCard: React.FC<{ product: Product; onPress?: () => void }> = ({ product, onPress }) => {
    const offerPercentage = parseFloat(String(product.offer || '0')) || 0;
    const sellingPrice = parseFloat(String(product.selling_price || '0')) || 0;
    const mrpPrice = parseFloat(String(product.mrp || '0')) || 0;
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [quickView, setQuickView] = useState(false);

    const imageSrc =
        Array.isArray(product.product_images) && product.product_images.length > 0
            ? resolveImage(product.product_images[0])
            : resolveImage(product.thumbnail_image) ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                product?.name || "Product"
            )}&background=d1fae5&color=065f46&size=400`;

    const handleAdd = () => {
        Alert.alert('Add to cart', `Added "${product.name}" to cart`);
    };

    const handleToggleWishlist = () => {
        setIsInWishlist((s) => !s);
        Alert.alert(isInWishlist ? 'Removed' : 'Added', `${product.name} ${isInWishlist ? 'removed from' : 'added to'} wishlist`);
    };

    const handleShare = async () => {
        const productUrl = `${Platform.OS === 'web' ? window.location.origin : 'https://example.com'}/products/${product.id}`;
        try {
            await Share.share({ message: `${product.name} - ${productUrl}`, title: product.name });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex-1 mx-1.5 mb-4"
            style={{
                elevation: 6,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
            }}
        >
            <View className="relative w-full h-40 bg-gray-100">
                <Image
                    source={{ uri: imageSrc }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Offer Badge top-left */}
                {offerPercentage > 0 && (
                    <View className="absolute top-2 left-2 z-20 bg-red-600 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">{offerPercentage.toFixed(0)}% OFF</Text>
                    </View>
                )}

                {/* Heart icon top-right */}
                <TouchableOpacity onPress={handleToggleWishlist} className="absolute top-2 right-2 z-20 bg-white p-2 rounded-full shadow">
                    <Heart size={18} color={isInWishlist ? '#ef4444' : '#9ca3af'} />
                </TouchableOpacity>


            </View>

            <View className="p-3 flex-1 justify-between">
                <View>
                    <Text className="text-sm font-bold text-slate-900 mb-1" numberOfLines={2}>
                        {product.name}
                    </Text>

                    {parseFloat(String(product.rating || '0')) > 0 && (
                        <View className="flex-row items-center gap-1 mb-2">
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-xs font-semibold text-slate-700">
                                {parseFloat(String(product.rating || '0')).toFixed(1)}
                            </Text>
                            <Text className="text-xs text-slate-500">({product.review_count || 0})</Text>
                        </View>
                    )}

                    <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-xl font-extrabold text-slate-900">₹{sellingPrice.toFixed(2)}</Text>
                        {mrpPrice > 0 && (
                            <Text className="text-sm line-through text-slate-400">₹{mrpPrice.toFixed(2)}</Text>
                        )}

                    </View>

                    {product.delivery_time && (
                        <Text className="text-xs text-green-600 font-semibold mb-2">📦 {product.delivery_time}</Text>
                    )}

                </View>

                <TouchableOpacity onPress={() => setQuickView(true)} className="mt-3 border border-green-600 rounded-lg py-3 flex-row items-center justify-center">
                    <Text className="text-green-600 font-semibold">Quick View</Text>
                    <Text className="text-green-600 ml-2">→</Text>
                </TouchableOpacity>
            </View>

            {/* QR Modal */}
            <Modal visible={showQR} transparent animationType="fade">
                <View className="flex-1 bg-black/60 items-center justify-center p-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-md">
                        <Text className="font-semibold text-lg mb-3">Scan to view product</Text>
                        <ScrollView className="mb-4">
                            <Text className="text-sm text-slate-600 break-words">{`${Platform.OS === 'web' ? window.location.origin : 'https://example.com'}/products/${product.id}`}</Text>
                        </ScrollView>
                        <View className="flex-row justify-end">
                            <TouchableOpacity onPress={() => setShowQR(false)} className="px-4 py-2 rounded-lg bg-slate-100">
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Quick View Modal */}
            <Modal visible={quickView} transparent animationType="slide">
                <View className="flex-1 bg-black/60 items-center justify-center p-4">
                    <View className="bg-white rounded-xl w-full max-w-lg p-4">
                        <View className="flex-row justify-between items-start mb-3">
                            <Text className="text-lg font-bold">{product.name}</Text>
                            <TouchableOpacity onPress={() => setQuickView(false)} className="px-2 py-1">
                                <Text className="text-slate-600">Close</Text>
                            </TouchableOpacity>
                        </View>

                        <Image source={{ uri: imageSrc }} className="w-full h-48 mb-3" resizeMode="cover" />

                        <Text className="text-sm text-slate-700 mb-2">Price: ₹{sellingPrice.toFixed(2)}</Text>
                        {mrpPrice > 0 && <Text className="text-sm line-through text-slate-500 mb-2">MRP: ₹{mrpPrice.toFixed(2)}</Text>}
                        {product.description ? <Text className="text-sm text-slate-600">{product.description}</Text> : <Text className="text-sm text-slate-400">No description available.</Text>}

                        <View className="mt-4 flex-row justify-end gap-2">
                            <TouchableOpacity onPress={() => { handleAdd(); setQuickView(false); }} className="bg-green-600 px-4 py-2 rounded-lg">
                                <Text className="text-white font-bold">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    );
};

export default ProductCard;
