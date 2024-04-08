
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, getDocs, getDoc} from 'firebase/firestore';

export interface TodoItem {
    id?: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: Date;
    location?: string;
    imageUri?: string;
}

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLh61AmHqLtUUUAbToHAn4HyOIaAo8Wa0",
    authDomain: "angular-form-1e0d7.firebaseapp.com",
    databaseURL: "https://angular-form-1e0d7-default-rtdb.firebaseio.com",
    projectId: "angular-form-1e0d7",
    storageBucket: "angular-form-1e0d7.appspot.com",
    messagingSenderId: "1066590711795",
    appId: "1:1066590711795:web:27e44d5c409b6e0cc76c86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export async function uploadImage(filePath: string): Promise<string> {
    const response = await fetch(filePath);
    const filePathsplits = filePath.split('/');
    const filename = filePathsplits[filePathsplits.length - 1];
    const extendName = filename.split('.')[1];
    const blob = await response.blob();
    const imageRef = ref(storage, `images/${filename}`);
    const snapshot = await  uploadBytesResumable(imageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export async function addTodoItem(item: TodoItem): Promise<void> {
    await addDoc(collection(db, "todos"), item);
}

export async function updateTodoItem(id: string, item: Partial<TodoItem>): Promise<void> {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, item);
}

export async function deleteTodoItem(id: string): Promise<void> {
    const todoRef = doc(db, "todos", id);
    await deleteDoc(todoRef);
}

export async function getAllTodos(): Promise<TodoItem[]> {
    const todosCollectionRef = collection(db, "todos");
    const q = query(todosCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const todos: TodoItem[] = [];
    querySnapshot.forEach((doc) => {
        todos.push({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            isCompleted: doc.data().isCompleted,
            createdAt: doc.data().createdAt.toDate(),
            imageUri: doc.data().imageUri,
        } as TodoItem);
    });
    return todos;
}

export async function getTodoById(id: string): Promise<TodoItem | undefined> {
    const todoRef = doc(db, "todos", id);
    const docSnap = await getDoc(todoRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TodoItem;
    } else {
        console.log("No such document!");
        return undefined;
    }
}
