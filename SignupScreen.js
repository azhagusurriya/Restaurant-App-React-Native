import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, Button, TouchableHighlight, Image, View, Dimensions} from 'react-native';
import {Database} from './Database'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

function SignupScreen({navigation}){

  const [items, setItems] = useState(null);
  const [location, setLocation] = React.useState(null);
  const [geoAddress, setGeoAddress] = React.useState(null);
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [geoCode, setGeocode] = React.useState(null);
  const [errors,setErrors] = React.useState('');

  React.useEffect(() => {
    Database.getData(setItems);
    (async () => {
      let {status} = await Permissions.askAsync(Permissions.LOCATION);
      console.log(status)
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const validateUsername = (username) => {
    if (items === null || items.length === 0) {
      console.log("console.error();");
    }
    else{
      for(var i = 0; i<items.length; i++){
        if(username == items[i].username){
          setErrors('Username already exists');
        }
      }
    }
  }
    const addUser = (username, name, password, address, contact, email) => {
      if (name === null || name === '') { return false; }
      if (address === null || address === '') { return false; }
      if (contact === null || contact === '') { return false; }
      if (email === null || email === '') { return false; }
      if(errors === ''){
      Database.insert(username, name, password, address, contact, email, latitude, longitude)
      navigation.navigate("Login");
    }
    }

    const geocode = async (address) => {
      if(address == null) return;
      console.log('Fetch the coordinates')
      let geoCoding = await Location.geocodeAsync(address)
      setGeocode(geoCoding)
      getGeoAddress(geoCoding[0])
      console.log(geoCoding)
    }

    const getLocation = async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
      getGeoAddress(location.coords);
    }

    const getGeoAddress = async (loc) => {
      if(loc == null) return;
      setLatitude(parseFloat(loc.latitude));
      setLongitude(parseFloat(loc.longitude));
      let reverseCode = await Location.reverseGeocodeAsync({
        latitude : parseFloat(loc.latitude),
        longitude : parseFloat(loc.longitude)
      })
      setGeoAddress(reverseCode);
      console.log(reverseCode);
      const addressString = geoAddress[0].name + ', ' + geoAddress[0].street + ', ' + geoAddress[0].city + ', ' + geoAddress[0].country;
      setAddress(addressString);
      console.log(addressString);
      console.log(latitude);
      console.log(longitude);
    }

    return(
      <SafeAreaView style={styles.sectionContainer}>

      <TextInput style={styles.input} placeholder = "Name"  returnKeyType = "next"  value = {name}  onChangeText = {setName} autoCapitalize = "none"/>
      <TextInput style={styles.input} placeholder = "Username"  returnKeyType = "next"  value = {username}  onChangeText = {setUsername}
      onSubmitEditing={()=>{validateUsername(username);}} autoCapitalize = "none"/>
      <TextInput style={styles.input} placeholder = "Email" returnKeyType = "next" value = {email} onChangeText = {setEmail} autoCapitalize = "none"/>
      <TextInput style={styles.input} placeholder = "Password" returnKeyType = "next" value = {password} onChangeText = {setPassword} textContentType = "password" autoCapitalize = "none" autoCapitalize = "none"/>
      <TextInput style={styles.input} placeholder = "Confirm Password" returnKeyType = "next" value = {confirmPassword} onChangeText = {setConfirmPassword} autoCapitalize = "none"/>

      <View style={styles.itemFlex}>
      <TextInput style={styles.input1} placeholder = "Address" returnKeyType = "next" value = {address} onChangeText = {setAddress}
      onSubmitEditing={()=>{geocode(address);}} autoCapitalize = "none"/>
      <TouchableHighlight activeOpacity={0.6} style={{position: 'absolute',right: 1, marginRight: 10, marginTop: 22}} onPress={() => {getLocation();}}>
      <Image source={require('./assets/location.png')}/>
      </TouchableHighlight>
      </View>

      <TextInput style={styles.input} placeholder = "Phone No." returnKeyType = "next" value = {contact} onChangeText = {setContact}textContentType = "telephoneNumber" autoCapitalize = "none"/>
      <View style={{margin:20}}>
      <Button title = "Signup" color="black" onPress = { () => {
        if(password == confirmPassword){
          addUser(username, name, password, address, contact, email);
          setErrors('');
        }
        else{
          setErrors('Passwords mismatch')
        }
      }}/>
      </View>
      <Text style={styles.error}>{errors}</Text>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    thumb: {
      width: '90%',
      height: 150,
      padding: 10,
      borderRadius: 10
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
    input:{
      borderColor:'#f0f0f0',
      backgroundColor: 'white',
      borderRadius: 4,
      borderWidth: 1,
      height: 50,
      margin: 10,
      padding:5
    },
    input1:{
      borderColor:'#f0f0f0',
      backgroundColor: 'white',
      borderRadius: 3,
      borderWidth: 1,
      height: 50,
      margin: 5,
      marginRight:10,
      padding: 5,
      width: Dimensions.get('window').width/1.07
    },
    itemFlex:{
      flexDirection:'row',
      padding : 5,
      margin: 5
    }
  });


  export default SignupScreen;
