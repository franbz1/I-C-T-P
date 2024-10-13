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
import DateTimePicker from 'react-native-modal-datetime-picker'; // Importa DateTimePicker
import { AuthContext } from '../../Backend/auth/authContext';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../../firebase';
import ProjectCard from '../components/projectCard';
import AddProjectCard from '../components/AddProjectCard';
import { Feather } from '@expo/vector-icons';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
    const [newProject, setNewProject] = useState({
        contractNumber: '',
        name: '',
        startDate: '',
        endDate: '',
        image: '',
    });
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false); // Estado para el picker de fecha de inicio
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false); // Estado para el picker de fecha de fin

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

    // Funciones para manejar las fechas
    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };

    const handleStartDateConfirm = (date) => {
        setNewProject({ ...newProject, startDate: date.toISOString().split('T')[0] }); // Guardar la fecha seleccionada
        hideStartDatePicker();
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };

    const handleEndDateConfirm = (date) => {
        setNewProject({ ...newProject, endDate: date.toISOString().split('T')[0] });
        hideEndDatePicker();
    };

    const renderItem = ({ item }) => (
        <ProjectCard 
            project={item} 
            onDelete={handleDeleteProject} 
        />
    );

    const resetProjectForm = () => {
        setNewProject({
            contractNumber: '',
            name: '',
            startDate: '',
            endDate: '',
            image: '',
        });
    };
    
    const closeModal = () => {
        resetProjectForm();  // Reinicia los valores de los campos al cerrar la modal
        toggleProjectModal();
    };

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
                onRequestClose={closeModal}
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
                        <Pressable onPress={showStartDatePicker}>
                            <Text className={`bg-neutral-700 text-[#ccc] p-2 rounded mb-2 ${
                                newProject.startDate ? 'text-white' : 'text-[#ccc]'
                            }`}>
                                {newProject.startDate ? `Fecha de inicio: ${newProject.startDate}` : 'Seleccionar fecha de inicio'}
                            </Text>
                        </Pressable>
                        <Pressable onPress={showEndDatePicker}>
                            <Text className={`bg-neutral-700 text-[#ccc] p-2 rounded mb-2 ${
                                newProject.endDate ? 'text-white' : 'text-[#ccc]'
                            }`}>
                                {newProject.endDate ? `Fecha de finalización: ${newProject.endDate}` : 'Seleccionar fecha de finalización'}
                            </Text>
                        </Pressable>
                        <TextInput 
                            placeholder="UrlImagen (opcional)"
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
                            onPress={closeModal}
                        >
                            <Text className="text-white">Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* DatePickers */}
            <DateTimePicker
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={hideStartDatePicker}
            />
            <DateTimePicker
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleEndDateConfirm}
                onCancel={hideEndDatePicker}
            />

            <FlatList
                data={[...projects, { id: 'add', name: 'Añadir Proyecto' }]} // Añadir el botón de añadir al final
                renderItem={({ item }) =>
                    item.id === 'add' ? (
                        <AddProjectCard onAdd={toggleProjectModal} />
                    ) : (
                        renderItem({ item })
                    )
                }
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
