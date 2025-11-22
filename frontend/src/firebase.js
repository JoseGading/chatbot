import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - Using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Save chat message to Firebase
export const saveChatMessage = async (message, reply, sessionId, userId) => {
  try {
    await addDoc(collection(db, 'chatLogs'), {
      message,
      reply,
      sessionId,
      userId,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
};

// Get chat history - untuk user tertentu atau semua (admin)
export const getChatHistory = async (userId = null, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'chatLogs'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filter by userId jika ada, kalau tidak (admin) tampilkan semua
      if (!userId || data.userId === userId) {
        messages.push({ id: doc.id, ...data });
      }
    });
    return messages.reverse();
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

// Subscribe to real-time chat updates
export const subscribeToChatUpdates = (callback, limitCount = 50) => {
  try {
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
    }, (error) => {
      console.error('Error in real-time updates:', error);
      callback([]); // Return empty array on error
    });
  } catch (error) {
    console.error('Error subscribing to chat updates:', error);
    return () => {}; // Return no-op unsubscribe function
  }
};

export { db, analytics };
