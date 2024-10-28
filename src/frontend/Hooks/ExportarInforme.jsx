import * as Print from 'expo-print';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { getInformeById } from '../../Backend/services/InformeService';

function useExportarInforme() {
  const requestAndroidPermission = async () => {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Se requieren permisos para almacenar el PDF en su dispositivo.');
      }
    }
  };

  const fetchInforme = async (projectId, informeId) => {
    try {
      const fetchedInforme = await getInformeById(projectId, informeId);
      return fetchedInforme;
    } catch (error) {
      console.error('Error al obtener el informe:', error);
      throw new Error('No se pudo obtener el informe, por favor intente nuevamente.');
    }
  };

  const createHtmlTemplate = (informe, objetivos) => {
    // Función para formatear fechas desde timestamp
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      const date = timestamp.toDate();
      return date.toLocaleDateString();
    };
  
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f9;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: auto;
              padding: 20px;
              background: #fff;
              box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
              position: relative;
            }
            .watermark {
              position: absolute;
              top: 10px;
              right: 10px;
              font-size: 12px;
              color: #777;
              opacity: 0.7;
              font-weight: bold;
            }
            h1, h2 {
              color: #3a77d2;
            }
            h1 {
              font-size: 24px;
              text-align: center;
            }
            h2 {
              font-size: 20px;
              margin-top: 20px;
            }
            p {
              line-height: 1.6;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 20px;
            }
            .objetivo {
              background-color: #e8f4ff;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 10px;
            }
            .objetivo h2 {
              font-size: 18px;
              color: #2a6595;
            }
            .objetivo p {
              margin: 5px 0;
            }
            .presupuesto, .contratistas {
              font-weight: bold;
              color: #3a77d2;
            }
            .image-gallery img {
              width: 100%;
              max-width: 300px;
              height: auto;
              border-radius: 8px;
              margin: 10px 0;
            }
            .image-gallery {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="watermark">I-C-T-P INGENIERIA</div>
            <h1>Informe de ${informe.NombreProyecto}</h1>
            <div class="section">
              <p><strong>Numero del Contrato:</strong> ${informe.Contrato}</p>
              <p><strong>Fecha de Inicio:</strong> ${formatDate(informe.FechaInicio)}</p>
              <p><strong>Fecha de Fin:</strong> ${formatDate(informe.FechaFin)}</p>
            </div>
            <div class="section">
              <p><strong>Introducción:</strong> ${informe.Introduccion}</p>
              <p><strong>Desarrollo:</strong> ${informe.Desarrollo}</p>
            </div>
            <div class="section">
              ${objetivos.map((objetivo) => `
                <div class="objetivo">
                  <h2>Objetivo : ${objetivo.Titulo}</h2>
                  <p><strong>Descripción:</strong> ${objetivo.Descripcion}</p>
                  <p><strong>Estado:</strong> ${objetivo.Completado ? 'Completado' : 'Pendiente'}</p>
                </div>
              `).join('')}
            </div>
            <div class="section">
              <p class="presupuesto"><strong>Presupuesto:</strong> ${informe.Presupuesto.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
              })}</p>
              <p class="contratistas"><strong>Contratistas:</strong> ${informe.Contratistas.join(', ')}</p>
            </div>
            <div class="section image-gallery">
              ${informe.Fotos.map((url, index) => `
                <img src="${url}" alt="Foto ${index + 1}" />
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  };
  
  

  const handleExportaInforme = async (projectId, informeId, objetivos) => {
    try {
      await requestAndroidPermission();
      const informe = (await fetchInforme(projectId, informeId)).data;
      
      const htmlContent = createHtmlTemplate(informe, objetivos);
      const { uri: tempUri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfFilePath = `${FileSystem.documentDirectory}${informe.NombreProyecto}_Informe.pdf`;
      await FileSystem.moveAsync({
        from: tempUri,
        to: pdfFilePath,
      });
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        await Sharing.shareAsync(pdfFilePath);
      }
    } catch (error) {
      console.error('Error al exportar el informe:', error);
    }
  };

  return {
    handleExportaInforme,
  };
}

export default useExportarInforme;
