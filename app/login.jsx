import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useUser();
  const { theme } = useTheme();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.push('/carts');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid username or password');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Login</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor={theme.textSecondary}
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
});
