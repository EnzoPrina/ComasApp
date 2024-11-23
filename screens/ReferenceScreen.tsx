import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Importa Firebase

interface Material {
  name: string;
  material_reference: string;
  quantity: number;
}

interface Reference {
  reference: string;
  materials: Material[];
  line: string;  // Agregar la línea de producción a cada referencia
}

interface ReferencesData {
  [key: string]: Reference[];  // Agrupar referencias por línea de producción
}

const ReferenceScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { line } = route.params || { line: null };

  const [references, setReferences] = useState<ReferencesData>({});
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!line) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: Nenhuma linha de produção foi selecionada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Obtener las referencias desde Firebase
  const fetchReferences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'references')); // Obtén todas las referencias
      const referencesData: ReferencesData = {};
      
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const line = data.line || 'Unknown'; // Asumiendo que cada referencia tiene un campo 'line'
        
        if (!referencesData[line]) {
          referencesData[line] = [];
        }

        referencesData[line].push({
          reference: data.reference,
          materials: data.materials,
          line,
        });
      });

      setReferences(referencesData);
    } catch (error) {
      console.error('Erro ao buscar referências:', error);
    }
  };

  useEffect(() => {
    fetchReferences();  // Cargar las referencias desde Firebase
  }, []);

  // Manejar la selección de referencia y mostrar el modal
  const handleReferenceClick = (reference: string) => {
    setSelectedReference(reference);
    setModalVisible(true);
  };

  // Obtener los materiales para una referencia específica
  const getMaterials = (reference: string): Material[] => {
    const referenceData = references[line] || [];
    const selectedRef = referenceData.find((ref) => ref.reference === reference);
    return selectedRef ? selectedRef.materials : [];
  };

  // Renderizar cada referencia como botón
  const renderReference = ({ item }: { item: Reference }) => (
    <TouchableOpacity
      style={styles.referenceButton}
      onPress={() => handleReferenceClick(item.reference)}
    >
      <Text style={styles.referenceButtonText}>{item.reference}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Referência - {line}</Text>
      </View>

      <View style={styles.innerContainer}>
        <FlatList
          data={references[line] || []}
          renderItem={renderReference}
          keyExtractor={(item) => item.reference}
          numColumns={3} // Mostrar en columnas de a 3
          columnWrapperStyle={styles.row}
        />
      </View>

      {selectedReference && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Referência</Text>
                <Text style={styles.modalReference}>{selectedReference}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeIcon}>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <View style={styles.columnHeaderRow}>
                  <Text style={styles.columnHeader}>Material</Text>
                  <View style={styles.verticalDivider} />
                  <Text style={styles.columnHeader}>Referência</Text>
                  <View style={styles.verticalDivider} />
                  <Text style={styles.columnHeader}>Quantidade</Text>
                </View>
                {getMaterials(selectedReference).map((item) => (
                  <View key={item.name} style={styles.materialRow}>
                    <Text style={styles.modalText}>{item.name}</Text>
                    <View style={styles.verticalDivider} />
                    <Text style={styles.modalText}>{item.material_reference}</Text>
                    <View style={styles.verticalDivider} />
                    <Text style={styles.modalText}>{item.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0024d3',
  },
  headerContainer: {
    backgroundColor: '#0024d3',
    padding: 20,
    width: '100%',
    paddingTop: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingBottom: 30,
  },
  innerContainer: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    overflow: 'hidden', // Agregar esta línea
    marginBottom: -20
  },
  row: {
    justifyContent: 'space-between',
  },
  referenceButton: {
    backgroundColor: '#0024d3',
    padding: 30,
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '32%',
  },
  referenceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden', // Agregar esta línea
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#0024d3',
    paddingBottom: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalReference: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  columnHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomColor: '#ccc',
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '30%',
    textAlign: 'left',
    paddingLeft: 10,
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    width: '30%',
    textAlign: 'left',
    paddingLeft: 10,
  },
  verticalDivider: {
    width: 0.4,
    backgroundColor: '#ccc',
    marginHorizontal: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  goBackButton: {
    padding: 10,
    backgroundColor: '#0024d3',
    borderRadius: 5,
  },
  goBackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReferenceScreen;
