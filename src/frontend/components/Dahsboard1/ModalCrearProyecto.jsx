import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, Alert } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { createProject } from '../../../Backend/services/ProjectoService';

export default function ModalCrearProyecto({
  visible,
  onClose,
  onProjectAdded,
}) {
  const [newProject, setNewProject] = useState({
    contractNumber: '',
    name: '',
    startDate: '',
    endDate: '',
    image: '',
  });
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // Funciones para manejar las fechas
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setNewProject({
      ...newProject,
      startDate: date.toISOString().split('T')[0],
    });
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setNewProject({ ...newProject, endDate: date.toISOString().split('T')[0] });
    hideEndDatePicker();
  };

  const handleAddProject = async () => {
    if (
      !newProject.contractNumber ||
      !newProject.name ||
      !newProject.startDate ||
      !newProject.endDate
    ) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const imageUrl =
      newProject.image.trim() === ''
        ? 'https://via.placeholder.com/150'
        : newProject.image;

    const projectData = {
      contract: newProject.contractNumber,
      projectName: newProject.name,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      imageUrl: imageUrl,
    };

    try {
      const newProjectId = await createProject(projectData);
      onProjectAdded({ id: newProjectId, ...projectData });
      setNewProject({ contractNumber: '', name: '', startDate: '', endDate: '', image: '' });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo añadir el proyecto.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="w-4/5 bg-neutral-800 rounded-lg p-5">
          <Text className="text-lg font-bold text-yellow-400 mb-2">
            Añadir Proyecto
          </Text>
          <TextInput
            placeholder="Número de contrato"
            placeholderTextColor="#ccc"
            value={newProject.contractNumber}
            onChangeText={(text) =>
              setNewProject({ ...newProject, contractNumber: text })
            }
            className="bg-neutral-700 text-white p-2 rounded mb-2"
          />
          <TextInput
            placeholder="Nombre del proyecto"
            placeholderTextColor="#ccc"
            value={newProject.name}
            onChangeText={(text) => setNewProject({ ...newProject, name: text })}
            className="bg-neutral-700 text-white p-2 rounded mb-2"
          />
          <Pressable onPress={showStartDatePicker}>
            <Text className="bg-neutral-700 text-[#ccc] p-2 rounded mb-2">
              {newProject.startDate
                ? `Fecha de inicio: ${newProject.startDate}`
                : 'Seleccionar fecha de inicio'}
            </Text>
          </Pressable>
          <Pressable onPress={showEndDatePicker}>
            <Text className="bg-neutral-700 text-[#ccc] p-2 rounded mb-2">
              {newProject.endDate
                ? `Fecha de finalización: ${newProject.endDate}`
                : 'Seleccionar fecha de finalización'}
            </Text>
          </Pressable>
          <TextInput
            placeholder="UrlImagen (opcional)"
            placeholderTextColor="#ccc"
            value={newProject.image}
            onChangeText={(text) =>
              setNewProject({ ...newProject, image: text })
            }
            className="bg-neutral-700 text-white p-2 rounded mb-2"
          />
          <Pressable
            className="bg-yellow-400 py-2 px-5 rounded-md mb-2"
            onPress={handleAddProject}
          >
            <Text className="text-black font-bold">Añadir Proyecto</Text>
          </Pressable>
          <Pressable className="bg-gray-500 py-2 px-4 rounded-md" onPress={onClose}>
            <Text className="text-white">Cerrar</Text>
          </Pressable>
        </View>
      </View>
      <DateTimePicker
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
      />
      <DateTimePicker
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />
    </Modal>
  );
}
