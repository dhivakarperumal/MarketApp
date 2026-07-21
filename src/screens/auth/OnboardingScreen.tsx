import React, { useContext, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const OnboardingScreen = () => {
  const { completeOnboarding } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleComplete = async () => {
    await completeOnboarding();
  };

  const slides = [
    {
      id: 1,
      image: require('../../assets/logo.png'),
      title: 'FreshMart',
      subtitle: 'Supermarket',
      basketImage: require('../../assets/aboutimagesupermarket.png'),
      description: 'Fresh products\ndelivered to your door',
      layout: 'logo-top',
    },
    {
      id: 2,
      image: require('../../assets/aboutimagesupermarket.png'),
      title: 'Fresh groceries',
      subtitle: 'at your doorstep',
      description: 'Get the best quality products\ndelivered to your home',
      layout: 'text-top',
    },
    {
      id: 3,
      image: require('../../assets/banner2.png'),
      title: 'Exclusive Offers',
      subtitle: 'just for you',
      description: 'Enjoy great discounts\non your daily needs',
      layout: 'text-top',
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1">
        <Swiper
          ref={swiperRef}
          loop={false}
          showsPagination={true}
          onIndexChanged={(index) => setActiveIndex(index)}
          activeDotColor="#16a34a"
          dotColor="#e2e8f0"
          paginationStyle={{ bottom: height * 0.22 }}
          activeDotStyle={{ width: 24, height: 6, borderRadius: 3, marginHorizontal: 4 }}
          dotStyle={{ width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 }}
        >
          {slides.map((slide) => (
            <View key={slide.id} className="flex-1 items-center pt-16 px-8">
              {slide.layout === 'logo-top' ? (
                // First Page Layout (Logo top, Basket middle, Text bottom)
                <>
                  <Image 
                    source={slide.image} 
                    className="w-32 h-32 object-contain" 
                  />
                  <Text className="text-[32px] font-extrabold text-emerald-600 mt-4 tracking-tight">{slide.title}</Text>
                  <Text className="text-xl font-bold text-slate-700 mb-10 tracking-wide">{slide.subtitle}</Text>
                  
                  <Image 
                    source={slide.basketImage} 
                    className="w-[280px] h-[280px] object-contain shadow-sm" 
                  />
                  
                  <View className="absolute bottom-[30%]">
                    <Text className="text-slate-500 text-center text-base font-medium leading-6 px-6">
                      {slide.description}
                    </Text>
                  </View>
                </>
              ) : (
                // Second & Third Page Layout (Text top, Image bottom)
                <View className="w-full flex-1 items-center mt-12">
                  <Text className="text-3xl font-extrabold text-emerald-600 text-center leading-10 tracking-tight">
                    {slide.title}
                  </Text>
                  <Text className="text-2xl font-bold text-slate-800 text-center mb-4 leading-8">
                    {slide.subtitle}
                  </Text>
                  <Text className="text-slate-500 text-center text-base font-medium mb-12 px-6 leading-6">
                    {slide.description}
                  </Text>
                  
                  <Image 
                    source={slide.image} 
                    className="w-[320px] h-[320px] object-contain shadow-sm" 
                  />
                </View>
              )}
            </View>
          ))}
        </Swiper>

        {/* Bottom Fixed Controls */}
        <View className="absolute bottom-10 left-0 right-0 px-8">
          <TouchableOpacity
            onPress={() => {
              if (activeIndex < 2) {
                swiperRef.current?.scrollBy(1);
              } else {
                handleComplete();
              }
            }}
            activeOpacity={0.8}
            className="w-full shadow-lg shadow-emerald-500/30"
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 rounded-full items-center justify-center w-full"
            >
              <Text className="text-white text-lg font-bold tracking-wider">
                {activeIndex === 2 ? 'GET STARTED' : 'NEXT'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleComplete} 
            className="mt-5 py-3 items-center"
            activeOpacity={0.6}
          >
            <Text className="text-slate-400 font-bold text-base tracking-wide uppercase">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
