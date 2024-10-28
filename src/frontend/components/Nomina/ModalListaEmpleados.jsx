import React, { useState, useMemo } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";

const ModalListaEmpleados = ({ visible, empleados, onClose, onConfirm }) => {
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);

  const toggleEmpleadoSelection = (empleadoId) => {
    setSelectedEmpleados((prevSelected) =>
      prevSelected.includes(empleadoId)
        ? prevSelected.filter((id) => id !== empleadoId)
        : [...prevSelected, empleadoId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedEmpleados);
    setSelectedEmpleados([]);
    onClose();
  };

  // Memorizar el estado de los empleados seleccionados
  const isSelected = useMemo(
    () => (empleadoId) => selectedEmpleados.includes(empleadoId),
    [selectedEmpleados]
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black bg-opacity-75 justify-center items-center">
        <View className="bg-neutral-900 w-4/5 p-6 rounded-lg">
          <Text className="text-2xl text-yellow-400 font-bold mb-4">
            Seleccionar Empleados
          </Text>
          <ScrollView className="max-h-60">
            {empleados.map((empleado) => (
              <TouchableOpacity
                key={empleado.id}
                onPress={() => toggleEmpleadoSelection(empleado.id)}
                className={`p-2 rounded-lg mb-2 border-b ${
                  isSelected(empleado.id) ? "bg-yellow-400" : "bg-black"
                }`}
              >
                <Text
                  className={`text-center ${
                    isSelected(empleado.id) ? "text-black" : "text-white"
                  }`}
                >
                  {empleado.Nombres} {empleado.Apellidos}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="flex-row justify-end mt-4 space-x-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-red-500 rounded-md"
            >
              <Text className="text-white font-semibold">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              className="px-4 py-2 bg-blue-500 rounded-md"
            >
              <Text className="text-white font-semibold">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalListaEmpleados;
