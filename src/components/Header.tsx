import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Hardcoded for demonstration. In a real app, this would come from your auth state/context
  const userInitial = "U"; 

  return (
    <View className="bg-green-600 px-4 py-4 flex-row items-center justify-between shadow-md z-50">
      <Text className="text-white text-xl font-bold">{title}</Text>
      
      {/* Profile Avatar Button */}
      <TouchableOpacity 
        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.7}
      >
        <Text className="text-green-600 font-bold text-lg">{userInitial}</Text>
      </TouchableOpacity>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* Overlay to catch clicks outside the menu */}
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View className="flex-1 relative">
            
            {/* The Dropdown Menu Box */}
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="absolute top-16 right-4 bg-white rounded-xl shadow-lg w-40 border border-slate-100 overflow-hidden">
                <TouchableOpacity 
                  className="px-4 py-3 border-b border-slate-100 bg-white active:bg-slate-50"
                  onPress={() => {
                    setMenuVisible(false);
                    console.log("Navigate to Profile");
                  }}
                >
                  <Text className="text-slate-700 text-base font-medium">Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="px-4 py-3 bg-white active:bg-slate-50"
                  onPress={() => {
                    setMenuVisible(false);
                    console.log("Handle Logout");
                  }}
                >
                  <Text className="text-red-500 text-base font-bold">Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
