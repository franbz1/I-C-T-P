import { View, Text, Image, TextInput, Button } from 'react-native';
import { useState } from 'react';
import ProgressBar from '../ProgressBar';
import Objetivos from './Objetivos';
import { updateInforme } from '../../../Backend/services/InformeService'; // Asegúrate de importar la función de actualización de informe

function InformeEntry({ informe, id, proyecto }) {
  const [Objetivos1, setObjetivos1] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados locales para los campos editables
  const [introduccion, setIntroduccion] = useState(informe.Introduccion || '');
  const [desarrollo, setDesarrollo] = useState(informe.Desarrollo || '');
  const [presupuesto, setPresupuesto] = useState(informe.Presupuesto || '');
  const [contratistas, setContratistas] = useState(informe.Contratistas || '');

  const manejarObjetivos = (objetivos) => {
    setObjetivos1(objetivos);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  function CalcularProgreso(objetivos) {
    if (!objetivos || objetivos.length === 0) return 0;
    let total = objetivos.filter((objetivo) => objetivo.Completado).length;
    return Math.round((total * 100) / objetivos.length);
  }

  // Manejador de la edición/actualización de los datos
  const toggleEditMode = async () => {
    console.log(contratistas);
    if (isEditing) {
      // Guardar cambios en Firebase
      
      await updateInforme(proyecto.id, informe.id, {
        introduction: introduccion,
        desarrollo: desarrollo,
        budget: parseFloat(presupuesto),
        contractors: contratistas,
      });
    }
    setIsEditing(!isEditing); // Cambiar el estado de edición
  };

  return (
    <View className="flex-1">
      <ProgressBar estado={CalcularProgreso(Objetivos1)} />
      <Text className="text-yellow-400 text-center text-2xl font-bold">
        {proyecto.Nombre}
      </Text>
      <Text className="text-white mt-1">Número de Contrato: {proyecto.Contrato}</Text>
      <Text className="text-white mb-1">
        Desde: {formatTimestamp(proyecto.FechaInicio)} | Hasta: {formatTimestamp(proyecto.FechaFin)}
      </Text>
      <Image
        source={{
          uri: proyecto.Imagen || 'https://via.placeholder.com/150',
        }}
        className="w-full h-64 rounded-lg"
        resizeMode="cover"
      />
      
      <Text className="text-white text-xl mt-1 text-center">Introducción</Text>
      {isEditing ? (
        <TextInput
          value={introduccion}
          onChangeText={setIntroduccion}
          className="text-white rounded-lg border-gray-700 p-1 border-[1px] mb-2"
          multiline={true}
        />
      ) : (
        <Text className="text-white rounded-lg border-[1px] mb-2">{informe.Introduccion}</Text>
      )}

      <Text className="text-white text-xl mt-1 text-center">Desarrollo</Text>
      {isEditing ? (
        <TextInput
          value={desarrollo}
          onChangeText={setDesarrollo}
          className="text-white rounded-lg border-gray-700 p-1 border-[1px] mb-2"
          multiline={true}
        />
      ) : (
        <Text className="text-white rounded-lg border-[1px]">{informe.Desarrollo}</Text>
      )}

      <Objetivos projectId={id} informeId={informe.id} actualObjectives={manejarObjetivos} />

      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xl">Presupuesto:</Text>
        {isEditing ? (
          <TextInput
            value={presupuesto.toString()}
            onChangeText={setPresupuesto}
            keyboardType="numeric"
            className="text-white text-xl border-b border-gray-700"
          />
        ) : (
          <Text className="text-white text-xl">
              {informe.Presupuesto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
          </Text>
        )}
      </View>

      <Text className="text-white mt-1">Contratistas:</Text>
      {isEditing ? (
        <TextInput
          value={contratistas}
          onChangeText={setContratistas}
          className="text-white rounded-lg p-1 border-b border-gray-700 mb-2"
        />
      ) : (
        <Text className="text-white mb-2">{informe.Contratistas}</Text>
      )}

      <Button title={isEditing ? "Guardar" : "Editar"} onPress={toggleEditMode} />
    </View>
  );
}

export default InformeEntry;
