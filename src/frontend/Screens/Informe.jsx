// screens/Proyecto.js
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  createInforme,
  validateInformeData,
} from '../../Backend/services/InformeService'
import { getAllInformes } from '../../Backend/services/InformeService'  // Importar el servicio para obtener el proyecto
import BarraOpciones from '../components/BarraOpciones'

export default function Informe() {
  const route = useRoute()
  const navigation = useNavigation()
  const { id } = route.params
  const [informe, setInforme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInformeData = async () => {
      try {
        await fetchInforme()
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el informe de este proyecto.')
      } finally {
        setLoading(false)
      }
    }

    fetchInformeData()
  }, [id])

  const fetchInforme = async () => {
    const fetchedInforme = await getAllInformes(id)
    setInforme(fetchedInforme.data[0])
  }

  const handleCreateInforme = async () => {
    setLoading(true)
    try {
      const Proyecto = await getProjectById(id)

      const informeData = {
        projectName: Proyecto.Nombre,
        contract: Proyecto.Contrato,
        startDate: Proyecto.FechaInicio,
        endDate: Proyecto.FechaFin,
        fotoPrincipal: Proyecto.Imagen,
        introduction: '',
        desarrollo: '',
        budget: 0,
        state: 0,
        fotos: [],
        nominations: Proyecto.Empleados,
        contractors: [],
      }
      // Validar los datos antes de proceder
      validateInformeData(informeData)
      // Crear informe si los datos son válidos
      await createInforme(id, informeData)
      console.log('Informe creado con éxito', informeData)
      Alert.alert('Informe creado con éxito')
      // Obtener el informe recién creado
      setInforme(await getAllInformes(id))
    } catch (error) {
      if (error.message === '12') {
        Alert.alert(
          'Error',
          'La nómina es obligatoria y debe contener al menos un empleado. Por favor asigna un empleado a este proyecto.'
        )
        navigation.goBack()
      }
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-black'>
        <BarraOpciones />
        <View className='flex-1 justify-center items-center bg-black'>
          <ActivityIndicator
            size='large'
            color='#FFD700'
          />
        </View>
      </SafeAreaView>
    )
  }

  if (!informe) {
    return (
      <SafeAreaView className='flex-1 bg-black'>
        <BarraOpciones />
        <ScrollView>
          <View className='flex-1 justify-center items-center bg-black'>
            <Text className='text-yellow-400 text-lg'>
              El informe aun no ha sido creado
            </Text>
            <Pressable
              className='bg-yellow-400 rounded-lg p-2 mt-4'
              onPress={handleCreateInforme}
            >
              <Text className='text-white text-center'>Crear Informe</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className='p-4'
      >
        <View className='space-y-4'>
          {/* Información del Informe */}
          <View>
            <Text className='text-yellow-400 text-2xl font-bold'>
              {informe.NombreProyecto}
            </Text>
            <Text className='text-white mt-1'>
              Número de Contrato: {informe.Contrato}
            </Text>
            <Text className='text-white'>
              Desde: {formatTimestamp(informe.FechaInicio)} | Hasta: {formatTimestamp(informe.FechaFin)}
            </Text>
            <Image
              source={{
                uri: informe.FotoPrincipal || 'https://via.placeholder.com/150',
              }}
              className='w-full h-64 rounded-lg'
              resizeMode='cover'
            />
            <Text className='text-white mt-1'>
              Introducción: {informe.Introduccion}
            </Text>
            <Text className='text-white'>
              Desarrollo: {informe.Desarrollo}
            </Text>
            <Text className='text-white mt-1'>
              Presupuesto: {informe.Presupuesto}
            </Text>
            <Text className='text-white'>
              Estado: {informe.Estado}
            </Text>
            <Text className='text-white mt-1'>
              Fotos: {informe.Fotos}
            </Text>
            <Text className='text-white'>
              Nomina: {informe.Nomina}
            </Text>
            <Text className='text-white mt-1'>
              Contratistas: {informe.Contratistas}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
