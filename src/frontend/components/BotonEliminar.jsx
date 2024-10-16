import React from 'react';
import { Pressable, Text, Alert } from 'react-native';

export default function BotonEliminar({ onDelete, projectId }) {
  const confirmDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(projectId),
        },
      ]
    );
  };

  return (
    <Pressable
      className="bg-red-500 py-2 px-4 rounded-md"
      onPress={confirmDelete}
    >
      <Text className="text-white">Eliminar Proyecto</Text>
    </Pressable>
  );
}
