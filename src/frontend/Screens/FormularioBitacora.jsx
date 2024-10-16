import React, { useState } from 'react'
import { View, TextInput, Button, Alert, Text } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createBitacoraEntry } from '../../Backend/services/BitacoraService'
import { styled } from 'nativewind'

const Container = styled(View)
const StyledTextInput = styled(TextInput)
const StyledText = styled(Text)

export default function FormularioBitacora() {
  const [detalles, setDetalles] = useState('')
  const [empleados, setEmpleados] = useState('')
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params // ID del proyecto
  

  const handleSave = async () => {
    if (!detalles || !empleados) {
      Alert.alert('Error', 'Todos los campos son requeridos')
      return
    }

    const newEntry = {
      fecha: new Date(),
      detalles: detalles,
      fotos: [], // Si hay fotos, las añades aquí
      empleados: empleados.split(',').map((e) => e.trim()), // Convertir a array
    }

    try {
      await createBitacoraEntry(id, newEntry)
      Alert.alert('Éxito', 'Entrada creada correctamente')
      navigation.goBack() // Volver a la vista anterior
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la entrada')
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <Container className='flex-1 p-4'>
        <StyledText className='mb-2'>Detalles de la bitácora:</StyledText>
        <StyledTextInput
          value={detalles}
          onChangeText={setDetalles}
          placeholder='Escribe los detalles'
          className='border border-gray-400 mb-4 p-2 rounded-md'
        />
        <StyledText className='mb-2'>
          Empleados (IDs separados por comas):
        </StyledText>
        <StyledTextInput
          value={empleados}
          onChangeText={setEmpleados}
          placeholder='empleado1, empleado2'
          className='border border-gray-400 mb-4 p-2 rounded-md'
        />
        <Button
          title='Guardar'
          onPress={handleSave}
        />
      </Container>
    </SafeAreaView>
  )
}
