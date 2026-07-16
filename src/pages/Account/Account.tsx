import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import PersonalInfo from "./PersonalInfo";
import Orders from "./Orders";
import Address from "./Address";
import SetPassword from "./SetPassword";

export const Account = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const menu = [
    {
      key: "personal",
      label: "Personal Info",
      icon: "person-outline",
    },
    {
      key: "orders",
      label: "My Orders",
      icon: "cube-outline",
    },
    {
      key: "address",
      label: "Manage Address",
      icon: "location-outline",
    },
    {
      key: "password",
      label: "Set Password",
      icon: "lock-closed-outline",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f5f7f3]">

      <ScrollView>

        {/* Header */}

        <View className="bg-green-700 rounded-b-3xl px-5 py-8">

          <Text className="text-green-100 uppercase tracking-widest text-xs font-bold">
            Account
          </Text>

          <Text className="text-white text-3xl font-bold mt-2">
            My Account
          </Text>

          <Text className="text-green-100 mt-2">
            Manage your Account, orders, address and password.
          </Text>

        </View>

        {/* Menu */}

        <View className="mx-4 mt-5 bg-white rounded-3xl p-4 shadow">

          {menu.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setActiveTab(item.key)}
              className={`flex-row items-center p-4 rounded-2xl mb-3 ${
                activeTab === item.key
                  ? "bg-yellow-400"
                  : "bg-gray-50"
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-green-700 items-center justify-center">
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="#fff"
                />
              </View>

              <Text
                className={`ml-4 font-semibold ${
                  activeTab === item.key
                    ? "text-black"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

        </View>

        {/* Content */}

        <View className="mx-4 mt-5 mb-10">

          {activeTab === "personal" && <PersonalInfo />}

          {activeTab === "orders" && <Orders />}

          {activeTab === "address" && <Address />}

          {activeTab === "password" && <SetPassword />}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};