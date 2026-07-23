import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onConfirm: () => void;
  confirmText?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  cancelText?: string;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title,
  message,
  type = 'error',
  onConfirm,
  confirmText = 'OK',
  showCancel = false,
  onCancel,
  cancelText = 'Cancel',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={28} color="#10B981" />;
      case 'error':
        return <AlertCircle size={28} color="#EF4444" />;
      default:
        return <Info size={28} color="#3B82F6" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      default: return 'bg-blue-50';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={showCancel && onCancel ? onCancel : onConfirm}>
      <TouchableWithoutFeedback onPress={showCancel && onCancel ? onCancel : onConfirm}>
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <TouchableWithoutFeedback>
            <View className="w-full bg-white rounded-3xl p-6 items-center shadow-lg">
              <View className={`w-16 h-16 rounded-full ${getBgColor()} items-center justify-center mb-4`}>
                {getIcon()}
              </View>
              
              <Text className="text-xl font-bold text-slate-800 mb-2 text-center">
                {title}
              </Text>
              
              <Text className="text-sm text-slate-500 text-center mb-6">
                {message}
              </Text>
              
              {showCancel ? (
                <View className="flex-row w-full gap-3 mt-2">
                  <TouchableOpacity
                    onPress={onCancel}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200"
                  >
                    <Text className="font-bold text-slate-700">{cancelText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onConfirm}
                    className={`flex-1 py-3.5 rounded-2xl ${getButtonColor()} items-center justify-center`}
                  >
                    <Text className="font-bold text-white">{confirmText}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={onConfirm}
                  className={`w-full py-3.5 rounded-2xl ${getButtonColor()} items-center justify-center`}
                >
                  <Text className="font-bold text-white">{confirmText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
