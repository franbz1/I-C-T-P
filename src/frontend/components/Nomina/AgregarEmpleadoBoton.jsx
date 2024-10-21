import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { UserPlusIcon } from 'react-native-heroicons/outline';

const AgregarEmpleadoBoton = ({ handleAddEmployee }) => {
  return (
    <TouchableOpacity
      onPress={handleAddEmployee}
      className='bg-yellow-400 p-4 m-4 rounded-lg flex-row justify-center items-center'
      activeOpacity={0.7}
    >
      <UserPlusIcon color='black' size={24} />
      <Text className='text-black font-bold text-lg ml-2'>Agregar Empleado</Text>
    </TouchableOpacity>
  );
};

export default AgregarEmpleadoBoton;
