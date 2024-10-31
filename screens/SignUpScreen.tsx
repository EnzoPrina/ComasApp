// SignUpScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Asegúrate de tener esta librería instalada
import AntDesign from '@expo/vector-icons/AntDesign';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Crear cuenta en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar el nombre y el correo en Firestore bajo el ID del usuario
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: user.email,
      });

      Alert.alert('Registro Exitoso', 'Tu cuenta ha sido creada con éxito');
      navigation.navigate('Main', { screen: 'HomeScreen' }); // Navegar a la pantalla principal tras registrarse
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/forvia-05.png')} style={styles.logo} />
      <TouchableOpacity style={styles.infoIcon} onPress={() => setModalVisible(true)}>
      <AntDesign name="infocirlceo" size={26} color="white" />
      </TouchableOpacity>
      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#fff"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Inscribirse</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
        <Text style={styles.signInText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Projetado e desenvolvido por{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://enzo-prina.netlify.app/')}>
            Enzo Prina
          </Text>
        </Text>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Vantagens da Aplicação para a Gestão nas Linhas COMAS</Text>
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
              Inclui dois ecrãs chave: Referências: Acesso a todas as referências de produção. Gestão de Material: Ferramenta para realizar cálculos e controlar quantidades de materiais.
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
  signInText: {
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
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
  },
  link: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  infoIcon: {
    position: 'absolute',
    right: 16,
    top: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#0024D3',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '90%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SignUpScreen;
