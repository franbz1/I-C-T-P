import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getProjectById } from '../../Backend/services/ProjectoService'
import {
  getCommentsByProjectId,
  updateComment,
} from '../../Backend/services/CommentService' // Servicio para obtener los comentarios

export default function Proyecto() {
  const route = useRoute()
  const { id } = route.params
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([]) // Estado para los comentarios
  const [expandedComment, setExpandedComment] = useState(null) // Estado para el comentario expandido

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProjectById(id)
        setProject(fetchedProject)

        // Obtener comentarios
        const fetchedComments = await getCommentsByProjectId(id)
        setComments(fetchedComments)
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el proyecto o los comentarios.')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const toggleComment = (commentId) => {
    setExpandedComment(expandedComment === commentId ? null : commentId)
  }

  const handleToggleResolved = async (commentId, currentComment) => {
    try {
      // Actualiza el estado de "resuelto" en el backend usando updateComment
      const updatedData = {
        ...currentComment,
        resuelto: !currentComment.resuelto, // Invertir el estado actual de "resuelto"
      }
      
      // Actualizamos el estado local primero para que el usuario vea el cambio inmediatamente
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, resuelto: !currentComment.resuelto } : comment
        )
      )
      
      // Hacemos la actualización en el backend
      await updateComment(id, commentId, updatedData)

    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del comentario.')
    }
  }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <ActivityIndicator size='large' color='#FFD700' />
      </View>
    )
  }

  if (!project) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <Text className='text-yellow-400 text-lg'>Proyecto no encontrado</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='p-4'>
        <View className='space-y-4'>
          <View className=''>
            <Text className='text-yellow-400 text-2xl font-bold'>{project.name}</Text>
            <Text className='text-white mt-1'>Número de Contrato: {project.contractNumber}</Text>
            <Text className='text-white'>Desde: {project.startDate} | Hasta: {project.endDate}</Text>
          </View>

          <Image
            source={{ uri: project.image || 'https://via.placeholder.com/150' }}
            className='w-full h-64 rounded-lg'
            resizeMode='cover'
          />

          {/* Botones de navegación */}
          <View className='mt-6 space-y-2'>
            <Pressable className='bg-yellow-400 p-3 rounded-lg'>
              <Text className='text-center text-black font-semibold'>Bitácora</Text>
            </Pressable>
            <Pressable className='bg-yellow-500 p-3 rounded-lg'>
              <Text className='text-center text-black font-semibold'>Informe</Text>
            </Pressable>
            <Pressable className='bg-yellow-600 p-3 rounded-lg'>
              <Text className='text-center text-black font-semibold'>Nómina</Text>
            </Pressable>
          </View>

          {/* Sección de comentarios */}
          <View className='space-y-2 p-2'>
            <Text className='text-center font-semibold text-yellow-500'>Comentarios del contratista</Text>
            <View className='bg-neutral-900 rounded-lg mb-10'>
              {comments.map((comment) => (
                <View key={comment.id} className='p-4'>
                  {/* Sección de resolución y título del comentario */}
                  <View className='flex-row items-center'>
                    {/* Cuadro pequeño para el botón del estado */}
                    <Pressable
                      onPress={() => handleToggleResolved(comment.id, comment)}
                      style={{
                        width: 24,
                        height: 24,
                        borderWidth: 1,
                        borderColor: comment.resuelto ? '#32CD32' : '#FF6347',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 8, // Espaciado a la derecha del cuadrado
                      }}
                    >
                      {comment.resuelto && (
                        <Text style={{ color: '#32CD32', fontSize: 12 }}>✔️</Text> // Muestra el visto si está resuelto
                      )}
                    </Pressable>

                    {/* Título del comentario con estado visual basado en "resuelto" */}
                    <Pressable onPress={() => toggleComment(comment.id)} style={{ flex: 1 }}>
                      <Text
                        className={`font-semibold ${
                          comment.resuelto
                            ? 'line-through text-gray-400' // Título tachado y gris si está resuelto
                            : 'text-red-800' // Título en rojo si no está resuelto
                        }`}
                      >
                        {comment.titulo}{expandedComment ? '▲' : '▼'}
                      </Text>
                    </Pressable>
                  </View>

                  {/* Mostrar el cuerpo del comentario cuando esté expandido */}
                  {expandedComment === comment.id && (
                    <Text className='text-white mt-2'>
                      {comment.cuerpo}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
