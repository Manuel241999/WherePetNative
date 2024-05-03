import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  TextInput,
  Button,
  Headline,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AutenticarInput = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigation = useNavigation<any>(); // Añade un tipo genérico para la navegación

  const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input){
      token
    }
  }
  `;

  // Mutation de Apollo
  const [autenticarUsuario] = useMutation<{ autenticarUsuario: { token: string } }, { input: AutenticarInput }>(AUTENTICAR_USUARIO);

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      mensajeAlerta('Todos los campos son obligatorios');
      return;
    } 
    if (password.length < 6) {
      mensajeAlerta('El password debe de ser de al menos 6 caracteres');
      return;
    }

    try {
      const { data } = await autenticarUsuario({
        variables: {
          input: {
            email,
            password,
          }
        }
      });
      await AsyncStorage.setItem('token', data.autenticarUsuario.token);
      navigation.navigate("MapScreen");
      mensajeExito('Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      mensajeAlerta(error.message || 'Error al iniciar sesión');
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
  };

  const mensajeExito = (mensaje: string) => {
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: mensaje,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="dog" size={30} color="#616161" style={styles.icon} />
        <Headline style={styles.headline}>WherePet</Headline>
      </View>

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
        onPress={handleSubmit}
        uppercase={true}
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Iniciar Sesión
      </Button>
      <Text
        style={styles.createAccountText}
        onPress={() => navigation.navigate('CrearCuenta')}
      >
        Crear Cuenta
      </Text>
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
  createAccountText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
});

export default Login;
