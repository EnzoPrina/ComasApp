import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import referencesData from '../data/references.json';

const ReferenceConteoScreen = ({ route }) => {
  const { line } = route.params || {};
  const [references, setReferences] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialQuantities, setMaterialQuantities] = useState({});
  const [cantidadARealizar, setCantidadARealizar] = useState('');

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

    if (line) {
      const lineReferences = referencesData[line];
      setReferences(lineReferences || []);
    }
  }, [line]);

  useEffect(() => {
    const saveQuantities = async () => {
      await AsyncStorage.setItem('materialQuantities', JSON.stringify(materialQuantities));
    };

    saveQuantities();
  }, [materialQuantities]);

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

  const handleCantidadChange = (value) => {
    setCantidadARealizar(value);
  };

  const handleCloseModal = async () => {
    const updatedCantidadARealizar = await AsyncStorage.getItem('cantidadARealizar');
    const cantidadData = updatedCantidadARealizar ? JSON.parse(updatedCantidadARealizar) : {};
    cantidadData[selectedReference.reference] = cantidadARealizar;

    await AsyncStorage.setItem('cantidadARealizar', JSON.stringify(cantidadData));
    await AsyncStorage.setItem('materialQuantities', JSON.stringify(materialQuantities));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Linha: {line}</Text>
        <Text style={styles.subtitle}>Referência</Text>
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
          <Text>No hay referencias disponibles para esta línea.</Text>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Referencia: {selectedReference?.reference}</Text>
            <TextInput
              style={styles.inputCantidad}
              placeholder="Cantidad a realizar"
              value={cantidadARealizar}
              onChangeText={handleCantidadChange}
              keyboardType="numeric"
              placeholderTextColor="#ffffff"
            />

            <View style={styles.materialList}>
              <View style={styles.materialRow}>
                <Text style={styles.materialColumnHeader}>Ref</Text>
                <Text style={styles.materialColumnHeader}>Material</Text>
                <Text style={styles.materialColumnHeader}>Cantidad</Text>
                <Text style={styles.materialColumnHeader}>Sumas</Text>
              </View>

              {materials.map((material) => {
                const currentQuantity = materialQuantities[selectedReference?.reference]?.[material.name] || 0;

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

              <TouchableOpacity
                onPress={handleResetCounter}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reiniciar contador</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleCloseModal} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0024d3',
    paddingHorizontal: 0,
  },
  headerContainer: {
    backgroundColor: '#0024d3',
    padding: 20,
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
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    width: '100%',
    padding: 20,
    marginTop: 30,
    marginBottom: -30,
  },
  referenceButton: {
    backgroundColor: '#0024d3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  referenceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeaderText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  inputCantidad: {
    backgroundColor: '#0024d3',
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 20,
    padding: 5,
  },
  materialList: {
    width: '100%',
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  materialColumnHeader: {
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
  },
  materialText: {
    width: '20%',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#0024d3',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  counterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterDisplay: {
    backgroundColor: '#0024d3',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 20,
/*     backgroundColor: '#0024d3', */
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  closeModalButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#0024d3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',    textAlign: 'center',
  },
});

export default ReferenceConteoScreen;
