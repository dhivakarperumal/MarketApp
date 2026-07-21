import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

// ─── Slide Data ────────────────────────────────────────────────────────────────
const features = [
  { title: 'Best Prices', description: 'Enjoy daily deals, exclusive discounts, and unbeatable grocery prices.', icon: 'tags' },
  { title: 'Fast Delivery', description: 'Same-day delivery with secure packaging to keep your groceries fresh.', icon: 'shipping-fast' },
  { title: 'Farm Fresh', description: 'Fresh fruits and vegetables sourced directly from trusted local farms.', icon: 'leaf' },
  { title: 'Quality Assured', description: 'Every product is carefully inspected to ensure premium quality.', icon: 'shield-alt' },
];

const deliveryFeatures = [
  { icon: 'truck', title: 'Fast Delivery', desc: 'Get your order within 90 mins' },
  { icon: 'shield', title: 'Fresh & Quality', desc: '100% fresh products at best prices' },
  { icon: 'credit-card', title: 'Secure Payment', desc: '100% secure & safe payments' },
  { icon: 'refresh-cw', title: 'Easy Returns', desc: '7 days easy returns policy' },
  { icon: 'headphones', title: '24/7 Support', desc: 'We are always here to help you' },
];

export const OnboardingScreen = () => {
  const { completeOnboarding } = useContext(AuthContext);
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const TOTAL = 5;

  const handleComplete = async () => {
    await completeOnboarding();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={{ flex: 1 }}>
        <Swiper
          ref={swiperRef}
          loop={false}
          showsPagination={true}
          onIndexChanged={(index) => setActiveIndex(index)}
          activeDotColor="#16a34a"
          dotColor="#e2e8f0"
          paginationStyle={{ bottom: height * 0.17 }}
          activeDotStyle={{ width: 24, height: 7, borderRadius: 4, marginHorizontal: 3 }}
          dotStyle={{ width: 7, height: 7, borderRadius: 4, marginHorizontal: 3 }}
        >

          {/* ── Slide 1: Welcome / Logo ─────────────────────────────────────── */}
          <View style={{ flex: 1, alignItems: 'center', paddingTop: height * 0.08, paddingHorizontal: 28 }}>
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 34, fontWeight: '900', color: '#15803d', marginTop: 16, letterSpacing: -0.5 }}>
              SuperMarket
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#64748b', marginTop: 4, letterSpacing: 1 }}>
              FRESH • QUALITY • SAVE MORE
            </Text>

            <Image
              source={require('../../assets/aboutimagesupermarket.png')}
              style={{ width: width * 0.78, height: width * 0.72, marginTop: 28 }}
              resizeMode="contain"
            />

            <Text style={{ fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 20, lineHeight: 24, fontWeight: '500' }}>
              Your one-stop supermarket for fresh groceries,{'\n'}delivered right to your door.
            </Text>
          </View>

          {/* ── Slide 2: About / Freshness ──────────────────────────────────── */}
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: height * 0.06 }}>
            <View style={{ position: 'relative' }}>
              <Image
                source={require('../../assets/aboutimagesupermarket.png')}
                style={{ width: '100%', height: 200, borderRadius: 24 }}
                resizeMode="cover"
              />
              <View style={{
                position: 'absolute', bottom: 12, left: 12,
                backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16,
              }}>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>10+</Text>
                <Text style={{ color: '#fff', fontSize: 11 }}>Years Serving Freshness</Text>
              </View>
            </View>

            <View style={{
              alignSelf: 'flex-start', marginTop: 20, backgroundColor: '#dcfce7',
              paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
            }}>
              <Text style={{ color: '#15803d', fontWeight: '700', fontSize: 12 }}>🌿 Fresh • Healthy • Affordable</Text>
            </View>

            <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827', marginTop: 12, lineHeight: 34 }}>
              Where Freshness Meets{'\n'}Convenience
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 10, lineHeight: 22 }}>
              We deliver fresh groceries, vegetables, fruits, dairy, snacks & household essentials — premium quality at affordable prices.
            </Text>
          </View>

          {/* ── Slide 3: Why Choose Us ──────────────────────────────────────── */}
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: height * 0.06 }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#15803d', textAlign: 'center' }}>
              Why Choose Us?
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 6, marginBottom: 20 }}>
              We go the extra mile for every customer
            </Text>

            {features.map((item) => (
              <View
                key={item.title}
                style={{
                  backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 10,
                  flexDirection: 'row', alignItems: 'center',
                  elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6,
                  borderWidth: 1, borderColor: '#f0fdf4',
                }}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={item.icon} size={18} color="#fff" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827' }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 18 }}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Slide 4: Delivery Features ──────────────────────────────────── */}
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: height * 0.06 }}>
            <Image
              source={require('../../assets/bannersm1.png')}
              style={{ width: '100%', height: 160, borderRadius: 20 }}
              resizeMode="cover"
            />

            <Text style={{ fontSize: 26, fontWeight: '900', color: '#15803d', marginTop: 20 }}>
              Everything You Need
            </Text>
            <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 16 }}>
              Built to make grocery shopping effortless
            </Text>

            {deliveryFeatures.map((item) => (
              <View
                key={item.title}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: '#f0fdf4', borderRadius: 14,
                  padding: 12, marginBottom: 8,
                }}
              >
                <View style={{
                  width: 40, height: 40, borderRadius: 12,
                  backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FeatherIcon name={item.icon} size={18} color="#15803d" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Slide 5: Get Started / Offer ────────────────────────────────── */}
          <View style={{ flex: 1, alignItems: 'center', paddingTop: height * 0.05, paddingHorizontal: 28 }}>
            <Image
              source={require('../../assets/banner2.png')}
              style={{ width: '100%', height: 200, borderRadius: 24 }}
              resizeMode="cover"
            />

            <Text style={{ fontSize: 30, fontWeight: '900', color: '#15803d', textAlign: 'center', marginTop: 24 }}>
              Exclusive Offers
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b', textAlign: 'center' }}>
              Just for You!
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 10, lineHeight: 22, paddingHorizontal: 16 }}>
              Get up to 40% off on your first order. Fresh groceries, amazing deals — start saving today!
            </Text>

            {/* Mini stat badges */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 22 }}>
              {[
                { num: '500+', label: 'Products' },
                { num: '10K+', label: 'Happy Customers' },
                { num: '99%', label: 'Satisfaction' },
              ].map((s) => (
                <View
                  key={s.label}
                  style={{
                    flex: 1, backgroundColor: '#f0fdf4', borderRadius: 16,
                    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#bbf7d0',
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#15803d' }}>{s.num}</Text>
                  <Text style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

        </Swiper>

        {/* ── Bottom Controls ──────────────────────────────────────────────── */}
        <View style={{ position: 'absolute', bottom: 28, left: 0, right: 0, paddingHorizontal: 28 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              if (activeIndex < TOTAL - 1) {
                swiperRef.current?.scrollBy(1);
              } else {
                handleComplete();
              }
            }}
          >
            <LinearGradient
              colors={['#22c55e', '#15803d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 16, borderRadius: 100, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.8 }}>
                {activeIndex === TOTAL - 1 ? '🛒  GET STARTED' : 'NEXT  →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleComplete} style={{ marginTop: 14, alignItems: 'center' }} activeOpacity={0.6}>
            <Text style={{ color: '#94a3b8', fontWeight: '700', fontSize: 13, letterSpacing: 1 }}>SKIP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
