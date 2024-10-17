import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import BarraOpciones from '../components/BarraOpciones'
import { createEmpleado } from '../../Backend/services/Empleado'

const AgregarEmpleado = ({ navigation }) => {
  const [empleadoData, setEmpleadoData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    nombresAcudiente: '',
    telefonoAcudiente: '',
    seguroLaboral: '',
    eps: '',
    tipoSangineo: '',
    cargo: '',
    foto: '', // URL de la foto (opcional)
  })

  const handleInputChange = (key, value) => {
    setEmpleadoData({ ...empleadoData, [key]: value })
  }

  const handleAgregarEmpleado = async () => {
    try {
      await createEmpleado(empleadoData)
      Alert.alert('Éxito', 'Empleado agregado correctamente')
      navigation.goBack() // Para volver a la pantalla anterior después de agregar el empleado
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al agregar el empleado')
      console.error('Error al agregar el empleado: ', error)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
      <ScrollView className='p-4 bg-black'>
        <Text className='text-xl text-yellow-400 font-semibold mb-4'>
          Agregar Empleado
        </Text>

        {/* Cedula */}
        <View className='mb-4'>
          <Text className='text-white'>Cédula</Text>
          <TextInput
            value={empleadoData.cedula}
            onChangeText={(text) => handleInputChange('cedula', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Cédula'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Nombres */}
        <View className='mb-4'>
          <Text className='text-white'>Nombres</Text>
          <TextInput
            value={empleadoData.nombres}
            onChangeText={(text) => handleInputChange('nombres', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Nombres'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Apellidos */}
        <View className='mb-4'>
          <Text className='text-white'>Apellidos</Text>
          <TextInput
            value={empleadoData.apellidos}
            onChangeText={(text) => handleInputChange('apellidos', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Apellidos'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Correo */}
        <View className='mb-4'>
          <Text className='text-white'>Correo</Text>
          <TextInput
            value={empleadoData.correo}
            onChangeText={(text) => handleInputChange('correo', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Correo'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Teléfono */}
        <View className='mb-4'>
          <Text className='text-white'>Teléfono</Text>
          <TextInput
            value={empleadoData.telefono}
            onChangeText={(text) => handleInputChange('telefono', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Teléfono'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Dirección */}
        <View className='mb-4'>
          <Text className='text-white'>Dirección</Text>
          <TextInput
            value={empleadoData.direccion}
            onChangeText={(text) => handleInputChange('direccion', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Dirección'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Nombres del Acudiente */}
        <View className='mb-4'>
          <Text className='text-white'>Nombres del Acudiente</Text>
          <TextInput
            value={empleadoData.nombresAcudiente}
            onChangeText={(text) => handleInputChange('nombresAcudiente', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Nombres del Acudiente'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Teléfono del Acudiente */}
        <View className='mb-4'>
          <Text className='text-white'>Teléfono del Acudiente</Text>
          <TextInput
            value={empleadoData.telefonoAcudiente}
            onChangeText={(text) =>
              handleInputChange('telefonoAcudiente', text)
            }
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Teléfono del Acudiente'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Seguro Laboral */}
        <View className='mb-4'>
          <Text className='text-white'>Seguro Laboral</Text>
          <TextInput
            value={empleadoData.seguroLaboral}
            onChangeText={(text) => handleInputChange('seguroLaboral', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Seguro Laboral'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* EPS */}
        <View className='mb-4'>
          <Text className='text-white'>EPS</Text>
          <TextInput
            value={empleadoData.eps}
            onChangeText={(text) => handleInputChange('eps', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='EPS'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Tipo Sanguíneo */}
        <View className='mb-4'>
          <Text className='text-white'>Tipo Sanguíneo</Text>
          <TextInput
            value={empleadoData.tipoSangineo}
            onChangeText={(text) => handleInputChange('tipoSangineo', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Tipo Sanguíneo'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Cargo */}
        <View className='mb-4'>
          <Text className='text-white'>Cargo</Text>
          <TextInput
            value={empleadoData.cargo}
            onChangeText={(text) => handleInputChange('cargo', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='Cargo'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Foto (URL opcional) */}
        <View className='mb-4'>
          <Text className='text-white'>Foto (URL opcional)</Text>
          <TextInput
            value={empleadoData.foto}
            onChangeText={(text) => handleInputChange('foto', text)}
            className='text-white border-b border-yellow-400 p-2'
            placeholder='URL de la Foto'
            placeholderTextColor='#facc15'
          />
        </View>

        {/* Botón para agregar empleado */}
        <TouchableOpacity
          onPress={handleAgregarEmpleado}
          className='bg-yellow-400 p-4 rounded-full mb-10'
          activeOpacity={0.7}
        >
          <Text className='text-center text-black font-bold'>
            Agregar Empleado
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AgregarEmpleado
