import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
} from 'react-native-heroicons/outline';
import { updateEmpleado } from '../../../Backend/services/Empleado';

const EditableField = ({ label, value, isEditing, onChange, placeholder }) => (
  <View className="flex-row">
    <Text className="font-semibold text-yellow-400">{label}: </Text>
    {isEditing ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        className="text-white mb-2 flex-1 border-b border-yellow-400"
        placeholder={placeholder}
        placeholderTextColor="#facc15"
      />
    ) : (
      <Text className="text-white mb-2">{value}</Text>
    )}
  </View>
);

const EmpleadoItem = React.memo(({ empleado, expandedId, toggleExpand, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmpleado, setEditedEmpleado] = useState({ ...empleado });
  const [tempEmpleado, setTempEmpleado] = useState({ ...empleado });

  const handleEditToggle = useCallback(async () => {
    if (isEditing) {
      try {
        await updateEmpleado(empleado.id, editedEmpleado);
        setTempEmpleado({ ...editedEmpleado });
        console.log('Empleado actualizado con éxito:', editedEmpleado);
      } catch (error) {
        Alert.alert('Error', 'No se pudo actualizar el empleado. Intenta de nuevo.');
        setEditedEmpleado({ ...tempEmpleado });
        console.error('Error al actualizar el empleado:', error);
      }
    }
    setIsEditing(!isEditing);
  }, [isEditing, editedEmpleado, tempEmpleado, empleado.id]);

  const handleInputChange = useCallback((key, value) => {
    setEditedEmpleado((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const url = empleado.Foto || 'https://via.placeholder.com/150';

  return (
    <View className="mb-2 bg-neutral-900 rounded-lg shadow">
      <TouchableOpacity
        onPress={() => toggleExpand(empleado.id)}
        className="flex-row justify-between items-center p-4"
        activeOpacity={0.7}
      >
        <Text className="text-lg text-yellow-400 font-semibold">
          {tempEmpleado.Nombres}
        </Text>
        {expandedId === empleado.id ? (
          <ChevronUpIcon color="#facc15" size={24} />
        ) : (
          <ChevronDownIcon color="#facc15" size={24} />
        )}
      </TouchableOpacity>

      <Collapsible collapsed={expandedId !== empleado.id}>
        <View className="p-4 border-t border-[#facc15]">
          <Image source={{ uri: url }} className="w-24 h-24 rounded-full mb-4 self-center" />

          {/* Campos editables */}
          {[
            { label: 'Nombres', key: 'Nombres', placeholder: 'Nombres' },
            { label: 'Apellidos', key: 'Apellidos', placeholder: 'Apellidos' },
            { label: 'Correo', key: 'Correo', placeholder: 'Correo' },
            { label: 'Teléfono', key: 'Telefono', placeholder: 'Teléfono' },
            { label: 'Dirección', key: 'Direccion', placeholder: 'Dirección' },
            { label: 'Seguro Laboral', key: 'SeguroLaboral', placeholder: 'Seguro Laboral' },
            { label: 'EPS', key: 'EPS', placeholder: 'EPS' },
            { label: 'Tipo de Sangre', key: 'TipoSangineo', placeholder: 'Tipo de Sangre' },
            { label: 'Cargo', key: 'Cargo', placeholder: 'Cargo' },
            { label: 'Acudiente', key: 'NombresAcudiente', placeholder: 'Acudiente' },
            { label: 'Teléfono del Acudiente', key: 'TelefonoAcudiente', placeholder: 'Teléfono Acudiente' },
          ].map((field) => (
            <EditableField
              key={field.key}
              label={field.label}
              value={isEditing ? editedEmpleado[field.key] : tempEmpleado[field.key]}
              isEditing={isEditing}
              onChange={(value) => handleInputChange(field.key, value)}
              placeholder={field.placeholder}
            />
          ))}

          {/* Botones para guardar/cancelar edición */}
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              onPress={handleEditToggle}
              className={`p-2 rounded-full mr-2 ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}
              activeOpacity={0.7}
            >
              {isEditing ? <BookmarkIcon color="white" size={20} /> : <PencilIcon color="white" size={20} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(empleado.id)}
              className="bg-red-600 p-2 rounded-full"
              activeOpacity={0.7}
            >
              <TrashIcon color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Collapsible>
    </View>
  );
});

export default React.memo(EmpleadoItem);
