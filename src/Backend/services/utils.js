// services/utils.js
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firestore, storage, auth } from '../../../firebase'

export const deleteCollection = async (collectionPath) => {
  const collectionRef = collection(firestore, collectionPath)
  const collectionSnapshot = await getDocs(collectionRef)

  const deletePromises = collectionSnapshot.docs.map((docSnapshot) =>
    deleteDoc(doc(firestore, collectionPath, docSnapshot.id))
  )
  await Promise.all(deletePromises)
}

export const uploadImage = async (uri) => {
  try {
    // Convertir la URI de la imagen a blob
    const response = await fetch(uri)
    const blob = await response.blob()

    // Crear una referencia en Firebase Storage
    const storageRef = ref(
      storage,
      `images/${auth.currentUser.uid}/${Date.now()}`
    )

    // Subir la imagen
    const snapshot = await uploadBytes(storageRef, blob)

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error al subir la imagen: ', error)
    return null
  }
}
