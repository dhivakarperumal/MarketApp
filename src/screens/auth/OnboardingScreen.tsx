import React, { useContext, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
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
                  <Text className="text-3xl font-bold text-green-600 mt-2">{slide.title}</Text>
                  <Text className="text-lg font-semibold text-slate-500 mb-10">{slide.subtitle}</Text>
                  
                  <Image 
                    source={slide.basketImage} 
                    className="w-[280px] h-[280px] object-contain" 
                  />
                  
                  <View className="absolute bottom-[28%]">
                    <Text className="text-slate-500 text-center text-sm font-medium leading-5">
                      {slide.description}
                    </Text>
                  </View>
                </>
              ) : (
                // Second & Third Page Layout (Text top, Image bottom)
                <View className="w-full flex-1 items-center mt-10">
                  <Text className="text-2xl font-bold text-green-700 text-center leading-8">
                    {slide.title}
                  </Text>
                  <Text className="text-2xl font-bold text-slate-800 text-center mb-4 leading-8">
                    {slide.subtitle}
                  </Text>
                  <Text className="text-slate-500 text-center text-sm font-medium mb-12 px-4 leading-5">
                    {slide.description}
                  </Text>
                  
                  <Image 
                    source={slide.image} 
                    className="w-[300px] h-[300px] object-contain" 
                  />
                </View>
              )}
            </View>
          ))}
        </Swiper>

        {/* Bottom Fixed Controls */}
        <View className="absolute bottom-10 left-0 right-0 px-6">
          <TouchableOpacity
            onPress={() => {
              if (activeIndex < 2) {
                swiperRef.current?.scrollBy(1);
              } else {
                handleComplete();
              }
            }}
            className="bg-green-700 py-4 rounded-xl items-center shadow-sm w-full"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold tracking-wide">
              {activeIndex === 2 ? 'Get Started' : 'Get Started'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleComplete} 
            className="mt-6 py-2 items-center"
            activeOpacity={0.6}
          >
            <Text className="text-slate-800 font-bold text-sm">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
