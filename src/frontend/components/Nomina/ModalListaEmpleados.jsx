import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";

const ModalListaEmpleados = ({ visible, empleados, onClose, onConfirm }) => {
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);

  const toggleEmpleadoSelection = (empleadoId) => {
    if (selectedEmpleados.includes(empleadoId)) {
      setSelectedEmpleados(selectedEmpleados.filter((id) => id !== empleadoId));
    } else {
      setSelectedEmpleados([...selectedEmpleados, empleadoId]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedEmpleados);
    setSelectedEmpleados([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 bg-black bg-opacity-75 justify-center items-center">
        <View className="bg-neutral-900 w-4/5 p-4 rounded-lg">
          <Text className="text-2xl text-yellow-400 font-bold mb-4">Seleccionar Empleados</Text>
          <ScrollView>
            {empleados.map((empleado) => (
              <TouchableOpacity
                key={empleado.id}
                onPress={() => toggleEmpleadoSelection(empleado.id)}
                className={`p-2 rounded-lg border-b ${
                  selectedEmpleados.includes(empleado.id)
                    ? "bg-yellow-400"
                    : "bg-black"
                }`}
              >
                <Text className={`${selectedEmpleados.includes(empleado.id) ? 'text-black' : 'text-white'}`}>
                  {empleado.Nombres} {empleado.Apellidos}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity onPress={onClose} className="mr-4">
              <Text className="text-red-600">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text className="text-blue-600">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalListaEmpleados;
