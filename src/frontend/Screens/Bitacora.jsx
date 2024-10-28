import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBitacoraEntries } from '../../Backend/services/BitacoraService';
import BitacoraEntry from '../components/Bitacora/BitacoraEntry';
import EmptyBitacora from '../components/Bitacora/EmptyBitacora';
import BarraOpciones from '../components/BarraOpciones';
import BotonAgregarBitacora from '../components/Bitacora/BotonAgregarBitacora';

const Loader = () => (
  <View className="flex-1 justify-center items-center bg-black">
    <ActivityIndicator size="large" color="#FFD700" />
  </View>
);

const ErrorView = () => (
  <View className="flex-1 justify-center items-center bg-black">
    <Text className="text-yellow-400 text-lg">Error al cargar la bitácora.</Text>
  </View>
);

export default function Bitacora() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const fetchedEntries = await getBitacoraEntries(id);
      setEntries(fetchedEntries);
    } catch (err) {
      setError(true);
      Alert.alert('Error', 'No se pudieron cargar las entradas de la bitácora.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEntries();
    const unsubscribe = navigation.addListener('focus', fetchEntries);
    return unsubscribe;
  }, [fetchEntries, navigation]);

  const toggleEntry = (entryId) => {
    setExpandedEntry((prev) => (prev === entryId ? null : entryId));
  };

  const handleEntryDeleted = (deletedEntryId) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== deletedEntryId));
    Alert.alert('Éxito', 'Entrada eliminada correctamente.');
  };

  if (loading) return <Loader />;
  if (error) return <ErrorView />;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <BotonAgregarBitacora id={id} />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
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
