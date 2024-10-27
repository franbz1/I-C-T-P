import { View, Text, Image, TextInput, Pressable, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import ProgressBar from '../ProgressBar'
import Objetivos from './Objetivos'
import Carousel from '../Carousel'
import { updateInforme } from '../../../Backend/services/InformeService'
import useImageUpload from '../../Hooks/useImageUpload'
import useExportarInforme from '../../Hooks/ExportarInforme'

function InformeEntry({ informe, id, proyecto, isEditing }) {
  const [objetivos, setObjetivos] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const { handleSelectImage } = useImageUpload()
  const { handleExportaInforme } = useExportarInforme()

  // Estados locales para los campos editables
  const [introduccion, setIntroduccion] = useState(informe.Introduccion || '')
  const [desarrollo, setDesarrollo] = useState(informe.Desarrollo || '')
  const [presupuesto, setPresupuesto] = useState(informe.Presupuesto || 0)
  const [fotos, setFotos] = useState(informe.Fotos || [])
  const [contratistas, setContratistas] = useState(
    informe.Contratistas.join(', ') || ''
  )

  useEffect(() => {
    toggleEditMode()
  }, [isEditing])

  const manejarObjetivos = (objetivosActualizados) => {
    setObjetivos(objetivosActualizados)
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp.seconds * 1000) // Convertir de segundos a milisegundos
    return date.toLocaleDateString()
  }

  function calcularProgreso(objetivos) {
    if (!objetivos || objetivos.length === 0) return 0
    let total = objetivos.filter((objetivo) => objetivo.Completado).length
    return Math.round((total * 100) / objetivos.length)
  }

  const toggleEditMode = async () => {
    if (!isEditing) {
      const parsedBudget = parseFloat(presupuesto)
      if (isNaN(parsedBudget)) {
        alert('Por favor ingresa un presupuesto válido.')
        return
      }

      try {
        const informeData = {
          NombreProyecto: proyecto.Nombre,
          Contrato: proyecto.Contrato,
          Empleados: proyecto.Empleados,
          FechaInicio: proyecto.FechaInicio,
          FechaFin: proyecto.FechaFin,
          Introduccion: introduccion,
          Desarrollo: desarrollo,
          Presupuesto: parsedBudget,
          Contratistas: contratistas.split(',').map((item) => item.trim()),
        }
        await updateInforme(proyecto.id, informe.id, informeData)
        setIntroduccion(informeData.Introduccion)
        setDesarrollo(informeData.Desarrollo)
        setPresupuesto(informeData.Presupuesto)
        setContratistas(informeData.Contratistas.join(', '))
      } catch (error) {
        console.error('Error al actualizar el informe:', error)
        alert('No se pudo actualizar el informe. Inténtalo de nuevo.')
      }
    }
  }

  const handleAddImage = async () => {
    try {
      setIsUploading(true)
      const url = await handleSelectImage()
      if (url) {
        const updatedFotos = [...fotos, url]
        setFotos(updatedFotos) // Actualizar fotos en el frontend
        const updatedInforme = { ...informe, Fotos: updatedFotos } // Actualizar informe con las nuevas fotos
        await updateInforme(proyecto.id, informe.id, updatedInforme)
      }
    } catch (error) {
      console.error('Error al subir la foto:', error)
      alert('No se pudo subir la foto. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async (index) => {
    try {
      setIsUploading(true)

      const updatedFotos = fotos.filter((_, i) => i !== index)
      setFotos(updatedFotos)
      const updatedInforme = { ...informe, Fotos: updatedFotos }
      await updateInforme(proyecto.id, informe.id, updatedInforme)
      alert('Foto eliminada correctamente')
      setIsUploading(false)
    } catch (error) {
      console.error('error al elimnar la foto:', error)
      alert('No se pudo eliminar la foto. Inténtalo de nuevo.')
      setIsUploading(false)
    }
  }

  const exportarInforme = async () => {
    handleExportaInforme(id, informe.id, objetivos)
  }

  return (
    <View className='flex-1'>
      <ProgressBar estado={calcularProgreso(objetivos)} />
      <Text className='text-yellow-500 text-center text-2xl font-bold'>
        {proyecto.Nombre}
      </Text>
      <Text className='text-white mt-2'>
        Número de Contrato: {proyecto.Contrato}
      </Text>
      <Text className='text-white mb-2'>
        Desde: {formatTimestamp(proyecto.FechaInicio)} | Hasta:{' '}
        {formatTimestamp(proyecto.FechaFin)}
      </Text>
      <Image
        source={{ uri: proyecto.Imagen || 'https://via.placeholder.com/150' }}
        className='w-full h-48 rounded-lg'
        resizeMode='cover'
      />

      <Text className='text-white text-xl mt-2 text-center'>Introducción</Text>
      {isEditing ? (
        <TextInput
          value={introduccion}
          onChangeText={setIntroduccion}
          className='text-white rounded-lg border border-gray-500 p-2 mb-2'
          multiline={true}
        />
      ) : (
        <Text className='text-white rounded-lg border p-2 mb-2'>
          {introduccion}
        </Text>
      )}

      <Text className='text-white text-xl mt-2 text-center'>Desarrollo</Text>
      {isEditing ? (
        <TextInput
          value={desarrollo}
          onChangeText={setDesarrollo}
          className='text-white rounded-lg border border-gray-500 p-2 mb-2'
          multiline={true}
        />
      ) : (
        <Text className='text-white rounded-lg border p-2 mb-2'>
          {desarrollo}
        </Text>
      )}

      <Objetivos
        projectId={id}
        informeId={informe.id}
        actualObjectives={manejarObjetivos}
      />

      <View className='flex-row justify-between items-center'>
        <Text className='text-white text-lg'>Presupuesto:</Text>
        {isEditing ? (
          <TextInput
            value={presupuesto.toString()}
            onChangeText={setPresupuesto}
            keyboardType='numeric'
            className='text-white text-lg border-b border-gray-500'
          />
        ) : (
          <Text className='text-white text-lg'>
            {presupuesto.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
            })}
          </Text>
        )}
      </View>

      <Text className='text-white mt-2'>Contratistas:</Text>
      {isEditing ? (
        <TextInput
          value={contratistas}
          onChangeText={setContratistas}
          className='text-white rounded-lg border-b border-gray-500 mb-2'
        />
      ) : (
        <Text className='text-white mb-2'>{contratistas}</Text>
      )}
      <Carousel
        className='mb-2'
        images={fotos}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        isUploading={isUploading}
        isEditable={true}
      />

      <TouchableOpacity
        className='bg-yellow-400 rounded-lg p-2 mt-4'
        onPress={exportarInforme}
      >
        <Text className='text-white text-center'>Exportar Informe</Text>
      </TouchableOpacity>
    </View>
  )
}

export default InformeEntry
