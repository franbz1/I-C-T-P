import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import Collapsible from 'react-native-collapsible'
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
} from 'react-native-heroicons/outline'

const EmpleadoItem = ({ empleado, expandedId, toggleExpand, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmpleado, setEditedEmpleado] = useState({
    ...empleado,
  })

  const handleEditToggle = () => {
    if (isEditing) {
      console.log('Guardando cambios:', editedEmpleado)
    }
    setIsEditing(!isEditing) // Cambiar el estado de edición
  }

  const handleInputChange = (key, value) => {
    setEditedEmpleado({ ...editedEmpleado, [key]: value })
  }

  return (
    <View className='mb-2 bg-neutral-900 rounded-lg shadow'>
      <TouchableOpacity
        onPress={() => toggleExpand(empleado.id)}
        className='flex-row justify-between items-center p-4'
        activeOpacity={0.7}
      >
        <Text className='text-lg text-yellow-400 font-semibold'>
          {empleado.nombre}
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
            source={{ uri: empleado.foto }}
            className='w-24 h-24 rounded-full mb-4 self-center'
          />

          {/* Campo no editable para "CC:" */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>CC: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.cc}
                onChangeText={(text) => handleInputChange('cc', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Número de CC'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.cc}</Text>
            )}
          </View>

          {/* Campo editable para Correo */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Correo: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.correo}
                onChangeText={(text) => handleInputChange('correo', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Correo'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.correo}</Text>
            )}
          </View>

          {/* Campo editable para Teléfono */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Teléfono: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.telefono}
                onChangeText={(text) => handleInputChange('telefono', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Teléfono'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.telefono}</Text>
            )}
          </View>

          {/* Campo editable para Dirección */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Dirección: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.direccion}
                onChangeText={(text) => handleInputChange('direccion', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Dirección'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.direccion}</Text>
            )}
          </View>

          {/* Campo editable para Seguro Laboral */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>
              Seguro Laboral:{' '}
            </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.seguroLaboral}
                onChangeText={(text) =>
                  handleInputChange('seguroLaboral', text)
                }
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Seguro Laboral'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.seguroLaboral}</Text>
            )}
          </View>

          {/* Campo editable para EPS */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>EPS: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.eps}
                onChangeText={(text) => handleInputChange('eps', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='EPS'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.eps}</Text>
            )}
          </View>

          {/* Campo editable para Tipo de Sangre */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>
              Tipo de Sangre:{' '}
            </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.tipoSangre}
                onChangeText={(text) => handleInputChange('tipoSangre', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Tipo de Sangre'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.tipoSangre}</Text>
            )}
          </View>

          {/* Campo editable para Cargo */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Cargo: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.cargo}
                onChangeText={(text) => handleInputChange('cargo', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Cargo'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.cargo}</Text>
            )}
          </View>

          {/* Campos para Acudiente y Teléfono del Acudiente */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Acudiente: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.acudiente}
                onChangeText={(text) => handleInputChange('acudiente', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Acudiente'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{empleado.acudiente}</Text>
            )}
          </View>
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>
              Teléfono del Acudiente:{' '}
            </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.telefonoAcudiente}
                onChangeText={(text) =>
                  handleInputChange('telefonoAcudiente', text)
                }
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Teléfono del Acudiente'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>
                {empleado.telefonoAcudiente}
              </Text>
            )}
          </View>

          <View className='flex-row justify-end mt-4'>
            <TouchableOpacity
              onPress={handleEditToggle}
              className={`p-2 rounded-full mr-2 ${
                isEditing ? 'bg-green-600' : 'bg-blue-600'
              }`}
              activeOpacity={0.7}
            >
              {isEditing ? (
                <BookmarkIcon
                  color='white'
                  size={20}
                />
              ) : (
                <PencilIcon
                  color='white'
                  size={20}
                />
              )}
            </TouchableOpacity>
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
