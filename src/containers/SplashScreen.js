import React,{Component} from 'react';
import {View,Text,StyleSheet,Image,} from 'react-native';
import images from "../components/images";
import Dimensions from 'Dimensions';

export default class SplashScreen extends Component{
	render(){
		return (
                <View style={styles.container}>
                  <Image style={styles.img} source={images.logo}></Image>
                </View>
			);
	}
}
const width_device=Dimensions.get('window').width;
const height_device=Dimensions.get('window').height;
const styles =StyleSheet.create({
    container:{
        alignItems:'center',
    	flex:1,
    	justifyContent:'center',
    	backgroundColor:'#f4f',
        //f4f
    },
    img:{
        width:230,
        height:230,
    }
});
