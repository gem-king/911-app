import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import images from "../components/images";

import { NavigationActions } from 'react-navigation'

export default class Launcher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            isTime: false
        }
    }
    componentDidMount(){
        setTimeout(()=> {
            this.setState({
                isTime: true
            })
            this.pushScreen();
        },2000)
    }

    pushScreen(){
        var token = AsyncStorage.getItem('token', (err, res)=> {
            if(res) {
                // const { navigate } = this.props.navigation;
                // navigate('SideMenu');
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'SideMenu'})
                    ]
                });
                this.props.navigation.dispatch(resetAction)

            } else {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login',params:{key:'login'}})
                    ]
                });
                this.props.navigation.dispatch(resetAction)

            }
        });
    }

    render(){

        return (
                <View style = {styles.container}>
                    <Image style = {styles.image} source = {images.logo1}></Image>
                </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    image: {
        resizeMode: 'contain',
        width:200,
        height:80

    }
})