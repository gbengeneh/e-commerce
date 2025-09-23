import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image, Alert } from 'react-native';
import { useCart } from '../contexts/CartContext';

const Carts = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, checkout } = useCart();

  const handleCheckout = async () => {
    await checkout();
    Alert.alert('Success', 'Order placed successfully!');
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <View style={styles.buttonContainer}>
        <Button title="-" onPress={() => updateQuantity(item.id, item.quantity - 1)} />
        <Button title="+" onPress={() => updateQuantity(item.id, item.quantity + 1)} />
        <Button title="Remove" onPress={() => removeFromCart(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.total}>Total: ${getTotal().toFixed(2)}</Text>
      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <Button title="Checkout" onPress={handleCheckout} />
        </View>
      )}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  cartContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 16,
  },
  checkoutContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default Carts;
