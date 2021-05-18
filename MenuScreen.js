import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, Image, View, Alert, FlatList, ActivityIndicator, Pressable, Button,TouchableOpacity,ScrollView,TouchableHighlight,Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function MenuScreen({navigation}){

  const isFocused = useIsFocused()

      useEffect(() => {
        getMenuFromApi();

        if(cartItemList != null){
            getCartList();
        }

          console.log('isFocused working ??????')
      } , [isFocused])


  const [data, setData] = useState([]);
  const [dataAvailable, setdataAvailable] = useState([]);
  const [renderState, setrenderState] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isAddToCartLoading, setAddToCartLoading] = useState(true);
  const [menuDetailList] = useState([]);
  const [newCartList] = useState([]);
  const [cartItemList,setCartItemList] = useState([]);
  const [buttonText, setbuttonText] = useState([]);
  const [buttonState, setbuttonState] = useState(true);

  const storeMenuDetailItems = async (value) => {
  try{
    const jsonValue = JSON.stringify(value);

    await AsyncStorage.setItem('menu_item_list', jsonValue);
  }catch (ex){
    console.error(ex);
  }
}

const storeCartItems = async (value) => {
try{
  const jsonValue = JSON.stringify(value);

  await AsyncStorage.setItem('cart_item_list', jsonValue);
}catch (ex){
  console.error(ex);
}
}

  const getMenuFromApi = () => {
    const menuURL = "https://gist.githubusercontent.com/skd09/8d8a685ffbdae387ebe041f28384c13c/raw/26e97cec1e18243e3d88c90d78d2886535a4b3a6/menu.json";

    return fetch(menuURL)
    .then((response) => response.json()
    .then( (json) => {setData(json);})
    .catch( (error) => {console.error(error);})
    .finally( () => setLoading(false))
    );
    console.log(data);
  };


  const getCartList = async () => {
      try{
        const jsonValue = await AsyncStorage.getItem('cart_item_list');

        const data = jsonValue != null ? JSON.parse(jsonValue) : null;


        setCartItemList(data);
        setAddToCartLoading(false);
      }catch (ex){
        console.error(ex);
      }
    }


const addToCart = (item) => {

  if(cartItemList != null){
    console.log("Adding " + item.Title + " to Cart");
    console.log('before adding into cart')
    console.log(item);
                cartItemList.push(item);
                setbuttonState(false);
                storeCartItems(cartItemList);
                console.log('after adding into cart')
                console.log(cartItemList);
   }else{
     console.log("Adding " + item.Title + " to Cart");
     console.log('empty array adding into cart')
     console.log(item);
     newCartList.push(item);
     setCartItemList(newCartList);
     setbuttonState(false);
     storeCartItems(newCartList);
     console.log('after adding into cart')
     console.log(cartItemList);
   }


}

  const addedToCart = (item) => {
    console.log("Removing " + item.Title + " from Cart");
      console.log(cartItemList.filter(items  => items.Id !== item.Id))

  setCartItemList(cartItemList.filter(items  => items.Id !== item.Id));
  setbuttonState(true);
  storeCartItems(cartItemList.filter(items  => items.Id !== item.Id));

  }

  const navigateCartScreen = () => {
navigation.navigate('Cart');
  }

  const sortTitleAsc = () => {
    setData(data.sort((a, b) => a.Title.localeCompare(b.Title)));
    handleRefresh();
  }
  const sortTitleDsc = () => {
    setData(data.sort((a, b) => b.Title.localeCompare(a.Title)));
    handleRefresh();
  }
  const sortLowPrice = () => {
    setData(data.sort((a, b) => (a.Price) - (b.Price)));
    handleRefresh();
  }
  const sortHighPrice = () => {
    setData(data.sort((a, b) => (b.Price) - (a.Price)));
    handleRefresh();
  }
  const sortTopRated = () => {
    setData(data.sort((a, b) => (b.Ratings) - (a.Ratings)));
    handleRefresh();
  }

  const sortAvailability = () => {

    setData(data.filter(i => i.Available == 1));
    handleRefresh();
  }


  useEffect( () => {getMenuFromApi()}, []);
  useEffect( () => {getCartList()}, []);

  const handleRefresh = () => {
      setrenderState({ refreshing: false }, ()=>{});
  }

  function findArrayElementByTitle(array, title) {
    return array.find((element) => {
      return element.title === title;
    })
  }


return(

  <View style={styles.container}>


<View style={styles.sortButtonItems}>
<View style={styles.sortButton}>
    <Button title = "Title(Asc)" color="grey" onPress = { () => {
      sortTitleAsc();
    }} />
    </View>
    <View style={styles.sortButton}>
        <Button title = "Title(Dsc)" color="grey" onPress = { () => {
          sortTitleDsc();
        }} />
        </View>
        <View style={styles.sortButton}>
            <Button title = "Price(L)" color="grey" onPress = { () => {
              sortLowPrice();
            }} />
            </View>

  </View>

  <View style={styles.sortButtonItems}>
  <View style={styles.sortButton}>
      <Button title = "Top Rated" color="grey" onPress = { () => {
        sortTopRated();
      }} />
      </View>
      <View style={styles.sortButton}>
          <Button title = "Available" color="grey" onPress = { () => {
            sortAvailability();
          }} />
          </View>
          <View style={styles.sortButton}>
              <Button title = "Price(H)" color="grey" onPress = { () => {
                sortHighPrice();
              }} />
              </View>
    </View>



<TouchableOpacity>
  {isLoading ? (<ActivityIndicator/>) : (<FlatList
          data = {data}
          extraData={renderState}
          keyExtractor = { (item, index) => {return item.Title;} }
          renderItem = { ({item}) => (

            <Pressable onPress={ () => {


              if(menuDetailList.length > 0){
                  for (var i = menuDetailList.length; i > 0; i--) {
                   menuDetailList.pop();
                  }
              }

              menuDetailList.push(item);
              storeMenuDetailItems(menuDetailList);

              navigation.navigate('MenuDetail');
            }}>
              <View>
                <View style={styles.listitem}>
                  <Image style={styles.thumb} source = {{uri: item.Image}} />
                  <Text style={styles.title}>  {item.Title} </Text>
                  <Text style={styles.synopsis}> {item.Category} </Text>
                  <Text style={styles.price}> ${item.Price} </Text>


  {isAddToCartLoading ? (<ActivityIndicator/>) :


<View style={styles.button}>

    <Button title = "Add to cart" color="green" onPress = { () => {
      addToCart(item);
    }} />

<View style={styles.removeButton}>

    <Button title = "Remove from cart" color="red" onPress = { () => {
      addedToCart(item);
    }} />
      </View>
  </View>
}
                </View>
                <View style={styles.separator} />
              </View>
            </Pressable>
          )}
        />)}
</TouchableOpacity>


<Text style={styles.header}>  </Text>
<Text style={styles.header}>  </Text>
<Text style={styles.header}>  </Text>
<Text style={styles.header}>  </Text>

      </View>


);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
 height : windowHeight,
  },
  header:{
    marginTop:50,
    marginBottom:50,
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
  listitem: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  synopsis: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color:'orange'
  },
  price: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color:'green'
  },
  button:{
  marginTop : 5,
  flexDirection: 'row',
  height:40
},
sortButtonItems:{
  flexDirection: 'row',
  margin : 5,
  height:48,
  width:100
},
sortButton:{
marginLeft : 15,
height:40,
width:100
},
removeButton:{
marginLeft : 5,
},
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  }
});


export default MenuScreen;
