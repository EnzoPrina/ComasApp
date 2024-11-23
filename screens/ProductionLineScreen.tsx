import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView, 
  Alert, 
  ImageBackground 
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { doc, setDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';import AntDesign from '@expo/vector-icons/AntDesign';

import { db } from '../firebaseConfig'; // Configuración de Firebase


type ProductionLineScreenProps = {
  navigation: {
    navigate: (screen: string, params?: { line: string }) => void;
  };
  route: {
    params: {
      isAdmin: boolean;
    };
  };
};

const ProductionLineScreen: React.FC<ProductionLineScreenProps> = ({ navigation, route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newReference, setNewReference] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [materialReference, setMaterialReference] = useState('');
  const [quantity, setQuantity] = useState('');
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);


  // Recibir el parámetro isAdmin desde la navegación
  useEffect(() => {
    if (route.params?.isAdmin) {
      setIsAdmin(route.params.isAdmin);
    }
  }, [route.params?.isAdmin]);

 // Función para agregar la referencia a Firebase
 const addNewReferenceToFirebase = async () => {
  if (!newReference || !selectedLine) {
    alert('Por favor, complete todos los campos');
    return;
  }

  try {
    // Agregar la nueva referencia con la línea seleccionada
    const referenceData = {
      reference: newReference,
      line: selectedLine,  // Guardar la línea seleccionada
      materials,  // Los materiales asociados con esta referencia
    };

    // Almacenar en la colección 'references' de Firebase
    await addDoc(collection(db, 'references'), referenceData);

    // Limpiar el formulario
    setNewReference('');
    setSelectedLine(null);
    setMaterials([]);
    setMaterialName('');
    setMaterialReference('');
    setQuantity('');

    alert('Referencia agregada con éxito');
  } catch (error) {
    console.error('Error al agregar la referencia:', error);
    alert('Hubo un error al agregar la referencia');
  }
};


// Manejo de login
const handleLogin = () => {
  if (email === 'comas@email.com' && password === 'Comas9+') {
    setIsAdmin(true);
    setLoginModalVisible(false);
    Alert.alert('Bem-vindo', 'Está ligado como administrador.');
  } else {
    Alert.alert('Erro', 'Credenciais incorretas.');
  }
};

const handleLogout = () => {
  setIsAdmin(false);
  Alert.alert('Desligado', 'Está desligado como administrador');
};

const addMaterial = () => {
  if (!materialName || !materialReference || !quantity) {
    alert('Por favor, complete todos los campos del material');
    return;
  }

  const newMaterial = {
    name: materialName,
    material_reference: materialReference,
    quantity: parseInt(quantity),
  };

  setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);

  // Limpiar los campos de material
  setMaterialName('');
  setMaterialReference('');
  setQuantity('');
};

// Manejo del modal
const openModal = () => setModalVisible(true);
const closeModal = () => {
  setModalVisible(false);
  setNewReference('');
  setMaterialName('');
  setMaterialReference('');
  setQuantity('');
  setMaterials([]);
};


return (
  <ImageBackground
    source={require('../assets/Fondopng.png')}
    style={styles.container}
    resizeMode="cover"
  >
    {/* Título */}
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>Linhas de Produção</Text>
    </View>

    {/* Botones principales */}
    <View style={styles.productionLinesContainer}>
      <TouchableOpacity
        style={styles.comas1Button}
        onPress={() => navigation.navigate('ReferenceScreen', { line: 'COMAS 1' })}
      >
        <Text style={styles.buttonText}>COMAS 1</Text>
      </TouchableOpacity>
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('ReferenceScreen', { line: 'COMAS 2' })}
        >
          <Text style={styles.buttonText}>COMAS 2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('ReferenceScreen', { line: 'COMAS 3' })}
        >
          <Text style={styles.buttonText}>COMAS 3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('ReferenceScreen', { line: 'Subconjunto' })}
        >
          <Text style={styles.buttonText}>Subconjunto</Text>
        </TouchableOpacity>
        
      </View>
    </View>

{/* Botones de Recambio y Contagem */}
<View style={styles.recambioContagemContainer}>
  <TouchableOpacity
    style={styles.recambioButton}
    onPress={() => navigation.navigate('ReferenceScreen', { line: 'RECAMBIO' })}
  >
    <Text style={styles.buttonText}>Recambio</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.contagemButton}
    onPress={() => navigation.navigate('Conteo')}
  >
    <Text style={styles.countButtonText}> 
      <AntDesign name="calculator" size={30} color="white" /> 
      Contagem</Text>
  </TouchableOpacity>
