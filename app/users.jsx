import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchUsers } from '../api/products';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useUser();
  const { theme } = useTheme();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Please login to view user information.</Text>
      </View>
    );
  }

  const authenticatedUser = users.find(u => u.username === user?.username);

  if (!authenticatedUser) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>User information not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.userContainer, { backgroundColor: theme.card }]}>
        <Image source={{ uri: authenticatedUser.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{authenticatedUser.firstName} {authenticatedUser.lastName}</Text>
          <Text style={{ color: theme.textSecondary }}>{authenticatedUser.email}</Text>
          <Text style={{ color: theme.textSecondary }}>{authenticatedUser.phone}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Users;
