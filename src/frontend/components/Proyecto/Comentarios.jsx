// components/Comentarios.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {
  subscribeToComentarios,
  updateComentario,
} from '../../../Backend/services/CommentService';

const Comentarios = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState([]); // Permitir múltiples comentarios expandibles

  useEffect(() => {
    // Suscribirse a los comentarios en tiempo real
    const unsubscribe = subscribeToComentarios(projectId, (fetchedComments) => {
      setComments(fetchedComments);
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [projectId]);

  // Función para alternar la expansión de un comentario
  const toggleComment = (commentId) => {
    setExpandedComments((prevExpanded) => {
      if (prevExpanded.includes(commentId)) {
        // Si ya está expandido, eliminarlo
        return prevExpanded.filter(id => id !== commentId);
      } else {
        // Si no está expandido, agregarlo
        return [...prevExpanded, commentId];
      }
    });
  };

  // Función para alternar el estado "Resuelto" de un comentario
  const handleToggleResolved = async (commentId, currentComment) => {
    try {
      const isResolving = !currentComment.Resuelto;
      const updatedData = {
        ...currentComment,
        Resuelto: isResolving,
        FechaResuelto: isResolving ? new Date().toISOString() : null, // Establecer fecha actual o null
      };

      // Actualizar el estado local primero para reflejar el cambio inmediatamente
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.ComentarioID === commentId
            ? { ...comment, Resuelto: isResolving, FechaResuelto: isResolving ? new Date().toISOString() : null }
            : comment
        )
      );

      // Hacer la actualización en el backend
      await updateComentario(projectId, commentId, updatedData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del comentario.');
      // Revertir el cambio en el estado local si falla la actualización
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.ComentarioID === commentId
            ? { ...comment, Resuelto: currentComment.Resuelto, FechaResuelto: currentComment.FechaResuelto }
            : comment
        )
      );
    }
  };

  // Función para formatear los timestamps de Firestore
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Firestore Timestamp tiene el método toDate()
    return date.toLocaleDateString();
  };

  return (
    <View className='space-y-2 p-2'>
      <Text className='text-center font-semibold text-yellow-500'>
        Comentarios del contratista
      </Text>

      <View className='bg-neutral-900 rounded-lg mb-10'>
        {comments.map((comment) => (
          <View key={comment.ComentarioID} className='p-4 border-b border-gray-700'>
            {/* Sección de resolución y título del comentario */}
            <View className='flex-row items-center'>
              {/* Cuadro pequeño para el botón del estado */}
              <Pressable
                onPress={() => handleToggleResolved(comment.ComentarioID, comment)}
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 1,
                  borderColor: comment.Resuelto ? '#32CD32' : '#FF6347',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                  borderRadius: 4,
                }}
              >
                {comment.Resuelto && (
                  <Text style={{ color: '#32CD32', fontSize: 12 }}>
                    ✔️
                  </Text>
                )}
              </Pressable>

              {/* Título del comentario con estado visual basado en "resuelto" */}
              <Pressable
                onPress={() => toggleComment(comment.ComentarioID)}
                style={{ flex: 1 }}
              >
                <Text
                  className={`font-semibold ${
                    comment.Resuelto
                      ? 'line-through text-gray-400'
                      : 'text-red-800'
                  }`}
                >
                  {comment.Titulo} {expandedComments.includes(comment.ComentarioID) ? '▲' : '▼'}
                </Text>
              </Pressable>
            </View>

            {/* Mostrar el cuerpo del comentario cuando esté expandido */}
            {expandedComments.includes(comment.ComentarioID) && (
              <View className='mt-2'>
                <Text className='text-white'>{comment.Detalles}</Text>
                {comment.FechaComentario && (
                  <Text className='text-gray-500 text-sm mt-1'>
                    Comentado el: {formatTimestamp(comment.FechaComentario)}
                  </Text>
                )}
                {comment.FechaResuelto && (
                  <Text className='text-gray-500 text-sm mt-1'>
                    Resuelto el: {formatTimestamp(comment.FechaResuelto)}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Comentarios;
