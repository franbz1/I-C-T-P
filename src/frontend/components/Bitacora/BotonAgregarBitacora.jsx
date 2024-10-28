import React, { useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import * as Animatable from 'react-native-animatable';

const AnimatedTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
const Button = styled(AnimatedTouchableOpacity);
const ButtonText = styled(Animatable.Text);

const BotonAgregarBitacora = ({ id }) => {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate('FormularioBitacora', { id });
  }, [navigation, id]);

  return (
    <Button
      className="bg-yellow-400 py-2 px-4 rounded-md items-center my-2 mx-3"
      onPress={handlePress}
      onPressIn={(e) => e.target.animate({ 0: { scale: 1 }, 1: { scale: 0.9 } }, 100)}
      onPressOut={(e) => e.target.animate({ 0: { scale: 0.9 }, 1: { scale: 1 } }, 100)}
    >
      <ButtonText className="text-black font-bold text-lg">+ Añadir Bitácora</ButtonText>
    </Button>
  );
};

export default BotonAgregarBitacora;
