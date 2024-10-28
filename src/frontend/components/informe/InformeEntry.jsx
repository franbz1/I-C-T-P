import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import { useEffect, useState, useCallback, useMemo } from 'react'
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

  const [introduccion, setIntroduccion] = useState(informe.Introduccion || '')
  const [desarrollo, setDesarrollo] = useState(informe.Desarrollo || '')
  const [presupuesto, setPresupuesto] = useState(informe.Presupuesto || 0)
  const [fotos, setFotos] = useState(informe.Fotos || [])
  const [contratistas, setContratistas] = useState(
    informe.Contratistas.join(', ') || ''
  )

  const manejarObjetivos = useCallback(
    (objetivosActualizados) => setObjetivos(objetivosActualizados),
    []
  )

  const progreso = useMemo(() => {
    if (!objetivos.length) return 0
    const completados = objetivos.filter((objetivo) => objetivo.Completado).length
    return Math.round((completados * 100) / objetivos.length)
  }, [objetivos])

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString()
  }, [])

  useEffect(() => {
    const guardarCambios = async () => {
      if (!isEditing) {
        const parsedBudget = parseFloat(presupuesto)
        if (isNaN(parsedBudget)) {
          alert('Por favor ingresa un presupuesto válido.')
          return
        }

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

        try {
          await updateInforme(proyecto.id, informe.id, informeData)
        } catch (error) {
          console.error('Error al actualizar el informe:', error)
          alert('No se pudo actualizar el informe. Inténtalo de nuevo.')
        }
      }
    }
    guardarCambios()
  }, [isEditing])

  const handleAddImage = useCallback(async () => {
    try {
      setIsUploading(true)
      const url = await handleSelectImage()
      if (url) {
        const updatedFotos = [...fotos, url]
        setFotos(updatedFotos)
        await updateInforme(proyecto.id, informe.id, { ...informe, Fotos: updatedFotos })
      }
    } catch (error) {
      console.error('Error al subir la foto:', error)
      alert('No se pudo subir la foto. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }, [fotos, handleSelectImage, informe, proyecto.id])

  const handleRemoveImage = useCallback(async (index) => {
    try {
      setIsUploading(true)
      const updatedFotos = fotos.filter((_, i) => i !== index)
      setFotos(updatedFotos)
      await updateInforme(proyecto.id, informe.id, { ...informe, Fotos: updatedFotos })
      alert('Foto eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar la foto:', error)
      alert('No se pudo eliminar la foto. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }, [fotos, informe, proyecto.id])

  const exportarInforme = useCallback(() => {
    handleExportaInforme(id, informe.id, objetivos)
  }, [handleExportaInforme, id, informe.id, objetivos])

  return (
    <View className="flex-1">
      <ProgressBar estado={progreso} />
      <Text className="text-yellow-500 text-center text-2xl font-bold">
        {proyecto.Nombre}
      </Text>
      <Text className="text-white mt-2">Número de Contrato: {proyecto.Contrato}</Text>
      <Text className="text-white mb-2">
        Desde: {formatTimestamp(proyecto.FechaInicio)} | Hasta: {formatTimestamp(proyecto.FechaFin)}
      </Text>
      <Image
        source={{ uri: proyecto.Imagen || 'https://via.placeholder.com/150' }}
        className="w-full h-48 rounded-lg"
        resizeMode="cover"
      />

      <Text className="text-white text-xl mt-2 text-center">Introducción</Text>
      {isEditing ? (
        <TextInput
          value={introduccion}
          onChangeText={setIntroduccion}
          className="text-white rounded-lg border border-gray-500 p-2 mb-2"
          multiline
        />
      ) : (
        <Text className="text-white rounded-lg border p-2 mb-2">
          {introduccion}
        </Text>
      )}

      <Text className="text-white text-xl mt-2 text-center">Desarrollo</Text>
      {isEditing ? (
        <TextInput
          value={desarrollo}
          onChangeText={setDesarrollo}
          className="text-white rounded-lg border border-gray-500 p-2 mb-2"
          multiline
        />
      ) : (
        <Text className="text-white rounded-lg border p-2 mb-2">
          {desarrollo}
        </Text>
      )}

      <Objetivos projectId={id} informeId={informe.id} actualObjectives={manejarObjetivos} />

      <View className="flex-row justify-between items-center">
        <Text className="text-white text-lg">Presupuesto:</Text>
        {isEditing ? (
          <TextInput
            value={presupuesto.toString()}
            onChangeText={setPresupuesto}
            keyboardType="numeric"
            className="text-white text-lg border-b border-gray-500"
          />
        ) : (
          <Text className="text-white text-lg">
            {presupuesto.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
            })}
          </Text>
        )}
      </View>

      <Text className="text-white mt-2">Contratistas:</Text>
      {isEditing ? (
        <TextInput
          value={contratistas}
          onChangeText={setContratistas}
          className="text-white rounded-lg border-b border-gray-500 mb-2"
        />
      ) : (
        <Text className="text-white mb-2">{contratistas}</Text>
      )}

      <Carousel
        className="mb-2"
        images={fotos}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        isUploading={isUploading}
        isEditable={isEditing}
      />

      <TouchableOpacity className="bg-yellow-400 rounded-lg p-2 mt-4" onPress={exportarInforme}>
        <Text className="text-white text-center">Exportar Informe</Text>
      </TouchableOpacity>
    </View>
  )
}

export default InformeEntry
