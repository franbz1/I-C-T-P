// components/BotonNavegacionProyecto.js
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BotonNavegacionProyecto = ({ texto, ruta, id }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(ruta, {id: id});
  };

  // Asignar un color diferente basado en la ruta para mantener la consistencia visual
  const getBackgroundColor = () => {
    switch (ruta) {
      case 'Bitacora':
        return 'bg-yellow-400';
      case 'Informe':
        return 'bg-yellow-500';
      case 'Nomina':
        return 'bg-yellow-600';
      default:
        return 'bg-yellow-400';
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`${getBackgroundColor()} p-3 rounded-lg mb-2`}
    >
      <Text className='text-center text-black font-semibold'>
        {texto}
      </Text>
    </Pressable>
  );
};

export default BotonNavegacionProyecto;
