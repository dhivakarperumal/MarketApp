import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Shield,
  Truck,
  Headphones,
  Globe,
  Mail,
  Phone,
  Heart,
  Zap,
  Award,
  Users,
  ChevronRight,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AboutSection } from '../components/AboutSection';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '100';

// ─── Reusable Info Row ──────────────────────────────────────────────────────
const InfoRow = ({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
}: {
  icon: any;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center p-4 border-b border-slate-100">
    <View
      className={`w-10 h-10 rounded-full ${iconBg} items-center justify-center mr-4`}>
      <Icon size={20} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-slate-500 mb-0.5">{label}</Text>
      <Text className="text-slate-800 font-semibold">{value}</Text>
    </View>
  </View>
);

// ─── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard = ({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
}: {
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
}) => (
  <View className="w-[47%] bg-white rounded-2xl p-4 mb-3 shadow-sm shadow-slate-100 border border-slate-50">
    <View
      className={`w-12 h-12 rounded-2xl ${iconBg} items-center justify-center mb-3`}>
      <Icon size={24} color={iconColor} />
    </View>
    <Text className="text-slate-900 font-bold text-sm mb-1">{title}</Text>
    <Text className="text-slate-500 text-xs leading-4">{subtitle}</Text>
  </View>
);

// ─── Contact Button ──────────────────────────────────────────────────────────
const ContactButton = ({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
  onPress,
}: {
  icon: any;
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-slate-100"
    onPress={onPress}
    activeOpacity={0.75}>
    <View
      className={`w-12 h-12 rounded-full ${iconBg} items-center justify-center mr-4`}>
      <Icon size={22} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-slate-400 mb-0.5">{label}</Text>
      <Text className="text-slate-800 font-semibold">{value}</Text>
    </View>
    <ChevronRight size={18} color="#94a3b8" />
  </TouchableOpacity>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export const AboutScreen = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLogoPress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.18,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* ── Header ── */}
      <View className="bg-green-600 pb-10 px-4 pt-4 rounded-b-[40px]">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">About Us</Text>
          <View className="w-10" />
        </View>

        

        {/* Logo + App Name */}
        <View className="items-center">
          <TouchableOpacity activeOpacity={0.9} onPress={handleLogoPress}>
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }] }}
              className="w-24 h-24 bg-white rounded-3xl items-center justify-center shadow-lg mb-4">
              <ShoppingCart size={48} color="#16a34a" />
            </Animated.View>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white mb-1">SuperMarket</Text>
          <View className="flex-row items-center bg-white/20 px-4 py-1.5 rounded-full">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-white text-sm font-semibold ml-1.5">
              Your Trusted Shopping Partner
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 -mt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Mission Card ── */}
        <View className="bg-white rounded-3xl p-5 shadow-sm shadow-slate-200/50 mb-6 mt-2">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center mr-3">
              <Zap size={18} color="#16a34a" />
            </View>
            <Text className="text-lg font-bold text-slate-900">Our Mission</Text>
          </View>
          <Text className="text-slate-600 leading-6">
            SuperMarket is built to make everyday grocery shopping effortless, affordable, and
            delightful. We connect you with the freshest products, exclusive deals, and
            lightning-fast delivery — all at your fingertips.
          </Text>
        </View>

        <AboutSection/>

        {/* ── App Info ── */}
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          App Information
        </Text>
        <View className="bg-white rounded-3xl p-2 shadow-sm shadow-slate-200/50 mb-6">
          <InfoRow
            icon={Award}
            iconColor="#f59e0b"
            iconBg="bg-amber-50"
            label="Version"
            value={`v${APP_VERSION} (Build ${BUILD_NUMBER})`}
          />
          <InfoRow
            icon={Globe}
            iconColor="#3b82f6"
            iconBg="bg-blue-50"
            label="Platform"
            value="Android & iOS"
          />
          <InfoRow
            icon={Shield}
            iconColor="#16a34a"
            iconBg="bg-green-50"
            label="Developer"
            value="Q Techx Solutions"
          />
          <View className="flex-row items-center p-4">
            <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center mr-4">
              <Heart size={20} color="#ec4899" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-0.5">Made With</Text>
              <Text className="text-slate-800 font-semibold">React Native & ❤️</Text>
            </View>
          </View>
        </View>

        {/* ── Key Features ── */}
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          Key Features
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          <FeatureCard
            icon={Truck}
            iconColor="#f97316"
            iconBg="bg-orange-50"
            title="Fast Delivery"
            subtitle="Get groceries delivered to your door within hours"
          />
          <FeatureCard
            icon={Shield}
            iconColor="#16a34a"
            iconBg="bg-green-50"
            title="Secure Payment"
            subtitle="100% safe & encrypted payment gateway"
          />
          <FeatureCard
            icon={Star}
            iconColor="#f59e0b"
            iconBg="bg-amber-50"
            title="Best Deals"
            subtitle="Exclusive discounts and combo offers daily"
          />
          <FeatureCard
            icon={Users}
            iconColor="#8b5cf6"
            iconBg="bg-purple-50"
            title="Community"
            subtitle="Trusted by 10,000+ happy shoppers"
          />
          <FeatureCard
            icon={Headphones}
            iconColor="#3b82f6"
            iconBg="bg-blue-50"
            title="24/7 Support"
            subtitle="We're here whenever you need us"
          />
          <FeatureCard
            icon={Zap}
            iconColor="#ec4899"
            iconBg="bg-pink-50"
            title="Smart Lists"
            subtitle="AI-powered shopping lists & recommendations"
          />
        </View>

        {/* ── Contact ── */}
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          Get In Touch
        </Text>
        <ContactButton
          icon={Globe}
          iconColor="#16a34a"
          iconBg="bg-green-50"
          label="Website"
          value="www.qtechx.com"
          onPress={() => Linking.openURL('https://www.qtechx.com').catch(() => {})}
        />
        <ContactButton
          icon={Mail}
          iconColor="#3b82f6"
          iconBg="bg-blue-50"
          label="Email Support"
          value="support@qtechx.com"
          onPress={() => Linking.openURL('mailto:support@qtechx.com').catch(() => {})}
        />
        <ContactButton
          icon={Phone}
          iconColor="#f97316"
          iconBg="bg-orange-50"
          label="Phone"
          value="+91 98765 43210"
          onPress={() => Linking.openURL('tel:+919876543210').catch(() => {})}
        />

        {/* ── Footer ── */}
        <View className="items-center mt-4">
          <Text className="text-slate-400 text-xs text-center leading-5">
            © 2025 Q Techx Solutions. All rights reserved.{'\n'}
            Made with love in India 🇮🇳
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
