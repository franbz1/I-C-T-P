import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Here you would typically handle the login logic
    // For this example, we'll just show an alert
    Alert.alert('Login Attempt', `Attempting to login with email: ${email}`);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center px-4 pt-10">
        <Text className="text-3xl font-bold mb-6 text-center text-gray-800">Login</Text>
        <View className="bg-white p-6 rounded-lg shadow-md">
          <TextInput
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 p-2 rounded-md mb-6"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-md"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}