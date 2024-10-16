import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { getBitacoraEntries, createBitacoraEntry } from '../../Backend/services/BitacoraService'
import BitacoraEntry from '../components/Bitacora/BitacoraEntry'
import EmptyBitacora from '../components/Bitacora/EmptyBitacora'
import BarraOpciones from '../components/BarraOpciones'
import BotonAgregarBitacora from '../components/Bitacora/BotonAgregarBitacora';

export default function Bitacora() {
  const route = useRoute()
  const { id } = route.params
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedEntry, setExpandedEntry] = useState(null)

  const loadTestBitacoraEntries = async () => {
    try {
      const testEntries = [
        {
          fecha: new Date(2024, 1, 12), // Fecha 12 de febrero de 2024
          detalles:
            'Realizamos una inspección del terreno y se encontró un problema con la maquinaria.',
          fotos: [
            'https://picsum.photos/seed/a1/900/900',
            'https://picsum.photos/seed/a3/900/900',
          ],
          empleados: ['empleado1', 'empleado2'], // IDs de empleados
        },
        {
          fecha: new Date(2024, 1, 13), // Fecha 13 de febrero de 2024
          detalles:
            'El equipo instaló las primeras bases estructurales y continuó con la nivelación del suelo.',
          fotos: ['https://picsum.photos/seed/a3/900/900'],
          empleados: ['empleado2', 'empleado3'], // IDs de empleados
        },
        {
          fecha: new Date(2024, 1, 14), // Fecha 14 de febrero de 2024
          detalles:
            'Se avanzó en la construcción del sistema de drenaje, todo el equipo en sitio trabajando.',
          fotos: [],
          empleados: ['empleado1', 'empleado3'], // IDs de empleados
        },
      ];

      for (const entry of testEntries) {   
        console.log(entry);
        await createBitacoraEntry(id, entry) // Crear cada entrada usando el servicio
        console.log(
          `Entrada de bitácora para ${entry.fecha.toDateString()} creada con éxito.`
        )
      }

      console.log('Datos de prueba cargados con éxito.')
    } catch (error) {
      console.error('Error al cargar datos de prueba para bitácora: ', error)
    }
  }

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const fetchedEntries = await getBitacoraEntries(id)
        setEntries(fetchedEntries)
      } catch (err) {
        setError(err)
        Alert.alert(
          'Error',
          'No se pudieron cargar las entradas de la bitácora.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [id])

  const toggleEntry = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId)
  }

  const handleEntryDeleted = (deletedEntryId) => {
    setEntries(entries.filter(entry => entry.id !== deletedEntryId));
    Alert.alert('Éxito', 'Entrada eliminada correctamente.');
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <ActivityIndicator
          size='large'
          color='#FFD700'
        />
      </View>
    )
  }

  if (error) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <Text className='text-yellow-400 text-lg'>
          Error al cargar la bitácora.
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones btnDev={loadTestBitacoraEntries}/>
      <BotonAgregarBitacora id={id} />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BitacoraEntry
            item={item}
            expandedEntry={expandedEntry}
            toggleEntry={toggleEntry}
            projectId={id}
            onEntryDeleted={handleEntryDeleted}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<EmptyBitacora />}
      />
    </SafeAreaView>
  )
}
