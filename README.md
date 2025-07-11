# Proyecto I-C-T-P - Aplicación de Gestión de Proyectos

Este repositorio contiene la aplicación de gestión de proyectos desarrollada para la hackatón de Parquesoft Nariño en colaboración con la empresa de ingeniería eléctrica **I-C-T-P**. La aplicación ha sido diseñada para facilitar el seguimiento, la administración y la optimización de los proyectos de ingeniería de la empresa, utilizando tecnologías modernas y enfocándonos en la simplicidad y la eficiencia.

![ictp](https://github.com/user-attachments/assets/aafc058c-0989-414a-ba42-2778c7b6e756)

## Descripción

La aplicación de gestión de proyectos I-C-T-P permite a los administradores y empleados de la empresa visualizar, organizar y realizar un seguimiento de cada proyecto en tiempo real. Desde la asignación de tareas hasta el seguimiento de avances y el almacenamiento seguro de archivos, esta solución está diseñada para cubrir las necesidades clave de la gestión de proyectos en el sector de ingeniería eléctrica.

## Características

- **Dashboard de Proyectos**: Vista centralizada con todos los proyectos activos, donde cada proyecto muestra su estado actual, fechas importantes y responsables.

![Imagen de WhatsApp 2025-06-25 a las 22 23 35_cde73176](https://github.com/user-attachments/assets/7b3d6954-0403-403c-9894-89a93eed92da)

- **Gestión de Tareas**: Creación, asignación y seguimiento de tareas específicas dentro de cada proyecto.

![Imagen de WhatsApp 2025-06-25 a las 22 23 36_d984beaa](https://github.com/user-attachments/assets/bf7f1440-7423-45a3-9f81-85bc3a56c4f9)
  
- **Bitácora y Registros**: Captura y almacenamiento de registros de actividades diarias, incluyendo detalles, empleados involucrados y recursos utilizados.

![Imagen de WhatsApp 2025-06-25 a las 22 23 35_67dd2852](https://github.com/user-attachments/assets/c1ed1e27-5e24-4350-bb5d-2fa7f2c9fab0)
  
- **Gestión de Empleados**: Administración de perfiles de empleados asociados a proyectos específicos, con roles, permisos y áreas de especialización.

![Imagen de WhatsApp 2025-06-25 a las 22 23 36_353734f3](https://github.com/user-attachments/assets/e100841b-a331-4ef9-b663-9e744488985b)

- **Subida y Organización de Documentos**: Integración de subida de documentos y archivos relevantes para cada proyecto con almacenamiento en la nube.
- **Interfaz de Usuario Intuitiva**: Diseño enfocado en la usabilidad para dispositivos móviles y optimizado para ingenieros y personal de proyectos.
- **Actualizaciones en Tiempo Real**: Utilización de Firebase para actualizaciones en tiempo real en el dashboard y las vistas de proyecto.

## Tecnologías

- **Frontend**: [React Native](https://reactnative.dev/) (versión Expo para desarrollo rápido y despliegue multiplataforma)
- **Backend y Almacenamiento**: Firebase (para autenticación, Firestore como base de datos en tiempo real y Firebase Storage para almacenamiento de archivos)
- **Estilos**: NativeWind, para estilizar la aplicación en concordancia con los principios de diseño de interfaz de usuario móvil

## Instalación y Ejecución

1. Clonar el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/ictp-gestion-proyectos.git
    cd ictp-gestion-proyectos
    ```

2. Instalar dependencias:

    ```bash
    npm install
    ```

3. Configurar Firebase:

    - Crear un proyecto en Firebase y habilitar la autenticación, Firestore y Firebase Storage.
    - Configurar las credenciales en un archivo `.env` o directamente en el proyecto.

4. Iniciar la aplicación:

    ```bash
    npx expo start
    ```

## Uso

1. **Registro y Login**: Autenticación para usuarios de la empresa.
2. **Navegación por Proyectos**: Visualización de la lista de proyectos en el dashboard.
3. **Gestión de Tareas y Bitácoras**: Acceso y creación de registros en cada proyecto.
4. **Administración de Empleados**: Asociación de empleados a proyectos específicos.

## Contribuidores

- **Miguel Francisco Ruales Pianda** - Programador Full Stack y Líder del Proyecto
- **David Enrique Benavides Melo** - Desarrollador Backend en Local
- **Julian M. Bastidas Perez** - Desarrollador Frontend

**Idea Original y Dueños de la Empresa I-C-T-P Ingeniería SAS**:
- **Janeth Herrera Yepez**
- **Andres Tobar Paredes**
