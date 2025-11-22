import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - Langsung terintegrasi
const firebaseConfig = {
  apiKey: "AIzaSyC0yE00Hw-1GEsUVJ_xf26k-Iuh0fVB4Zk",
  authDomain: "dasda-ec527.firebaseapp.com",
  databaseURL: "https://dasda-ec527-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dasda-ec527",
  storageBucket: "dasda-ec527.firebasestorage.app",
  messagingSenderId: "916617697357",
  appId: "1:916617697357:web:7673e80f88a40f0cd02404",
  measurementId: "G-G3HBFEQYW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Save chat message to Firebase
export const saveChatMessage = async (message, reply, sessionId) => {
  try {
    await addDoc(collection(db, 'chatLogs'), {
      message,
      reply,
      sessionId,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
};

// Get chat history
export const getChatHistory = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'chatLogs'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return messages.reverse();
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

// Subscribe to real-time chat updates
export const subscribeToChatUpdates = (callback, limitCount = 50) => {
  const q = query(
    collection(db, 'chatLogs'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages.reverse());
  });
};

export { db, analytics };
