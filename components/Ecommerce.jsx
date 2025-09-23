import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts, login } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

const EcommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [imageLoading, setImageLoading] = useState({});
  const [imageError, setImageError] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Fetched products data is not an array:', data);
          setError('Invalid products data received');
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    addToCart(product);
    Alert.alert('Success', 'Product added to cart');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    // Fix for Invariant Violation: Add key to root element and adjust flex basis for 2 columns
    const isRightColumn = index % 2 === 1;
    return (
      <View style={[styles.productContainer, { flexBasis: '48%', marginTop: 8, marginLeft: 8, marginBottom: 8, marginRight: isRightColumn ? 16 : 8 }]}>
        <View style={styles.imageContainer}>
          {imageLoading[item.id] && (
            <ActivityIndicator
              style={styles.imageLoader}
              size="small"
              color="#e74c3c"
            />
          )}
          {imageError[item.id] ? (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Image not available</Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(prev => ({ ...prev, [item.id]: true }))}
              onLoad={() => setImageLoading(prev => ({ ...prev, [item.id]: false }))}
              onError={() => setImageError(prev => ({ ...prev, [item.id]: true }))}
            />
          )}
          {item.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.stock}>Stock: {item.stock}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            {item.discountPercentage > 0 && (
              <Text style={styles.originalPrice}>${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}</Text>
            )}
          </View>
          <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.filterButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category && styles.filterButtonTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 8,
    paddingBottom: 32,
    paddingRight: 16,
    flexGrow: 1,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
filterButton: {
  marginRight: 8,
  marginBottom: 2,
  paddingVertical: 2,   // reduce vertical padding
  paddingHorizontal: 12,
  backgroundColor: '#fff',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ddd',
  minHeight: 30,        // set a slimmer height
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 1,         // reduce shadow so it doesn’t look bulky
},
filterButtonText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#333',
  textAlign: 'center',
  lineHeight: 16,       // keeps text centered nicely
},

  filterButtonSelected: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  productContainer: {
   
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  imageLoader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  info: {
    padding: 8,
  },
  category: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '600',
  },
  stock: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EcommerceApp;
