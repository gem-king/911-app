import React, {Component} from 'react'
import {
    ListView,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    StyleSheet,
    Image,
    FlatList,
    TouchableHighlight,
    ActivityIndicator,
    NetInfo

} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import {URL, URL_FOLDER, URL_TIMEFINISH} from "../components/const";
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
var widthInput = 0;
var sizeText = 0;
var sizeText1 = 0;
var sizeText2 = 0;
var sizeWidth = 0;
var sizeHeight = 0;
var sizeLayout = 0;
if (DEVICE_WIDTH >= 500) {
    widthInput = DEVICE_WIDTH * 4 / 5;
    sizeText = 20;
    sizeText1 = 18;
    sizeText2 = 14;
    sizeWidth = 60;
    sizeHeight = 60;
    sizeLayout = 85;
} else {
    widthInput = DEVICE_WIDTH - 40;
    sizeText = 16;
    sizeText1 = 14;
    sizeText2 = 10;
    sizeWidth = 40;
    sizeHeight = 40;
    sizeLayout = 72;
}

export default class MyFolder extends Component{

    static navigationOptions = ({ navigation}) => {
        const {state} = navigation;
        return {
            headerLeft:
                <TouchableOpacity onPress={() => {
                    navigation.navigate('DrawerOpen')
                }}>
                    <Icon name="menu" size={30} style={{marginLeft: 7}} color="white"></Icon>
                </TouchableOpacity>
        }

    }
    constructor(props) {
        super(props);
        this.state = {
            dataSource:'',
            isLoading : true,
            refresh : false,
            page : 0,
            net: null
        }

    }


    componentWillMount () {
        this.fetchData();
    }

    onReload = (stateReload) =>{

        if(stateReload){
            this.fetchData();
        }

    };
    fetchData = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({net:isConnected});
            if (this.state.net == true)
            {
                AsyncStorage.getItem('token').then((value) => {
                    fetch(URL + URL_FOLDER+ "&page=0&size=1000", {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response) => response.json())
                        .then((data4) => {
                            this.setState({
                                isLoading: false,
                                dataSource: data4.content,
                            });
                        })
                        .catch((error)=>{console.log(error)})
                });
                NetInfo.isConnected.addEventListener(
                    'connectionChange',
                    handleFirstConnectivityChange.bind(this)
                );
            }
            if(this.state.net == false)
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
            }if(this.state.net == false) {
                // alert("Network request failed")
                NetInfo.isConnected.addEventListener(
                    'connectionChange',
                    handleFirstConnectivityChange.bind(this)
                );
            }
            console.log("network2",this.state.net);
        }
    }

    mTime(time){
        var myDate = new Date(time);

        var timeZone = myDate.getTimezoneOffset();
        timeZone = timeZone / (-60);
        var mMili = myDate.getTime()-timeZone*3600*1000;
        myDate = new Date(mMili);
        var myHour = myDate.getHours();
        var amPM = ((myHour >= 12) ? "PM" : "AM");
        myHour = ((myHour>12)? myHour-12 : myHour);
        myHour = ((myHour<10)?("0"+myHour):myHour);
        var myMin = ((myDate.getMinutes())<10?("0"+myDate.getMinutes()): myDate.getMinutes());
        return myTime = myHour+":"+myMin+" "+amPM;
    }

    mDate(date){
        var myDate = new Date(date);
        var timeZone = myDate.getTimezoneOffset();
        timeZone = timeZone / (-60);
        var mMili = myDate.getTime()-timeZone*3600*1000;
        myDate = new Date(mMili);
        var myYear = myDate.getFullYear();
        var myMonth = ((myDate.getMonth()+1)<10?("0"+(myDate.getMonth()+1)):(myDate.getMonth()+1));
        var myDay = myDate.getDate();
        var startDate = myMonth+"-"+myDay+"-"+myYear;
        return startDate
    }

    showTime(name, myTime) {
        var n = name.indexOf("DOC");
        console.log("nnnnnnnnnnnnnnnn",n);
        if (n > -1) {
            return "";
        } else {
            return this.mTime(myTime)
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1,justifyContent:'center', alignItems: 'center', backgroundColor: "#718792"}}>
                    <ActivityIndicator size="large" color="white"/>
                </View>
            );
        }
        return (
            <View style = {{flex:1, backgroundColor: "#718792"}}>
                <FlatList
                    refreshing = {this.state.refresh}
                    onRefresh = {()=>  {this.fetchData()}}
                    data={this.state.dataSource}
                    renderItem={({item}) =>
                        <TouchableOpacity onPress = {()=> {this.props.navigation.navigate('DetailsFolder', {dataShedule: item,stateReload:this.onReload,
                            id: item.id,
                            depart: item.noiDepartmentId,
                            custo: item.noiCustomerId,
                            clinic: item.noiClinicVenueId
                        })}}>
                            <View style = {{backgroundColor: "#718792", flex:1}}>
                                <View style={styles.container}>
                                    <View style = {{flex:1, alignItems: 'center',
                                        justifyContent: 'center',}}>
                                        <View style={styles.imgColor}>
                                            <Text style={{fontWeight: 'bold', color: 'white', fontSize: sizeText}}>{(item.noiLanguageName).slice(0, 3)}</Text>
                                        </View>
                                    </View>
                                    <View style = {styles.container2}>
                                        <Text style={{fontWeight: 'bold', fontSize: sizeText1, marginTop:10, color: '#D2232A'}}>{item.appNbr}</Text>
                                        <Text style={{fontSize: sizeText2, color: 'black'}}>{this.mDate(item.timeOfService)}</Text>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{fontSize: sizeText2,flex:2, color: 'black'}}>{this.showTime(item.appNbr, item.timeOfService)}</Text>
                                            <Text style={{fontSize: sizeText2, flex:1, color: 'black'}}>{item.noiCustomerName}</Text>

                                        </View>

                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => index}

                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 10,
    },
    iconn: {
        marginLeft:5,
    },
    container:{
        flex:1,
        marginLeft:10,
        marginTop: 5,
        marginRight:10,
        marginBottom: 5,
        backgroundColor:'#d9d9d9',
        borderRadius: 10,
        height: sizeLayout,
        flexDirection:'row',

    },
    imgColor: {
        width: sizeWidth,
        height: sizeHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D2232A',
    },
    container2: {
        flex: 4,
        // backgroundColor:'green'
    }

});