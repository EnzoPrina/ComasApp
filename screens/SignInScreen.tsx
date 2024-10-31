// SignInScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, Alert, Linking, Modal, ScrollView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons'; // Importar el ícono
import AntDesign from '@expo/vector-icons/AntDesign';

const auth = getAuth(firebaseApp);

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Main', { screen: 'HomeScreen' });
    } catch (error) {
      setErrorMessage('La contraseña o el email son incorrectos.');
    }
  };

  const handleLinkPress = () => {
    Linking.openURL('https://enzo-prina.netlify.app/');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/forvia-05.png')} style={styles.logo} />
      <TouchableOpacity style={styles.infoButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="infocirlceo" size={26} color="white" />
      </TouchableOpacity>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Projetado e desenvolvido por{'  '}
          <TouchableOpacity onPress={handleLinkPress}>
            <Text style={styles.linkText}>Enzo Prina</Text>
          </TouchableOpacity>
        </Text>
      </View>

      <Modal
        transparent={false} // Cambiado para ocupar toda la pantalla
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Cerrar modal al presionar atrás
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Vantagens da Aplicação para a Gestão nas Linhas COMAS</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalText}>
                Esta aplicação foi desenhada para otimizar a eficiência nas linhas de produção COMAS, oferecendo as seguintes vantagens:
              </Text>
              <Text style={styles.modalSubtitle}>Controlo Preciso da Produção:</Text>
              <Text style={styles.modalText}>
                Permite registar a quantidade exata de peças a fabricar, evitando a sobreprodução e reduzindo o trabalho adicional.
              </Text>
              <Text style={styles.modalSubtitle}>Otimização de Recursos:</Text>
              <Text style={styles.modalText}>
                Garante que cada linha conte com a quantidade necessária de materiais, minimizando custos e desperdícios.
              </Text>
              <Text style={styles.modalSubtitle}>Ecrãs Intuitivos:</Text>
              <Text style={styles.modalText}>
                Inclui dois ecrãs chave:
              </Text>
              <Text style={styles.modalSubtitle}>Referências:</Text>
              <Text style={styles.modalText}>
                Acesso a todas as referências de produção.
              </Text>
              <Text style={styles.modalSubtitle}>Gestão de Material:</Text>
              <Text style={styles.modalText}>
                Ferramenta para realizar cálculos e controlar quantidades de materiais.
              </Text>
              <Text style={styles.modalSubtitle}>Secção de Notas para Melhorias:</Text>
              <Text style={styles.modalText}>
                Facilita o registo de ideias e sugestões, promovendo a colaboração e a inovação entre a equipa.
              </Text>
              <Text style={styles.modalSubtitle}>Facilidade de Uso:</Text>
              <Text style={styles.modalText}>
                Interface intuitiva que assegura uma rápida adoção por parte dos utilizadores.
              </Text>
              <Text style={styles.modalSubtitle}>Aumento da Produtividade:</Text>
              <Text style={styles.modalText}>
                Melhora o controlo e a organização, contribuindo para um aumento notável na produtividade das linhas.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0024D3',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#0024D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  infoButton: {
    position: 'absolute',
    right: 16,
    top: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0024D3', // Fondo azul
  },
  modalContent: {
    width: '100%', // Cambiado para ocupar toda la pantalla
    backgroundColor: '#0024D3', // Fondo azul
    borderRadius: 0, // Sin bordes redondeados
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Texto en blanco
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Texto en blanco
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold', // Estilo más bold
    marginVertical: 5,
    color: '#fff', // Texto en blanco
  },
  modalText: {
    marginBottom: 10,
    lineHeight: 20,
    color: '#fff', // Texto en blanco
  },
  scrollViewContent: {
    paddingBottom: 20, // Para añadir espacio en la parte inferior
  },
});

export default SignInScreen;
