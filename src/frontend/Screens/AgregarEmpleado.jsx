import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native'
import BarraOpciones from '../components/BarraOpciones'
import { createEmpleado } from '../../Backend/services/Empleado'
import useImageUpload from '../Hooks/useImageUpload'

const initialEmpleadoData = {
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
  foto: '',
}

const AgregarEmpleado = ({ navigation }) => {
  const [empleadoData, setEmpleadoData] = useState(initialEmpleadoData)
  const { uploading, handleSelectImage } = useImageUpload()

  const handleInputChange = (key, value) => {
    setEmpleadoData((prevData) => ({ ...prevData, [key]: value }))
  }

  const validateFields = () => {
    const { cedula, nombres, apellidos, correo, telefono } = empleadoData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{7,10}$/

    if (!cedula || cedula.length < 6) {
      Alert.alert('Error', 'La cédula debe tener al menos 6 caracteres.')
      return false
    }
    if (!nombres.trim()) {
      Alert.alert('Error', 'Por favor, ingrese los nombres.')
      return false
    }
    if (!apellidos.trim()) {
      Alert.alert('Error', 'Por favor, ingrese los apellidos.')
      return false
    }
    if (!correo || !emailRegex.test(correo)) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido.')
      return false
    }
    if (!telefono || !phoneRegex.test(telefono)) {
      Alert.alert('Error', 'Ingrese un teléfono válido (7-10 dígitos).')
      return false
    }
    return true
  }

  const handleAgregarEmpleado = async () => {
    if (!validateFields()) return
    try {
      await createEmpleado(empleadoData)
      Alert.alert('Éxito', 'Empleado agregado correctamente')
      navigation.goBack()
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al agregar el empleado')
      console.error('Error al agregar el empleado: ', error)
    }
  }

  const seleccionarImagen = async () => {
    const url = await handleSelectImage()
    if (url) {
      handleInputChange('foto', url)
    }
  }

  const renderInput = (label, key, placeholder, keyboardType = 'default') => (
    <View className='mb-4'>
      <Text className='text-white'>{label}</Text>
      <TextInput
        value={empleadoData[key]}
        onChangeText={(text) => handleInputChange(key, text)}
        className='text-white border-b border-yellow-400 p-2'
        placeholder={placeholder}
        placeholderTextColor='#facc15'
        keyboardType={keyboardType}
      />
    </View>
  )

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
      <ScrollView className='p-4 bg-black'>
        <Text className='text-xl text-yellow-400 font-semibold mb-4'>
          Agregar Empleado
        </Text>

        {renderInput('Cédula', 'cedula', 'Cédula', 'numeric')}
        {renderInput('Nombres', 'nombres', 'Nombres')}
        {renderInput('Apellidos', 'apellidos', 'Apellidos')}
        {renderInput('Correo', 'correo', 'Correo', 'email-address')}
        {renderInput('Teléfono', 'telefono', 'Teléfono', 'phone-pad')}
        {renderInput('Dirección', 'direccion', 'Dirección')}
        {renderInput(
          'Nombres del Acudiente',
          'nombresAcudiente',
          'Nombres del Acudiente'
        )}
        {renderInput(
          'Teléfono del Acudiente',
          'telefonoAcudiente',
          'Teléfono del Acudiente',
          'phone-pad'
        )}
        {renderInput('Seguro Laboral', 'seguroLaboral', 'Seguro Laboral')}
        {renderInput('EPS', 'eps', 'EPS')}
        {renderInput('Tipo Sanguíneo', 'tipoSangineo', 'Tipo Sanguíneo')}
        {renderInput('Cargo', 'cargo', 'Cargo')}

        <View className='mb-4'>
          <TouchableOpacity
            onPress={seleccionarImagen}
            className='border-b border-yellow-400 mb-10'
            activeOpacity={0.7}
          >
            <Text className='py-2 text-white'>Foto (opcional)</Text>
            <Text className='text-yellow-400 pb-3 pl-2'>
              {empleadoData.foto ? 'Cambiar Foto' : 'Subir Foto'}
            </Text>
            {uploading ? (
              <ActivityIndicator
                size='large'
                color='#FFC107'
              />
            ) : (
              empleadoData.foto && (
                <Image
                  source={{ uri: empleadoData.foto }}
                  className='w-24 h-24 rounded-full mb-4 justify-end'
                />
              )
            )}
          </TouchableOpacity>
        </View>

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
