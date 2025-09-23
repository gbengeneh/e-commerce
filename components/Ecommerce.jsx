import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchProducts } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Ionicons } from '@expo/vector-icons';

const EcommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [imageError, setImageError] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const { theme } = useTheme();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
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

  const filteredAndSortedProducts = () => {
    let filtered = selectedCategory === 'All'
      ? products
      : products.filter(p => p.category === selectedCategory);

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (priceRange === '100+') return p.price >= 100;
        return p.price >= min && p.price <= max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    addToCart(product);
    Alert.alert('Success', 'Product added to cart');
  };

  const handleWishlistToggle = (product) => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      Alert.alert('Success', 'Product removed from wishlist');
    } else {
      addToWishlist(product);
      Alert.alert('Success', 'Product added to wishlist');
    }
  };

  if (loading) {
    return (
      <View style={[styles(theme).center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles(theme).center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  const handleProductPress = (product) => {
    router.push({
      pathname: '/productDetails',
      params: { product: JSON.stringify(product) }
    });
  };

  const renderItem = ({ item, index }) => {
    const isRightColumn = index % 2 === 1;
    const inWishlist = isInWishlist(item.id);

    return (
      <TouchableOpacity
        style={[styles(theme).productContainer, { flexBasis: '48%', marginTop: 8, marginLeft: 8, marginBottom: 8, marginRight: isRightColumn ? 16 : 8 }]}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles(theme).imageContainer}>
          {imageLoading[item.id] && (
            <ActivityIndicator
              style={styles(theme).imageLoader}
              size="small"
              color={theme.primary}
            />
          )}
          {imageError[item.id] ? (
            <View style={styles(theme).imagePlaceholder}>
              <Text style={styles(theme).placeholderText}>Image not available</Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles(theme).image}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(prev => ({ ...prev, [item.id]: true }))}
              onLoad={() => setImageLoading(prev => ({ ...prev, [item.id]: false }))}
              onError={() => setImageError(prev => ({ ...prev, [item.id]: true }))}
            />
          )}
          {item.discountPercentage > 0 && (
            <View style={styles(theme).discountBadge}>
              <Text style={styles(theme).discountText}>-{item.discountPercentage}%</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles(theme).wishlistButton, { backgroundColor: inWishlist ? theme.primary : theme.surface }]}
            onPress={() => handleWishlistToggle(item)}
          >
            <Ionicons
              name={inWishlist ? "heart" : "heart-outline"}
              size={16}
              color={inWishlist ? "#fff" : theme.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles(theme).info}>
          <Text style={styles(theme).category}>{item.category}</Text>
          <Text style={styles(theme).title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles(theme).brand}>{item.brand}</Text>
          <Text style={styles(theme).description} numberOfLines={2}>{item.description}</Text>
          <View style={styles(theme).ratingContainer}>
            <Text style={styles(theme).rating}>⭐ {item.rating}</Text>
            <Text style={styles(theme).stock}>Stock: {item.stock}</Text>
          </View>
          <View style={styles(theme).priceContainer}>
            <Text style={styles(theme).price}>${item.price}</Text>
            {item.discountPercentage > 0 && (
              <Text style={styles(theme).originalPrice}>${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}</Text>
            )}
          </View>
          <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
        </View>
      </TouchableOpacity>
    );
  };

  const currentStyles = styles(theme);
  const filteredProducts = filteredAndSortedProducts();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Search Bar */}
      <View style={currentStyles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={currentStyles.searchIcon} />
        <TextInput
          style={currentStyles.searchInput}
          placeholder="Search products, brands, categories..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={currentStyles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color={showFilters ? theme.primary : theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={currentStyles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={currentStyles.filterGroup}>
              <Text style={currentStyles.filterLabel}>Category:</Text>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    currentStyles.filterButton,
                    selectedCategory === category && currentStyles.filterButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      currentStyles.filterButtonText,
                      selectedCategory === category && currentStyles.filterButtonTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={currentStyles.filterGroup}>
              <Text style={currentStyles.filterLabel}>Price Range:</Text>
              {['all', '0-25', '25-50', '50-100', '100+'].map(range => (
                <TouchableOpacity
                  key={range}
                  style={[
                    currentStyles.filterButton,
                    priceRange === range && currentStyles.filterButtonSelected,
                  ]}
                  onPress={() => setPriceRange(range)}
                >
                  <Text
                    style={[
                      currentStyles.filterButtonText,
                      priceRange === range && currentStyles.filterButtonTextSelected,
                    ]}
                  >
                    {range === 'all' ? 'All Prices' : range === '100+' ? '$100+' : `$${range}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={currentStyles.filterGroup}>
              <Text style={currentStyles.filterLabel}>Sort By:</Text>
              {[
                { key: 'name', label: 'Name' },
                { key: 'price-low', label: 'Price: Low to High' },
                { key: 'price-high', label: 'Price: High to Low' },
                { key: 'rating', label: 'Rating' },
                { key: 'newest', label: 'Newest' }
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    currentStyles.filterButton,
                    sortBy === option.key && currentStyles.filterButtonSelected,
                  ]}
                  onPress={() => setSortBy(option.key)}
                >
                  <Text
                    style={[
                      currentStyles.filterButtonText,
                      sortBy === option.key && currentStyles.filterButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      <View style={currentStyles.resultsContainer}>
        <Text style={currentStyles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={currentStyles.list}
        numColumns={2}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  list: {
    padding: 8,
    paddingBottom: 32,
    paddingRight: 16,
    flexGrow: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.card,
    borderRadius: 8,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterToggle: {
    marginLeft: 8,
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingVertical: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.text,
    marginRight: 8,
    minWidth: 80,
  },
  filterButton: {
    marginRight: 8,
    marginBottom: 2,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },
  filterButtonSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.surface,
  },
  resultsText: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  productContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 16,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.error,
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
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  info: {
    padding: 8,
  },
  category: {
    fontSize: 10,
    color: theme.textSecondary,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: theme.textSecondary,
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
    color: theme.warning,
    fontWeight: '600',
  },
  stock: {
    fontSize: 12,
    color: theme.success,
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
    color: theme.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: theme.textSecondary,
    textDecorationLine: 'line-through',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EcommerceApp;
