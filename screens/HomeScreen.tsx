import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ScrollView, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de instalar esta dependencia
import { AntDesign, FontAwesome } from '@expo/vector-icons'; // Importamos los iconos
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const HomeScreen = ({ navigation, route }) => {
  const userName = route.params?.userName || 'Usuario';
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false); // Control del modal

  useEffect(() => {
    loadNotes(); // Cargar notas al inicio
  }, []);

  const loadNotes = async () => {
    try {
      const notesJson = await AsyncStorage.getItem('notes');
      if (notesJson) {
        setNotes(JSON.parse(notesJson));
      }
    } catch (error) {
      console.error("Error loading notes: ", error);
    }
  };

  const saveNotes = async (notesToSave) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notesToSave));
    } catch (error) {
      console.error("Error saving notes: ", error);
    }
  };

  const addNote = async () => {
    if (note.trim()) {
      const newNote = { id: Date.now().toString(), text: note, completed: false }; // Asignar un ID único
      const updatedNotes = editingNoteId 
        ? notes.map(n => n.id === editingNoteId ? { ...n, text: note } : n) 
        : [...notes, newNote];

      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      setNote('');
      setEditingNoteId(null);
    } else {
      Alert.alert('Error', 'No puedes agregar una nota vacía');
    }
  };

  const deleteNote = async (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const startEditing = (id, currentText) => {
    setEditingNoteId(id);
    setNote(currentText);
  };

  const toggleComplete = async (id) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión (podrías borrar datos, limpiar AsyncStorage, etc.)
    AsyncStorage.clear(); // Ejemplo de limpieza de datos
    setModalVisible(false); // Cerrar modal
    navigation.replace('SignInScreen'); // Redirigir a Sign In
  };

  return (
    <View style={styles.container}>
      <View style={styles.blueSection}>
        <View style={styles.headerContainer}>


        </View>
        <Text style={styles.slogan}>Bem-vindo à Comas App, trabalhe de forma organizada com as contas na sua linha.</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Producción')}
          >
            <Text style={styles.buttonText}>Linhas</Text>
            <Text style={styles.buttonText}>de Produção</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity
            style={styles.countButton}
            onPress={() => navigation.navigate('Conteo')}
          >
            <Text style={styles.countButtonText}>Ir para </Text>
            <Text style={styles.countButtonText}>Contagem</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteSection}>
        <Text style={styles.notesTitle}>Notas</Text>
        <ScrollView style={styles.notesInnerContainer} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.input}
            placeholder="Adicionar uma nota..."
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.addButtonText}>{editingNoteId ? 'Editar Nota' : 'Adicionar Nota'}</Text>
          </TouchableOpacity>

          <FlatList
            data={notes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.noteContainer}>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <FontAwesome name="trash-o" size={24} color="black" /> 
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => startEditing(item.id, item.text)}
                  style={[styles.noteBox, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
                  <Text style={[styles.noteText, item.completed && styles.completedNote]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.checkContainer}>
                  <AntDesign name="checkcircleo" size={24} color="black" /> 
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>
      </View>

      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0024d3',
  },
  blueSection: {
    flex: 0.4,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  whiteSection: {
    marginTop: 50,
    flex: 0.6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',backgroundColor: '#0024d3',
  },
  title: {backgroundColor: '#0024d3',
    paddingTop: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 10,
  },
  profileIcon: {
    paddingTop: 20,
  },
  slogan: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'left',
    marginBottom: 30,
  },
  notesTitle: {
    paddingTop: 20,
    fontWeight: 'bold',
    color: '#0024d3',
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 10,
  },
  notesInnerContainer: {
    borderRadius: 15,
    paddingTop: 30,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#0024d3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  countButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0024d3',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 10,
  },
  countButtonText: {
    color: '#0024d3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: '#0024d3',
    borderWidth: 0.1,
    borderRadius: 5,
    paddingLeft: 10,
    width: '100%',
    fontSize: 14,
    backgroundColor: '#f9fbff',
  },
  addButton: {
    backgroundColor: '#0024d3',
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  noteBox: {
    flex: 1,
    backgroundColor: '#f9fbff',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
  },
  completedNote: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
  checkContainer: {
    paddingLeft: 10,
  },
  spacer: {
    width: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0024d3',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#0024d3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
