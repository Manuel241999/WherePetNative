import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';
import {
  TextInput,
  Button,
  Headline,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';

// Definición de tipos para las variables de entrada del usuario
type UsuarioInput = {
  nombre: string;
  email: string;
  password: string;
};

const NUEVA_CUENTA = gql`
mutation crearUsuario($input: UsuarioInput) {
  crearUsuario(input: $input)
}
`;

const CrearCuenta: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigation = useNavigation<any>(); // Utiliza un tipo genérico para la navegación

  const [crearUsuario] = useMutation<{ crearUsuario: string }, { input: UsuarioInput }>(NUEVA_CUENTA);

  const handleSubmit = async () => {
    if (nombre === '' || email === '' || password === '') {
      mensajeAlerta('Todos los campos son obligatorios');
      return;
    }
    if (password.length < 6) {
      mensajeAlerta('El password debe de ser de al menos 6 caracteres');
      return;
    }

    try {
      const { data } = await crearUsuario({
        variables: {
          input: { nombre, email, password }
        }
      });
      mensajeExito(data?.crearUsuario ?? 'Cuenta creada con éxito'); // Mensaje de éxito
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
      mensajeAlerta(error.message || 'Error al crear la cuenta');
    }
  };

  const mensajeAlerta = (mensaje: string) => {
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: mensaje,
      visibilityTime: 4000,
      autoHide: true,
    });
  }

  const mensajeExito = (mensaje: string) => {
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: mensaje,
      visibilityTime: 4000,
      autoHide: true,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="dog" size={30} color="#616161" style={styles.icon} />
        <Headline style={styles.headline}>WherePet</Headline>
      </View>

      <TextInput
        label="Nombre"
        mode="outlined"
        placeholder="Nombre"
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        label="Email"
        mode="outlined"
        placeholder="Ingresa tu email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        placeholder="Ingresa tu contraseña"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button
        mode="contained"
        uppercase={true}
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={handleSubmit}
      >
        Crear Cuenta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#D4C3EA',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headline: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  icon: {
    marginRight: 10,
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CrearCuenta;
