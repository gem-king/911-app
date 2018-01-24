import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    StyleSheet,
    Image,
    TouchableHighlight,
    NetInfo
} from 'react-native';
// import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import {default as IconFontAwesome} from 'react-native-vector-icons/FontAwesome';
import images from "../components/images";
import {URL, URL_ACOUNT, URL_ID, URL_LANGUAGE, URL_TIMEFINISH} from "../components/const";
import DatePicker from 'react-native-datepicker';
import {connect} from 'react-redux';

import {NavigationActions, StackNavigator} from 'react-navigation';
import ChangePassword from "./ChangePassword";
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
var widthMenu = 0;
var heightLogo = 0;
if (DEVICE_WIDTH >= 500) {
    widthMenu = DEVICE_WIDTH * 1 / 2;
    heightLogo = 50;
} else {
    widthMenu = DEVICE_WIDTH * 3 / 4;
    heightLogo = 40;
}

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            account: '',
            time: '8-30',
            myAccount: '',
            check: '',
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('timer').then((timer) => {
            this.setState({
                time: timer,
            });
        }).catch((error) => console.log("Error load timer:", error)).done();

        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({net:isConnected});
            if (this.state.net)
            {
                AsyncStorage.getItem('token').then((value) => {
                    fetch(URL + URL_ACOUNT, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                        }
                    })
                        .then((response) => response.json())
                        .then((responseData) => {

                            fetch(URL + URL_ID + responseData.id, {
                                method: "GET",
                                headers: {
                                    'Authorization': value,
                                }
                            })
                                .then((response2) => response2.json())
                                .then((responseData2) => {
                                    fetch(URL + URL_LANGUAGE + responseData2, {
                                        method: "GET",
                                        headers: {
                                            'Authorization': value,
                                        }
                                    })
                                        .then((response3) => response3.json())
                                        .then((responseData3) => {
                                            this.setState({
                                                account: responseData3
                                            })
                                        })
                                })
                        })
                        .done();
                });
                NetInfo.isConnected.addEventListener(
                    'connectionChange',
                    handleFirstConnectivityChange.bind(this)
                );
            }
            else
            {
                // alert("Network request failed")
                NetInfo.isConnected.addEventListener(
                    'connectionChange',
                    handleFirstConnectivityChange.bind(this)
                );
            }
        });

        function handleFirstConnectivityChange(isConnected) {
            console.log("nnnn2",isConnected);
            this.setState({net:isConnected});
            if(this.state.net == true){
                this.fetchData();
            }else {
                // alert("Network request failed")
                NetInfo.isConnected.addEventListener(
                    'connectionChange',
                    handleFirstConnectivityChange.bind(this)
                );
            }
            console.log("network2",this.state.net);
        }

        // NetInfo.isConnected.fetch().done((isConnected) => {
        //     if ( isConnected )
        //     {
        //         AsyncStorage.getItem('token').then((value) => {
        //             fetch(URL + URL_ACOUNT, {
        //                 method: "GET",
        //                 headers: {
        //                     'Authorization': value,
        //                 }
        //             })
        //                 .then((response) => response.json())
        //                 .then((responseData) => {
        //
        //                     fetch(URL + URL_ID + responseData.id, {
        //                         method: "GET",
        //                         headers: {
        //                             'Authorization': value,
        //                         }
        //                     })
        //                         .then((response2) => response2.json())
        //                         .then((responseData2) => {
        //                             fetch(URL + URL_LANGUAGE + responseData2, {
        //                                 method: "GET",
        //                                 headers: {
        //                                     'Authorization': value,
        //                                 }
        //                             })
        //                                 .then((response3) => response3.json())
        //                                 .then((responseData3) => {
        //                                     this.setState({
        //                                         account: responseData3
        //                                     })
        //                                 })
        //                         })
        //                 })
        //                 .done();
        //         });
        //     }
        //     else
        //     {
        //         alert("Network request failed")
        //     }
        // });
    }

    componentDidMount() {
    }

    componentWillReceiveProps() {
        this.componentWillMount();
    }

    onLogout() {
        AsyncStorage.removeItem('token');
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({type: 'Navigate', routeName: 'Login', params: {key: 'logout'}})
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{flex: 1, backgroundColor: '#495669'}}>
                <View style={{width: widthMenu, backgroundColor: 'white'}}>
                    <Image style={{
                        width: widthMenu,
                        height: heightLogo,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white'
                    }}
                           source={images.logo1}
                           resizeMode="contain"/>
                </View>
                <View style={styles.picture}>
                    <Image style={styles.imageProfile} source={images.profile}/>
                    <Text style={{
                        marginLeft: 16,
                        marginTop: 8,
                        marginBottom: 32,
                        marginRight: 16,
                        backgroundColor: 'transparent',
                        color: 'white',
                        fontSize: 20
                    }}>{this.state.account.firstName} {this.state.account.lastName}</Text>
                </View>
                <View style={{}}>
                    <TouchableOpacity
                        onPress={
                            () => {
                                navigate('InfoProfile', {dataAccount: this.state.account})
                            }}
                    >
                        <View style={styles.infoContainer}>
                            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                <IconFontAwesome name="user-circle" size={25} style={{marginLeft: 5, marginTop: 5}}
                                                 color="white"/>
                            </View>
                            <View style={{flex: 7, marginLeft: 13, marginTop: 7}}>
                                <Text style={styles.text}>ACCOUNT INFOR</Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                    <View style={{height: 1, backgroundColor: '#cccccc', marginTop: 10}}/>

                    <View style={styles.timersetting}>
                        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                            <Icon name="md-alarm" size={25} style={{marginLeft: 5}} color="white"/>
                        </View>
                        <View style={{flex: 7, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                            <View style={{marginLeft: 13, flex: 1}}>
                                <Text style={styles.text}>SETTING TIMER</Text>
                            </View>
                            <View style={{marginLeft: 10}}>
                                <DatePicker
                                    style={{width: 100, height: 40, alignItems: 'center',}}
                                    date={this.state.time}
                                    mode="time"
                                    placeholder=" "
                                    is24Hour={false}
                                    format="HH:mm"
                                    hideText={false}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        timeIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        timeInput: {},
                                        dateText: {
                                            color: '#ffffff'
                                        }
                                        // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(time) => {
                                        this.setState({
                                            time: time
                                        });
                                        AsyncStorage.setItem('timer', this.state.time);
                                        this.props.dispatch({type: 'CHANGED'});
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#cccccc', marginTop: 5}}/>
                    <TouchableOpacity onPress={() => {
                        navigate('ChangePassword')
                    }}>
                        <View style={styles.infoContainer}>
                            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                <Icons name="key" size={25} style={{margin: 5}} color="white"/>
                            </View>
                            <View style={{flex: 7, marginLeft: 13, marginTop: 7}}>
                                <Text style={styles.text}>CHANGE PASSWORD</Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                    <View style={{height: 1, backgroundColor: '#cccccc', marginTop: 5}}/>
                    <TouchableOpacity
                        onPress={this.onLogout.bind(this)}
                    >
                        <View style={styles.infoContainer}>
                            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                                <IconFontAwesome name="sign-out" size={25} style={{marginLeft: 5}} color="white"/>
                            </View>

                            <View style={{flex: 7, marginLeft: 13, marginTop: 7}}>
                                <Text style={styles.text}>SIGN OUT</Text>
                            </View>

                        </View>

                    </TouchableOpacity>
                    <View style={{height: 1, backgroundColor: '#cccccc', marginTop: 5}}/>

                </View>
            </View>
        );

    }
}

export default connect()(Profile)
const styles = StyleSheet.create({
    viewHeader: {
        flex: 1,

    },
    timersetting: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        marginTop: 5,

    },
    picture: {
        backgroundColor: '#495669',
        borderWidth: 1,
        borderTopColor: 'white',
        borderBottomColor: 'white'
    },
    imageProfile: {
        marginTop: 20,
        marginLeft: 16,
        width: 50,
        height: 50
    },
    text: {
        color: 'white',
        marginTop: 5,
        marginBottom: 5,
    }
});