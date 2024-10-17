import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarraOpciones from '../components/BarraOpciones';
import EmpleadoList from '../components/Nomina/EmpleadoList';
import AgregarEmpleadoBoton from '../components/Nomina/AgregarEmpleadoBoton';

// Simulación de datos de empleados
const empleados = [
  {
    id: 1,
    nombre: 'Miguel Ruales',
    foto: 'https://i.pravatar.cc/150?img=1',
    cc: '1234567890',
    correo: 'miguel.ruales@example.com',
    telefono: '1234567890',
    direccion: 'Calle 123 #45-67',
    acudiente: 'Miguel Ruales',
    telefonoAcudiente: '1234567890',
    seguroLaboral: 'Seguro XYZ',
    eps: 'EPS ABC',
    tipoSangre: 'O+',
    cargo: 'Desarrollador',
  },
  {
    id: 2,
    nombre: 'Andres López',
    foto: 'https://i.pravatar.cc/150?img=2',
    cc: '0987654321',
    correo: 'andres.lopez@example.com',
    telefono: '0987654321',
    direccion: 'Avenida 789 #12-34',
    acudiente: 'Andres Lopez',
    telefonoAcudiente: '0987654321',
    seguroLaboral: 'Seguro ABC',
    eps: 'EPS XYZ',
    tipoSangre: 'A-',
    cargo: 'Diseñador',
  },
  // añadir más empleados a la lista
];

export default function Nomina() {
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    console.log('Eliminar empleado con ID:', id);
  };

  const handleAddEmployee = () => {
    navigation.navigate('AgregarEmpleado');
  };

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
      <ScrollView className='flex-1 bg-black'>
        <EmpleadoList
          empleados={empleados}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
          handleDelete={handleDelete}
        />
        <AgregarEmpleadoBoton handleAddEmployee={handleAddEmployee} />
      </ScrollView>
    </SafeAreaView>
  );
}
