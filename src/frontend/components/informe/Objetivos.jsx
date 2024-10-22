import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { PencilIcon } from 'react-native-heroicons/outline';
import { subscribeToObjectives, createObjective, updateObjective, deleteObjective } from '../../../Backend/services/objetivosService';

const Objetivos = ({ projectId, informeId }) => {
  const [objectives, setObjectives] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingObjectiveId, setEditingObjectiveId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToObjectives(projectId, informeId, (fetchedObjectives) => {
      setObjectives(fetchedObjectives);
    });

    return () => unsubscribe();
  }, [projectId, informeId]);

  const addObjective = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      const newObjective = { Titulo: title, Descripcion: description, Completado: false };
      const response = await createObjective(projectId, informeId, newObjective);

      if (response.success) {
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el objetivo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (objective) => {
    try {
      const updatedObjective = { ...objective, Completado: !objective.Completado };
      await updateObjective(projectId, informeId, objective.ObjetivoID, updatedObjective);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del objetivo.');
    }
  };

  const handleDeleteObjective = async (objectiveId) => {
    try {
      await deleteObjective(projectId, informeId, objectiveId);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el objetivo.');
    }
  };

  const startEditing = (objective) => {
    setEditingObjectiveId(objective.ObjetivoID);
    setEditedTitle(objective.Titulo);
    setEditedDescription(objective.Descripcion);
  };

  const saveEdits = async (objective) => {
    try {
      const updatedObjective = {
        ...objective,
        Titulo: editedTitle,
        Descripcion: editedDescription,
      };
      await updateObjective(projectId, informeId, objective.ObjetivoID, updatedObjective);
      setEditingObjectiveId(null); // Finalizar edición
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el objetivo.');
    }
  };

  const renderObjective = (objective) => {
    const isEditing = editingObjectiveId === objective.ObjetivoID;

    return (
      <View key={objective.ObjetivoID} className='p-4 border-b border-gray-700'>
        <View className='flex-row my-1 items-center justify-between'>
          <Pressable
            onPress={() => toggleCompletion(objective)}
            style={{
              width: 24,
              height: 24,
              borderWidth: 1,
              borderColor: objective.Completado ? '#32CD32' : '#FF6347',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
              borderRadius: 4,
            }}
          >
            {objective.Completado && <Text style={{ color: '#32CD32', fontSize: 12 }}>✔️</Text>}
          </Pressable>

          {isEditing ? (
            <>
              <TextInput
                className='text-white bg-neutral-900 rounded p-1 flex-1'
                value={editedTitle}
                onChangeText={setEditedTitle}
              />
              <Pressable onPress={() => saveEdits(objective)} className='ml-2'>
                <Text className='text-green-500'>Guardar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text
                className={`flex-1 font-semibold ${objective.Completado ? 'line-through text-gray-400' : 'text-red-800'}`}
              >
                {objective.Titulo}
              </Text>
              <Pressable onPress={() => startEditing(objective)}>
                <PencilIcon color="#FFF" size={20} />
              </Pressable>
            </>
          )}
        </View>

        {isEditing ? (
          <TextInput
            className='text-white bg-neutral-900 rounded p-2 mt-2'
            value={editedDescription}
            onChangeText={setEditedDescription}
            multiline
          />
        ) : (
          <Text className='text-white'>{objective.Descripcion}</Text>
        )}

        <Pressable onPress={() => handleDeleteObjective(objective.ObjetivoID)}>
          <Text className='text-red-500'>Eliminar</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View className='space-y-4 p-4'>
      <Text className='text-center text-yellow-500 text-lg'>Objetivos del Proyecto</Text>

      <TextInput
        className='text-white bg-neutral-900 rounded p-2'
        placeholderTextColor={'#facc15'}
        placeholder='Título del objetivo'
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className='text-white bg-neutral-900 rounded p-2'
        placeholderTextColor={'#facc15'}
        placeholder='Descripción del objetivo'
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Pressable onPress={addObjective} className='bg-yellow-500 p-2 rounded'>
        <Text className='text-center text-white'>Agregar Objetivo</Text>
      </Pressable>

      {loading ? (
        <Text className='text-white'>Cargando...</Text>
      ) : (
        <ScrollView nestedScrollEnabled={true}>
          {objectives.map((objective) => renderObjective(objective))}
        </ScrollView>
      )}
    </View>
  );
};

export default Objetivos;
