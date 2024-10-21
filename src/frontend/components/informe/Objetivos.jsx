import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import ObjetivosService from '../../../Backend/services/objetivosService';

const Objetivos = ({ id, informeId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(false);

  const objetivosService = new ObjetivosService(id, informeId);

  useEffect(() => {
    // Función para cargar los objetivos (puedes ajustarla si usas Firestore en tiempo real)
    const fetchObjectives = async () => {
      setLoading(true);
      try {
        // Aquí puedes implementar la lógica de obtener los objetivos de Firestore
        const fetchedObjectives = await objetivosService.getObjectives(id, informeId);
        // por ahora usaremos un mock.
        setObjectives(fetchedObjectives);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los objetivos.');
      } finally {
        setLoading(false);
      }
    };

    fetchObjectives();
  }, []);

  const addObjective = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const newObjective = { title, description, completed: false };
      const response = await objetivosService.createObjective(newObjective);

      if (response.success) {
        setObjectives([...objectives, { id: response.id, ...newObjective }]);
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el objetivo.');
    }
  };

  const toggleCompletion = async (objective) => {
    try {
      const updatedObjective = { ...objective, completed: !objective.completed };
      await objetivosService.updateObjective(objective.id, updatedObjective);
      
      setObjectives((prevObjectives) =>
        prevObjectives.map((obj) =>
          obj.id === objective.id ? updatedObjective : obj
        )
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del objetivo.');
    }
  };

  const deleteObjective = async (id) => {
    try {
      await objetivosService.deleteObjective(id);
      setObjectives((prevObjectives) =>
        prevObjectives.filter((obj) => obj.id !== id)
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el objetivo.');
    }
  };

  const renderObjective = ({ item }) => (
    <View className='p-4 border-b border-gray-700'>
      <Pressable
        onPress={() => toggleCompletion(item)}
        style={{
          width: 24,
          height: 24,
          borderWidth: 1,
          borderColor: item.completed ? '#32CD32' : '#FF6347',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          borderRadius: 4,
        }}
      >
        {item.completed && (
          <Text style={{ color: '#32CD32', fontSize: 12 }}>
            ✔️
          </Text>
        )}
      </Pressable>
      <Text className={`font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-red-800'}`}>
        {item.title}
      </Text>
      <Text className='text-white'>{item.description}</Text>
      <Pressable onPress={() => deleteObjective(item.id)}>
        <Text className='text-red-500'>Eliminar</Text>
      </Pressable>
    </View>
  );

  return (
    <View className='space-y-4 p-4'>
      <Text className='text-center text-yellow-500 text-lg'>Objetivos del Proyecto</Text>
      
      {/* Input para agregar nuevos objetivos */}
      <TextInput
        className='bg-white rounded p-2 mb-2'
        placeholder='Título del objetivo'
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className='bg-white rounded p-2 mb-2'
        placeholder='Descripción del objetivo'
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Pressable onPress={addObjective} className='bg-yellow-500 p-2 rounded'>
        <Text className='text-center text-white'>Agregar Objetivo</Text>
      </Pressable>

      {/* Lista de objetivos */}
      {loading ? (
        <Text className='text-white'>Cargando...</Text>
      ) : (
        <FlatList
          data={objectives}
          keyExtractor={(item) => item.id}
          renderItem={renderObjective}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
};

export default Objetivos;
