import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';

export default function BitacoraEntry({ item, expandedEntry, toggleEntry }) {
  return (
    <View className="bg-neutral-900 rounded-lg p-4 mb-4">
      {/* Fecha de la entrada */}
      <Pressable onPress={() => toggleEntry(item.id)} className="flex-row items-center">
        <Text className="text-yellow-400 text-xl font-bold flex-1">{item.Fecha.toDateString()}</Text>
        <Text className="text-yellow-500 text-xl">
          {expandedEntry === item.id ? '▲' : '▼'}
        </Text>
      </Pressable>

      {/* Detalles de la entrada expandida */}
      {expandedEntry === item.id && (
        <View className="mt-4">
          <Text className="text-white mb-2">
            <Text className="font-semibold text-yellow-400">Detalles:</Text> {item.Detalles}
          </Text>
          {item.Fotos && item.Fotos.length > 0 && (
            <ScrollView className="mt-2">
              {item.Fotos.map((foto, index) => (
                <Image
                  key={index}
                  source={{ uri: foto }}
                  className="w-100 h-80 rounded-lg mb-5"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
