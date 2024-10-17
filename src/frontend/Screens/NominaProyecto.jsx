import React, { useState, useEffect } from "react";
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
} from "../../Backend/services/Empleado";
import ModalListaEmpleados from "../components/Nomina/ModalListaEmpleados"; // Importamos el modal

export default function NominaProyecto() {
  const route = useRoute(); // Obtener los params de la ruta
  const { id } = route.params; // Obtener el ID del proyecto desde los params de la ruta

  const [empleados, setEmpleados] = useState([]);
  const [empleadosProyecto, setEmpleadosProyecto] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Para controlar la visibilidad del modal
  const [loadingProyecto, setLoadingProyecto] = useState(true); // Controlar cuando los empleados del proyecto se cargan

  // Función para obtener los empleados del proyecto
  const fetchEmpleadosProyecto = async () => {
    try {
      const empleadosData = await getEmpleadosByProyecto(id);
      setEmpleadosProyecto(empleadosData);
    } catch (error) {
      console.error("Error al obtener los empleados del proyecto:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al obtener los empleados del proyecto"
      );
    } finally {
      setLoadingProyecto(false); // Indicar que los empleados del proyecto se han cargado
    }
  };

  // Función para obtener los empleados excluyendo los que ya están en el proyecto
  const fetchEmpleados = async () => {
    if (loadingProyecto) return; // Esperar hasta que los empleados del proyecto se hayan cargado

    try {
      // Obtener todos los empleados
      const empleadosData = await getEmpleados();

      // Excluir los empleados que ya están en este proyecto
      const empleadosFiltrados = empleadosData.filter(
        (empleado) =>
          !empleadosProyecto.some(
            (empProyecto) => empProyecto.id === empleado.id
          )
      );

      setEmpleados(empleadosFiltrados); // Actualizar el estado con los empleados filtrados
    } catch (error) {
      console.error("Error al obtener los empleados: ", error);
      Alert.alert("Error", "Ocurrió un error al obtener la lista de empleados");
    }
  };

  // useEffect para obtener los empleados del proyecto primero, luego los otros empleados
  useEffect(() => {
    const fetchData = async () => {
      await fetchEmpleadosProyecto(); // Obtener los empleados del proyecto
    };

    fetchData(); // Llamar a la función para obtener empleados y proyectos
  }, []);

  // useEffect para cargar los empleados una vez que los empleados del proyecto están cargados
  useEffect(() => {
    if (!loadingProyecto) {
      fetchEmpleados(); // Llamar a la función para obtener empleados excluyendo los del proyecto
    }
  }, [loadingProyecto]); // Ejecutar fetchEmpleados cuando empleadosProyecto esté listo

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    console.log("Eliminar empleado con ID:", id);
  };

  const handleAddEmployee = () => {
    setModalVisible(true); // Mostrar el modal al presionar el botón de agregar
  };

  const handleConfirmSelection = async (selectedEmpleados) => {
    try {
      // Filtrar los empleados seleccionados del array de empleados
      const empleadosSeleccionados = empleados.filter((empleado) =>
        selectedEmpleados.includes(empleado.id)
      );
      // Agregar los empleados seleccionados al proyecto localmente
      setEmpleadosProyecto((prevEmpleados) => [
        ...prevEmpleados,
        ...empleadosSeleccionados,
      ]);

      // Agregar el proyecto a cada empleado en Firestore
      await Promise.all(
        selectedEmpleados.map(async (empleadoId) => {
          console.log(empleadoId, id); // Aquí usamos "id" que viene de route.params
          await agregarProyectoAEmpleado(empleadoId, id); // Pasar el id del proyecto (no proyectoId)
        })
      );

      console.log("Empleados agregados correctamente al proyecto.");
    } catch (error) {
      console.error("Error al agregar empleados al proyecto: ", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al agregar los empleados al proyecto"
      );
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
            empleados={empleadosProyecto} // Usa los empleados obtenidos desde Firestore
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            handleDelete={handleDelete}
          />
          <AgregarEmpleadoBoton handleAddEmployee={handleAddEmployee} />
        </View>
      </ScrollView>

      {/* Modal para seleccionar empleados */}
      <ModalListaEmpleados
        visible={modalVisible}
        empleados={empleados}
        onClose={() => setModalVisible(false)} // Cerrar modal
        onConfirm={handleConfirmSelection} // Manejar la confirmación de selección
      />
    </SafeAreaView>
  );
}
