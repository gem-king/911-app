import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    AsyncStorage,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    ActivityIndicator,
    NetInfo
} from 'react-native';
import Dimensions from 'Dimensions';
import Logo from "../components/Login/Logo";
import Form from "../components/Login/Form";
import SignupSection from "../components/Login/SignupSection";
import images from "../components/images";
import {URL, URL_ACOUNT, URL_FOLDER, URL_LOGIN, URL_TIMEFINISH} from "../components/const";

var {height, width} = Dimensions.get('window');
height = height;
import {NavigationActions} from 'react-navigation'

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            pass: '',
            height: height,
            dataSource: '',
            isLoading: false,
            alert: false,
            invalid: false,
            noaccount: false
        }
        this._onPress = this._onPress.bind(this);
    }

    componentWillMount(){

    }

    _onPress() {
        Keyboard.dismiss();
        this.setState({
            isLoading: true
        });

        NetInfo.isConnected.fetch().done((isConnected) => {
            if ( isConnected )
            {
                fetch(URL + URL_LOGIN, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({
                        username: this.state.email,
                        password: this.state.pass,
                        rememberMe: true

                    })
                }).then((data) => {
                    if(this.state.email == '' || this.state.pass == ''){
                        this.setState({
                            isLoading: false,
                            alert: true
                        })
                    }else {
                        this.setState({
                            alert: false
                        })
                        if (data.status === 401 || data.ok === false) {
                            this.setState({
                                isLoading: false,
                                invalid: true
                            })
                        }
                        else {
                            AsyncStorage.setItem(
                                'token', data.headers.get("authorization"),
                            );

                            AsyncStorage.setItem('pass', this.state.pass);

                            AsyncStorage.getItem('token').then((value) => {
                                fetch(URL + URL_ACOUNT, {
                                    method: "GET",
                                    headers: {
                                        'Authorization': value,
                                    }
                                })
                                    .then((response) => response.json())
                                    .then((responseData) => {
                                        console.log('accountLogin', responseData)
                                        this.setState({
                                            dataSource: responseData,
                                        })
                                        if(JSON.stringify(this.state.dataSource.authorities).contains("ROLE_INTERPRETER")){
                                            let key = this.props.navigation.state.params.key;
                                            if (key === 'logout') {
                                                const resetAction = NavigationActions.reset({
                                                    index: 0,
                                                    actions: [
                                                        NavigationActions.navigate({routeName: 'Tab'})
                                                    ]
                                                });
                                                this.props.navigation.dispatch(resetAction)
                                            } else {
                                                const resetAction = NavigationActions.reset({
                                                    index: 0,
                                                    actions: [
                                                        NavigationActions.navigate({routeName: 'SideMenu'})
                                                    ]
                                                });
                                                this.props.navigation.dispatch(resetAction)
                                            }
                                        }else{
                                            this.setState({
                                                noaccount: true,
                                                isLoading: false
                                            })
                                            AsyncStorage.removeItem('token');
                                        }
                                    })
                            });

                        }
                    }
                }).catch((erro) => {
                    console.log(erro);
                })
            }
            else
            {
                alert("Network request failed")
            }
        });
    }

    getEmail = (email) => {
        this.setState({
            email: email
        })
    }
    getPass = (pass) => {
        this.setState({
            pass: pass
        })
    }

    _notification = () => {
        if(this.state.alert == true){
            return (
                <View style={{
                    width: DEVICE_WIDTH - 40,
                    backgroundColor: '#ffcdd2', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 20, padding: 10, marginRight: 20,
                    marginBottom: 20
                }}>
                    <Text style={{color: '#e60000'}}>
                        Please Enter Required Information!
                    </Text>
                </View>
            )
        }if(this.state.invalid == true){
            return (
                <View style={{
                    width: DEVICE_WIDTH - 40,
                    backgroundColor: '#ffcdd2', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 20, padding: 10, marginRight: 20,
                    marginBottom: 20
                }}>
                    <Text style={{color: '#e60000'}}>
                        Can not sign in with this account
                    </Text>
                </View>
            )
        }
        if(this.state.noaccount == true){
            return (
                <View style={{
                    width: DEVICE_WIDTH - 40,
                    backgroundColor: '#ffcdd2', borderColor: '#524c00',
                    borderRadius: 5,
                    justifyContent: 'center',
                    borderWidth: 1, marginLeft: 20, padding: 10, marginRight: 20,
                    marginBottom: 20
                }}>
                    <Text style={{color: '#e60000'}}>
                        Username or password is incorrect!
                    </Text>
                </View>
            )
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{flex: 1}}>
                <KeyboardAvoidingView
                    style={styles.container1}
                    behavior="padding">

                    <View style={{height: this.state.height, position: 'absolute'}}>

                        <Image style={styles.picture} source={images.wall}>

                            <Logo/>

                            {this._notification()}

                            <Form
                                getEmail={this.getEmail}
                                getPass={this.getPass}
                            />
                            <View style={styles.container}>
                                <TouchableOpacity style={styles.button}
                                                  onPress={this._onPress}
                                >
                                    <Text style={styles.text}>LOGIN</Text>
                                </TouchableOpacity>
                            </View>

                            <SignupSection/>
                        </Image>

                    </View>


                </KeyboardAvoidingView>
                {this.state.isLoading ?
                    <View style={{
                        flex: 1, justifyContent: 'center',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        opacity: 0.5,

                        alignItems: 'center', position: 'absolute', backgroundColor: 'black'
                    }}>
                        <ActivityIndicator size="large"/>
                    </View> : null}
            </View>

        );
    }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;
const styles = StyleSheet.create({
    picture: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D2232A',
        height: MARGIN,
        borderRadius: 20,
        zIndex: 100,
        marginHorizontal: 20,
        width: DEVICE_WIDTH - 40,
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    container1: {
        backgroundColor: '#4c69a5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});