import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { Star, ShoppingCart, Heart } from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

type Props = {
  visible: boolean;
  product: any;
  onClose: () => void;
  onAdd?: (qty?: number) => void;
};

const { width } = Dimensions.get('window');

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

const QuickView: React.FC<Props> = ({ visible, product, onClose, onAdd }) => {
  const navigation = useNavigation<any>();
  const [qty, setQty] = useState(1);
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isInWishlist = wishlist.some((w: any) => w.product_id === product.id || w.id === product.id);

  const images = useMemo(() => {
    if (!product) return [];
    const candidates = [
      product?.product_images,
      product?.images,
      product?.thumbnail_image,
      product?.image,
      product?.image_url,
      product?.variants?.[0]?.images,
    ];

    const imgs = Array.from(
      new Set(
        candidates
          .flatMap((c: any) => normalizeImageList(c))
          .map(resolveImage)
          .filter(Boolean),
      ),
    );

    if (imgs.length) return imgs;
    return [`https://ui-avatars.com/api/?name=${encodeURIComponent(product?.name || 'Product')}&background=random`];
  }, [product]);

  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', maxHeight: '90%' }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', flex: 1 }} numberOfLines={1}>{product.name}</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 8, backgroundColor: '#f3f4f6', borderRadius: 20 }}>
              <Text style={{ color: '#444', fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 260 }}>
            <Swiper autoplay loop showsPagination dotColor="#e5e7eb" activeDotColor="#16a34a">
              {images.map((img: string, idx: number) => (
                <Image key={idx} source={{ uri: img }} style={{ width: width, height: 260, resizeMode: 'cover' }} />
              ))}
            </Swiper>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 6 }}>{product.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text style={{ color: '#666' }}>{parseFloat(String(product.rating || '0.0')).toFixed(1)}</Text>
                  <Text style={{ color: '#999' }}>({product.review_count || 0})</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#16a34a' }}>₹{product.offer_price || product.selling_price || product.price}</Text>
                {product.mrp ? <Text style={{ textDecorationLine: 'line-through', color: '#9ca3af' }}>₹{product.mrp}</Text> : null}
              </View>
            </View>

            <Text style={{ marginTop: 12, color: '#444', lineHeight: 20 }}>{product.description || 'No description available.'}</Text>

            <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center', justifyContent: 'space-between' }}>
               <Text style={{ fontWeight: '600' }}>Quantity</Text>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 4 }}>
                <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: 12 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{qty}</Text>
                <TouchableOpacity onPress={() => setQty((q) => q + 1)} style={{ padding: 12 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
               </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 24, gap: 12, paddingBottom: 24 }}>
              <TouchableOpacity onPress={async () => { await addToCart(product, null, null, qty); onClose(); }} style={{ flex: 1, backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#16a34a', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Add to Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { onClose(); navigation.navigate('ProductDetails', { id: product.id, product }); }} style={{ flex: 1, backgroundColor: '#fbbf24', padding: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#fbbf24', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
                <Text style={{ color: '#000', fontWeight: '800', fontSize: 16 }}>Buy Now</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default QuickView;
