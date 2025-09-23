import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem('wishlist');
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };
    loadWishlist();
  }, []);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Item already in wishlist, remove it
        const updated = prev.filter((item) => item.id !== product.id);
        saveWishlist(updated);
        return updated;
      } else {
        // Add item to wishlist
        const updated = [...prev, product];
        saveWishlist(updated);
        return updated;
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveWishlist(updated);
      return updated;
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const saveWishlist = async (wishlist) => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const clearWishlist = async () => {
    try {
      setWishlistItems([]);
      await AsyncStorage.removeItem('wishlist');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
