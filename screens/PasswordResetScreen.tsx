import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const auth = getAuth();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um endereço de email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Sucesso", "Um link de redefinição foi enviado para o seu email.");
      navigation.navigate('LoginScreen'); // Navega de volta para a tela de login
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/forvia-05.png')} style={styles.logo} />
      <Text style={styles.title}>Recuperar Senha</Text>
      <TextInput
        placeholder="Insira o seu email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar link de redefinição</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.loginLinkText}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0024D3',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#0024D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default PasswordResetScreen;
