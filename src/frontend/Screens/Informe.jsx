import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
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
  getAllInformes,
} from '../../Backend/services/InformeService'
import { getProjectById } from '../../Backend/services/ProjectoService'
import BarraOpciones from '../components/BarraOpciones'
import InformeEntry from '../components/informe/InformeEntry'
import BotonEditInforme from '../components/informe/BotonEditInforme'

export default function Informe() {
  const route = useRoute()
  const navigation = useNavigation()
  const { id, proyecto } = route.params
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
        className='px-2'
      >
        <View className='space-y-4'>
          <InformeEntry
            proyecto={proyecto}
            id={id}
            informe={informe}
          />
        </View>
      </ScrollView>
      <BotonEditInforme />
    </SafeAreaView>
  )
}
