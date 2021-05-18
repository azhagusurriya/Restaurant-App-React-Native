import React, { useState, useEffect } from 'react';
import {SafeAreaView, View, StyleSheet, Text, Button, TextInput, CheckBox} from 'react-native';
import {Database} from './Database'
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({navigation}){

  Database.createTable();

  const [items, setItems] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [error, setError] = useState(true);

  useEffect( () => {  (async () => {
        console.log(username);
        try{
          await Database.getData(setItems);
          setUsername(await AsyncStorage.getItem('username'))
          setPassword(await AsyncStorage.getItem('password'))
          }
        catch (ex){
          console.error(ex);
        }
      }
    )();
  }, []);

  const signup = () => { navigation.navigate("Signup"); }

  const login = async () => {
    if (items === null || items.length === 0) {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      console.log("error");
    }
    else{
      for(var i = 0; i<items.length; i++){
        if(username == items[i].username && password == items[i].password){
          setError(false)
          if(isSelected === true){
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
          } else {
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('password');
            setSelection(false)
          }
          navigation.navigate("Home", {username: username});
        }
        }
        if(error === true){
          setErrors('Username / Password Incorrect')
        }
        else{
          setErrors('')
        }
      }
    }


  return(
    <SafeAreaView style={styles.container}>

    <TextInput style={styles.input} placeholder = "Username" returnKeyType = "next" value = {username} onChangeText = {setUsername}
    autoCapitalize = "none"/>
    <TextInput style={styles.input1} placeholder = "Password" returnKeyType = "next" value = {password} onChangeText = {setPassword}
    autoCapitalize = "none"/>
    <View style={styles.checkboxContainer}>
    <CheckBox value={isSelected} onValueChange={setSelection} style={styles.checkbox}/>
    <Text style={styles.label}> Remember Me </Text>
    </View>
    <View style={{margin:20}}>
    <Button title = "Login" color="black" onPress = { () => {
      login();
    }} />
    </View>
    <View style={{marginLeft:20, marginRight:20}}>
    <Button title = "Sign Up" color="black" onPress = { () => {
      signup();
    }} />
    </View>
    <Text style={styles.error}>{errors}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
  },
  thumb: {
    width: '90%',
    height: 150,
    padding: 10,
    borderRadius: 10
  },
  input:{
    borderColor:'#f0f0f0',
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    height: 50,
    marginTop: 50,
    margin: 10,
    padding:5
  },
  input1:{
    borderColor:'#f0f0f0',
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    height: 50,
    margin: 10,
    marginBottom: 20,
    padding:5
  },
  listitem: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#123456',
  },
  synopsis: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginLeft: 10
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  error: {
    textAlign:'center',
    color:'red',
    margin:10
  }
});


export default LoginScreen;
