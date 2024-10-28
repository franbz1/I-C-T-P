import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Alert, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import BarraOpciones from "../components/BarraOpciones";
import EmpleadoList from "../components/Nomina/EmpleadoList";
import AgregarEmpleadoBoton from "../components/Nomina/AgregarEmpleadoBoton";
import {
  getEmpleados,
  agregarProyectoAEmpleado,
  getEmpleadosByProyecto,
  eliminarProyectoAEmpleado,
} from "../../Backend/services/Empleado";
import { updateProjectEmployees, eliminarEmpleadoAProyecto } from "../../Backend/services/ProjectoService";
import ModalListaEmpleados from "../components/Nomina/ModalListaEmpleados";

export default function NominaProyecto() {
  const { id } = useRoute().params;

  const [empleados, setEmpleados] = useState([]);
  const [empleadosProyecto, setEmpleadosProyecto] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEmpleadosProyecto = useCallback(async () => {
    try {
      const empleadosData = await getEmpleadosByProyecto(id);
      setEmpleadosProyecto(empleadosData);
      return empleadosData;
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener los empleados del proyecto");
    }
  }, [id]);

  const fetchEmpleados = useCallback(async (empleadosProyecto) => {
    try {
      const empleadosData = await getEmpleados();
      const empleadosFiltrados = empleadosData.filter(
        (empleado) => !empleadosProyecto.some((emp) => emp.id === empleado.id)
      );
      setEmpleados(empleadosFiltrados);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener la lista de empleados");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const empleadosProyectoData = await fetchEmpleadosProyecto();
        await fetchEmpleados(empleadosProyectoData || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchEmpleadosProyecto, fetchEmpleados]);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const handleDelete = async (empleadoId) => {
    try {
      await eliminarProyectoAEmpleado(empleadoId, id);
      await eliminarEmpleadoAProyecto(id, empleadoId);

      setEmpleadosProyecto((prev) => prev.filter((emp) => emp.id !== empleadoId));
      setEmpleados((prev) => [...prev, empleadosProyecto.find((emp) => emp.id === empleadoId)]);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al intentar eliminar al empleado del proyecto");
    }
  };

  const handleConfirmSelection = async (selectedEmpleados) => {
    try {
      const empleadosSeleccionados = empleados.filter((emp) =>
        selectedEmpleados.includes(emp.id)
      );

      await Promise.all([
        ...selectedEmpleados.map((empleadoId) =>
          agregarProyectoAEmpleado(empleadoId, id)
        ),
        ...selectedEmpleados.map((empleadoId) =>
          updateProjectEmployees(id, empleadoId)
        ),
      ]);

      setEmpleadosProyecto((prev) => [...prev, ...empleadosSeleccionados]);
      setEmpleados((prev) => prev.filter((emp) => !selectedEmpleados.includes(emp.id)));
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al agregar los empleados al proyecto");
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <ScrollView className="flex-1 bg-black">
        <View className="p-4">
          <Text className="text-2xl text-yellow-400 font-bold mb-4">
            Empleados en el Proyecto
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#FFD700" />
          ) : (
            <EmpleadoList
              empleados={empleadosProyecto}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              handleDelete={handleDelete}
            />
          )}

          <AgregarEmpleadoBoton handleAddEmployee={() => setModalVisible(true)} />
        </View>
      </ScrollView>

      <ModalListaEmpleados
        visible={modalVisible}
        empleados={empleados}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmSelection}
      />
    </SafeAreaView>
  );
}
