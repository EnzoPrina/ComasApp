import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Montserrat_100Thin, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

import Navigation from './src/navigation/Navigation';
import { auth } from './firebaseConfig'; // Importa correctamente la configuración de Firebase
import { onAuthStateChanged } from 'firebase/auth'; // Importa onAuthStateChanged de firebase/auth

// Evita que la pantalla de carga se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Carga las fuentes
  const [fontsLoaded] = useFonts({
    Montserrat_Regular: Montserrat_400Regular,
    Montserrat_Bold: Montserrat_700Bold,
    Montserrat_100Thin: Montserrat_100Thin,
  });

  // Estado para controlar la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para controlar el proceso de carga

  // Callback para ocultar la pantalla de carga cuando las fuentes estén listas
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); // Oculta el Splash Screen una vez carguen las fuentes
    }
  }, [fontsLoaded]);

  // Verifica el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Si hay usuario autenticado, actualiza isLoggedIn
      setLoading(false); // Detenemos la carga después de comprobar la autenticación
    });

    return () => unsubscribe(); // Limpiamos el listener al desmontar
  }, []);

  // Muestra un indicador de carga mientras se cargan las fuentes y se comprueba la autenticación
  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Navigation isLoggedIn={isLoggedIn} />
      </NavigationContainer>
    </View>
  );
}
