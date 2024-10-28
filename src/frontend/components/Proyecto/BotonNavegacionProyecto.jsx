// components/BotonNavegacionProyecto.js
import React, { useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BotonNavegacionProyecto = ({ texto, ruta, id, proyecto }) => {
  const navigation = useNavigation();

  const handlePress = () => navigation.navigate(ruta, { id, proyecto });

  const backgroundColor = useMemo(() => {
    switch (ruta) {
      case 'Bitacora':
        return 'bg-yellow-400';
      case 'Informe':
        return 'bg-yellow-500';
      case 'NominaProyecto':
        return 'bg-yellow-600';
      default:
        return 'bg-yellow-400';
    }
  }, [ruta]);

  return (
    <Pressable
      onPress={handlePress}
      className={`${backgroundColor} p-3 rounded-lg mb-2`}
    >
      <Text className="text-center text-black font-semibold">
        {texto}
      </Text>
    </Pressable>
  );
};

export default BotonNavegacionProyecto;
