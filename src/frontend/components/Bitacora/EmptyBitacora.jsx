// components/Bitacora/EmptyBitacora.js
import React from 'react';
import { View, Text } from 'react-native';

export default function EmptyBitacora() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-yellow-400 text-lg">No hay entradas en la bitácora.</Text>
    </View>
  );
}
