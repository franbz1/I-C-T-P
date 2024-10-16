import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';

const Button = styled(TouchableOpacity);
const ButtonText = styled(Text);

const BotonAgregarBitacora = ({ id }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('FormularioBitacora', {id: id});// Navegar a la vista de formulario
  };

  return (
    <Button className="bg-yellow-400 py-2 px-4 rounded-md items-center my-2 mx-3" onPress={handlePress}>
      <ButtonText className="text-black font-bold text-lg">+ Añadir Bitácora</ButtonText>
    </Button>
  );
};

export default BotonAgregarBitacora;
