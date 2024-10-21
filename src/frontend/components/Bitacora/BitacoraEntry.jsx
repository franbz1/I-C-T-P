import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import ImageViewing from 'react-native-image-viewing'; // Importar la librería
import { deleteBitacoraEntry } from '../../../Backend/services/BitacoraService';
import { getEmpleadoById } from '../../../Backend/services/Empleado'; // Importar el servicio para eliminar la entrada

export default function BitacoraEntry({ item, expandedEntry, toggleEntry, projectId, onEntryDeleted }) {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDelete = async () => {
    try {
      await deleteBitacoraEntry(projectId, item.id);
      onEntryDeleted(item.id); // Callback para eliminar la entrada localmente
      Alert.alert('Éxito', 'Entrada eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);
      Alert.alert('Error', 'No se pudo eliminar la entrada.');
    }
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsImageViewVisible(true);
  };

  // Preparar las imágenes para ImageViewing
  const images = item.Fotos ? item.Fotos.map((foto) => ({ uri: foto })) : [];

  return (
    <View className="bg-neutral-900 rounded-lg p-4 mb-4">
      {/* Fecha de la entrada */}
      <Pressable onPress={() => toggleEntry(item.id)} className="flex-row items-center">
        <Text className="text-yellow-400 text-xl font-bold flex-1">{item.Fecha}</Text>
        <Text className="text-yellow-500 text-xl">
          {expandedEntry === item.id ? '▲' : '▼'}
        </Text>
      </Pressable>

      {/* Detalles de la entrada expandida */}
      {expandedEntry === item.id && (
        <View className="mt-4">
          {/* Detalles de la bitácora */}
          <Text className="text-white mb-2">
            <Text className="font-semibold text-yellow-400">Detalles:</Text> {item.Detalles}
          </Text>

          {/* Lista de empleados */}
          {item.Empleados && item.Empleados.length > 0 && (
            <Text className="text-white mb-2">
              <Text className="font-semibold text-yellow-400">Empleados:</Text> {item.Empleados.join(', ')}
            </Text>
          )}

          {/* Mostrar imágenes */}
          {images.length > 0 && (
            <ScrollView className="mt-2" horizontal>
              {images.map((image, index) => (
                <Pressable key={index} onPress={() => openImageViewer(index)}>
                  <Image
                    source={{ uri: image.uri }}
                    className="w-40 h-40 rounded-lg mb-5 mr-2"
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Botón para eliminar la entrada */}
          <Pressable
            onPress={handleDelete}
            className="bg-red-600 rounded-lg p-2 mt-4 w-40 self-end"
          >
            <Text className="text-white text-center">Eliminar entrada</Text>
          </Pressable>
        </View>
      )}

      {/* Modal de ImageViewing */}
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </View>
  );
}
