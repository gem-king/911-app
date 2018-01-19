import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import images from "../images";
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
var widthImage = 0;
    var heightImage = 0;
    var textSize = 0;
if (DEVICE_WIDTH>=500){
    widthImage = 300;
    heightImage = 45;
    textSize = 28;
} else {
    widthImage = 200;
    heightImage = 30;
    textSize = 20;
}

export default class Logo extends Component {
    render () {
        return (
            <View style={styles.container}>
                <Image source={images.logo1} style={styles.image}/>
                <Text style={styles.text}>911 INTERPRETER</Text>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
       width:widthImage,
        height:heightImage,
        resizeMode:'stretch',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginTop: 4,
        fontSize: textSize
    }
});
