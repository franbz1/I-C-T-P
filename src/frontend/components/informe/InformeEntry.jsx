import { View, Text, Image } from 'react-native'
import ProgressBar from '../ProgressBar'
import Objetivos from './Objetivos'

function InformeEntry({ informe, id }) {  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return date.toLocaleDateString()
  }

  return (
    <View className='flex-1'>
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
      <Text className='text-white text-xl mt-1 text-center'>Introducción</Text>
      <Text className='text-white rounded-lg border-[1px] mb-2'>
        {informe.Introduccion}
      </Text>
      <Text className='text-white rounded-lg border-[1px]'>
        {informe.Desarrollo}
      </Text>
      <Objetivos id={id} informeId={informe.id} />
      <View className='flex-row justify-between items-center'>
        <Text className='text-white text-xl'>Presupuesto:</Text>
        <Text className='text-white text-xl'>{informe.Presupuesto}</Text>
      </View>
      <Text className='text-white mt-1'>Fotos: {informe.Fotos}</Text>
      <Text className='text-white'>Nomina: {informe.Nomina}</Text>
      <Text className='text-white mt-1'>
        Contratistas: {informe.Contratistas}
      </Text>
    </View>
  )
}

export default InformeEntry
