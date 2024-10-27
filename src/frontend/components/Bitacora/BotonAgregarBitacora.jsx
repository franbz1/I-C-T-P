import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import * as Animatable from 'react-native-animatable';

/* se crean animaciones para los botones */
const AnimatedTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
const Button = styled(AnimatedTouchableOpacity);
const ButtonText = styled(Animatable.Text);

/* Boton agregar */
const BotonAgregarBitacora = ({ id }) => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  /* boton presionado */
  const handlePress = () => {
    setIsPressed(true);
    navigation.navigate('FormularioBitacora', {id: id});
  };

/* funcion de animacion */
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  /* render del boton */
  return (
    <Button
      className="bg-yellow-400 py-2 px-4 rounded-md items-center my-2 mx-3"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      animation={isPressed ? "pulse" : undefined}
      iterationCount={1}
      duration={300}
    >
      <ButtonText
        className="text-black font-bold text-lg"
        animation={isPressed ? "rubberBand" : undefined}
        iterationCount={1}
        duration={300}
      >
        + Añadir Bitácora
      </ButtonText>
    </Button>
  );
};

export default BotonAgregarBitacora;