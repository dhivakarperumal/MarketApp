import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, X, Home, Map, Navigation, Phone, User, Building2, Mail } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Toast from 'react-native-toast-message';

export const AddressScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useContext(AuthContext) as any;
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India',
    address_type: 'Home'
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const uid = user?.user_id || user?.id;
    if (!uid) { setLoading(false); return; }
    try {
      setLoading(true);
      const res = await api.get(`/addresses/user/${uid}`);
      setAddresses(res.data || []);
    } catch (error) {
      console.log('Failed to fetch addresses', error);
      Toast.show({ type: 'error', text1: 'Could not load addresses' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      customer_name: user?.username || '',
      customer_phone: '',
      customer_email: user?.email || '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'India',
      address_type: 'Home'
    });
    setShowAddModal(true);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      customer_name: address.customer_name || '',
      customer_phone: address.customer_phone || '',
      customer_email: address.customer_email || '',
      street_address: address.street_address || '',
      city: address.city || '',
      state: address.state || '',
      zip_code: address.zip_code || '',
      country: address.country || 'India',
      address_type: address.address_type || 'Home'
    });
    setShowAddModal(true);
  };

  const handleDelete = (address: any) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete this ${address.address_type || 'address'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/addresses/${address.id}`);
              Toast.show({ type: 'success', text1: 'Address deleted' });
              fetchAddresses();
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Failed to delete address' });
            }
          }
        }
      ]
    );
  };

  const saveAddress = async () => {
    if (!formData.customer_name.trim()) return Toast.show({ type: 'error', text1: 'Please enter your name' });
    if (!formData.street_address.trim()) return Toast.show({ type: 'error', text1: 'Please enter street address' });
    if (!formData.city.trim()) return Toast.show({ type: 'error', text1: 'Please enter city' });
    if (!formData.state.trim()) return Toast.show({ type: 'error', text1: 'Please enter state' });
    if (!formData.zip_code.trim()) return Toast.show({ type: 'error', text1: 'Please enter zip code' });

    setSaving(true);
    try {
      const payload = {
        user_id: user?.user_id || user?.id,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country || 'India',
        address_type: formData.address_type,
        is_default: addresses.length === 0 ? 1 : 0
      };

      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}`, payload);
        Toast.show({ type: 'success', text1: 'Address updated successfully!' });
      } else {
        await api.post('/addresses', payload);
        Toast.show({ type: 'success', text1: 'Address saved successfully!' });
      }
      setShowAddModal(false);
      fetchAddresses();
    } catch (error) {
      console.log('Failed to save address', error);
      Toast.show({ type: 'error', text1: 'Failed to save address' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* Header */}
      <View className="bg-green-600 pb-5 pt-5 px-4 rounded-b-[40px] z-10 shadow-sm shadow-green-700/20">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
            >
              <ArrowLeft size={22} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Delivery Addresses</Text>
          </View>
          <TouchableOpacity onPress={handleAddNew} className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
            <Plus size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {addresses.length === 0 ? (
            <View className="items-center justify-center py-20 mt-4">
              <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6">
                <MapPin size={40} color="#16a34a" />
              </View>
              <Text className="text-xl font-bold text-slate-800 mb-2">No Saved Addresses</Text>
              <Text className="text-slate-500 text-center px-6 mb-8 leading-relaxed">
                You haven't saved any delivery addresses yet. Add one to make checkout faster.
              </Text>
              <TouchableOpacity
                onPress={handleAddNew}
                className="bg-green-600 flex-row items-center py-3.5 px-8 rounded-full shadow-sm shadow-green-200"
              >
                <Plus size={20} color="#ffffff" />
                <Text className="text-white font-bold text-base ml-2">Add New Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {addresses.map((address: any, index: number) => (
                <View key={address.id || index} className="bg-white rounded-3xl p-5 mb-4 shadow-sm shadow-slate-100 border border-slate-100">
                  {/* Card Header */}
                  <View className="flex-row items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
                        <MapPin size={20} color="#16a34a" />
                      </View>
                      <Text className="font-bold text-slate-800 text-base">{address.address_type || 'Home'}</Text>
                      {address.is_default ? (
                        <View className="bg-green-100 px-2 py-0.5 rounded-md ml-3">
                          <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Default</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {/* Address Details */}
                  <View className="mb-4">
                    <Text className="text-slate-800 font-semibold mb-1">{address.customer_name}</Text>
                    <Text className="text-slate-500 leading-relaxed text-sm">
                      {[address.street_address, address.city, address.zip_code ? `- ${address.zip_code}` : '', address.state, address.country].filter(Boolean).join(', ')}
                    </Text>
                    {address.customer_phone ? (
                      <Text className="text-slate-600 mt-2 text-sm font-medium">📞 {address.customer_phone}</Text>
                    ) : null}
                    {address.customer_email ? (
                      <Text className="text-slate-500 mt-1 text-xs">✉ {address.customer_email}</Text>
                    ) : null}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => handleEdit(address)}
                      className="flex-1 flex-row items-center justify-center bg-slate-50 border border-slate-200 py-2.5 rounded-xl"
                    >
                      <Edit2 size={16} color="#64748b" />
                      <Text className="font-semibold text-slate-600 ml-1.5">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(address)}
                      className="flex-1 flex-row items-center justify-center bg-red-50 border border-red-100 py-2.5 rounded-xl"
                    >
                      <Trash2 size={16} color="#ef4444" />
                      <Text className="font-semibold text-red-500 ml-1.5">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={handleAddNew}
                className="bg-white border-2 border-dashed border-green-400 flex-row items-center justify-center py-4 rounded-2xl mt-2 mb-4"
              >
                <Plus size={20} color="#16a34a" />
                <Text className="text-green-700 font-bold text-base ml-2">Add Another Address</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}

      {/* Add / Edit Address Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true} onRequestClose={() => setShowAddModal(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-slate-50 rounded-t-3xl h-[88%] overflow-hidden">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center px-6 py-4 bg-white border-b border-slate-100">
              <Text className="text-xl font-bold text-slate-800">{editingAddress ? 'Edit Address' : 'Add New Address'}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} className="bg-slate-100 p-2 rounded-full">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

              {/* Address Type Toggle */}
              <View className="flex-row gap-3 mb-5">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, address_type: 'Home' })}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${formData.address_type === 'Home' ? 'bg-green-50 border-green-500' : 'bg-white border-slate-200'}`}
                >
                  <Home size={18} color={formData.address_type === 'Home' ? '#16a34a' : '#94a3b8'} />
                  <Text className={`font-semibold ml-2 ${formData.address_type === 'Home' ? 'text-green-700' : 'text-slate-500'}`}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, address_type: 'Work' })}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${formData.address_type === 'Work' ? 'bg-green-50 border-green-500' : 'bg-white border-slate-200'}`}
                >
                  <Building2 size={18} color={formData.address_type === 'Work' ? '#16a34a' : '#94a3b8'} />
                  <Text className={`font-semibold ml-2 ${formData.address_type === 'Work' ? 'text-green-700' : 'text-slate-500'}`}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, address_type: 'Other' })}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${formData.address_type === 'Other' ? 'bg-green-50 border-green-500' : 'bg-white border-slate-200'}`}
                >
                  <MapPin size={18} color={formData.address_type === 'Other' ? '#16a34a' : '#94a3b8'} />
                  <Text className={`font-semibold ml-2 ${formData.address_type === 'Other' ? 'text-green-700' : 'text-slate-500'}`}>Other</Text>
                </TouchableOpacity>
              </View>

              {/* Contact Details */}
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contact Details</Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 mb-3">
                <User color="#94a3b8" size={18} />
                <TextInput
                  placeholder="Full Name *" placeholderTextColor="#94a3b8"
                  value={formData.customer_name} onChangeText={(t) => setFormData({ ...formData, customer_name: t })}
                  className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium"
                />
              </View>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 mb-3">
                <Phone color="#94a3b8" size={18} />
                <TextInput
                  placeholder="Phone Number" placeholderTextColor="#94a3b8"
                  value={formData.customer_phone} onChangeText={(t) => setFormData({ ...formData, customer_phone: t })}
                  className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" keyboardType="phone-pad"
                />
              </View>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 mb-5">
                <Mail color="#94a3b8" size={18} />
                <TextInput
                  placeholder="Email Address" placeholderTextColor="#94a3b8"
                  value={formData.customer_email} onChangeText={(t) => setFormData({ ...formData, customer_email: t })}
                  className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" keyboardType="email-address" autoCapitalize="none"
                />
              </View>

              {/* Address Details */}
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Address Details</Text>
              <View className="flex-row items-start bg-white border border-slate-200 rounded-xl px-4 mb-3">
                <MapPin color="#94a3b8" size={18} style={{ marginTop: 14 }} />
                <TextInput
                  placeholder="Street Address (House No, Building, Street) *" placeholderTextColor="#94a3b8"
                  value={formData.street_address} onChangeText={(t) => setFormData({ ...formData, street_address: t })}
                  className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium" multiline
                />
              </View>

              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3">
                  <Building2 color="#94a3b8" size={18} />
                  <TextInput
                    placeholder="City *" placeholderTextColor="#94a3b8"
                    value={formData.city} onChangeText={(t) => setFormData({ ...formData, city: t })}
                    className="flex-1 py-3.5 px-2 text-sm text-slate-800 font-medium"
                  />
                </View>
                <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3">
                  <Navigation color="#94a3b8" size={18} />
                  <TextInput
                    placeholder="Zip Code *" placeholderTextColor="#94a3b8"
                    value={formData.zip_code} onChangeText={(t) => setFormData({ ...formData, zip_code: t })}
                    className="flex-1 py-3.5 px-2 text-sm text-slate-800 font-medium" keyboardType="number-pad"
                  />
                </View>
              </View>

              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 mb-6">
                <Map color="#94a3b8" size={18} />
                <TextInput
                  placeholder="State *" placeholderTextColor="#94a3b8"
                  value={formData.state} onChangeText={(t) => setFormData({ ...formData, state: t })}
                  className="flex-1 py-3.5 px-3 text-sm text-slate-800 font-medium"
                />
              </View>

              <TouchableOpacity
                onPress={saveAddress}
                disabled={saving}
                className={`bg-[#0e6827] py-4 rounded-2xl items-center shadow-sm ${saving ? 'opacity-70' : ''}`}
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-white font-bold text-lg">{editingAddress ? 'Update Address' : 'Save Address'}</Text>
                )}
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
