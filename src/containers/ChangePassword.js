import React, {Component} from 'react'
import {
    View, Image, StyleSheet, TextInput, Text, TouchableOpacity, AsyncStorage, Alert, Keyboard, NetInfo
} from 'react-native'
import images from "../components/images";
import Logo from "../components/Login/Logo";
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';
import {URL, URL_CANCEL, URL_CHANGE, URL_FORGOT, URL_SHEDULE, URL_TIMEFINISH} from "../components/const";
import {NavigationActions} from "react-navigation";


const DEVICE_WIDTH = Dimensions.get('window').width;
var widthInput = 0;
var sizeText = 0;
var sizeButton = 0;
var heightButton = 0;
if (DEVICE_WIDTH >= 500) {
    widthInput = DEVICE_WIDTH * 4 / 5;
    sizeText = 22;
    sizeButton = 200;
    heightButton = 60;
} else {
    widthInput = DEVICE_WIDTH - 40;
    sizeText = 16;
    sizeButton = 160;
    heightButton = 50;
}
export default class ChangePassword extends Component {
    myColor = '#e0e0e0';

    static navigationOptions = ({ navigation}) => {
        const {state} = navigation;
        return {
            headerLeft:
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Icon name="ios-arrow-back" size={30} style={{marginLeft: 15}} color="white"></Icon>
                </TouchableOpacity>
        }

    };

    constructor(props) {
        super(props);
        this.state = {
            pass: "",
            pass2: "",
            pass3: "",
            myColor1: 'white',
            myColor2: 'white',
            myColor3: 'white',
            dataPass: '',
            myPass: "",
            alert: false,
            success: false,
            invalid: false,
        };

    }

    _onChangePass() {
        Keyboard.dismiss();
        NetInfo.isConnected.fetch().then((isConnected) => {
            if ( isConnected )
            {
                AsyncStorage.getItem('pass').then(value => {
                    console.log("Pass", value);
                    if (this.state.pass != value || this.state.pass2 == "" || this.state.pass3 == "") {
                        this.setState({
                            alert: true
                        })
                    } else {
                        if (this.state.pass2 != this.state.pass3) {

                        } else {
                            AsyncStorage.getItem('token').then((value) => {
                                fetch(URL + URL_CHANGE, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': value,
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        oldPassword: this.state.pass,
                                        newPassword: this.state.pass2,
                                    }),
                                })
                                    .then((response) => response.text())
                                    .then((responseData) => {
                                        if (responseData.status === 401 || responseData.ok === false) {
                                            this.setState({
                                                invalid: true
                                            })
                                        } else {
                                            AsyncStorage.setItem('pass', this.state.pass2);
                                            this.setState({
                                                alert: false,
                                                success: true
                                            })
                                        }
                                    }).catch((error) => console.log(error))
                            });
                        }
                    }
                });
            }
            else
            {
                alert("Network request failed")
            }
        });
    }

    _isCheck(text, num) {
        if (text.length < 4) {
            switch (num) {
                case 1:
                    this.setState({myColor1: 'red'});
                    break;
                case 2:
                    this.setState({myColor2: 'red'});
                    break;
                case 3:
                    this.setState({myColor3: 'red'});
                    break;
            }
        } else {
            switch (num) {
                case 1:
                    this.setState({myColor1: '#0288d1'});
                    break;
                case 2:
                    this.setState({myColor2: '#0288d1'});
                    break;
                case 3:
                    this.setState({myColor3: '#0288d1'});
                    break;
            }
        }

    }

    _isShowText(text, num) {
        if (text.length < 4 && text.length > 0) {
            return (<View>
                <Text style={{color: 'red', fontSize: sizeText - 2}}>Please enter password more than 4 character</Text>
            </View>);
        } else {
            if (text.length >= 4 && num == 3 && text != this.state.pass2) {
                return (<View>
                    <Text style={{color: 'red', fontSize: sizeText - 2}}>Please enter confirm password like new
                        password</Text>
                </View>);
            }
            else {
                return null;
            }
        }

    }

    _notification = () => {
        if(this.state.alert == true){
            return (
                <View style={{
                    width: widthInput,
                    backgroundColor: '#ffcdd2', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 10, padding: 10, marginRight: 10
                }}>
                    <Text style={{color: '#e60000'}}>
                        Old Password is incorrect!
                    </Text>
                </View>
            )
        }if(this.state.invalid == true){
            return (
                <View style={{
                    width: widthInput,
                    backgroundColor: '#ffcdd2', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 10, padding: 10, marginRight: 10
                }}>
                    <Text style={{color: '#e60000'}}>
                        Invalid password. Please review and try again
                    </Text>
                </View>
            )
        }if(this.state.success == true){
            return (
                <View style={{
                    width: widthInput,
                    backgroundColor: '#b3ffb3', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 10, padding: 10, marginRight: 10
                }}>
                    <Text style={{color: '#006600'}}>
                        Change password success!
                    </Text>
                </View>
            )
        }
    }

    render() {
        const {params} = this.state.dataPass;
        return (
            <View style={{flex: 1, backgroundColor: '#4fc3f7'}}>
                <View style={styles.container}>
                    <Image style={styles.picture} source={images.wall}>
                        <Logo/>
                        <View style={{
                            flex: 10, flexDirection: 'column',
                            marginTop: -20,
                            alignItems: 'center',
                        }}>
                            {this._notification()}
                            <View style={styles.container1}>
                                <Text style={styles.myText}>Old password *</Text>
                                <TextInput style={styles.input}
                                           placeholderTextColor={this.myColor}
                                           underlineColorAndroid={this.state.myColor1}
                                           secureTextEntry={true}
                                           onChangeText={(text) => {
                                               this.setState({pass: text}), this._isCheck(text, 1)
                                           }}
                                           value={this.state.pass}
                                           returnKeyType='done'/>
                                {this._isShowText(this.state.pass, 1)}
                            </View>
                            <View style={styles.container1}>
                                <Text style={styles.myText}>New password *</Text>
                                <TextInput style={styles.input}
                                           placeholderTextColor={this.myColor}
                                           underlineColorAndroid={this.state.myColor2}
                                           secureTextEntry={true}
                                           onChangeText={(text1) => {
                                               this.setState({pass2: text1}), this._isCheck(text1, 2)
                                           }}
                                           returnKeyType='done'/>
                                {this._isShowText(this.state.pass2, 2)}
                            </View>
                            <View style={styles.container1}>
                                <Text style={styles.myText}>New password confirmation *</Text>
                                <TextInput style={styles.input}
                                           placeholderTextColor={this.myColor}
                                           underlineColorAndroid={this.state.myColor3}
                                           secureTextEntry={true}
                                           onChangeText={(text2) => {
                                               this.setState({pass3: text2}), this._isCheck(text2, 3)
                                           }}
                                           returnKeyType='done'/>

                                {this._isShowText(this.state.pass3, 3)}
                            </View>

                            <View style={{marginTop: 40}}>
                                <TouchableOpacity onPress={() => {
                                    this._onChangePass()
                                }}>
                                    <View style={{
                                        backgroundColor: '#D2232A',
                                        width: sizeButton,
                                        height: heightButton,
                                        borderRadius: (sizeButton / 2 - 20) / 2,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{fontSize: 20, color: 'white'}}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Image>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignContent: 'center',
    },

    input: {
        width: widthInput,
        fontSize: sizeText,
        color: 'white'
    },
    picture: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    container1: {
        marginTop: 10
    },

    myText: {
        color: 'white',
        fontSize: sizeText,
        fontWeight: 'bold'
    }

})