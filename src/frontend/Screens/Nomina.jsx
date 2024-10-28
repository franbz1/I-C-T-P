import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Alert, Text, View, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarraOpciones from "../components/BarraOpciones";
import EmpleadoList from "../components/Nomina/EmpleadoList";
import AgregarEmpleadoBoton from "../components/Nomina/AgregarEmpleadoBoton";
import { getEmpleados, deleteEmpleado } from "../../Backend/services/Empleado";

export default function Nomina() {
  const [empleados, setEmpleados] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    try {
      const empleadosData = await getEmpleados();
      setEmpleados(empleadosData);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      Alert.alert("Error", "Ocurrió un error al obtener la lista de empleados");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEmpleados();
    }, [fetchEmpleados])
  );

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar Empleado",
      "¿Estás seguro de que deseas eliminar este empleado?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => {
          try {
            deleteEmpleado(id)
            setEmpleados(prevEmpleados => prevEmpleados.filter(empleado => empleado.id !== id))
            alert('Empleado eliminado con éxito')
          } catch (error) {
            alert('Error al eliminar el empleado')
            console.error('Error al eliminar el empleado:', error)
          }
        } },
      ]
    );
  };

  const handleAddEmployee = () => navigation.navigate("AgregarEmpleado");

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-black">
        <View className="p-4">
          <Text className="text-2xl text-yellow-400 font-bold mb-4">
            Nómina de Empleados
          </Text>
          {loading ? (
            <View className="flex-1 justify-center items-center mt-5">
              <ActivityIndicator size="large" color="#FBBF24" />
              <Text className="text-yellow-400 mt-2">Cargando empleados...</Text>
            </View>
          ) : (
            <EmpleadoList
              empleados={empleados}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              handleDelete={handleDelete}
              allowEdit
            />
          )}
          <AgregarEmpleadoBoton handleAddEmployee={handleAddEmployee} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
