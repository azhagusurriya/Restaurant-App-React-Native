import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, Image, View, Alert, FlatList, ActivityIndicator, Pressable, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function BillingScreen({navigation}){
  const [cardNo, setCardNo] = React.useState('');
  const [cvv, setCVV] = React.useState('');
  const [name, setName] = React.useState('');
  const [errors, setErrors] = React.useState('');

  const validateCardNo = () => {
    if(cardNo.length != 16){
      setErrors('Invalid Card Number')
    }
    else if(cvv.length === 3){
          setErrors('Invalid Card Number')
        }
        else{
      setErrors('')
      alert("Payment Succeded")
      navigation.navigate("Menu");
    }
  }

return(
  <SafeAreaView style={styles.container}>
  <TextInput style={styles.input} placeholder = "Card Number"  returnKeyType = "next"  value = {cardNo}  onChangeText = {setCardNo} autoCapitalize = "none"/>
  <TextInput style={styles.input} placeholder = "CVV"  returnKeyType = "next"  value = {cvv}  onChangeText = {setCVV} autoCapitalize = "none"/>
  <TextInput style={styles.input} placeholder = "Name on card"  returnKeyType = "next"  value = {name}  onChangeText = {setName} autoCapitalize = "none"/>
  <View style={{marginLeft:20, marginRight:20, marginTop:20}}>
  <Button title = "Make Payment" color="black" onPress = { () => {
    validateCardNo();
}} />
<Text style={styles.error}>{errors}</Text>
</View>
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
    marginTop: 10,
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


export default BillingScreen;
