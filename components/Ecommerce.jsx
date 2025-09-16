import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { fetchProducts } from '../api/products';
import { useCart } from './CartContext';
import { ActivityIndicator } from 'react-native';

const Ecommerce = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [imageLoading, setImageLoading] = React.useState({});
  const [imageError, setImageError] = React.useState({});
  const {addToCart} = useCart();

useEffect(() => {
  const loadProducts = async ()=>{
    try{
      const data = await fetchProducts();
      if(Array.isArray(data)){
        setProducts(data);
      }else{
        setError('Invalid product data recieved');
      }
    }catch(err){
              console.error('Error fetching products:', err);
      setError('Failed to load products');
    }finally{
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
    if (!global.isAuthenticated) {
      Alert.alert('Authentication required', 'Please login to add products to cart.');
      return;
    }
    addToCart(product);
    Alert.alert('Success', 'Product added to cart');
  };

  if(loading){
    return(
      <View style={[styles.center, {flex:1}]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if(error){
    return(
      <View style={[styles.center, {flex:1}]}>
        <Text style={{color:'red'}}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({item, index}) => {
      const isRightColumn = index % 2 === 1;
        return(
            <View style={[styles.productContainer, {flexBasis: '48%', marginTop:8 , marginLeft: 8 , marginRight: isRightColumn ? 16 : 8}]}>
              <View style={styles.imageContainer}>
                {imageLoading[item.id] && (
                  <ActivityIndicator style={styles.imageLoader} size="small" color="#e74c3c" />
                )}
                {imageError[item.id] ? (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>Image not available</Text>
                    </View>
                ):(
                    <Image
                       source={{uri: item.thumbnail}}
                       style={styles.image}
                        onLoadStart={() => setImageLoading(prev => ({...prev, [item.id]: true}))}
                        onLoadEnd={() => setImageLoading(prev => ({...prev, [item.id]: false}))}
                        onError={()=>setImageError(prev => ({...prev, [item.id]: true}))}
                    
                    />
                )}
              </View>
            </View>
        )
  }


  return (
    <View style={{flex:1}}>
     <ScrollView
     horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
     >
         {categories.map((category) => (
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


     <FlatList
     data={filteredProducts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      numColumns={2}
      // columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
     />
    </View>
  );
};

export default Ecommerce

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