import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, Image, View, Alert, FlatList, ActivityIndicator, Pressable} from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MenuScreen from './MenuScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

function HomeScreen({navigation, route}){
  const {username} = route.params;
  useEffect( () => { console.log(username); });



return(
  <Tab.Navigator initialRouteName="Menu"
  screenOptions={ ({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Menu'){
          iconName = focused ? 'list' : 'list-outline';
        }else if (route.name === 'Cart'){
          iconName = focused ? 'cart' : 'cart-outline';
        }
        else if (route.name === 'Profile'){
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      }
    })
    }
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}>
    <Tab.Screen name="Menu" component={MenuScreen} options={{ title: "Menu" }} />
    <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarBadge: 3, title : "Cart" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{username: username}} options={ ({route}) => ({username: route.params.username}) }/>
</Tab.Navigator>
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
  }
});


export default HomeScreen;
