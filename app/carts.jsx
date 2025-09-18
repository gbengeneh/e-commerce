import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '../contexts/UserContext';

const Cart = () => {

  const router = useRouter();
  const {isAuthenticated} = useUser();

  useEffect(()=>{
    if(!isAuthenticated){
      router.replace('/login');
    }
  },[isAuthenticated]);

  if(!isAuthenticated){
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>Redirecting to Login...</Text>
      </View>
    ); // or a loading indicator
  }

  return (
    <Cart/>
  )
}

export default Cart

const styles = StyleSheet.create({})