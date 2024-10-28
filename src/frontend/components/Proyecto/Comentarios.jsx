// components/Comentarios.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, TextInput, Button, Alert } from 'react-native';
import { subscribeToComentarios, updateComentario, createComentario } from '../../../Backend/services/CommentService';

const Comentario = ({ comment, isExpanded, onToggleExpand, onToggleResolved }) => {
  const { ComentarioID, Titulo, Detalles, FechaComentario, FechaResuelto, Resuelto } = comment;

  return (
    <View className="p-4 border-b border-gray-700">
      <View className="flex-row items-center">
        <Pressable
          onPress={() => onToggleResolved(ComentarioID, comment)}
          style={{
            width: 24,
            height: 24,
            borderWidth: 1,
            borderColor: Resuelto ? '#32CD32' : '#FF6347',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
            borderRadius: 4,
          }}
        >
          {Resuelto && <Text style={{ color: '#32CD32', fontSize: 12 }}>✔️</Text>}
        </Pressable>

        <Pressable onPress={() => onToggleExpand(ComentarioID)} style={{ flex: 1 }}>
          <Text className={`font-semibold ${Resuelto ? 'line-through text-gray-400' : 'text-red-800'}`}>
            {Titulo} {isExpanded ? '▲' : '▼'}
          </Text>
        </Pressable>
      </View>

      {isExpanded && (
        <View className="mt-2">
          <Text className="text-white">{Detalles}</Text>
          {FechaComentario && (
            <Text className="text-gray-500 text-sm mt-1">
              Comentado el: {FechaComentario}
            </Text>
          )}
          {FechaResuelto && (
            <Text className="text-gray-500 text-sm mt-1">
              Resuelto el: {FechaResuelto}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const Comentarios = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState([]);
  const [newComment, setNewComment] = useState({ titulo: '', detalles: '' });

  useEffect(() => {
    const unsubscribe = subscribeToComentarios(projectId, setComments);
    return () => unsubscribe();
  }, [projectId]);

  const toggleComment = useCallback((commentId) => {
    setExpandedComments((prevExpanded) =>
      prevExpanded.includes(commentId)
        ? prevExpanded.filter((id) => id !== commentId)
        : [...prevExpanded, commentId]
    );
  }, []);

  const handleToggleResolved = useCallback(
    async (commentId, currentComment) => {
      try {
        const isResolving = !currentComment.Resuelto;
        const updatedData = {
          ...currentComment,
          Resuelto: isResolving,
          FechaResuelto: isResolving ? new Date().toISOString() : null,
        };

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.ComentarioID === commentId ? updatedData : comment
          )
        );

        await updateComentario(projectId, commentId, updatedData);
      } catch (error) {
        Alert.alert('Error', 'No se pudo actualizar el estado del comentario.');
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.ComentarioID === commentId ? currentComment : comment
          )
        );
      }
    },
    [projectId]
  );

  const handleInputChange = (field, value) => {
    setNewComment((prevComment) => ({ ...prevComment, [field]: value }));
  };

  const handleAddComment = async () => {
    const { titulo, detalles } = newComment;

    if (!titulo.trim() || !detalles.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const newCommentData = {
        titulo,
        detalles,
        fechaComentario: new Date().toISOString(),
        resuelto: false,
      };

      await createComentario(projectId, newCommentData);
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment({ titulo: '', detalles: '' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el comentario.');
    }
  };

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '';
    return (timestamp.toDate ? timestamp.toDate() : new Date(timestamp)).toLocaleDateString();
  }, []);

  return (
    <View className="space-y-2 p-2">
      <Text className="text-center font-semibold text-yellow-500">Comentarios del contratista</Text>
      
      {/* Formulario para nuevo comentario */}
      <View className="bg-neutral-800 p-4 rounded-lg mb-4">
        <TextInput
          placeholder="Título"
          placeholderTextColor={'#facc15'}
          value={newComment.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}
          className="p-2 mb-2 rounded text-white"
        />
        <TextInput
          placeholder="Descripción"
          placeholderTextColor={'#facc15'}
          value={newComment.detalles}
          onChangeText={(text) => handleInputChange('detalles', text)}
          className="p-2 mb-2 rounded text-white"
          multiline
        />
        <Button title="Agregar Comentario" onPress={handleAddComment} color="black" />
      </View>

      {/* Listado de comentarios existentes */}
      <View className="bg-neutral-900 rounded-lg mb-10">
        {comments.map((comment) => (
          <Comentario
            key={comment.ComentarioID}
            comment={{
              ...comment,
              FechaComentario: formatTimestamp(comment.FechaComentario),
              FechaResuelto: formatTimestamp(comment.FechaResuelto),
            }}
            isExpanded={expandedComments.includes(comment.ComentarioID)}
            onToggleExpand={toggleComment}
            onToggleResolved={handleToggleResolved}
          />
        ))}
      </View>
    </View>
  );
};

export default Comentarios;
