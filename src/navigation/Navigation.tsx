// Navigation.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, StyleSheet, Alert, Button, Text } from 'react-native';
import HomeScreen from '../../screens/HomeScreen';
import ConteoScreen from '../../screens/ConteoScreen';
import ProductionLineScreen from '../../screens/ProductionLineScreen';
import SignInScreen from '../../screens/SignInScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import ReferenceScreen from '../../screens/ReferenceScreen';
import ReferenceConteoScreen from '../../screens/ReferenceConteoScreen';
import { auth } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { firestore } from '../../firebaseConfig';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente TabNavigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          borderRadius: 100,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 70,
          marginBottom: 10,
          marginHorizontal: 20,
        },
      }}
    >
      <Tab.Screen 
        name="Producción" 
        component={ProductionLineScreen} 
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <MaterialIcons name="blur-linear" size={30} color="black" />,
          header: () => <CustomHeader />,
        }} 
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: () => (
            <View style={styles.homeIconContainer}>
              <View style={styles.circle}>
                <Image source={require('../../assets/forvia.png')} style={styles.forviaImage} />
              </View>
            </View>
          ),
          header: () => <CustomHeader />,
        }} 
      />
      <Tab.Screen 
        name="Conteo" 
        component={ConteoScreen} 
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <AntDesign name="calculator" size={28} color="black" />,
          header: () => <CustomHeader />,
        }} 
      />
      
      <Tab.Screen 
        name="ReferenceConteo" 
        component={ReferenceConteoScreen} 
        options={{ 
          header: () => <CustomHeader />, 
          tabBarButton: () => null }}
         // Ocultar el botón de la pestaña
      />
      <Tab.Screen 
        name="ReferenceScreen" 
        component={ReferenceScreen} 
        options={{
          header: () => <CustomHeader />,
          tabBarButton: () => null }} // Ocultar el botón de la pestaña
      />
    </Tab.Navigator>
  );
}

// Componente de encabezado personalizado
const CustomHeader = ({ userName }) => {
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Sesión cerrada con éxito');
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Olá {userName}</Text>
      <Button title="Terminar Sessão" onPress={handleLogout} color="#0024d3" />
    </View>
  );
};

// Componente de navegación principal
export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Usuario'); // Estado para el nombre del usuario

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('User state changed:', user);
      setIsLoggedIn(!!user);
      if (user) {
        // Si el usuario está autenticado, busca su nombre en Firestore
        const userRef = firestore.collection('users').doc(user.uid); // Cambia 'users' por el nombre de tu colección
        userRef.get().then((doc) => {
          if (doc.exists) {
            setUserName(doc.data().name); // Asegúrate de que 'name' es el campo correcto en Firestore
          } else {
            console.log('No se encontró el documento del usuario');
          }
        }).catch((error) => {
          console.error('Error al obtener el documento:', error);
        });
      } else {
        setUserName('Usuario'); // Restablece a 'Usuario' si no hay sesión
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main">
          {() => <MainTabNavigator userName={userName} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Auth" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Estilos
const styles = StyleSheet.create({
  forviaImage: {
    width: 40,
    height: 40,
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
  header: {    
    paddingTop: 30,
    backgroundColor: '#0024d3',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    paddingLeft:10,
    color: '#ffffff',
    fontSize: 20,
  },
});
