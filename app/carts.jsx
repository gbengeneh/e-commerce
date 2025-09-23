import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import Cart from '../components/Cart';

export default function CartsPage() {
  const router = useRouter();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    // Check if authenticated
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Redirecting to login...</Text>
      </View>
    );
  }

  return <Cart />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
