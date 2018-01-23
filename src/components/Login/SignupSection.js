import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    TouchableHighlight,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    AsyncStorage,
    NetInfo
} from 'react-native';
import Modal from 'react-native-modal'
import Dimensions from 'Dimensions';
import {URL, URL_ACOUNT, URL_FORGOT, URL_ID, URL_LANGUAGE, URL_LOGIN, URL_RESET, URL_TIMEFINISH} from "../const";
import {NavigationActions} from "react-navigation";

const DEVICE_WIDTH = Dimensions.get('window').width;
var widthInput = 0;
var sizeText = 0;
var sizeButton = 0;
if (DEVICE_WIDTH >= 500) {
    widthInput = DEVICE_WIDTH * 4 / 5;
    sizeText = 20;
    sizeButton = 200;
} else {
    widthInput = DEVICE_WIDTH - 40;
    sizeText = 16;
    sizeButton = 140;
}

export default class SignupSection extends Component {

    constructor(props){
        super(props)
        this.state = {
            isModalVisible: false,
            pressStatus: false,
            name: '',
            check: true,
            success: null,
        }

        this.mang = false;

        NetInfo.isConnected.fetch().then(isConnected => {
            // console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            console.log("nnnn1",isConnected);
            this.mang = isConnected;
            console.log("network1",this.mang);
        });
        function handleFirstConnectivityChange(isConnected) {
            // console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
            console.log("nnnn2",isConnected);
            this.mang = isConnected;
            this.a = 1;
            console.log("network2",this.mang);
            NetInfo.isConnected.removeEventListener(
                'connectionChange',
                handleFirstConnectivityChange
            );
        }

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            handleFirstConnectivityChange.bind(this)
        );
    }

    async _resetPassword(){
        Keyboard.dismiss();
        if(this.mang == true) {
            try {
                const response = await fetch(URL + URL_FORGOT, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'text/plain',
                    },
                    body: this.state.name
                })
                if (response.status === 400) {
                    this.setState({
                        check: false
                    });
                }
                if (response.status === 200) {
                    this.setState({
                        check: true,
                        success: true,
                    });
                    this._notification()
                }
            } catch (err) {
                console.log(err + "")
            }
        }else {
            alert("Network request failed")
        }

    }

    _notification = () => {
        if(this.state.check == false){
            return (
                <View style={{
                    backgroundColor: '#ffcdd2', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 16, padding: 10, marginRight: 16
                }}>
                    <Text stype={{color: '#e60000'}}>
                        User Name is incorrect!
                    </Text>
                </View>
            )
        }else {

        }if(this.state.success == true){
            return (
                <View style={{
                    backgroundColor: '#b3ffb3', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 16, padding: 10, marginRight: 16
                }}>
                    <Text stype={{color: '#006600'}}>
                        Successfully Reset Email, Please checking your email
                    </Text>
                </View>
            )
        }
    }

    _showModal = () => this.setState({ isModalVisible: true })

    _onHideUnderlay(){
        this.setState({ pressStatus: false });
    }
    _onShowUnderlay(){
        this.setState({ pressStatus: true });
    }

    _isShowText(text) {

        var illegalChars = /\W/;
        if (illegalChars.test(text)) {
            return (<View>
                <Text style={{color: 'red', fontSize: sizeText-4}}>User Name must start with a letter and can not contain spaces or special characters</Text>
            </View>);
        } else {
                return null;
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    activeOpacity={1}
                    onPress={this._showModal}
                    style={this.state.pressStatus ? styles.forgot2 : styles.forgot1}
                    onHideUnderlay={this._onHideUnderlay.bind(this)}
                    onShowUnderlay={this._onShowUnderlay.bind(this)}
                >
                    <Text style={{color: 'white', fontSize: 16}}>Forgot Password?</Text>
                </TouchableHighlight>
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor: 'white', borderRadius: 7,}}>
                        <View style={{backgroundColor: '#D2232A', borderTopRightRadius: 7, borderTopLeftRadius: 7}}>
                            <Text style={styles.title}>Forgot Password</Text>
                        </View>

                        <View style={{backgroundColor:'#ffebee',borderColor:'#524c00',
                            borderRadius:5,
                            justifyContent: 'center',
                            borderWidth:1, margin:16 }}>
                            <Text style={{color:'#524c00', fontSize:sizeText-2, marginLeft:16, marginTop:10, marginBottom:10}}>
                                Please enter the User Name that you used to register
                            </Text>
                        </View>
                        {this._notification()}
                        <View style={{marginTop:20, margin:16, flexDirection:'column'}}>
                            <View style={{flexDirection:'row'}}>
                            <Text style={{color: '#616161', fontSize: sizeText-3, marginLeft: 5}}>User Name</Text>
                            <Text style={{color: '#D2232A', fontSize: sizeText-3, marginLeft: 5}}>*</Text>
                            </View>
                            <TextInput style={styles.input}
                                       placeholderTextColor='black'
                                       underlineColorAndroid='blue'
                                       onChangeText={(text) => {
                                           this.setState({name: text})
                                       }}
                            />


                         {this._isShowText(this.state.name)}
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity onPress={() => {this._resetPassword()}}>
                                <View style={{
                                    backgroundColor: '#D2232A',
                                    borderRadius: 7,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 6}}>
                                    <Text style={{color: 'white', fontSize: sizeText-4, marginLeft:16,
                                    marginTop:5, marginBottom:5, marginRight:16}}>Reset Password</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableHighlight
                                activeOpacity={1}
                                onPress={() => this.setState({isModalVisible: false, success: null, check: true})}
                                style={this.state.pressStatus ? styles.cancel2 : styles.cancel}
                                onHideUnderlay={this._onHideUnderlay.bind(this)}
                                onShowUnderlay={this._onShowUnderlay.bind(this)}
                            >
                                <Text style={this.state.pressStatus ? styles.text2 : styles.text}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:16,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    title: {
        color: 'white',
        fontSize: sizeText,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 10,
        marginBottom:10,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 20,
        fontSize:sizeText-2,
        color: 'black',
    },
    button: {
        marginLeft: 5,
        marginTop: 5,
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'black',
        fontSize: sizeText-4, marginLeft:16,
        marginTop:5, marginBottom:5, marginRight:16
    },
    text2: {
        color: 'white',
        fontSize: sizeText-4, marginLeft:16,
        marginTop:5, marginBottom:5, marginRight:16
    },
    forgot1: {
        height: 40,
        padding: 10,
    },
    forgot2: {
        backgroundColor: '#D2232A',
        height: 40,
        padding: 10,
        borderRadius: 20,
    },
    cancel: {
        backgroundColor: 'white',
        borderRadius: 7,
        borderWidth: 1,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    cancel2: {
        backgroundColor: '#D2232A',
        borderRadius: 7,
        borderWidth: 1,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    }
});
