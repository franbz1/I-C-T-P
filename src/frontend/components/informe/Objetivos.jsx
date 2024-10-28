import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { PencilIcon } from 'react-native-heroicons/outline';
import { subscribeToObjectives, createObjective, updateObjective, deleteObjective } from '../../../Backend/services/objetivosService';

const Objetivos = ({ projectId, informeId, actualObjectives }) => {
  const [objectives, setObjectives] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToObjectives(projectId, informeId, (fetchedObjectives) => {
      setObjectives(fetchedObjectives);
      actualObjectives(fetchedObjectives);
    });
    return () => unsubscribe();
  }, [projectId, informeId, actualObjectives]);

  const handleAddObjective = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
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

  const handleToggleCompletion = async (objective) => {
    try {
      const updatedObjective = { ...objective, Completado: !objective.Completado };
      await updateObjective(projectId, informeId, objective.ObjetivoID, updatedObjective);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del objetivo.');
    }
  };

  const handleDeleteObjective = useCallback(async (objectiveId) => {
    try {
      await deleteObjective(projectId, informeId, objectiveId);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el objetivo.');
    }
  }, [projectId, informeId]);

  const startEditingObjective = useCallback((objective) => {
    setEditingObjective({ ...objective });
  }, []);

  const saveEdits = async () => {
    if (!editingObjective) return;

    setLoading(true);
    try {
      await updateObjective(projectId, informeId, editingObjective.ObjetivoID, editingObjective);
      setEditingObjective(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el objetivo.');
    } finally {
      setLoading(false);
    }
  };

  const renderObjective = useCallback((objective) => {
    const isEditing = editingObjective?.ObjetivoID === objective.ObjetivoID;

    return (
      <View key={objective.ObjetivoID} className="p-4 border-b border-gray-700">
        <View className="flex-row my-1 items-center justify-between">
          <Pressable
            onPress={() => handleToggleCompletion(objective)}
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
            <TextInput
              className="text-white bg-neutral-900 rounded p-1 flex-1"
              value={editingObjective.Titulo}
              onChangeText={(text) => setEditingObjective((prev) => ({ ...prev, Titulo: text }))}
            />
          ) : (
            <Text
              className={`flex-1 font-semibold ${
                objective.Completado ? 'line-through text-gray-400' : 'text-red-800'
              }`}
            >
              {objective.Titulo}
            </Text>
          )}

          <Pressable onPress={() => (isEditing ? saveEdits() : startEditingObjective(objective))}>
            <Text className={`ml-2 ${isEditing ? 'text-green-500' : ''}`}>
              {isEditing ? 'Guardar' : <PencilIcon color="#FFF" size={20} />}
            </Text>
          </Pressable>
        </View>

        {isEditing ? (
          <TextInput
            className="text-white bg-neutral-900 rounded p-2 mt-2"
            value={editingObjective.Descripcion}
            onChangeText={(text) => setEditingObjective((prev) => ({ ...prev, Descripcion: text }))}
            multiline
          />
        ) : (
          <Text className="text-white">{objective.Descripcion}</Text>
        )}

        <Pressable onPress={() => handleDeleteObjective(objective.ObjetivoID)}>
          <Text className="text-red-500">Eliminar</Text>
        </Pressable>
      </View>
    );
  }, [editingObjective, handleDeleteObjective, handleToggleCompletion]);

  return (
    <View className="space-y-4 p-4">
      <Text className="text-center text-yellow-500 text-lg">Objetivos del Proyecto</Text>

      <TextInput
        className="text-white bg-neutral-900 rounded p-2"
        placeholderTextColor="#facc15"
        placeholder="Título del objetivo"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="text-white bg-neutral-900 rounded p-2"
        placeholderTextColor="#facc15"
        placeholder="Descripción del objetivo"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Pressable onPress={handleAddObjective} className="bg-yellow-500 p-2 rounded">
        <Text className="text-center text-white">Agregar Objetivo</Text>
      </Pressable>

      {loading ? (
        <Text className="text-white">Cargando...</Text>
      ) : (
        <ScrollView nestedScrollEnabled>
          {objectives.map((objective) => renderObjective(objective))}
        </ScrollView>
      )}
    </View>
  );
};

export default Objetivos;
