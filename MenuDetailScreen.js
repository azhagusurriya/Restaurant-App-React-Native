import React,{ useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet,
   TextInput, Text, Button, View, Image, FlatList, ActivityIndicator, Alert, Pressable, Dimensions} from 'react-native';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   import StarRating from 'react-native-star-rating';

   const windowWidth = Dimensions.get('window').width;
   const windowHeight = Dimensions.get('window').height;

   function MenuDetailScreen({ navigation}){

const [menuList, setmenuList] = useState([]);
const [buttonText, setbuttonText] = useState([]);
const [isLoading, setLoading] = useState(true);
const [cartList, setcartList] = useState([]);
const [oldCartItem, setoldCartItem] = useState([]);



const storeCartItems = async (value) => {
  try{
    const jsonValue = JSON.stringify(value);

    await AsyncStorage.setItem('cart_menu_list', jsonValue);
  }catch (ex){
    console.error(ex);
  }
}

const addToCart = () => {

  getCartList();
  console.log('oldddddddd Itemmmmmmm:   '+oldCartItem)
  if(oldCartItem != null){
    cartList.push(oldCartItem);
  }

if(cartList.length >= 1){
      for (var i = cartList.length; i > 0; i--) {
     if(menuList.Id != cartList.Id)
     cartList.push(menuList[0]);
     storeCartItems(cartList);

     console.log('adding values to cart1:' + cartList);
      }
    }
      else{
        cartList.push(menuList[0]);
        storeCartItems(cartList);

        console.log('adding values to cart2:' + cartList);
      }
}


const getMenuList = async () => {
    try{
      const jsonValue = await AsyncStorage.getItem('menu_item_list');


      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
      setmenuList(data);
      setLoading(false)

    }catch (ex){
      console.error(ex);
    }
  }


  const getCartList = async () => {
      try{
        const jsonValue = await AsyncStorage.getItem('cart_menu_list');
        if (jsonValue != null){
                  console.log('Cart Stored Items: ' + jsonValue)
                  const data = jsonValue != null ? JSON.parse(jsonValue) : null;
                  setoldCartItem(data);
            }
            else{
              console.log('This is the first item to be added in cart !!')
            }

      }catch (ex){
        console.error(ex);
      }
    }




useEffect( () => {getMenuList()}, []);

     return(
        <SafeAreaView style={styles.sectionContainer}>

        {isLoading ? (<ActivityIndicator/>) : (<FlatList
        data = {menuList}
        keyExtractor = { (item, index) => {return item.Title;} }
        renderItem =  { ({item}) => (

          <View style={styles.container}>
                    <Image style={styles.thumb} source = {{uri: item.Image}} />
                      <Text style={styles.title}>  {item.Title} </Text>
                      <Text style={styles.subTitle}> {item.Category} </Text>
                      <Text style={styles.description}> {item.Description} </Text>
                      <Text style={styles.price}> ${item.Price} </Text>
                      <Text style={styles.subTitle}> Availability :{item.Available} </Text>

                      <StarRating
        disabled={true}
        maxStars={5}
        emptyStar={'ios-star-outline'}
        fullStar={'ios-star'}
        halfStar={'ios-star-half'}
        iconSet={'Ionicons'}
        rating={item.Ratings}
        fullStarColor={'orange'}

      />
  <View style={styles.button}>
      <Button title = "Add to cart" color="red" onPress = { () => {
        addToCart();
      }} />
      </View>
          </View>

        )}
        />)}
        </SafeAreaView>
    );

   }

   const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: 'center',
    height:windowHeight
  },
  prompt: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#48BBEC'
  },
  thumb: {

    width: '90%',
    height: 150,
    padding: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'red',
    textAlign:'center'
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
    textAlign:'center'
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    color:"#ffaa80"
  },
  price: {
    fontSize: 25,
    textAlign: 'center',
    padding: 10,
    color:"green"
  },
  rating: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color:"#ff6699"
  },
  input:{
    height: 40,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button:{
  marginTop : 45
}
});


export default MenuDetailScreen;
