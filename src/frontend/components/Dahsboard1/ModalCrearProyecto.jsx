import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, Alert, Image, ActivityIndicator } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { createProject } from '../../../Backend/services/ProjectoService';
import useImageUpload from '../../Hooks/useImageUpload';

export default function ModalCrearProyecto({ visible, onClose, onProjectAdded }) {
  const [newProject, setNewProject] = useState({
    contractNumber: '',
    name: '',
    startDate: '',
    endDate: '',
    image: '',
  });

  const { handleSelectImage, uploading, imageUri, setImageUri } = useImageUpload();
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const handleDateChange = (key, date) => {
    setNewProject({ ...newProject, [key]: date.toISOString().split('T')[0] });
    key === 'startDate' ? setStartDatePickerVisibility(false) : setEndDatePickerVisibility(false);
  };

  const handleAddProject = async () => {
    if (!newProject.contractNumber || !newProject.name || !newProject.startDate || !newProject.endDate) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const imageUrl = newProject.image || 'https://via.placeholder.com/150';
    const projectData = {
      contract: newProject.contractNumber,
      projectName: newProject.name,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      imageUrl,
    };

    try {
      const newProjectId = await createProject(projectData);
      onProjectAdded({ id: newProjectId, ...projectData });
      setNewProject({ contractNumber: '', name: '', startDate: '', endDate: '', image: '' });
      handleCloseModal();
    } catch {
      Alert.alert('Error', 'No se pudo añadir el proyecto.');
    }
  };

  const handleImageSelection = async () => {
    const uploadedUrl = await handleSelectImage();
    if (uploadedUrl) {
      setNewProject({ ...newProject, image: uploadedUrl });
    }
  };

  const handleCloseModal = () => {
    setNewProject({ contractNumber: '', name: '', startDate: '', endDate: '', image: '' });
    setImageUri(null);
    onClose();
  }

  return (
    <Modal visible={visible} transparent onRequestClose={handleCloseModal}>
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="w-4/5 bg-neutral-800 rounded-lg p-5">
          <Text className="text-lg font-bold text-yellow-400 mb-2">Añadir Proyecto</Text>
          <TextInput
            placeholder="Número de contrato"
            placeholderTextColor="#ccc"
            value={newProject.contractNumber}
            onChangeText={(text) => setNewProject({ ...newProject, contractNumber: text })}
            className="bg-neutral-700 text-white p-2 rounded mb-2"
          />
          <TextInput
            placeholder="Nombre del proyecto"
            placeholderTextColor="#ccc"
            value={newProject.name}
            onChangeText={(text) => setNewProject({ ...newProject, name: text })}
            className="bg-neutral-700 text-white p-2 rounded mb-2"
          />
          <Pressable onPress={() => setStartDatePickerVisibility(true)}>
            <Text className={`bg-neutral-700 ${newProject.startDate ? 'text-white' : 'text-[#ccc]'} p-2 rounded mb-2`}>
              {newProject.startDate ? `Fecha de inicio: ${newProject.startDate}` : 'Seleccionar fecha de inicio'}
            </Text>
          </Pressable>
          <Pressable onPress={() => setEndDatePickerVisibility(true)}>
            <Text className={`bg-neutral-700 ${newProject.endDate ? 'text-white' : 'text-[#ccc]'} p-2 rounded mb-2`}>
              {newProject.endDate ? `Fecha de finalización: ${newProject.endDate}` : 'Seleccionar fecha de finalización'}
            </Text>
          </Pressable>
          <Pressable onPress={handleImageSelection} className="bg-neutral-700 p-2 rounded mb-2 flex-row justify-between items-center">
            <Text className="text-[#ccc]">{imageUri ? 'Cambiar Imagen' : 'Seleccionar Imagen'}</Text>
            {uploading ? (
              <ActivityIndicator size="small" color="#FFC107" />
            ) : (
              imageUri && <Image source={{ uri: imageUri }} className="w-10 h-10 rounded-full" />
            )}
          </Pressable>
          <Pressable className="bg-yellow-400 py-2 px-5 rounded-md mb-2" onPress={handleAddProject}>
            <Text className="text-black font-bold">Añadir Proyecto</Text>
          </Pressable>
          <Pressable className="bg-gray-500 py-2 px-4 rounded-md" onPress={handleCloseModal}>
            <Text className="text-white">Cerrar</Text>
          </Pressable>
        </View>
      </View>

      {/* Date Pickers */}
      <DateTimePicker
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(date) => handleDateChange('startDate', date)}
        onCancel={() => setStartDatePickerVisibility(false)}
      />
      <DateTimePicker
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(date) => handleDateChange('endDate', date)}
        onCancel={() => setEndDatePickerVisibility(false)}
      />
    </Modal>
  );
}
