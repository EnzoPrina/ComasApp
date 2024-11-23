// Navigation.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, StyleSheet, Text, Modal, Button } from 'react-native';
import HomeScreen from '../../screens/HomeScreen';
import ConteoScreen from '../../screens/ConteoScreen';
import ProductionLineScreen from '../../screens/ProductionLineScreen';
import ReferenceScreen from '../../screens/ReferenceScreen';
import ReferenceConteoScreen from '../../screens/ReferenceConteoScreen';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AdminScreen from '../../screens/AdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente TabNavigator
// Componente TabNavigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Oculta el header de cada tab
        tabBarStyle: {
          backgroundColor: '#fff', // Aquí cambiamos el color a #0024d3
          borderTopWidth: 0,
          borderRadius: 100,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 70,
          marginBottom: 15,
          paddingBottom: 10,
          marginHorizontal: 20,
        },
      }}
    >
      <Tab.Screen 
        name="Produção" 
        component={ProductionLineScreen} 
        options={{
          tabBarLabel: 'Picking',
          tabBarIcon: ({ color }) => <MaterialIcons name="blur-linear" size={30} color="black" />,
        }} 
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: () => (
            <View style={styles.homeIconContainer}>
              <View style={styles.circle}>
                <Image source={require('../../assets/forvia-05.png')} style={styles.forviaImage} />
              </View>
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Conteo" 
        component={ConteoScreen} 
        options={{
          tabBarLabel: 'Contagem',
          tabBarIcon: ({ color }) => <AntDesign name="calculator" size={28} color="black" />,
        }} 
      />
      <Tab.Screen 
        name="ReferenceConteo" 
        component={ReferenceConteoScreen} 
        options={{ tabBarButton: () => null }} 
      />
      <Tab.Screen 
        name="ReferenceScreen" 
        component={ReferenceScreen} 
        options={{ tabBarButton: () => null }} 
      />
      <Tab.Screen 
        name="Admin" 
        component={AdminScreen} 
        options={{ tabBarButton: () => null }} 
      />
    </Tab.Navigator>
  );
}


// Componente de bienvenida inicial
const WelcomeScreen = ({ onWelcomeComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onWelcomeComplete, 5000); // Mostrar por 3 segundos
    return () => clearTimeout(timer);
  }, [onWelcomeComplete]);

  return (
    <View style={styles.welcomeContainer}>
      <Image source={require('../../assets/forvia-05.png')} style={styles.forviaImageLarge} />
      <Text style={styles.welcomeText}>Bem-vindo à Comas App</Text>
      <Text style={styles.descriptionText}>A melhor solução para a gestão de produção na sua empresa</Text>
    </View>
  );
};

// Componente principal de navegación
export default function Navigation() {
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleWelcomeComplete = () => {
    setIsWelcomeShown(true);
    setIsModalVisible(true); // Mostrar modal después de bienvenida
  };

  const handleAcceptModal = () => {
    setIsModalVisible(false); // Cerrar modal y redirigir al HomeScreen
  };

  return (
    <>
      {/* Mostrar el modal después de la bienvenida */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Esta aplicação não é propriedade da Forvia Faurecia, 
              mas foi concebida e desenvolvida como uma ferramenta de apoio 
              para otimizar o fluxo de trabalho e facilitar a gestão de produção.
            </Text>
            <Button title="Aceitar" onPress={handleAcceptModal} color="#0024d3" />
          </View>
        </View>
      </Modal>

      <Stack.Navigator 
        screenOptions={{
          headerShown: false, // Oculta el encabezado de todas las pantallas del stack
        }}
      >
        {!isWelcomeShown ? (
          <Stack.Screen name="Welcome">
            {() => <WelcomeScreen onWelcomeComplete={handleWelcomeComplete} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
}

// Estilos
const styles = StyleSheet.create({
  forviaImage: {
    width: 40,
    height: 40,
  },
  forviaImageLarge: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  homeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -15,
  },
  circle: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#0024d3',
    borderRadius: 100,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0024d3',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});
