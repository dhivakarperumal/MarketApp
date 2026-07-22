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
import { Star, ShoppingCart, Zap, TrendingUp, Heart, Share2, QrCode } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import QuickView from './QuickView';
import { useStore } from '../context/StoreContext';

// product is treated as any to accommodate varying API shapes

const resolveImage = (url?: string | null) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
    return trimmed;
};

const ProductCard: React.FC<{ product: any; onPress?: () => void; compact?: boolean }> = ({ product, onPress, compact }) => {
    const offerPercentage = parseFloat(String(product.offer || '0')) || 0;
    const sellingPrice = parseFloat(String(product.selling_price || '0')) || 0;
    const mrpPrice = parseFloat(String(product.mrp || '0')) || 0;
    const { wishlist, toggleWishlist } = useStore();
    const isInWishlist = wishlist.some((w) => w.product_id === product.id || w.id === product.id);
    const [showQR, setShowQR] = useState(false);
    const [quickView, setQuickView] = useState(false);

    const imageSrc =
        Array.isArray((product as any).product_images) && (product as any).product_images.length > 0
            ? resolveImage((product as any).product_images[0])
            : resolveImage((product as any).thumbnail_image) ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                product?.name || "Product"
            )}&background=d1fae5&color=065f46&size=400`;
    const imageUri: string | undefined = imageSrc ? imageSrc : undefined;

    const handleAdd = () => {
        Alert.alert('Add to cart', `Added "${product.name}" to cart`);
    };

    const navigation = useNavigation<any>();

    const handleToggleWishlist = async () => {
        try {
            await toggleWishlist(product);
        } catch (err) {
            console.error('Wishlist toggle failed', err);
        }
    };

    const handleShare = async () => {
        const origin = Platform.OS === 'web' && typeof globalThis !== 'undefined' && (globalThis as any).location?.origin ? (globalThis as any).location.origin : 'https://example.com';
        const productUrl = `${origin}/products/${product.id}`;
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
                <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { id: product.id, product })} activeOpacity={0.9}>
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
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
                    <Text
                        className="text-sm font-bold text-slate-900 mb-1"
                        numberOfLines={compact ? 1 : 2}
                        onPress={() => navigation.navigate('ProductDetails', { id: product.id, product })}
                    >
                        {product.name}
                    </Text>

                    {/* {parseFloat(String(product.rating || '0')) > 0 && (
                        <View className="flex-row items-center gap-1 mb-2">
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-xs font-semibold text-slate-700">
                                {parseFloat(String(product.rating || '0')).toFixed(1)}
                            </Text>
                            <Text className="text-xs text-slate-500">({product.review_count || 0})</Text>
                        </View>
                    )} */}

                    <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-xl font-extrabold text-[#2F7D5A]">₹{sellingPrice.toFixed(2)}</Text>
                        {mrpPrice > 0 && (
                            <Text className="text-sm line-through text-slate-400">₹{mrpPrice.toFixed(2)}</Text>
                        )}

                    </View>

                    {/* {product.delivery_time && (
                        <Text className="text-xs text-green-600 font-semibold mb-2">📦 {product.delivery_time}</Text>
                    )} */}

                </View>

                {!compact && (
                    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { id: product.id, product })} className="mt-3 border border-green-600 rounded-lg py-3 flex-row items-center justify-center">
                        <Text className="text-green-600 font-semibold">Quick View</Text>
                        <Text className="text-green-600 ml-2">→</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* QR Modal */}
            <Modal visible={showQR} transparent animationType="fade">
                <View className="flex-1 bg-black/60 items-center justify-center p-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-md">
                        <Text className="font-semibold text-lg mb-3">Scan to view product</Text>
                        <ScrollView className="mb-4">
                            <Text className="text-sm text-slate-600 break-words">{`${Platform.OS === 'web' && typeof globalThis !== 'undefined' && (globalThis as any).location?.origin ? (globalThis as any).location.origin : 'https://example.com'}/products/${product.id}`}</Text>
                        </ScrollView>
                        <View className="flex-row justify-end">
                            <TouchableOpacity onPress={() => setShowQR(false)} className="px-4 py-2 rounded-lg bg-slate-100">
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Quick View Modal Component */}
            <QuickView visible={quickView} product={product} onClose={() => setQuickView(false)} onAdd={(qty) => { handleAdd(); setQuickView(false); }} />
        </TouchableOpacity>
    );
};

export default ProductCard;
