import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Asegúrate de tener la configuración correcta de Firebase

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Estado para el email
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Autentica al usuario con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Si el login es exitoso, navega a la pantalla Home
      navigation.navigate('HomeScreen'); 
    } catch (err) {
      // Si hay un error en el login, muestra una alerta con el mensaje de error
      setError('Error en el inicio de sesión. Verifica tus credenciales.');
      console.log("Error en el login:", err.message); // Muestra el mensaje de error en la consola
      Alert.alert('Login Fallido', err.message); // Muestra el mensaje de error detallado en la alerta
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/forvia-blanco.png')} // Asegúrate de que el archivo de imagen exista en la ruta correcta
        style={styles.logo}
      />
      <Text style={styles.title}>BIENVENIDO!</Text>
      <Text style={styles.subtitle}>Se eficiente, ten las referencias a mano.</Text>

      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#d3d3d3"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Define que el campo es de tipo email
        autoCapitalize="none" // Evita que las letras se capitalicen automáticamente
      />

    
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#d3d3d3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

     
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Acceder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0024D3',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
    resizeMode: 'contain',
    borderWidth: 0,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00188c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
