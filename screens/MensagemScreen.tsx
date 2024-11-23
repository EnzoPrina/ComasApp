import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../firebaseConfig'; // Asegúrate de la ruta correcta a tu archivo firebaseConfig.js

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MensagemScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(''); // ID del usuario autenticado
  const [otherUserId, setOtherUserId] = useState(''); // Reemplaza por el ID del otro usuario

  useEffect(() => {
    // Autenticar al usuario
    login('user@example.com', 'password123').then((user) => {
      setUserId(user.uid); // Guardar el UID del usuario autenticado
      listenForMessages(user.uid);
    });
  }, []);

  // Función para iniciar sesión
  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  }

  // Función para enviar un mensaje
  async function sendMessage() {
    try {
      await addDoc(collection(db, 'messages'), {
        from: userId,
        to: otherUserId,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage(''); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  }

  // Función para escuchar los mensajes en tiempo real
  function listenForMessages(currentUserId: string) {
    const q = query(
      collection(db, 'messages'),
      where('to', '==', currentUserId) // Filtra los mensajes que van dirigidos a este usuario
    );

    onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Escribe un mensaje"
        style={styles.input}
      />
      <Button title="Enviar" onPress={sendMessage} />
    </View>
  );
};

export default MensagemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fbff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#e6e6fa',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
  },
});
