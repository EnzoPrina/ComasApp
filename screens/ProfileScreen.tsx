// ProfileScreen.tsx (o cualquier otra pantalla donde se implemente el Sign Out)
import React from 'react';
import { View, Button } from 'react-native';
import { firebase } from '../firebaseConfig'; // Asegúrate de que esta ruta sea correcta en tu proyecto

const ProfileScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate('SignIn'); // Navegar a la pantalla de inicio de sesión tras cerrar sesión
    } catch (error) {
      console.error('Error during Sign Out:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default ProfileScreen;
