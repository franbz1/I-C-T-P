import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../auth/authContext';
import Login from '../../frontend/Screens/Login'; // Ajusta las rutas según tu estructura
import Home from '../../frontend/Screens/DashBoard1'; // Pantalla principal después del login
import Loading from '../../frontend/Screens/Loading'; // Pantalla de carga opcional
import Proyecto from '../../frontend/Screens/Proyecto' //Pantalla de un proyecto
import Bitacora from '../../frontend/Screens/Bitacora'; //';
import FormularioBitacora from '../../frontend/Screens/FormularioBitacora';
import Nomina from '../../frontend/Screens/Nomina';
import NominaProyecto from '../../frontend/Screens/NominaProyecto';
import AgregarEmpleado from '../../frontend/Screens/AgregarEmpleado';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, initializing } = useContext(AuthContext);

    if (initializing) {
        return <Loading />; // Muestra una pantalla de carga mientras se inicializa
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // Rutas para usuarios autenticados
                    <>
                        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                        <Stack.Screen name='Proyecto' component={Proyecto} options={{headerShown: false}} />
                        <Stack.Screen name='Bitacora' component={Bitacora} options={{ headerShown: false }} />
                        <Stack.Screen name='FormularioBitacora' component={FormularioBitacora} options={{headerShown: false}} />
                        <Stack.Screen name='AgregarEmpleado' component={AgregarEmpleado} options={{headerShown: false}} />
                        <Stack.Screen name='Nomina' component={Nomina} options={{headerShown: false}} />
                        <Stack.Screen name='NominaProyecto' component={NominaProyecto} options={{headerShown: false}} />
                        {/* Agrega más pantallas protegidas aquí */}
                    </>
                ) : (
                    // Rutas para usuarios no autenticados
                    <>
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;