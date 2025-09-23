import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductDetails() {
  const { product } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const { theme } = useTheme();

  // Parse the product data
  const productData = product ? JSON.parse(product) : null;

  if (!productData) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    addToCart(productData);
    Alert.alert('Success', 'Product added to cart');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: productData.thumbnail }} style={styles.image} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{productData.title}</Text>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.primary }]}>${productData.price}</Text>
          {productData.discountPercentage && (
            <Text style={[styles.discount, { color: theme.success }]}>
              {productData.discountPercentage}% OFF
            </Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: theme.warning }]}>⭐ {productData.rating}</Text>
          <Text style={[styles.stock, { color: productData.stock > 0 ? theme.success : theme.error }]}>
            {productData.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>

        <Text style={[styles.category, { color: theme.textSecondary }]}>Category: {productData.category}</Text>
        <Text style={[styles.brand, { color: theme.textSecondary }]}>Brand: {productData.brand}</Text>

        <Text style={[styles.description, { color: theme.text }]}>{productData.description}</Text>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            { backgroundColor: productData.stock === 0 ? theme.textSecondary : theme.primary },
            productData.stock === 0 && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={productData.stock === 0}
        >
          <Text style={styles.addToCartText}>
            {productData.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 12,
  },
  discount: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
  },
  stock: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 16,
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  addToCartButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
