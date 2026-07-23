import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { LogOut } from 'lucide-react-native';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <TouchableWithoutFeedback>
            <View className="w-full bg-white rounded-3xl p-6 items-center shadow-lg">
              <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
                <LogOut size={28} color="#EF4444" />
              </View>
              
              <Text className="text-xl font-bold text-slate-800 mb-2 text-center">
                Log Out
              </Text>
              
              <Text className="text-sm text-slate-500 text-center mb-6">
                Are you sure you want to log out of your account? You will need to login again to access your orders and wishlist.
              </Text>
              
              <View className="flex-row w-full gap-3">
                <TouchableOpacity
                  onPress={onCancel}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-100 items-center justify-center"
                >
                  <Text className="font-bold text-slate-700">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={onConfirm}
                  className="flex-1 py-3.5 rounded-2xl bg-red-500 items-center justify-center"
                >
                  <Text className="font-bold text-white">Yes, Log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
