import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
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
import ModalListaEmpleados from "../components/Nomina/ModalListaEmpleados";

export default function NominaProyecto() {
  const route = useRoute(); 
  const { id } = route.params; 

  const [empleados, setEmpleados] = useState([]); // Empleados no asignados al proyecto
  const [empleadosProyecto, setEmpleadosProyecto] = useState([]); // Empleados asignados al proyecto
  const [expandedId, setExpandedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingProyecto, setLoadingProyecto] = useState(true);

  // Función para obtener los empleados del proyecto
  const fetchEmpleadosProyecto = useCallback(async () => {
    try {
      const empleadosData = await getEmpleadosByProyecto(id);
      setEmpleadosProyecto(empleadosData);
    } catch (error) {
      console.error("Error al obtener los empleados del proyecto:", error);
      Alert.alert("Error", "Ocurrió un error al obtener los empleados del proyecto");
    } finally {
      setLoadingProyecto(false);
    }
  }, [id]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Función para obtener los empleados excluyendo los que ya están en el proyecto
  const fetchEmpleados = useCallback(async () => {
    if (loadingProyecto) return;

    try {
      const empleadosData = await getEmpleados();
      const empleadosFiltrados = empleadosData.filter(
        (empleado) => !empleadosProyecto.some((empProyecto) => empProyecto.id === empleado.id)
      );
      setEmpleados(empleadosFiltrados);
    } catch (error) {
      console.error("Error al obtener los empleados: ", error);
      Alert.alert("Error", "Ocurrió un error al obtener la lista de empleados");
    }
  }, [empleadosProyecto, loadingProyecto]);

  // useEffect para cargar empleados del proyecto al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      await fetchEmpleadosProyecto();
    };
    fetchData();
  }, [fetchEmpleadosProyecto]);

  // useEffect para cargar empleados disponibles cuando los empleados del proyecto estén listos
  useEffect(() => {
    if (!loadingProyecto) {
      fetchEmpleados();
    }
  }, [loadingProyecto, fetchEmpleados]);

  // Manejar eliminación de empleado del proyecto
  const handleDelete = async (empleadoId) => {
    try {
      await eliminarProyectoAEmpleado(empleadoId, id);
      setEmpleadosProyecto((prevEmpleados) => prevEmpleados.filter((empleado) => empleado.id !== empleadoId));
      setEmpleados((prevEmpleados) => [...prevEmpleados, empleadosProyecto.find(e => e.id === empleadoId)]);
      console.log("Empleado eliminado del proyecto.");
    } catch (error) {
      console.error("Error al eliminar al empleado del proyecto: ", error);
      Alert.alert("Error", "Ocurrió un error al intentar eliminar al empleado del proyecto");
    }
  };

  // Manejar agregar empleados al proyecto
  const handleConfirmSelection = async (selectedEmpleados) => {
    try {
      const empleadosSeleccionados = empleados.filter((empleado) =>
        selectedEmpleados.includes(empleado.id)
      );

      await Promise.all(
        selectedEmpleados.map(async (empleadoId) => {
          await agregarProyectoAEmpleado(empleadoId, id);
        })
      );

      // Actualizamos los empleados del proyecto y la lista disponible
      setEmpleadosProyecto((prev) => [...prev, ...empleadosSeleccionados]);
      setEmpleados((prev) =>
        prev.filter((empleado) => !selectedEmpleados.includes(empleado.id))
      );

      console.log("Empleados agregados correctamente al proyecto.");
    } catch (error) {
      console.error("Error al agregar empleados al proyecto: ", error);
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
          <EmpleadoList
            empleados={empleadosProyecto} 
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            handleDelete={handleDelete}
          />
          <AgregarEmpleadoBoton handleAddEmployee={() => setModalVisible(true)} />
        </View>
      </ScrollView>

      {/* Modal para seleccionar empleados */}
      <ModalListaEmpleados
        visible={modalVisible}
        empleados={empleados}
        onClose={() => setModalVisible(false)} 
        onConfirm={handleConfirmSelection}
      />
    </SafeAreaView>
  );
}
