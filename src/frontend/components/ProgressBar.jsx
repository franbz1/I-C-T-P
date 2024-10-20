import React from 'react';
import { View, Text } from "react-native";
import * as Progress from 'react-native-progress'; // Importamos la barra de progreso

// Componente para la barra de progreso
function ProgressBarComponent({ estado }) {
  const progress = estado / 100; // Convertimos el valor a un rango de 0 a 1

  return (
    <View className='mb-3'>
      <Text className='text-neutral-400 text-center text-sm mb-1'>
        Progreso actual {estado}%
        </Text>
      <Progress.Bar 
        progress={progress}
        width={null} 
        color="#FFD700" 
        height={10} 
        borderRadius={5}
      />
    </View>
  );
}


export default ProgressBarComponent;