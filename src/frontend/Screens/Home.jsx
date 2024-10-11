import React, { useContext, useState } from 'react';
import { 
    View, 
    Text, 
    Pressable, 
    Alert, 
    FlatList, 
    Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../Backend/auth/authContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import ProjectCard from '../components/projectCard';
import AddProjectCard from '../components/AddProjectCard';
import { Feather } from '@expo/vector-icons';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([
        { id: '1', name: 'Proyecto 1', image: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Proyecto 2', image: 'https://via.placeholder.com/150' },
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("Éxito", "Has cerrado sesión.");
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión.");
        }
    };

    const handleDeleteProject = (projectId) => {
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        Alert.alert("Eliminado", "El proyecto ha sido eliminado.");
    };

    const handleAddProject = () => {
        Alert.alert("Añadir Proyecto", "Funcionalidad para añadir un nuevo proyecto.");
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const renderItem = ({ item }) => (
        <ProjectCard 
            project={item} 
            onDelete={handleDeleteProject} 
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row justify-end mb-2 px-4 pt-4">
                <Pressable onPress={toggleModal}>
                    <Feather name="user" size={28} color="#FFD700" />
                </Pressable>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
                    <View className="w-4/5 bg-neutral-800 rounded-lg p-5 items-center">
                        <Text className="text-lg font-bold text-yellow-400 mb-2">Información del Usuario</Text>
                        <Text className="text-base text-white mb-5">Nombre: {user.displayName || 'Usuario'}</Text>
                        <Pressable 
                            className="bg-yellow-400 py-2 px-5 rounded-md mb-2"
                            onPress={handleLogout}
                        >
                            <Text className="text-black font-bold">Cerrar Sesión</Text>
                        </Pressable>
                        <Pressable 
                            className="bg-gray-500 py-2 px-4 rounded-md"
                            onPress={toggleModal}
                        >
                            <Text className="text-white">Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={[...projects, { id: 'add', name: 'Añadir Proyecto' }]} // Añadir el botón de añadir al final
                renderItem={({ item }) =>
                    item.id === 'add' ? (
                        <AddProjectCard onAdd={handleAddProject} />
                    ) : (
                        renderItem({ item })
                    )
                }
                keyExtractor={item => item.id}
                numColumns={2} // Mostrar dos columnas
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }} // Espaciado entre columnas
                contentContainerStyle={{ paddingBottom: 20 }} // Espaciado en la parte inferior
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
