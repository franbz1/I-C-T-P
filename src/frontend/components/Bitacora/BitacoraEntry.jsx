import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import { deleteBitacoraEntry } from '../../../Backend/services/BitacoraService';
import { getEmpleadoById } from '../../../Backend/services/Empleado';

const BitacoraEntry = ({ item, expandedEntry, toggleEntry, projectId, onEntryDeleted }) => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [empleadoNombres, setEmpleadoNombres] = useState([]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteBitacoraEntry(projectId, item.id);
      onEntryDeleted(item.id);
      Alert.alert('Éxito', 'Entrada eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);
      Alert.alert('Error', 'No se pudo eliminar la entrada.');
    }
  }, [projectId, item.id, onEntryDeleted]);

  const confirmDelete = useCallback(() => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta entrada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: handleDelete, style: 'destructive' },
      ],
      { cancelable: true }
    );
  }, [handleDelete]);

  const openImageViewer = useCallback((index) => {
    setCurrentImageIndex(index);
    setIsImageViewVisible(true);
  }, []);

  const images = useMemo(() => item.Fotos?.map((foto) => ({ uri: foto })) || [], [item.Fotos]);

  useEffect(() => {
    const fetchEmpleadoNombres = async () => {
      try {
        const nombres = await Promise.all(
          item.Empleados.map(async (empleadoId) => {
            const empleado = await getEmpleadoById(empleadoId);
            return empleado.nombre;
          })
        );
        setEmpleadoNombres(nombres);
      } catch (error) {
        console.error("Error al obtener nombres de empleados:", error);
      }
    };

    if (item.Empleados && item.Empleados.length > 0) {
      fetchEmpleadoNombres();
    }
  }, [item.Empleados]);

  return (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      className="bg-neutral-900 rounded-lg p-4 mb-4"
    >
      <Pressable onPress={() => toggleEntry(item.id)} className="flex-row items-center">
        <Animatable.Text 
          animation={expandedEntry === item.id ? "pulse" : undefined}
          className="text-yellow-400 text-xl font-bold flex-1"
        >
          {item.Fecha}
        </Animatable.Text>
        <Animatable.Text 
          animation={expandedEntry === item.id ? "rotate" : undefined}
          duration={300}
          className="text-yellow-500 text-xl"
        >
          {expandedEntry === item.id ? '▲' : '▼'}
        </Animatable.Text>
      </Pressable>

      <Collapsible collapsed={expandedEntry !== item.id} duration={300}>
        <Animatable.View 
          animation={expandedEntry === item.id ? "fadeInDown" : "fadeOutUp"}
          duration={300}
          className="mt-4"
        >
          <Text className="text-white mb-2">
            <Text className="font-semibold text-yellow-400">Detalles:</Text> {item.Detalles}
          </Text>

          {empleadoNombres.length > 0 && (
            <Text className="text-white mb-2">
              <Text className="font-semibold text-yellow-400">Empleados:</Text> {empleadoNombres.join(', ')}
            </Text>
          )}

          {images.length > 0 && (
            <ScrollView className="mt-2" horizontal>
              {images.map((image, index) => (
                <Animatable.View
                  key={index}
                  animation="zoomIn"
                  delay={index * 100}
                >
                  <Pressable onPress={() => openImageViewer(index)}>
                    <Image
                      source={{ uri: image.uri }}
                      className="w-40 h-40 rounded-lg mb-5 mr-2"
                      resizeMode="cover"
                    />
                  </Pressable>
                </Animatable.View>
              ))}
            </ScrollView>
          )}

          <Animatable.View animation="bounceIn" delay={300} className="self-end mt-4">
            <TouchableOpacity
              onPress={confirmDelete}
              className="bg-red-600 rounded-lg p-2 w-40 active:opacity-70"
            >
              <Text className="text-white text-center">Eliminar entrada</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </Collapsible>

      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </Animatable.View>
  );
};

export default React.memo(BitacoraEntry);
