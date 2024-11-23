import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { BlurView } from 'expo-blur';

const AdminScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'enzoprina9@gmail.com' && password === 'Comas9+') {
      Alert.alert('Login bem-sucedido!', 'Você foi autenticado com sucesso.', [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Produção', { isAdmin: true }) 
        },
      ]);
    } else {
      Alert.alert('Erro de autenticação', 'Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <ImageBackground source={require('../assets/backg2.png')} style={styles.background}>
      <BlurView intensity={1} tint="light" style={styles.blurContainer}>
        <Image source={require('../assets/forvia-05.png')} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '90%',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#0024d3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
