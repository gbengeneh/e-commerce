import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { TextInput } from 'react-native';
import { Button } from 'react-native';

const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();
    const { login } = useUser();


    const handleLogin = async () => {
        if(username === 'emilys' && password === 'emilyspass'){
           login({username});
              router.replace('/carts'); // Redirect to home or desired page after login
        } else{
            Alert.alert('Login Failed', 'Invalid username or password');
        }
    
    }  
  return (
    <View  style={styles.container}> 
        <Text style={styles.text}>Please login to continue</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize='none'
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.loginButton}>
         <Button   title="Login" onPress={handleLogin}/>
      </View>
    </View>
  );
}

export default Login

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },
    input:{
        borderWidth:1,
        borderColor:'#ccc',
        padding:10,
        marginBottom:10,
        width:'100%',
        borderRadius:5
     },
     text:{
        fontSize:18,
        marginBottom:20,
        textAlign:'center',
     },
     loginButton:{
        marginTop:10,
        width:'100%',
        borderRadius:8,
     }
     
})