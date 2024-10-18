import React, { useState, useCallback, useEffect } from 'react'
import {
  View,
  TextInput,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createBitacoraEntry } from '../../Backend/services/BitacoraService'
import { getEmpleadosByProyecto, getEmpleadoById } from '../../Backend/services/Empleado'
import { styled } from 'nativewind'
import ModalListaEmpleados from '../components/Nomina/ModalListaEmpleados'
import BarraOpciones from '../components/BarraOpciones'

const Container = styled(View)
const StyledTextInput = styled(TextInput)
const StyledText = styled(Text)

export default function FormularioBitacora() {
  const [detalles, setDetalles] = useState('')
  const [idsEmpleadosSeleccionados, setidsEmpleadosSeleccionados] = useState([])
  const [empleado, setEmpleado] = useState({})
  const [empleados, setEmpleados] = useState([])
  const [fotos, setFotos] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params // ID del proyecto

  const handleSave = async () => {
    if (!detalles || idsEmpleadosSeleccionados.length === 0) {
      Alert.alert('Error', 'Todos los campos son requeridos')
      return
    }

    const newEntry = {
      fecha: new Date(),
      detalles: detalles,
      fotos: fotos,
      empleados: idsEmpleadosSeleccionados,
    }

    try {
      await createBitacoraEntry(id, newEntry)
      Alert.alert('Éxito', 'Entrada creada correctamente')
      navigation.goBack() // Volver a la vista anterior
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la entrada')
    }
  }

  // Función para obtener los empleados del proyecto cuando la modal se abra
  const fetchEmpleadosProyecto = useCallback(async () => {
    try {
      const empleadosData = await getEmpleadosByProyecto(id)
      setEmpleados(empleadosData)
    } catch (error) {
      console.error('Error al obtener los empleados del proyecto:', error)
      Alert.alert('Error', 'Ocurrió un error al obtener los empleados del proyecto')
    }
  }, [id])

  // Función para manejar la apertura de la modal
  const handleOpenModal = () => {
    fetchEmpleadosProyecto()
    setModalVisible(true)
  }

  // Función para manejar la confirmación de la selección de empleados
  const handleConfirmSelection = (selectedEmpleados) => {
    setidsEmpleadosSeleccionados(selectedEmpleados);
    setModalVisible(false);
  };

  // Función para manejar el cierre de la modal
  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleSubirFoto = async (uri) => {}
  
  useEffect(() => {
    async function fetchEmpleado() {
      const empleadoData = await getEmpleadoById(idsEmpleadosSeleccionados[0])
      setEmpleado(empleadoData)
    }
  }, [idsEmpleadosSeleccionados]);

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
      <ScrollView className='p-4'>
        <StyledText className='text-xl text-yellow-400 font-semibold mb-4'>
          Crear Entrada de Bitácora
        </StyledText>

        {/* Detalles */}
        <StyledText className='text-white'>Detalles de la bitácora:</StyledText>
        <Container className='mb-4'>
          <StyledTextInput
            value={detalles}
            onChangeText={setDetalles}
            placeholder='Escribe los detalles'
            placeholderTextColor='#facc15'
            multiline={true}
            numberOfLines={10}
            style={{ verticalAlign: 'top', height: 150 }}
            className='text-white border-b border-yellow-400 p-2'
          />
        </Container>

        {/* Empleados */}
        <StyledText className='text-white'>Empleados en el día de hoy</StyledText>
        <TouchableOpacity
          onPress={handleOpenModal}
          className='bg-black rounded-full mb-4'
          activeOpacity={0.7}
        >
          <Text className='text-left border-b border-yellow-400 text-yellow-400 p-2'>
            Seleccionar empleados
          </Text>
        </TouchableOpacity>

        {/* Mostrar empleados seleccionados */}
        {empleados.length > 0 && (
          <View className='mb-4'>
            <StyledText className='text-white'>
              Empleados seleccionados:
            </StyledText>
            {empleados.map((empleado) => (
              <StyledText key={empleado.id} className=' p-2 text-yellow-400'>
                {empleado.Nombres} {empleado.Apellidos}, 
              </StyledText>
            ))}
          </View>
        )}

        {/* Fotos */}
        <StyledText className='text-white'>Fotos del trabajo realizado</StyledText>
        <TouchableOpacity
          onPress={handleSubirFoto}
          className='bg-black rounded-full mb-10'
          activeOpacity={0.7}
        >
          <Text className='text-left border-b border-yellow-400 text-yellow-400 p-2'>
            Seleccionar fotos
          </Text>
        </TouchableOpacity>

        {/* Botón Guardar */}
        <TouchableOpacity
          onPress={handleSave}
          className='bg-yellow-400 p-4 rounded-full mb-10'
          activeOpacity={0.7}
        >
          <Text className='text-center text-black font-bold'>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para seleccionar empleados */}
      <ModalListaEmpleados
        visible={modalVisible}
        empleados={empleados}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSelection}
      />
    </SafeAreaView>
  )
}
