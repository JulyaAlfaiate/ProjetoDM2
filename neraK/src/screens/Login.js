import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../servicess/firebase"; 
import { AuthenticatedUserContext } from "../../App";

const backImage = require("../../assets/login.png"); 

export default function Login({ navigation }) {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const { setUser } = useContext(AuthenticatedUserContext); 

  const onHandleLogin = async () => {
      if (!email || !password) {
      Alert.alert("Erro de Login", "Por favor, preencha todos os campos para fazer login."); 
      return;
    }

    setIsLoading(true); 
    try {
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password); 
      setUser(userCredential.user); 
      console.log("Login bem-sucedido! Usuário:", userCredential.user.email); 


      navigation.replace("Home");
    } catch (err) {
      console.error("Erro no login:", err.message); 
      let errorMessage = "Ocorre  u um erro ao tentar fazer login. Por favor, tente novamente."; 


      if (err.code === 'auth/invalid-email') { 
        errorMessage = "O endereço de e-mail está mal formatado ou é inválido."; 
      } else if (err.code === 'auth/user-disabled') { 
        errorMessage = "Esta conta de usuário foi desativada."; 
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {

        errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
      } else if (err.code === 'auth/too-many-requests') { 
        errorMessage = "Muitas tentativas de login. Sua conta pode ter sido temporariamente bloqueada por segurança. Tente novamente mais tarde."; 
      } else if (err.code) { 
        errorMessage = `Erro Firebase: ${err.message}`; 
      }
      Alert.alert("Erro de Login", errorMessage); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>neraK - Faça seu Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={onHandleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" /> 
          ) : (
            <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Entrar</Text>
          )}
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Não possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{color: '#5250F2', fontWeight: '600', fontSize: 14}}> Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 5,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#5250F2',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});