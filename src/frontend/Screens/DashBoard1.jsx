import React, { useContext, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Pressable, 
    Alert, 
    FlatList, 
    Modal, 
    TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../Backend/auth/authContext';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../../firebase'; // Asegúrate de exportar 'db' desde tu configuración de Firebase
import ProjectCard from '../components/projectCard';
import AddProjectCard from '../components/AddProjectCard';
import { Feather } from '@expo/vector-icons';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false); // Modal de usuario
    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false); // Modal de añadir proyecto
    const [newProject, setNewProject] = useState({
        contractNumber: '',
        name: '',
        startDate: '',
        endDate: '',
        image: '',
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, 'projects'), (snapshot) => {
            const projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsList);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("Éxito", "Has cerrado sesión.");
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión.");
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteDoc(doc(firestore, 'projects', projectId));
            Alert.alert("Eliminado", "El proyecto ha sido eliminado.");
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el proyecto.");
        }
    };

    const handleAddProject = async () => {
        if (!newProject.contractNumber || !newProject.name || !newProject.startDate || !newProject.endDate) {
            Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
            return;
        }

        const imageUrl = newProject.image.trim() === '' 
            ? 'https://via.placeholder.com/150' 
            : newProject.image;

        try {
            await addDoc(collection(firestore, 'projects'), {
                ...newProject,
                image: imageUrl,
                bitacora: [],
                informe: [],
                nomina: [],
            });
            setNewProject({ contractNumber: '', name: '', startDate: '', endDate: '', image: '' });
            toggleProjectModal();
        } catch (error) {
            Alert.alert("Error", "No se pudo añadir el proyecto.");
        }
    };

    const toggleUserModal = () => {
        setIsUserModalVisible(!isUserModalVisible);
    };

    const toggleProjectModal = () => {
        setIsProjectModalVisible(!isProjectModalVisible);
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
                <Pressable onPress={toggleUserModal}>
                    <Feather name="user" size={28} color="#FFD700" />
                </Pressable>
            </View>

            {/* Modal de usuario */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isUserModalVisible}
                onRequestClose={toggleUserModal}
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
                            onPress={toggleUserModal}
                        >
                            <Text className="text-white">Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal para añadir proyectos */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isProjectModalVisible}
                onRequestClose={toggleProjectModal}
            >
                <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
                    <View className="w-4/5 bg-neutral-800 rounded-lg p-5">
                        <Text className="text-lg font-bold text-yellow-400 mb-2">Añadir Proyecto</Text>
                        <TextInput 
                            placeholder="Número de contrato"
                            placeholderTextColor="#ccc"
                            value={newProject.contractNumber}
                            onChangeText={(text) => setNewProject({ ...newProject, contractNumber: text })}
                            className="bg-neutral-700 text-white p-2 rounded mb-2"
                        />
                        <TextInput 
                            placeholder="Nombre del proyecto"
                            placeholderTextColor="#ccc"
                            value={newProject.name}
                            onChangeText={(text) => setNewProject({ ...newProject, name: text })}
                            className="bg-neutral-700 text-white p-2 rounded mb-2"
                        />
                        <TextInput 
                            placeholder="Fecha de inicio (YYYY-MM-DD)"
                            placeholderTextColor="#ccc"
                            value={newProject.startDate}
                            onChangeText={(text) => setNewProject({ ...newProject, startDate: text })}
                            className="bg-neutral-700 text-white p-2 rounded mb-2"
                        />
                        <TextInput 
                            placeholder="Fecha de finalización (YYYY-MM-DD)"
                            placeholderTextColor="#ccc"
                            value={newProject.endDate}
                            onChangeText={(text) => setNewProject({ ...newProject, endDate: text })}
                            className="bg-neutral-700 text-white p-2 rounded mb-2"
                        />
                        <TextInput 
                            placeholder="Imagen (opcional)"
                            placeholderTextColor="#ccc"
                            value={newProject.image}
                            onChangeText={(text) => setNewProject({ ...newProject, image: text })}
                            className="bg-neutral-700 text-white p-2 rounded mb-2"
                        />
                        <Pressable 
                            className="bg-yellow-400 py-2 px-5 rounded-md mb-2"
                            onPress={handleAddProject}
                        >
                            <Text className="text-black font-bold">Añadir Proyecto</Text>
                        </Pressable>
                        <Pressable 
                            className="bg-gray-500 py-2 px-4 rounded-md"
                            onPress={toggleProjectModal}
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
                        <AddProjectCard onAdd={toggleProjectModal} /> // Cambia el manejo para abrir el modal de proyectos
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
