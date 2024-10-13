// services/utils.js
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase';

export const deleteCollection = async (collectionPath) => {
    const collectionRef = collection(firestore, collectionPath);
    const collectionSnapshot = await getDocs(collectionRef);

    const deletePromises = collectionSnapshot.docs.map((docSnapshot) => deleteDoc(doc(firestore, collectionPath, docSnapshot.id)));
    await Promise.all(deletePromises);
};
