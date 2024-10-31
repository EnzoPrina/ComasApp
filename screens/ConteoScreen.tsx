import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import references from '../data/references.json';
import { Ionicons } from '@expo/vector-icons';

interface Material {
  name: string;
  material_reference: string;
  quantity: number;
}

interface Reference {
  reference: string;
  materials: Material[];
}

const ConteoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState<string>(''); // Estado para el texto de búsqueda
  const [recentReferences, setRecentReferences] = useState<Reference[]>([]); // Estado para referencias recientes

  useEffect(() => {
    // Cargar referencias recientes desde AsyncStorage
    const loadRecentReferences = async () => {
      try {
        const storedReferences = await AsyncStorage.getItem('recentReferences');
        if (storedReferences) {
          console.log('Referencias recientes cargadas:', storedReferences); // Depuración
          setRecentReferences(JSON.parse(storedReferences));
        } else {
          console.log('No se encontraron referencias recientes.'); // Depuración
        }
      } catch (error) {
        console.error('Error loading recent references:', error);
      }
    };

    loadRecentReferences();
  }, []);

  // Guardar referencias recientes en AsyncStorage
  const saveRecentReferences = async (updatedReferences: Reference[]) => {
    try {
      console.log('Guardando referencias recientes:', updatedReferences); // Depuración
      await AsyncStorage.setItem('recentReferences', JSON.stringify(updatedReferences));
    } catch (error) {
      console.error('Error saving recent references:', error);
    }
  };

  // Obtener referencias filtradas según el texto de búsqueda
  const filteredReferences = Object.keys(references).flatMap((line) =>
    references[line].filter((ref: Reference) =>
      ref.reference.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Redirigir cuando se selecciona una referencia y pasar la línea y referencia seleccionada
  const handleReferenceClick = (line: string, reference: string) => {
    const selectedReference = references[line].find((ref: Reference) => ref.reference === reference);
    
    // Si se encuentra la referencia, agregarla a recientes
    if (selectedReference) {
      const updatedRecentReferences = [selectedReference, ...recentReferences.filter((ref) => ref.reference !== reference)];
      setRecentReferences(updatedRecentReferences);
      saveRecentReferences(updatedRecentReferences); // Guardar en AsyncStorage
    }

    navigation.navigate('ReferenceConteo', { line, reference });
  };

  // Redirigir cuando se selecciona una línea de producción
  const handleLineButtonPress = (line: string) => {
    navigation.navigate('ReferenceConteo', { line });
  };

  // Borrar referencias recientes
  const clearRecentReferences = async () => {
    setRecentReferences([]);
    await AsyncStorage.removeItem('recentReferences'); // Limpiar referencias recientes del almacenamiento
  };

  // Escuchar cuando se regresa a la pantalla para actualizar las referencias recientes
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Recargar referencias recientes desde AsyncStorage al volver a la pantalla
      const loadRecentReferences = async () => {
        try {
          const storedReferences = await AsyncStorage.getItem('recentReferences');
          if (storedReferences) {
            console.log('Referencias recientes recargadas al volver a la pantalla:', storedReferences); // Depuración
            setRecentReferences(JSON.parse(storedReferences));
          }
        } catch (error) {
          console.error('Error loading recent references:', error);
        }
      };

      loadRecentReferences();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Selecione uma Linha de Produção        </Text>

        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.lineButtonsContainer}>
            <TouchableOpacity onPress={() => handleLineButtonPress('COMAS 1')} style={styles.lineButton}>
              <Text style={styles.lineButtonText}>COMAS 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLineButtonPress('COMAS 2')} style={styles.lineButton}>
              <Text style={styles.lineButtonText}>COMAS 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLineButtonPress('COMAS 3')} style={styles.lineButton}>
              <Text style={styles.lineButtonText}>COMAS 3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLineButtonPress('Subconjunto')} style={styles.lineButton}>
              <Text style={styles.lineButtonText}>Subconjunto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      
      <View style={styles.searchContainerWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar referências..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={20} color="#0024d3" style={styles.searchIcon} />
        </View>

      
        <ScrollView style={styles.scrollView}>
          {searchText.length > 0 ? (
            filteredReferences.length === 0 ? (
              <Text style={styles.errorText}>Nenhuma referência encontrada.</Text>
            ) : (
              filteredReferences.map((ref: Reference) => (
                <TouchableOpacity
                  key={ref.reference}
                  style={styles.referenceButton}
                  onPress={() => handleReferenceClick('COMAS 1', ref.reference)} // Asegúrate de pasar la línea correcta
                >
                  <Text style={styles.referenceText}>{ref.reference}</Text>
                </TouchableOpacity>
              ))
            )
          ) : (
            <>
              <Text style={styles.recentTitle}>Referências Recentes              </Text>
              {recentReferences.map((ref) => (
                <TouchableOpacity
                  key={ref.reference}
                  style={styles.referenceButton}
                  onPress={() => handleReferenceClick('COMAS 1', ref.reference)} // Asegúrate de pasar la línea correcta
                >
                  <Text style={styles.referenceText}>{ref.reference}</Text>
                </TouchableOpacity>
              ))}

              {recentReferences.length > 0 && (
                <TouchableOpacity onPress={clearRecentReferences} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0024d3', // Fondo azul
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#0024d3',
  },
  title: {
    paddingTop: 50,
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  lineButton: {
    backgroundColor: '#fff', // Botones en blanco
    padding: 40,
    borderRadius: 10,
    marginBottom: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  lineButtonText: {
    color: '#0024d3', // Texto de los botones en azul
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainerWrapper: {
    flex: 1,
    backgroundColor: '#fff', // Contenedor blanco
    borderTopLeftRadius: 20, // Esquinas redondeadas arriba
    borderTopRightRadius: 20,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0024d3',
  },
  searchIcon: {
    paddingRight: 10,
  },
  scrollView: {
    padding: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0024d3',
  },
  referenceButton: {
    backgroundColor: '#0024d3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  referenceText: {
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#ff0000',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
  },
});

export default ConteoScreen;
