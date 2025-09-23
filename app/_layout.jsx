import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CartProvider, useCart } from '../contexts/CartContext';
import { UserProvider } from '../contexts/UserContext';
import { WishlistProvider, useWishlist } from '../contexts/WishlistContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  primary: '#e74c3c',
  secondary: '#f39c12',
  text: '#333333',
  textSecondary: '#666666',
  border: '#dddddd',
  card: '#ffffff',
  success: '#27ae60',
  error: '#e74c3c',
  warning: '#f39c12',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const CartTabIcon = ({ color, size }) => {
  const { cartItems } = useCart();
  const { theme } = useTheme();
  const count = cartItems.length;

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="cart" size={size} color={color} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.error }]}>
          <Text style={[styles.badgeText, { color: '#fff' }]}>{count}</Text>
        </View>
      )}
    </View>
  );
};

const WishlistTabIcon = ({ color, size }) => {
  const { wishlistItems } = useWishlist();
  const { theme } = useTheme();
  const count = wishlistItems.length;

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="heart" size={size} color={color} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.error }]}>
          <Text style={[styles.badgeText, { color: '#fff' }]}>{count}</Text>
        </View>
      )}
    </View>
  );
};

function TabLayoutContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarItemStyle: {
         flex: 1, 
         alignItems: 'center',
          justifyContent: 'center',
},
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
              <Ionicons
                name={theme === lightTheme ? "moon" : "sunny"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Tabs.Screen
        name="carts"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
        }}
      />
       <Tabs.Screen
        name="login"
        options={{
         href: null, // removes it from the tab bar AND navigation stack
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => <WishlistTabIcon color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="productDetails"
        options={{
          href: null, // removes it from the tab bar AND navigation stack
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
     
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <TabLayoutContent />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
});
