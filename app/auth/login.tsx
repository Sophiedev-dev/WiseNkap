// app/auth/login.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/firebase';
import { useRouter } from 'expo-router';
import { useGoogleAuth } from "../../src/googleAuth";
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const { signInWithGoogle } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Connexion réussie ✅");
      router.replace("/(tabs)");
    } catch (e: any) {
      setMessage(`Erreur : ${e.message}`);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (e: any) {
      setMessage("Erreur Google");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#4169E1" />
      </TouchableOpacity>

      {/* Titre */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>
      </View>

      {/* Formulaire */}
      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={22} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            onChangeText={setEmail}
            value={email}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Ionicons name="lock-closed-outline" size={20} color="#999" />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={22} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

        {/* Google Login Button */}
        <TouchableOpacity style={styles.googleButton} onPress={loginWithGoogle}>
          <Text style={styles.googleButtonText}>Se connecter avec Google</Text>
        </TouchableOpacity>

        {/* Message d'erreur/succès */}
        {message ? (
          <Text style={[styles.message, { color: message.includes('Erreur') ? 'red' : 'green' }]}>
            {message}
          </Text>
        ) : null}

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 30,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B7FD7',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#6B7FD7',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  googleButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
  },
  googleButtonText: {
    color: '#4169E1',
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#999',
    fontSize: 15,
  },
  signupLink: {
    color: '#4169E1',
    fontSize: 15,
    fontWeight: '600',
  },
});