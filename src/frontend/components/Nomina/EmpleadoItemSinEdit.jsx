import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from 'react-native-heroicons/outline'

const EmpleadoItem = ({ empleado, expandedId, toggleExpand, handleDelete }) => {
  const url = empleado.Foto ? empleado.Foto : 'https://via.placeholder.com/150'

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
        {expandedId === empleado.id ? (
          <ChevronUpIcon
            color='#facc15'
            size={24}
          />
        ) : (
          <ChevronDownIcon
            color='#facc15'
            size={24}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={expandedId !== empleado.id}>
        <View className='p-4 border-t border-[#facc15]'>
          <Image
            source={{ uri: url }}
            className='w-24 h-24 rounded-full mb-4 self-center'
          />

          {/* Mostrar valores no editables */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Nombres: </Text>
            <Text className='text-white mb-2'>{empleado.Nombres}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Apellidos: </Text>
            <Text className='text-white mb-2'>{empleado.Apellidos}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>CC: </Text>
            <Text className='text-white mb-2'>{empleado.Cedula}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Correo: </Text>
            <Text className='text-white mb-2'>{empleado.Correo}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Teléfono: </Text>
            <Text className='text-white mb-2'>{empleado.Telefono}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Dirección: </Text>
            <Text className='text-white mb-2'>{empleado.Direccion}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Seguro Laboral: </Text>
            <Text className='text-white mb-2'>{empleado.SeguroLaboral}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>EPS: </Text>
            <Text className='text-white mb-2'>{empleado.EPS}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Tipo de Sangre: </Text>
            <Text className='text-white mb-2'>{empleado.TipoSangineo}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Cargo: </Text>
            <Text className='text-white mb-2'>{empleado.Cargo}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Acudiente: </Text>
            <Text className='text-white mb-2'>{empleado.NombresAcudiente}</Text>
          </View>

          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Teléfono Acudiente: </Text>
            <Text className='text-white mb-2'>{empleado.TelefonoAcudiente}</Text>
          </View>

          {/* Botón para eliminar */}
          <View className='flex-row justify-end mt-4'>
            <TouchableOpacity
              onPress={() => handleDelete(empleado.id)}
              className='bg-red-600 p-2 rounded-full'
              activeOpacity={0.7}
            >
              <TrashIcon
                color='white'
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Collapsible>
    </View>
  )
}

export default EmpleadoItem