</View>
    

    {/* Botones de acciones */}
    <View style={styles.actionButtonsContainer}>
      {isAdmin ? (
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.actionButtonText}>Fechar Sessão</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLoginModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>Iniciar Sessão como Administrador</Text>
        </TouchableOpacity>
      )}
      {isAdmin && (
        <TouchableOpacity style={styles.actionButton} onPress={openModal}>
          <Text style={styles.actionButtonText}>Adicionar Nova Referência</Text>
        </TouchableOpacity>
      )}
    </View>

{/* Modal para Adicionar Nueva Referencia */}
<Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Referência</Text>

          {/* Selector de Linha de Produção */}
          <Text style={styles.modalLabel}>Linha de Produção</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedLine(value)}  // Almacena la línea seleccionada
              items={[
                { label: 'COMAS 1', value: 'COMAS 1' },
                { label: 'COMAS 2', value: 'COMAS 2' },
                { label: 'COMAS 3', value: 'COMAS 3' },
                { label: 'SUBCONJUNTO', value: 'SUBCONJUNTO' },
                { label: 'RECAMBIO', value: 'RECAMBIO' },
              ]}
              placeholder={{
                label: 'Selecione a linha de produção',
                value: null,
                color: '#000',
              }}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: {
                  height: 50,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: '#f9f9f9',
                  marginBottom: 15,
                },
                inputAndroid: {
                  height: 50,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: '#f9f9f9',
                  marginBottom: 15,
                },
              }}
              InputAccessoryView={() => null} // Toolbar nativa eliminada
            />
          </View>

          {/* Campo para Referência */}
          <TextInput
            style={styles.modalInput}
            placeholder="Referência"
            placeholderTextColor="#666"
            value={newReference}
            onChangeText={setNewReference}
          />

          {/* Lista de Materiais */}
          <ScrollView keyboardShouldPersistTaps="handled">
            {materials.map((material, index) => (
              <View key={index} style={styles.materialContainer}>
                <Text>
                  {material.name} - {material.material_reference} - {material.quantity}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Inputs para Material */}
          <TextInput
            style={styles.modalInput}
            placeholder="Nome do Material"
            placeholderTextColor="#666"
            value={materialName}
            onChangeText={setMaterialName}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Referência do Material"
            placeholderTextColor="#666"
            value={materialReference}
            onChangeText={setMaterialReference}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Quantidade"
            placeholderTextColor="#666"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          {/* Botões */}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={addMaterial}>
              <Text style={styles.modalButtonText}>Adicionar Material</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={addNewReferenceToFirebase}>
              <Text style={styles.modalButtonText}>Adicionar Referência</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.modalButtonClose} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      {/* Modal para Login */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={isLoginModalVisible}
  onRequestClose={() => setLoginModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Conecte-se</Text>
      <TextInput
        style={styles.modalInput}
        placeholder="Email"
        placeholderTextColor="#666" // Color más visible en iOS
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Contraseña"
        placeholderTextColor="#666" // Color más visible en iOS
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.modalButton, { backgroundColor: '#002080' }]} // Azul más oscuro
        onPress={handleLogin}
      >
        <Text style={styles.modalButtonText}>Conecte-se</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalButtonClose}
        onPress={() => setLoginModalVisible(false)}
      >
        <Text style={styles.modalButtonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0024d3',
    paddingTop: 80,
  },
  titleContainer: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginTop: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1, // Asegúrate de que tenga un zIndex bajo
  },
  productionLinesContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 60,
    zIndex: 2,
  },
  comas1Button: {
    width: '100%',
    height: 100,

    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 3, // Más alto que el contenedor blanco
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  smallButton: {
    width: '30%',
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonContent: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    color: "#0024d3",
    fontSize: 14,
    fontWeight: 'bold',
  },

  countButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#fff',
    borderColor: '#0024d3',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
  },
  countButtonContent: {
    width: '90%',
    paddingLeft: 10,
  },
  countButtonText: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  actionButton: {
    width: '48%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: "#0024d3",
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    width: '100%', // Asegura que el picker ocupe todo el ancho.
    marginVertical: 10, // Separación para evitar problemas de solapamiento.
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  modalButtonContainer: {
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonClose: {
    marginTop: 10,
    backgroundColor: '#f90057',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },



  modalPicker: {
    height: 50,
    width: '100%',
  },
  
  materialContainer: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  



  adminButtonBackground: {
    width: '100%',
    backgroundColor: "#fff",

    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  adminButtonImage: {
    borderRadius: 10,
    opacity: 0.8, // Controla la opacidad de la imagen de fondo
  },
 
   blurView: {
    borderRadius: 10,
    overflow: 'hidden', // Asegura que el blur no salga de los bordes
    marginBottom: 10,
  },
 
  recambioContagemContainer: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
  },
  
  recambioButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0024d3',
  },
  
  contagemButton: {
    flex: 1,    color: '#fff',
    marginLeft: 5,
    backgroundColor: '#f90057',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',

  },
  

 
});

export default ProductionLineScreen;
