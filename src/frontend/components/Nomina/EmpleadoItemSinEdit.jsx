import React, { memo, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from 'react-native-heroicons/outline';

const EmpleadoDetail = ({ label, value }) => (
  <View className='flex-row'>
    <Text className='font-semibold text-yellow-400'>{label}: </Text>
    <Text className='text-white mb-2'>{value}</Text>
  </View>
);

const EmpleadoItem = ({ empleado, expandedId, toggleExpand, handleDelete }) => {
  const isExpanded = expandedId === empleado.id;
  const url = empleado.Foto || 'https://via.placeholder.com/150';

  const empleadoDetails = useMemo(() => [
    { label: 'Nombres', value: empleado.Nombres },
    { label: 'Apellidos', value: empleado.Apellidos },
    { label: 'CC', value: empleado.Cedula },
    { label: 'Correo', value: empleado.Correo },
    { label: 'Teléfono', value: empleado.Telefono },
    { label: 'Dirección', value: empleado.Direccion },
    { label: 'Seguro Laboral', value: empleado.SeguroLaboral },
    { label: 'EPS', value: empleado.EPS },
    { label: 'Tipo de Sangre', value: empleado.TipoSangineo },
    { label: 'Cargo', value: empleado.Cargo },
    { label: 'Acudiente', value: empleado.NombresAcudiente },
    { label: 'Teléfono Acudiente', value: empleado.TelefonoAcudiente },
  ], [empleado]);

  return (
    <View className='mb-2 bg-neutral-900 rounded-lg shadow'>
      <TouchableOpacity
        onPress={() => toggleExpand(empleado.id)}
        className='flex-row justify-between items-center p-4'
        activeOpacity={0.7}
      >
        <Text className='text-lg text-yellow-400 font-semibold'>
          {empleado.Nombres}
        </Text>
        {isExpanded ? (
          <ChevronUpIcon color='#facc15' size={24} />
        ) : (
          <ChevronDownIcon color='#facc15' size={24} />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={!isExpanded}>
        <View className='p-4 border-t border-[#facc15]'>
          <Image source={{ uri: url }} className='w-24 h-24 rounded-full mb-4 self-center' />
          
          {/* Mostrar detalles de empleado usando el componente auxiliar */}
          {empleadoDetails.map(({ label, value }) => (
            <EmpleadoDetail key={label} label={label} value={value} />
          ))}

          {/* Botón para eliminar */}
          <View className='flex-row justify-end mt-4'>
            <TouchableOpacity
              onPress={() => handleDelete(empleado.id)}
              className='bg-red-600 p-2 rounded-full'
              activeOpacity={0.7}
            >
              <TrashIcon color='white' size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default React.memo(EmpleadoItem);
