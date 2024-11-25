import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const HomeScreen = ({ navigation, route }) => {
  const userName = route.params?.userName || 'Usuario';
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState('');
  const [turnoOptions] = useState(['Azul', 'Verde', 'Preto']);

  
  

  useEffect(() => {
    loadNotes();
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
      const newNote = { id: Date.now().toString(), text: note, completed: false };
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
    AsyncStorage.clear();
    setModalVisible(false);
    navigation.replace('SignInScreen');
  };

  const handleTurnoChange = (turno) => {
    setSelectedTurno(turno);
  };

  const handleSendMessage = () => {

    setModalVisible(false);
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteContainer}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)}>
        <AntDesign 
          name={item.completed ? "checkcircle" : "checkcircleo"} 
          size={24} 
          color={item.completed ? "#4caf50" : "#ccc"} 
        />
      </TouchableOpacity>
      <Text style={[styles.noteText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => deleteNote(item.id)}>
      <EvilIcons name="trash" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.blueSection}>
{/*     <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.sendMessageButtonText}>Enviar Mensaje al Próximo Turno</Text>
        </TouchableOpacity> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Produção')}
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
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
        />
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
    paddingTop: 80,

  },
  whiteSection: {
    marginTop: -50,
    flex: 0.6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    marginBottom: 0,
  },
  sendMessageButton: {
    backgroundColor: '#d2d6ec',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendMessageButtonText: {
    color: '#0024d3',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#f90057',
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#0024d3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0024d3',
    marginBottom: 10,
  },
  spacer: {
    width: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});

export default HomeScreen;
