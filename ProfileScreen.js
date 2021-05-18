import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, Button, ActivityIndicator, ScrollView, TextInput, View, TouchableHighlight, Image, Dimensions} from 'react-native';
import {Database} from './Database'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

function ProfileScreen({navigation, route}){
  const {username} = route.params;
  const [items, setItems] = useState(null);
  const [location, setLocation] = React.useState(null);
  const [geoAddress, setGeoAddress] = React.useState(null);
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [geoCode, setGeocode] = React.useState(null);
  const [isLoading, setLoading] = useState(true);


  useEffect( () => {
    (async () => {
      console.log(username);
      let {status} = await Permissions.askAsync(Permissions.LOCATION);
      console.log(status)
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      try{
        await Database.getUser(setItems,username);
        console.log("fetch")
        console.log(items);
        setLoading(false);
      }
      catch (ex){
        console.error(ex);
      }
    }
  )();
}, []);

const updateProfile = (username, name, password, contact, address, email, latitude, longitude) => {
     Database.updateProfile(username, name, password, contact, address, email, latitude, longitude);
     navigation.navigate('Menu');
}

const deleteProfile = (username) => {
     Database.removeData(username);
     navigation.navigate('Login');
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
    const addressString = geoAddress[0].name + ', ' + geoAddress[0].street + ', ' + geoAddress[0].city + ', ' + geoAddress[0].country;
    setAddress(addressString);
}

const loadData = () => {
  if(items === null){
    console.log(error);
  }
  else{
    setName(items[0].name);
    setContact(items[0].contact);
    setEmail(items[0].email);
    setAddress(items[0].address);
    setLatitude(items[0].latitude);
    setLongitude(items[0].longitude);
    setPassword(items[0].password);
  }
}

const logout = () => {
  navigation.navigate("Login");
}

return(
  <SafeAreaView style={styles.sectionContainer}>
  <Text style = {{textAlign: 'center', backgroundColor:'black', fontSize:20}} onPress = { () => {loadData();}}> Update Profile</Text>
  <TextInput style={styles.input} placeholder = "Name" returnKeyType = "next" value = {name} onChangeText = {setName}  autoCapitalize = "none"/>
  <TextInput style={styles.input} placeholder = "Email" returnKeyType = "next" value = {email} onChangeText = {setEmail}
  autoCapitalize = "none"/>

  <View style={styles.itemFlex}>
  <TextInput style={styles.input1} placeholder = "Address" returnKeyType = "next" value = {address} onChangeText = {setAddress}
  onSubmitEditing={()=>{geocode(address);}}/>
  <TouchableHighlight activeOpacity={0.6} style={{position: 'absolute',right: 1, marginRight: 10, marginTop: 22}} onPress={() => {getLocation();}}>
  <Image source={require('./assets/location.png')}/>
  </TouchableHighlight>
  </View>

  <TextInput style={styles.input} placeholder = "Password" returnKeyType = "next" value = {password} onChangeText = {setPassword}
  autoCapitalize = "none"/>

  <TextInput style={styles.input} placeholder = "Contact" returnKeyType = "next" value = {contact.toString()} onChangeText = {setContact}
  autoCapitalize = "none"/>
  <View style={{margin:20}}>
  <Button title = "Update Profile" color="black" onPress = { () => {
    updateProfile(username, name, password, parseInt(contact), address, email, latitude, longitude);
  }} />
  </View>
  <View style={{margin:20}}>
  <Button title = "Delete Profile" color="red" onPress = { () => {
    deleteProfile(username);
  }} />
  </View>
  <View style={{margin:20}}>
  <Button title = "Log Out" color="black" onPress = { () => {
    logout();
  }} />
  </View>
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


export default ProfileScreen;
