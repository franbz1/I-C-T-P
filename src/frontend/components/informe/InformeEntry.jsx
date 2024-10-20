import { View, Text, Image } from "react-native"
import ProgressBar from "../ProgressBar" 

function InformeEntry({ informe }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return date.toLocaleDateString()
  }

  return (
    <View>
      <ProgressBar estado={informe.Estado} />
      <Text className='text-yellow-400 text-center text-2xl font-bold'>
        {informe.NombreProyecto}
      </Text>
      <Text className='text-white mt-1'>
        Número de Contrato: {informe.Contrato}
      </Text>
      <Text className='text-white mb-1'>
        Desde: {formatTimestamp(informe.FechaInicio)} | Hasta:{' '}
        {formatTimestamp(informe.FechaFin)}
      </Text>
      <Image
        source={{
          uri: informe.FotoPrincipal || 'https://via.placeholder.com/150',
        }}
        className='w-full h-64 rounded-lg'
        resizeMode='cover'
      />
      <Text className='text-white text-xl mt-1 text-center'>
        Introducción
      </Text>
      <Text className='text-white py-10 border-yellow-200 rounded-lg border-[1px]'>{informe.Introduccion}</Text>
      <Text className='text-white'>Desarrollo: {informe.Desarrollo}</Text>
      <Text className='text-white mt-1'>
        Presupuesto: {informe.Presupuesto}
      </Text>
      <Text className='text-white mt-1'>Fotos: {informe.Fotos}</Text>
      <Text className='text-white'>Nomina: {informe.Nomina}</Text>
      <Text className='text-white mt-1'>
        Contratistas: {informe.Contratistas}
      </Text>
    </View>
  )
}

export default InformeEntry
