import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.text }]}>Redirecting to login...</Text>
      </View>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Success', 'Product added to cart');
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    Alert.alert('Success', 'Product removed from wishlist');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.wishlistItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>${item.price}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: theme.primary }]}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="cart" size={16} color="#fff" />
            <Text style={[styles.cartButtonText, { color: '#fff' }]}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.removeButton, { backgroundColor: theme.error }]}
            onPress={() => handleRemoveFromWishlist(item.id)}
          >
            <Ionicons name="heart-dislike" size={16} color="#fff" />
            <Text style={[styles.removeButtonText, { color: '#fff' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>My Wishlist</Text>
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Your wishlist is empty
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Add products to your wishlist by tapping the heart icon
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  wishlistItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  cartButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
