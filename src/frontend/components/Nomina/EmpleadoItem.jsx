import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import Collapsible from 'react-native-collapsible'
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
} from 'react-native-heroicons/outline'
import { updateEmpleado } from '../../../Backend/services/Empleado'

const EmpleadoItem = ({ empleado, expandedId, toggleExpand, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmpleado, setEditedEmpleado] = useState({
    ...empleado,
  })

  const [tempEmpleado, setTempEmpleado] = useState({ ...empleado }) // Guarda una copia temporal del empleado original

  const handleEditToggle = async () => {
    if (isEditing) {
      // Intentar actualizar en Firebase
      try {
        await updateEmpleado(empleado.id, editedEmpleado)
        // Si es exitoso, actualizamos tanto tempEmpleado como editedEmpleado
        setTempEmpleado({ ...editedEmpleado })
        setEditedEmpleado({ ...editedEmpleado })
        console.log('Empleado actualizado con éxito:', editedEmpleado)
      } catch (error) {
        // Si falla, mostramos una alerta y descartamos los cambios en editedEmpleado
        Alert.alert(
          'Error',
          'No se pudo actualizar el empleado. Intenta de nuevo.'
        )
        // Restauramos los valores originales de editedEmpleado a los previos en tempEmpleado
        setEditedEmpleado({ ...tempEmpleado })
        console.error('Error al actualizar el empleado:', error)
      }
    }
    setIsEditing(!isEditing) // Cambiar el estado de edición
  }

  const handleInputChange = (key, value) => {
    setEditedEmpleado({ ...editedEmpleado, [key]: value })
  }

  const url = empleado.Foto ? empleado.Foto : 'https://via.placeholder.com/150'

  return (
    <View className='mb-2 bg-neutral-900 rounded-lg shadow'>
      <TouchableOpacity
        onPress={() => toggleExpand(empleado.id)}
        className='flex-row justify-between items-center p-4'
        activeOpacity={0.7}
      >
        <Text className='text-lg text-yellow-400 font-semibold'>
          {tempEmpleado.Nombres} {/* Usamos tempEmpleado aquí */}
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

          {/* Campo editable para Nombres */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Nombres: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Nombres}
                onChangeText={(text) => handleInputChange('Nombres', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Nombres'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Nombres}</Text>
            )}
          </View>

          {/* Campo editable para Apellidos */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Apellidos: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Apellidos}
                onChangeText={(text) => handleInputChange('Apellidos', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Apellidos'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Apellidos}</Text>
            )}
          </View>

          {/* Campo no editable para "CC:" */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>CC: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Cedula}
                onChangeText={(text) => handleInputChange('Cedula', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Número de CC'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Cedula}</Text>
            )}
          </View>

          {/* Campo editable para Correo */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Correo: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Correo}
                onChangeText={(text) => handleInputChange('Correo', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Correo'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Correo}</Text>
            )}
          </View>

          {/* Campo editable para Teléfono */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Teléfono: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Telefono}
                onChangeText={(text) => handleInputChange('Telefono', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Teléfono'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Telefono}</Text>
            )}
          </View>

          {/* Campo editable para Dirección */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Dirección: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Direccion}
                onChangeText={(text) => handleInputChange('Direccion', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Dirección'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Direccion}</Text>
            )}
          </View>

          {/* Campo editable para Seguro Laboral */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>
              Seguro Laboral:{' '}
            </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.SeguroLaboral}
                onChangeText={(text) =>
                  handleInputChange('SeguroLaboral', text)
                }
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Seguro Laboral'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>
                {tempEmpleado.SeguroLaboral}
              </Text>
            )}
          </View>

          {/* Campo editable para EPS */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>EPS: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.EPS}
                onChangeText={(text) => handleInputChange('EPS', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='EPS'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.EPS}</Text>
            )}
          </View>

          {/* Campo editable para Tipo de Sangre */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>
              Tipo de Sangre:{' '}
            </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.TipoSangineo}
                onChangeText={(text) => handleInputChange('TipoSangineo', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Tipo de Sangre'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>
                {tempEmpleado.TipoSangineo}
              </Text>
            )}
          </View>

          {/* Campo editable para Cargo */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Cargo: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.Cargo}
                onChangeText={(text) => handleInputChange('Cargo', text)}
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Cargo'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>{tempEmpleado.Cargo}</Text>
            )}
          </View>

          {/* Campo editable para Acudiente */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>Acudiente: </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.NombresAcudiente}
                onChangeText={(text) =>
                  handleInputChange('NombresAcudiente', text)
                }
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Acudiente'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>
                {tempEmpleado.NombresAcudiente}
              </Text>
            )}
          </View>

          {/* Campo editable para Teléfono del Acudiente */}
          <View className='flex-row'>
            <Text className='font-semibold text-yellow-400'>
              Teléfono del Acudiente:{' '}
            </Text>
            {isEditing ? (
              <TextInput
                value={editedEmpleado.TelefonoAcudiente}
                onChangeText={(text) =>
                  handleInputChange('TelefonoAcudiente', text)
                }
                className='text-white mb-2 flex-1 border-b border-yellow-400'
                placeholder='Teléfono Acudiente'
                placeholderTextColor='#facc15'
              />
            ) : (
              <Text className='text-white mb-2'>
                {tempEmpleado.TelefonoAcudiente}
              </Text>
            )}
          </View>

          {/* Botones para guardar/cancelar edición */}
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
