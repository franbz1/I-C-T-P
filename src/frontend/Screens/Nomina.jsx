import React, { useState, useEffect } from "react";
import { ScrollView, Alert, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarraOpciones from "../components/BarraOpciones";
import EmpleadoList from "../components/Nomina/EmpleadoList";
import AgregarEmpleadoBoton from "../components/Nomina/AgregarEmpleadoBoton";
import { getEmpleados } from "../../Backend/services/Empleado";

export default function Nomina() {
  const [empleados, setEmpleados] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();

  // Función para obtener los empleados desde Firestore
  const fetchEmpleados = async () => {
    try {
      const empleadosData = await getEmpleados();
      setEmpleados(empleadosData); // Actualiza el estado con los empleados obtenidos
    } catch (error) {
      console.error("Error al obtener los empleados: ", error);
      Alert.alert("Error", "Ocurrió un error al obtener la lista de empleados");
    }
  };

  // Se ejecuta cuando se monta el componente
  useEffect(() => {
    fetchEmpleados(); // Llamar a la función para obtener empleados
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    console.log("Eliminar empleado con ID:", id);
    // Aquí puedes llamar a la función de eliminar empleado si es necesario
  };

  const handleAddEmployee = () => {
    navigation.navigate("AgregarEmpleado");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <ScrollView className="flex-1 bg-black">
        <View className='p-4'>
          <Text className="text-2xl text-yellow-400 font-bold mb-4">
            Nómina de Empleados
          </Text>
          <EmpleadoList
            empleados={empleados} // Usa los empleados obtenidos desde Firestore
            expandedId={expandedId}
            toggleExpand={toggleExpand}
            handleDelete={handleDelete}
          />
          <AgregarEmpleadoBoton handleAddEmployee={handleAddEmployee} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
