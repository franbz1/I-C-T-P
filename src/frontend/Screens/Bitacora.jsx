import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBitacoraEntries } from '../../Backend/services/BitacoraService';
import BitacoraEntry from '../components/Bitacora/BitacoraEntry';
import EmptyBitacora from '../components/Bitacora/EmptyBitacora';
import BarraOpciones from '../components/BarraOpciones';
import BotonAgregarBitacora from '../components/Bitacora/BotonAgregarBitacora';

export default function Bitacora() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEntry, setExpandedEntry] = useState(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const fetchedEntries = await getBitacoraEntries(id);
      setEntries(fetchedEntries);
    } catch (err) {
      setError(err);
      Alert.alert('Error', 'No se pudieron cargar las entradas de la bitácora.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();

    // Listener para recargar entradas cuando se vuelve a esta pantalla
    const unsubscribe = navigation.addListener('focus', fetchEntries);
    
    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, id]);

  const toggleEntry = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  const handleEntryDeleted = (deletedEntryId) => {
    setEntries(entries.filter(entry => entry.id !== deletedEntryId));
    Alert.alert('Éxito', 'Entrada eliminada correctamente.');
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <ActivityIndicator size='large' color='#FFD700' />
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <Text className='text-yellow-400 text-lg'>
          Error al cargar la bitácora.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
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
  );
}
