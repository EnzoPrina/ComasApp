import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, ScrollView,   ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDocs, collection, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de importar correctamente tu configuración de Firebase
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa el ícono de Material Icons

const ReferenceConteoScreen = ({ route }) => {
  const { line } = route.params || {}; // Obtenemos la línea actual
  const [references, setReferences] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialQuantities, setMaterialQuantities] = useState({});
  const [cantidadARealizar, setCantidadARealizar] = useState('');
  const [checkClosedKeyboard, setCheckClosedKeyboard] = useState(false); // Estado para manejar el checkbox

  // Función para obtener las referencias desde Firebase, filtradas por la línea actual
  const fetchReferences = async () => {
    try {
      const q = query(
        collection(db, 'references'),
        where('line', '==', line)  // Aquí filtras por la línea actual
      );
      const querySnapshot = await getDocs(q);
      const firebaseReferences = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReferences(firebaseReferences); // Actualiza las referencias en el estado
    } catch (error) {
      console.error('Error al obtener las referencias:', error);
    }
  };

  useEffect(() => {
    if (line) {
      fetchReferences();
    } else {
      console.warn('La línea no está definida');
    }
  }, [line]);

  useEffect(() => {
    const loadQuantities = async () => {
      const storedQuantities = await AsyncStorage.getItem('materialQuantities');
      if (storedQuantities) {
        setMaterialQuantities(JSON.parse(storedQuantities));
      }

      const storedCantidadARealizar = await AsyncStorage.getItem('cantidadARealizar');
      if (storedCantidadARealizar) {
        const cantidadData = JSON.parse(storedCantidadARealizar);
        setCantidadARealizar(cantidadData[line] || '');
      }
    };

    loadQuantities();
  }, [line]);

  useEffect(() => {
    const saveQuantities = async () => {
      await AsyncStorage.setItem('materialQuantities', JSON.stringify(materialQuantities));
    };

    saveQuantities();
  }, [materialQuantities]);

  const addNewReference = async (newReferenceData) => {
    try {
      await addDoc(collection(db, 'references'), newReferenceData); // Agregar referencia a Firebase
      fetchReferences(); // Recargar las referencias
    } catch (error) {
      console.error('Error al agregar nueva referencia:', error);
    }
  };

  const handleReferenceSelect = async (reference) => {
    setSelectedReference(reference);
    setMaterials(reference.materials);
    const storedCantidad = materialQuantities[reference.reference] || '';
    setCantidadARealizar(storedCantidad);

    const savedCantidad = await AsyncStorage.getItem('cantidadARealizar');
    const cantidadData = savedCantidad ? JSON.parse(savedCantidad) : {};
    setCantidadARealizar(cantidadData[reference.reference] || '');
    setModalVisible(true);
  };

  const handleMaterialChange = (materialName, change, quantity) => {
    setMaterialQuantities((prev) => {
      const refKey = selectedReference?.reference || 'default';
      const refQuantities = prev[refKey] || {};
      const newQuantity = (refQuantities[materialName] || 0) + change * quantity;

      return {
        ...prev,
        [refKey]: {
          ...refQuantities,
          [materialName]: Math.max(newQuantity, 0),
        },
      };
    });
  };

  const handleResetCounter = () => {
    setMaterialQuantities((prev) => {
      const refKey = selectedReference?.reference || 'default';
      const newQuantities = { ...prev };
      delete newQuantities[refKey];
      return newQuantities;
    });
    AsyncStorage.removeItem('materialQuantities');
    setCantidadARealizar('');
  };

  const handleCloseModal = async () => {
    const updatedCantidadARealizar = await AsyncStorage.getItem('cantidadARealizar');
    const cantidadData = updatedCantidadARealizar ? JSON.parse(updatedCantidadARealizar) : {};
    cantidadData[selectedReference.reference] = cantidadARealizar;

    await AsyncStorage.setItem('cantidadARealizar', JSON.stringify(cantidadData));
    await AsyncStorage.setItem('materialQuantities', JSON.stringify(materialQuantities));

    // Cerrar el teclado si el checkbox está marcado
    if (checkClosedKeyboard) {
      Keyboard.dismiss();
    }

    setModalVisible(false);
  };

  return (
    <ImageBackground
    source={require('../assets/FondoConteo_Mesa de trabajo 1.png')}
    style={styles.container}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Linha: {line}</Text>
        <Text style={styles.subtitle}>Referências</Text>
      </View>
      <View style={styles.referencesContainer}>
        {references.length > 0 ? (
          references.map((reference) => (
            <TouchableOpacity
              key={reference.reference}
              onPress={() => handleReferenceSelect(reference)}
              style={styles.referenceButton}
            >
              <Text style={styles.referenceButtonText}>{reference.reference}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Não existem referências disponíveis para esta linha.</Text>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalHeaderText}>Referência: {selectedReference?.reference}</Text>

      <View style={styles.cantidadInputContainer}>
  <TextInput
    style={styles.inputCantidad}
    placeholder="Cantidad a realizar"
    value={cantidadARealizar}
    onChangeText={setCantidadARealizar}
    keyboardType="numeric"
    placeholderTextColor="#ffffff"
  />
  <View style={styles.flexRow}>
    <TouchableOpacity
      onPress={() => {
        setCheckClosedKeyboard(!checkClosedKeyboard); // Alterna el checkbox
        Keyboard.dismiss(); // Cierra el teclado al marcar el checkbox
      }}
      style={styles.checkboxContainer}
    >
      <Icon
        name={checkClosedKeyboard ? "check-box" : "check-box-outline-blank"}
        size={24}
        color="#0024d3"
      />
    </TouchableOpacity>
    <Text style={styles.checkboxLabel}>Confirmar</Text>
  </View>
</View>

      {/* Títulos para las clasificaciones */}
      <View style={styles.materialRow}>
        <Text style={styles.materialText}>Ref</Text>
        <Text style={styles.materialText}>Material</Text>
        <Text style={styles.materialText}>Cantidad</Text>
        <Text style={styles.materialText}>Suma</Text>
      </View>

      <ScrollView style={styles.materialList} contentContainerStyle={styles.scrollContent}>
        {materials.map((material) => {
          const currentQuantity =
            materialQuantities[selectedReference?.reference]?.[material.name] || 0;

          return (
            <View key={material.name} style={styles.materialRow}>
              <Text style={styles.materialText}>{material.material_reference}</Text>
              <Text style={styles.materialText}>{material.name}</Text>
              <Text style={styles.materialText}>{material.quantity}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() => handleMaterialChange(material.name, -1, material.quantity)}
                  style={styles.counterButton}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.counterDisplay}>
                  <Text style={styles.counterText}>{currentQuantity}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleMaterialChange(material.name, 1, material.quantity)}
                  style={styles.counterButton}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity onPress={handleCloseModal} style={styles.closeModalButton}>
        <Text style={styles.closeModalButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 0,
  },


  inputCantidad:{  
    backgroundColor: '#0024d3',
    padding: 10,    borderRadius: 10, color: '#fff',
  },
  checkboxContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#002d3',
    marginLeft: 5,
  },
  

  headerContainer: {
    backgroundColor: '#0024d3',
    padding: 20,
    paddingTop: 80,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  referencesContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  referenceButton: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  referenceButtonText: {
    color: '#0024d3',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%', // Limita la altura del modal para que el contenido no se desborde
    alignItems: 'center',
  },
  modalHeaderText: { 
    fontWeight: 'bold', // Centra el contenido horizontalmente
    fontSize: 18,
    marginBottom: 40,
    marginTop: 10,
   }
  
  ,
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  materialText: {
    flex: 1,
    textAlign: 'center', // Centra el texto dentro de cada columna
    fontSize: 16,
    color: '#000',

  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centra los botones de suma/resta
  },
  counterButton: {
    backgroundColor: '#0024d3',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  counterButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  materialList: {
    width: '100%',
    marginTop: 10,
  },
  scrollContent: {
    alignItems: 'center', // Asegura que el contenido esté centrado en el eje horizontal
  },
  closeModalButton: {
    backgroundColor: '#f90057',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  cantidadInputContainer: {
    flexDirection: 'row', // Alinea los elementos en fila
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    gap: 10, // Agrega un pequeño espacio entre las columnas
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ReferenceConteoScreen;
