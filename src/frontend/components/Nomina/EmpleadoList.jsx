import React from 'react';
import { View, Text } from 'react-native';
import EmpleadoItem from './EmpleadoItem';

const EmpleadoList = ({ empleados, expandedId, toggleExpand, handleDelete }) => {
  return (
    <View className='p-4'>
      <Text className='text-2xl text-yellow-400 font-bold mb-4'>Nómina de Empleados</Text>
      {empleados.map((empleado) => (
        <EmpleadoItem
          key={empleado.id}
          empleado={empleado}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
          handleDelete={handleDelete}
        />
      ))}
    </View>
  );
};

export default EmpleadoList;
