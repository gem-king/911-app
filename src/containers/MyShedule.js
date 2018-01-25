import React, {Component} from 'react'
import {
    ListView,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    NativeModules,
    Picker,
    StatusBar,
    Platform, BackHandler,
    TouchableWithoutFeedback,
    NetInfo

} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import {URL, URL_SHEDULE, URL_TIMEFINISH} from "../components/const";
import {connect} from 'react-redux';

var AlarmIOS = NativeModules.AlarmModuleIos;
var AlarmAndroid = NativeModules.AlarmAndroid;

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


class MyShedule extends Component {
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {

            headerLeft: <TouchableOpacity onPress={() => {
                navigation.navigate('DrawerOpen')
            }}>
                <Icon name="menu" size={30} style={{marginLeft: 7}} color="white"/>
            </TouchableOpacity>
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: '',
            isLoading: true,
            refresh: false,
            page: 0,
            time: '8-30',
            net: null
        };

        AsyncStorage.getItem('timer').then((timer) => {
            if (timer === null) {
                //console.log("data timer is null");
                this.setState({
                    ...this.setState,
                    time: '8-30',
                });
            }
            else {
                this.setState({
                    ...this.setState,
                    time: timer,
                })
            }
        }).catch((error) => console.log("Error timer from MyShedule")).done();
    }

    componentWillMount() {
        this.fetchData();
    }

    onReload = (stateReload) => {
        if (stateReload) {
            this.fetchData();
        }

    };

    fillterColor(mang) {
        // console.log('mang', mang)
        let currentDay = new Date().getDate();
        // console.log('ngay', currentDay)
        let currentMonth = new Date().getMonth() + 1;
        // console.log('thang', currentMonth)
        let currentYear = new Date().getFullYear();
        // console.log('nam', currentYear)

        for (let i = 0; i < mang.length; i++) {
            mang[i].status = true;
            let dateItem = new Date(mang[i].timeOfService).getDate();
            // console.log('date', dateItem)
            let monthItem = new Date(mang[i].timeOfService).getMonth() + 1;
            // console.log('month', monthItem)
            let yearItem = new Date(mang[i].timeOfService).getFullYear();
            // console.log('year', yearItem)
            if (currentYear = yearItem) {
                if (currentMonth > monthItem) {

                    mang[i].status = false;

                }
                if (currentYear = monthItem && currentDay >= dateItem) {
                    mang[i].status = false;
                }
            }
            if (currentYear > yearItem) {
                mang[i].status = false;
            }
        }
        return mang;

    }

    fetchData = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({net:isConnected});
            if (this.state.net == true)
            {
                AsyncStorage.getItem('token').then((value) => {
                    fetch((URL + URL_SHEDULE + "&page=0&size=1000"), {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response) => response.json())
                        .then((data4) => {
                            console.log("f1", data4.content);
                            let arrData = this.fillterColor(data4.content);
                            this.setState({
                                ...this.state,
                                isLoading: false,
                                dataSource: arrData,
                            })

                            console.log('mang', this.state.dataSource)
                            this.excuceAlarm();
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                });
                NetInfo.isConnected.addEventListener(
                    'connectionChange',
                    handleFirstConnectivityChange.bind(this)
                );
            }
            if(this.state.net == false)
            {
                alert("Network request failed")
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

    fillterData(content, currentDay, currentMotnh, currentYear) {
        let array = [];
        for (let i = 0; i < content.length; i++) {
            let dateItem = new Date(content[i].timeOfService)
            console.log('wtf', dateItem)
            if (array.length == 0) {
                array.push({
                    day: dateItem.getDate(),
                    month: dateItem.getMonth() + 1,
                    year: dateItem.getFullYear(),
                })
            }
            else {
                let isAdd = true;

                for (let j = 0; j < array.length; j++) {
                    if (array[j].day === dateItem.getDate()) {
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    array.push({
                        day: dateItem.getDate(),
                        month: dateItem.getMonth() + 1,
                        year: dateItem.getFullYear(),
                    })
                }
            }
        }
        for (let k = 0; k < array.length; k++) {
            let n = array[k].day;
            let dem = 0;
            for (let i = 0; i < content.length; i++) {
                let ngay = new Date(content[i].timeOfService)
                if (ngay.getDate() === n) {
                    dem++
                }
            }
            array[k] = {apointment: dem, ...array[k]}
        }
        console.log("arr__", array);
        return array;

    }

    excuceAlarm() {
        console.log("exe alarm");
        let currentDay = new Date().getDate();
        let currentMotnh = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();

        //start fillter data
        let arrayFillter = this.fillterData(this.state.dataSource, currentDay, currentMotnh, currentYear);
        // start alarm
        this.startScheduceAlarm(arrayFillter, currentDay, currentMotnh, currentYear);

    }

    startScheduceAlarm(array, currentDay, currentMotnh, currentYear) {

        let time = this.state.time;
        let hour = time.slice(0, time.indexOf(':'));
        let minute = time.slice(time.indexOf(':') + 1, time.length);
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                let item = array[i];
                if (parseInt(item.day) > parseInt(currentDay) && parseInt(item.month) >= parseInt(currentMotnh) && parseInt(item.year) >= parseInt(currentYear)) {

                    console.log("da vao bao thuc");
                    console.log("month pass: ", item.month);
                    let key = item.day + "" + item.month + "" + item.year;
                    let body = "Tomorrow you have " + item.apointment + " apointment.";
                    let beforday = item.day;
                    let beforMonth = item.month;
                    let beforYear = item.year;
                    if (beforday == 1 && beforMonth == 1) {
                        beforMonth = 12;
                        beforYear = beforMonth - 1;
                    }

                    else if (beforday == 1) {
                        beforMonth = beforMonth - 1;
                        var d = new Date(beforYear, beforMonth, 0);
                        beforday = d.getDay();
                        beforMonth = d.getMonth();


                    } else {
                        beforday--;
                    }


                    if (Platform.OS === "ios") {
                        // AlarmIOS.createAlarmIOS(13,33,2017,10,18,key,"Reminder",body);
                        AlarmIOS.createAlarmIOS(parseInt(hour), parseInt(minute), beforYear, beforMonth, beforday, key, "Reminder", body);
                    } else {

                        AlarmAndroid.createAlarm(parseInt(hour), parseInt(minute), beforYear, beforMonth, beforday, key, "Reminder", body);
                        // AlarmAndroid.createAlarm(hour,minute,item.year,item.month,item.day,key,"Reminder",body);
                    }
                }
            }
        }

    }

    mTime(time) {
        var myDate = new Date(time);

        var timeZone = myDate.getTimezoneOffset();
        timeZone = timeZone / (-60);
        var mMili = myDate.getTime()-timeZone*3600*1000;
        myDate = new Date(mMili);
        var myHour = myDate.getHours();
        var amPM = ((myHour >= 12) ? "PM" : "AM");
        myHour = ((myHour > 12) ? myHour - 12 : myHour);
        myHour = ((myHour < 10) ? ("0" + myHour) : myHour);
        var myMin = ((myDate.getMinutes()) < 10 ? ("0" + myDate.getMinutes()) : myDate.getMinutes());
        return myTime = myHour + ":" + myMin + " " + amPM;
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
        // console.log("nnnnnnnnnnnnnnnn",n);
        if (n > -1) {
            return "";
        } else {
            return this.mTime(myTime)
        }
    }

    render() {

        if (this.props.isApply) {
            this.fetchData();
            this.props.dispatch({type: 'CANCEL_APPLY'});
        }
        if (this.props.isTimeChanged) {
            AsyncStorage.getItem('timer').then((timer) => {

                if (timer === null) {
                    //console.log("data timer is null");
                    this.setState({
                        ...this.setState,
                        time: '8-30',
                    });
                }
                else {
                    this.setState({
                        ...this.setState,
                        time: timer,
                    })
                    this.excuceAlarm();
                    this.props.dispatch({type: 'CANCEL_CHANGED'});
                }
            }).catch((error) => console.log("Error timer from MyShedule")).done();


        }
        if (this.state.isLoading) {
            return (

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#718792"}}>
                    <ActivityIndicator size="large" color='white'/>
                </View>
            );
        }

        return (
            <View style={{flex: 1, backgroundColor: "#718792"}}>
                <FlatList
                    // onEndReached  = {this.fetchData.bind(this)}
                    // onEndReachedThreshold ={0.2}
                    refreshing={this.state.refresh}
                    onRefresh={() => {
                        this.setState({page: 0});
                        this.fetchData()
                    }}
                    data={this.state.dataSource}
                    renderItem={({item}) =>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('Details', {
                                dataShedule: item,
                                stateReload: this.onReload,
                                id: item.id,
                                depart: item.noiDepartmentId,
                                custo: item.noiCustomerId,
                                clinic: item.noiClinicVenueId
                            })
                        }}>
                            {
                                item.status ? <View style={{backgroundColor: "#718792", flex: 1}}>
                                    <View style={styles.container1}>
                                        <View style={{
                                            flex: 1, alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <View style={styles.imgColor}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        fontSize: sizeText
                                                    }}>{(item.noiLanguageName).slice(0, 3)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.container2}>
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: sizeText1,
                                                marginTop: 10,
                                                color: '#D2232A'
                                            }}>{item.appNbr}</Text>
                                            <Text
                                                style={{
                                                    fontSize: sizeText2,
                                                    color: 'black'
                                                }}>{this.mDate(item.timeOfService)}</Text>
                                            <View style={{flexDirection: 'row', marginTop: 4}}>
                                                <Text style={{
                                                    fontSize: sizeText2,
                                                    flex: 2,
                                                    color: 'black'
                                                }}>{this.showTime(item.appNbr, item.timeOfService)}</Text>

                                                <Text style={{
                                                    fontSize: sizeText2,
                                                    flex: 1,
                                                    marginLeft: 30,
                                                    color: 'black'
                                                }}>{item.noiCustomerName}</Text>
                                            </View>

                                        </View>
                                    </View>
                                </View> : <View style={{backgroundColor: "#718792", flex: 1}}>
                                    <View style={styles.container}>
                                        <View style={{
                                            flex: 1, alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <View style={styles.imgColor}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        fontSize: sizeText
                                                    }}>{(item.noiLanguageName).slice(0, 3)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.container2}>
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: sizeText1,
                                                marginTop: 10,
                                                color: '#D2232A'
                                            }}>{item.appNbr}</Text>
                                            <Text
                                                style={{
                                                    fontSize: sizeText2,
                                                    color: 'black'
                                                }}>{this.mDate(item.timeOfService)}</Text>
                                            <View style={{flexDirection: 'row', marginTop: 4}}>
                                                <Text style={{
                                                    fontSize: sizeText2,
                                                    flex: 2,
                                                    color: 'black'
                                                }}>{this.showTime(item.appNbr, item.timeOfService)}</Text>
                                                <Text style={{
                                                    fontSize: sizeText2,
                                                    flex: 1,
                                                    marginLeft: 30,
                                                    color: 'black'
                                                }}>{item.noiCustomerName}</Text>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            }


                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => index}

                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log('state', state);
    return {
        isApply: state.isApply,
        isTimeChanged: state.isTimeChanged
    };
}

export default connect(mapStateToProps)(MyShedule);
const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 10,
    },
    iconn: {
        marginLeft: 5,
    },
    container: {
        flex: 1,
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10,
        marginBottom: 5,
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        height: sizeLayout,
        flexDirection: 'row',

    },
    container1: {
        flex: 1,
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10,
        marginBottom: 5,
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        height: sizeLayout,
        flexDirection: 'row',

    },
    imgColor: {
        width: sizeHeight,
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