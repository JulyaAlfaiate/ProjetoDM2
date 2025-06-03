import React, { useState, useContext } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Image, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthenticatedUserContext } from "../../App"; // Verifique o caminho se App.js está na raiz

const backImage = require("../../assets/login.png"); // Mantenha ou altere a imagem

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthenticatedUserContext); 

  const onHandleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); 
      console.log("Login success");
      // navigation.replace("Home"); // Descomente se quiser navegar direto para Home
    } catch (err) {
      Alert.alert("Erro no login", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>neraK</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="#555555"
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
          placeholderTextColor="#555555"
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={onHandleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" /> // Cor Branca para indicador no botão
          ) : (
            <Text style={{fontWeight: 'bold', color: '#ffffff', fontSize: 18}}>Continuar</Text>
          )}
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{color: '#000000', fontWeight: '600', fontSize: 14}}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{color: '#4169e1', fontWeight: '600', fontSize: 14}}> Faça seu cadastro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Cor Branca
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#000000", 
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#e5e4fb", 
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    color: "#000000", 
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#ffffff', // Cor Branca
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