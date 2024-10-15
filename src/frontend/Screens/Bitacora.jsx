// /components/Bitacora/Bitacora.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBitacoraEntriesByProjectId } from "../../Backend/services/BitacoraService";

export default function Bitacora({ route }) {
  const { projectId } = route.params;
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const fetchedEntries = await getBitacoraEntriesByProjectId(projectId);
        const testEntries = [{id: 1, fecha: '2024/02/12', trabajadores: ['pepe','juan','luis','alejandro',] , detalles: 'lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor', fotos: ["https://picsum.photos/seed/a1/900/900", "https://picsum.photos/seed/a3/900/900"]},{id: 2, fecha: '2024/02/13', trabajadores: ['pepe','juan','luis',], detalles: 'lorem ipsum dolor sit amet, consectetur adipis grouping lorem ipsum dolor sit'},{id: 3, fecha: '2024/02/14', trabajadores: ['pepe','juan','luis',] , detalles: 'lorem ipsum dolor sit amet, consectetur adipis grouping lorem ipsum dolor sit'}]
        setEntries(testEntries);
      } catch (err) {
        setError(err);
        Alert.alert('Error', 'No se pudieron cargar las entradas de la bitácora.');
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [projectId]);

  const toggleEntry = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  const renderItem = ({ item }) => (
    <View className="bg-neutral-900 rounded-lg p-4 mb-4">
      {/* Fecha de la entrada */}
      <Pressable onPress={() => toggleEntry(item.id)} className="flex-row items-center">
        <Text className="text-yellow-400 text-xl font-bold flex-1">{item.fecha}</Text>
        <Text className="text-yellow-500 text-xl">
          {expandedEntry === item.id ? '▲' : '▼'}
        </Text>
      </Pressable>

      {/* Detalles de la entrada expandida */}
      {expandedEntry === item.id && (
        <View className="mt-4">
          <Text className="text-white mb-2">
            <Text className="font-semibold text-yellow-400">Trabajadores en el día:</Text> {item.trabajadores.join(', ')}
          </Text>
          <Text className="text-white mb-2">
            <Text className="font-semibold text-yellow-400">Detalles:</Text> {item.detalles}
          </Text>
          {item.fotos && item.fotos.length > 0 && (
            <ScrollView className="mt-2">
              {item.fotos.map((foto, index) => (
                <Image
                  key={index}
                  source={{ uri: foto }}
                  className="w-100 h-80 rounded-lg mb-5"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-yellow-400 text-lg">Error al cargar la bitácora.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-yellow-400 text-lg">No hay entradas en la bitácora.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

