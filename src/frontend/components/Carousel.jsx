// Carousel.js
import React, { useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { Feather } from '@expo/vector-icons';

const Carousel = ({ images, onAddImage, onRemoveImage, isUploading, isEditable }) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Abrir visor de imagen completa
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };

  // Confirmar eliminación de imagen
  const handleRemoveImage = (index) => {
    if (!isEditable) return;
    Alert.alert('Eliminar Imagen', '¿Estás seguro de que deseas eliminar esta imagen?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onRemoveImage(index) }, // Pasamos el índice
    ]);
  };

  return (
    <View className="flex-1 py-4 items-center">
      {isUploading && <ActivityIndicator size="large" color="#0000ff" className="mb-4" />}

      {images.length === 0 ? (
        <View className="w-48 h-48 bg-neutral-900 rounded-lg items-center justify-center">
          <Text className="text-white">No hay imágenes</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="relative mr-4">
              <TouchableOpacity onPress={() => openImageViewer(index)}>
                <Image source={{ uri: item }} className="w-48 h-48 rounded-lg bg-gray-200" />
              </TouchableOpacity>
              {isEditable && (
                <TouchableOpacity
                  className="absolute top-2 right-2"
                  onPress={() => handleRemoveImage(index)}
                >
                  <Feather name="x-circle" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {/* Botón para agregar imagen */}
      {isEditable && (
        <TouchableOpacity
          className="mt-5 items-center bg-yellow-400 rounded-lg p-2 shadow-lg"
          onPress={onAddImage}
        >
          <Text className="text-white font-bold">Agregar Imagen</Text>
        </TouchableOpacity>
      )}

      {/* Visor de Imagen */}
      <ImageViewing
        images={images.map((uri) => ({ uri }))}
        imageIndex={currentImageIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
    </View>
  );
};

export default Carousel;
