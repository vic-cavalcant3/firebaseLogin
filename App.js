import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "SUA_CHAVE_API",
  authDomain: "projeto-1-20e0d.firebaseapp.com",
  projectId: "projeto-1-20e0d",
  storageBucket: "projeto-1-20e0d.firebasestorage.app",
  messagingSenderId: "805538056756",
  appId: "1:805538056756:web:bc496f699d22df85181861"
};


const app = initializeApp(firebaseConfig);

const TelaAutenticacao = ({ email, setEmail, senha, setSenha, fazerLogin, setFazerLogin, autenticar }) => {
  return (
    <View style={styles.containerAutenticacao}>
       <Text style={styles.titulo}>{fazerLogin ? 'Entrar' : 'Registrar'}</Text>

       <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha"
        secureTextEntry
      />
      <View style={styles.containerBotao}>
        <Button title={fazerLogin ? 'Entrar' : 'Registrar'} onPress={autenticar} color="#3498db" />
      </View>

      <View style={styles.containerRodape}>
        <Text style={styles.textoAlternar} onPress={() => setFazerLogin(!fazerLogin)}>
          {fazerLogin ? 'Precisa de uma conta? Registrar' : 'Já tem uma conta? Entrar'}
        </Text>
      </View>
    </View>
  );
}

const TelaAutenticada = ({ usuario, autenticar }) => {
  return (
    <View style={styles.containerAutenticacao}>
      <Text style={styles.titulo}>Bem-vindo</Text>
      <Text style={styles.textoEmail}>{usuario.email}</Text>
      <Button title="Sair" onPress={autenticar} color="#e74c3c" />
    </View>
  );
};


export default App = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [fazerLogin, setFazerLogin] = useState(true);

  const autenticacao = getAuth(app);
  useEffect(() => {
    const atualizarInscricao = onAuthStateChanged(autenticacao, (usuario) => {
      setUsuario(usuario);
    });

    return () => atualizarInscricao();
  }, [autenticacao]);

  
  const autenticar = async () => {
    try {
      if (usuario) {
        // Se o usuário já estiver autenticado, fazer logout
        console.log('Usuário desconectado com sucesso!');
        await signOut(autenticacao);
      } else {
        // Entrar ou registrar
        if (fazerLogin) {
          // Entrar
          await signInWithEmailAndPassword(autenticacao, email, senha);
          console.log('Usuário autenticado com sucesso!');
        } else {
          // Registrar
          await createUserWithEmailAndPassword(autenticacao, email, senha);
          console.log('Usuário registrado com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro de autenticação:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {usuario ? (
        // Mostrar o email do usuário se ele estiver autenticado
        <TelaAutenticada usuario={usuario} autenticar={autenticar} />
      ) : (
        // Mostrar formulário de login ou registro se o usuário não estiver autenticado
        <TelaAutenticacao
          email={email}
          setEmail={setEmail}
          senha={senha}
          setSenha={setSenha}
          fazerLogin={fazerLogin}
          setFazerLogin={setFazerLogin}
          autenticar={autenticar}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  containerAutenticacao: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  containerBotao: {
    marginBottom: 16,
  },
  textoAlternar: {
    color: '#3498db',
    textAlign: 'center',
  },
  containerRodape: {
    marginTop: 20,
  },
  textoEmail: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
