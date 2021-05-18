import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, Image, View, Alert, FlatList, ActivityIndicator, Pressable,Button,TouchableHighlight,Dimensions} from 'react-native';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   import { useIsFocused } from '@react-navigation/native';
   import Ionicons from 'react-native-vector-icons/Ionicons';
   import Icon from 'react-native-vector-icons/Feather';
   import DropDownPicker from 'react-native-dropdown-picker';
   import { SimpleStepper } from 'react-native-simple-stepper';

   const windowWidth = Dimensions.get('window').width;
   const windowHeight = Dimensions.get('window').height;



function CartScreen({navigation}){



  const isFocused = useIsFocused()

      useEffect(() => {
          getCartList();
          calculateTotalPrice();
          console.log('isFocused working in cart ??????')
      } , [isFocused])

const [cartList, setcartList] = useState([]);
const [duplicateCartList, setduplicateCartList] = useState([]);
const [renderState, setrenderState] = useState([]);
const [priceList, setpriceList] = useState(0);
const [finalPrice, setfinalPrice] = useState(0);
const [isLoading, setLoading] = useState(true);
const [pickerValue, setpickerValue] = useState({quantity : 'one'});

  const getCartList = async () => {
      try{
        const jsonValue = await AsyncStorage.getItem('cart_item_list');

        const data = jsonValue != null ? JSON.parse(jsonValue) : [];
const data1 = jsonValue != null ? JSON.parse(jsonValue) : [];


console.log('Back to menu list screen' + cartList);

        setcartList(data);
        setduplicateCartList(data1);
        handleRefresh();
        setLoading(false)


        calculateTotalPrice();
        console.log('before displaying cart list screen')

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

const removeCartItems = (item) => {
  console.log('Remove Item' + item.Title);
  console.log(cartList.filter(items  => items.Id !== item.Id));

setcartList((cartList.filter(items  => items.Id !== item.Id)));
storeCartItems((cartList.filter(items  => items.Id !== item.Id)));

console.log('after reving from cart');
console.log(cartList);

}

const addMoreItems = () => {
navigation.navigate("Menu");
}


const calculateTotalPrice = () => {
  console.log(cartList.length);
  if(cartList == null || cartList.length == 0) handleRefresh();
 if(cartList != null){
   console.log(priceList)
  setpriceList(cartList.reduce(function(prev, cur) {
  return prev + cur.Price;
}, 0));
console.log(priceList)
  if(priceList >= 100){
    setfinalPrice(priceList * 0.7);
  }
  else if (priceList > 80 && priceList < 100 ){
    setfinalPrice(priceList * 0.8);
  }
  else {
    setfinalPrice(priceList * 0.95);
  }

  handleRefresh();

  }
}

const handleRefresh = () => {
    setrenderState({ refreshing: false }, ()=>{});
}

useEffect( () => {getCartList()}, []);
//calculateTotalPrice()}, []);

const onStepperChanged = (value, item) =>{
    //console.log(item.Price * value)
    //xensole.log(value)

  for (var i in cartList) {
    if (cartList[i].Title === item.Title) {
      console.log(duplicateCartList[i].Price)
      cartList[i].Price = duplicateCartList[i].Price * value
      setcartList(cartList)
      break; }}//Stop this loop, we found it! } } }
      calculateTotalPrice();
      //handleRefresh();
}


proceedToBilling
const proceedToBilling = () =>{
    navigation.navigate('Billing');
}


return(
  <View style={styles.sectionContainer}>

  <Text style={styles.header}> Cart </Text>

<View style={styles.sectionList}>
  {isLoading ? (<ActivityIndicator/>) : (<FlatList
  data = {cartList}
  keyExtractor = { (item, index) => {return item.Title;} }
  renderItem =  { ({item}) => (

    <View style={styles.container}>
    <TouchableHighlight onPress={()=>{removeCartItems(item);}}>
         <View>
            <Ionicons style={styles.removeIcon} name={'trash'} size={34} color={'red'} />
         </View>
     </TouchableHighlight>

              <Image style={styles.thumb} source = {{uri: item.Image}} />
                <Text style={styles.title}>  {item.Title} </Text>


<SimpleStepper  showText = {true}
initialValue = {1}
minimumValue = {1}
valueChanged = {(value) => onStepperChanged(value,item)}
incrementImageStyle = {{ height: 12, width: 8 }}
decrementImageStyle = {{ height: 12, width: 8 }}
containerStyle = {{ backgroundColor: 'transparent',width: 65,height:30, flexDirection: 'row', borderWidth: 2, borderRadius: 8, overflow: 'hidden', alignItems: 'center', borderColor: 'black' }}
textStyle = {{ padding: 4, fontSize: 12, fontWeight: 'bold', color: 'red' }}
separatorStyle = {{ width: StyleSheet.hairlineWidth, backgroundColor: 'black', height: '100%' }}
/>

                <Text style={styles.price}> ${item.Price} </Text>

    </View>
  )}
  />)}
  </View>

  <View style={styles.button}>
      <Button title = "Update Cart" color="red" onPress = { () => {
        calculateTotalPrice();
      }} />
      </View>

<View style={styles.sectionContainer}>
<Text style={styles.price}> Net Total: {priceList}</Text>
<Text style={styles.price}> Final Amount: {finalPrice}</Text>
</View>

<View style={styles.bottomButton}>
    <Button title = "Proceed to Billing" color="red" onPress = { () => {
      proceedToBilling();
    }} />
    </View>

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
    flexDirection: 'row',
    padding: 20,
    backgroundColor: "white",
  },
  sectionContainer: {
    backgroundColor: "white",
  },
  sectionList: {
    backgroundColor: "black",
  },
  thumb: {
    width: '90%',
    height: 26,
    width : 44,
    marginLeft: 10,
    borderRadius: 10
  },
  listitem: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    width: 150,
    height:38,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 30,
    color: '#123456',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign : 'center',
    justifyContent : 'center',
    color: 'white',
  },
  price: {
    fontSize: 15,
    marginLeft: 20,
    paddingRight: 30,
    color:"green"
  },
  removeIcon: {
    fontSize: 25,
    color:"red"
  },
  synopsis: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'black'
  },
  sortButton:{
  marginLeft : 15,
  height:20,
  width:100
  },
  button:{
    width: 180,
    borderLeftWidth: 1,
   borderRightWidth: 1,
   borderTopWidth: 1,
  borderBottomWidth: 1,
   borderColor: 'red',
    marginTop : 5,
    marginBottom : 25,
    alignSelf: 'center'

},
bottomButton:{
  width: 180,
  borderLeftWidth: 1,
 borderRightWidth: 1,
 borderTopWidth: 1,
borderBottomWidth: 1,
 borderColor: 'red',
  marginTop : 55,
  alignSelf: 'center'

},
});


export default CartScreen;
