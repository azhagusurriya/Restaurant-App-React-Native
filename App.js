import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import MenuScreen from './MenuScreen';
import MenuDetailScreen from './MenuDetailScreen';
import CartScreen from './CartScreen';
import BillingScreen from './BillingScreen';
import {Database} from './Database'

const Stack = createStackNavigator();

export default function App() {
    Database.createTable()
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"
        screenOptions = {{
          headerStyle: {backgroundColor: 'black',},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Home" component={HomeScreen} initialParams={{username: 'lonewolf'}}  options={ ({route}) => ({username: route.params.username})}/>
          <Stack.Screen name="Signup" component={SignupScreen}/>

          <Stack.Screen name="MenuDetail" component={MenuDetailScreen}/>
          <Stack.Screen name="Billing" component={BillingScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
