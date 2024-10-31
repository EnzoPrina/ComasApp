import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ProductionLineScreenProps = {
  navigation: {
    navigate: (screen: string, params?: { line: string }) => void;
  };
};

const ProductionLineScreen: React.FC<ProductionLineScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Linhas de Produção</Text>
      </View>

   
      <View style={styles.bottomContainer} />

    
      <View style={styles.productionLinesContainer}>
        <TouchableOpacity
          style={styles.comas1Button}
          onPress={() => navigation.navigate('ReferenceScreen', { line: 'COMAS 1' })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>COMAS 1</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => navigation.navigate('ReferenceScreen', { line: 'COMAS 2' })}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>COMAS 2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => navigation.navigate('ReferenceScreen', { line: 'COMAS 3' })}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>COMAS 3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => navigation.navigate('ReferenceScreen', { line: 'Subconjunto' })}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Subconjunto</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón para navegar a la pantalla de Conteo */}
      <TouchableOpacity
        style={styles.countButton}
        onPress={() => navigation.navigate('Conteo')}
      >
        <View style={styles.countButtonContent}>
          <Text style={styles.countButtonText}> Contagem</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0024d3',
    paddingTop: 30,
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
  productionLinesContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 60,
  },
  comas1Button: {
    width: '100%',
    height: 100,
    backgroundColor: '#0024d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  smallButton: {
    width: '30%',
    height: 100,
    backgroundColor: '#0024d3',
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
    color: '#fff',
    fontSize: 16,
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
    paddingTop: 10,
    paddingBottom: 10,
    color: '#0024d3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductionLineScreen;
