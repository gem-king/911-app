import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    StyleSheet,
    Image,
    ScrollView,
    Button,
    TouchableHighlight,
    TextInput,
    BackHandler,
    ActivityIndicator,
    Alert,
    NetInfo,
    FlatList

} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'
import {
    URL, URL_ACOUNT, URL_BILL, URL_CUSTOMER, URL_DECLINE, URL_IDTIMEFINISH, URL_INTAKE, URL_LOGIN, URL_PAY,
    URL_TIMEFINISH
} from "../components/const";
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";

var {height, width} = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width;

var sizeMap = 0;
if (DEVICE_WIDTH >= 500) {
    sizeMap = 70;
} else {
    sizeMap = 50
}

class DetailsTimeFinish extends Component {

    static navigationOptions = ({ navigation}) => {
        const {state} = navigation;
        return {
            headerLeft:
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Icon name="ios-arrow-back" size={30} style={{marginLeft: 7}} color="white"></Icon>
                </TouchableOpacity>
        }

    };

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            time: '',
            isLoading: true,
            dataSource: '',
            pressStatus: false,
            start: '',
            dura: '',
            duraMin: '',
            dataBill: '',
            dataPay: '',
            isBill: null,
            isPay: null,
            isTime: null,
            diffMin: '',
            checkTime: null,
            success: null,
            finish: '',
            department: '',
            customer: '',
            clinic: '',
            dataStreet: '',
            dataCity: '',
        };

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

    componentWillMount() {
        NetInfo.isConnected.fetch().then((isConnected) => {
            if (isConnected) {
                AsyncStorage.getItem('token').then((value) => {
                    fetch(URL + URL_IDTIMEFINISH + this.props.navigation.state.params.id, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log("data", responseData);
                            this.setState({
                                isLoading: false,
                                dataSource: responseData,
                            });
                        })

                    fetch(URL + URL_BILL + this.props.navigation.state.params.custo, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    }).then((response) => response.json())
                        .then((data) => {

                            console.log("Bill", data);
                            this.setState({
                                dataBill: data
                            })
                        });

                    fetch(URL + URL_PAY + this.props.navigation.state.params.cover, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    }).then((responsePay) => responsePay.json())
                        .then((dataPay) => {
                            console.log("Pay", dataPay);
                            this.setState({
                                dataPay: dataPay
                            })
                        })

                    fetch(URL + "api/noi-departments/" + this.props.navigation.state.params.depart, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response3) => response3.json())
                        .then((responseData3) => {
                            this.setState({
                                department: responseData3
                            })
                        })
                        .done();

                    fetch(URL + URL_CUSTOMER + this.props.navigation.state.params.custo, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response4) => response4.json())
                        .then((responseData4) => {
                            this.setState({
                                customer: responseData4
                            })
                        })
                        .done();

                    fetch(URL + "api/noi-clinic-venues/" + this.props.navigation.state.params.clinic, {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response5) => response5.json())
                        .then((responseData5) => {
                            this.setState({
                                clinic: responseData5
                            })
                        })
                        .done();
                });
            }
            else {
                alert("Network request failed")
            }
        });
    }

    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', () => {
        //     const {navigation} = this.props;
        //     navigation.goBack();
        //     navigation.state.params.stateReload(true);
        //     return true;
        // });
    }

    componentWillUnmount() {
        const {navigation} = this.props;
        navigation.goBack();
        navigation.state.params.stateReload(true);
    }

    _onHideUnderlay() {
        this.setState({pressStatus: false});
    }

    _onShowUnderlay() {
        this.setState({pressStatus: true});
    }

    test = () => {
        console.log()
        return new Promise((resolve, reject) => {
            console.log("dadx", this.state.dataSource.intakeType)
            switch (this.state.dataSource.intakeType) {
                case 0:
                    if (this.state.dataBill.length != 0) {
                        for (i = 0; i < this.state.dataBill.length; i++) {
                            if (this.state.dataBill[i].rateType ==
                                this.state.dataSource.serviceType &&
                                this.state.dataBill[i].active == true) {
                                this.setState({
                                    isBill: true
                                });
                                resolve({result: true});
                                break;
                            }
                            if (this.state.dataBill[i].rateType !=
                                this.state.dataSource.serviceType ||
                                this.state.dataBill[i].active == false
                            ) {
                                this.setState({
                                    isBill: false
                                })
                            }
                        }
                        break;
                    } else {
                        this.setState({
                            isBill: false
                        })
                    }
                case 1:
                    if (this.state.dataBill.length != 0) {
                        for (i = 0; i < this.state.dataBill.length; i++) {
                            if (this.state.dataBill[i].rateType == 4 &&
                                this.state.dataBill[i].active == true) {
                                this.setState({isBill: true})
                                resolve({result: true});
                                break;
                            }
                            if (this.state.dataBill[i].rateType != 4 ||
                                this.state.dataBill[i].active == false
                            ) {
                                this.setState({isBill: false})
                            }
                        }
                        break;
                    } else {
                        this.setState({isBill: false})
                    }

                case 3:
                    if (this.state.dataBill.length != 0) {
                        for (i = 0; i < this.state.dataBill.length; i++) {
                            if (this.state.dataBill[i].rateType == 5 &&
                                this.state.dataBill[i].active == true) {
                                console.log("đã có bill", this.state.dataBill[i].rateType)
                                this.setState({isBill: true})
                                resolve({result: true});
                                break;
                            }
                            if (this.state.dataBill[i].rateType != 5 ||
                                this.state.dataBill[i].active == false
                            ) {
                                this.setState({isBill: false})
                            }
                        }
                        break;
                    } else {
                        this.setState({isBill: false})
                    }
                case 4:
                    if (this.state.dataBill.length != 0) {
                        for (i = 0; i < this.state.dataBill.length; i++) {
                            if (this.state.dataBill[i].rateType == 19
                                && this.state.dataBill[i].active == true) {
                                this.setState({isBill: true})
                                resolve({result: true});
                                break;
                            }
                            if (this.state.dataBill[i].rateType != 19 ||
                                this.state.dataBill[i].active == false
                            ) {
                                this.setState({isBill: false})
                            }
                        }
                        break;
                    } else {
                        this.setState({isBill: false})
                    }
                case 5:
                    if (this.state.dataBill.length != 0) {
                        for (i = 0; i < this.state.dataBill.length; i++) {
                            if (this.state.dataBill[i].rateType == 20 &&
                                this.state.dataBill[i].active == true) {
                                this.setState({isBill: true})
                                resolve({result: true});
                                break;
                            }
                            if (this.state.dataBill[i].rateType != 20 ||
                                this.state.dataBill[i].active == false
                            ) {
                                this.setState({isBill: false})
                            }
                        }
                        break;
                    } else {
                        this.setState({isBill: false})
                    }
            }
        });
    }

    addresss(){
        try{
            if (this.state.dataSource.offSite == true) {
                if (this.state.dataSource.noiDepartmentId != null) {
                    var street = this.state.department.streetAddress + ", " +
                        this.state.department.city + ", " +
                        this.state.department.noiState.name
                    return street
                } else {
                    if (this.state.dataSource.noiClinicVenueId != null) {
                        var street2 = this.state.clinic.streetAddress + ", " +
                            this.state.clinic.city + ", " +
                            this.state.clinic.noiState.name
                        return street2
                    } else {
                        if (this.state.dataSource.noiCustomerId != null) {
                            var street3 = this.state.customer.add1 + ", " +
                                this.state.customer.city + ", " +
                                this.state.customer.noiState.name
                            return street3
                        } else {
                            return null
                        }
                    }
                }
            } else {
                if (this.state.dataSource.streetAdd != null) {
                    var street4 = this.state.dataSource.streetAdd + ", " +
                        this.state.dataSource.city + ", " +
                        this.state.dataSource.noiStateName
                    return street4
                } else {
                    return null
                }
            }
        }catch (ero){
            console.log(ero)
        }
    }

_onPressSave = async () => {

    var myTime= this.state.date;
    console.log(myTime);
    let year = myTime.substring(myTime.lastIndexOf("/")+1, myTime.length).trim();
    let day = myTime.substring(myTime.indexOf("/")+1,myTime.lastIndexOf("/")).trim();
    let month = myTime.substring(0, myTime.indexOf("/")).trim()-1;

    let time =  this.state.time;
    let hour = time.substring(0, time.indexOf(":")).trim();
    let minute = time.substring(time.indexOf(":")+1, time.length).trim();
    // let secFinish = time.substring(time.lastIndexOf(":")+1, time.length).trim();

    var dat1 = new Date(Date.UTC(year, month, day, hour, minute)).toISOString();
    console.log("date",dat1)

    var startTime = new Date(this.state.dataSource.timeOfService);
    var timeZone = startTime.getTimezoneOffset();
    timeZone = timeZone / (-60);

    var myTime2 = this.state.date + " " + this.state.time;
    var dat = new Date(myTime2).toString();
    var date = new Date(dat);

    var diff1 = date.getTime() - startTime.getTime() + timeZone * 3600000;

    if (this.state.time == '' || this.state.date == '') {
        this.setState({
            isTime: false,
            isLoading: false
        })
    } else {
        this.setState({isTime: true})
        if (diff1 <= 0) {
            console.log("giờ", diff1)
            this.setState({
                checkTime: true,
                isLoading: false
            })
        } else {
            console.log("đã đến", this.state.dataSource.intakeType)
            this.setState({checkTime: false})
            switch (this.state.dataSource.intakeType) {
                case 0:
                    if (this.state.dataPay.length != 0) {
                        for (i = 0; i < this.state.dataPay.length; i++) {
                            if (this.state.dataPay[i].rateType ==
                                this.state.dataSource.serviceType &&
                                this.state.dataPay[i].active == true) {
                                this.setState({
                                    isPay: true
                                });
                                break;
                            }
                            if (this.state.dataPay[i].rateType !=
                                this.state.dataSource.serviceType ||
                                this.state.dataPay[i].active == false
                            ) {
                                this.setState({
                                    isPay: false
                                })
                            }
                        }
                        break;
                    } else {
                        this.setState({
                            isPay: false
                        })
                    }
                case 1:
                    if (this.state.dataPay.length != 0) {
                        for (i = 0; i < this.state.dataPay.length; i++) {
                            if (this.state.dataPay[i].rateType == 4 &&
                                this.state.dataPay[i].active == true) {
                                this.setState({
                                    isPay: true
                                });
                                break;
                            }
                            if (this.state.dataPay[i].rateType != 4 ||
                                this.state.dataPay[i].active == false
                            ) {
                                this.setState({
                                    isPay: false
                                })
                            }
                        }
                        break;
                    } else {
                        this.setState({
                            isPay: false
                        })
                    }
                case 3:
                    console.log("da vao 3")
                    console.log("da vao 4",this.state.dataPay)
                    console.log("da vao 5",this.state.dataPay[0].rateType)

                    if (this.state.dataPay.length != 0) {
                        for (i = 0; i < this.state.dataPay.length; i++) {
                            console.log("5 abc ", this.state.dataPay[i].rateType)
                            if (this.state.dataPay[i].rateType == 5 &&
                                this.state.dataPay[i].active == true) {
                                this.setState({
                                    isPay: true
                                });
                                break;
                            }
                            if (this.state.dataPay[i].rateType != 5 ||
                                this.state.dataPay[i].active == false
                            ) {
                                this.setState({
                                    isPay: false
                                })
                            }
                        }
                        break;
                    } else {
                        this.setState({
                            isPay: false
                        })
                    }
                case 4:
                    if (this.state.dataPay.length != 0) {
                        for (i = 0; i < this.state.dataPay.length; i++) {
                            if (this.state.dataPay[i].rateType == 19 &&
                                this.state.dataPay[i].active == true) {
                                this.setState({
                                    isPay: true
                                });
                                break;
                            }
                            if (this.state.dataPay[i].rateType != 19 ||
                                this.state.dataPay[i].active == false
                            ) {
                                this.setState({
                                    isPay: false
                                })
                            }
                        }
                        break;
                    } else {
                        this.setState({
                            isPay: false
                        })
                    }
                case 5:
                    if (this.state.dataPay.length != 0) {
                        for (i = 0; i < this.state.dataPay.length; i++) {
                            if (this.state.dataPay[i].rateType == 20 &&
                                this.state.dataPay[i].active == true) {
                                this.setState({
                                    isPay: true
                                });
                                break;
                            }
                            if (this.state.dataPay[i].rateType != 20 ||
                                this.state.dataPay[i].active == false
                            ) {
                                this.setState({
                                    isPay: false
                                })
                            }
                        }
                        break;
                    } else {
                        this.setState({
                            isPay: false
                        })
                    }
            }
            this.test().then(data=>{
                console.log("đã có kq", data.result)
                if(data.result){

                    if (this.state.isBill == true && this.state.isPay == true && diff1 > 0) {
                        console.log("đã có kq2", data.result)
                        if (this.state.time != null && this.state.date != null) {
                            this.setState({finish: true})
                        } else {
                            this.setState({finish: false})
                        }

                        var factor = Math.pow(10, 3);

                        this.setState({dura: Math.round((diff1 / (3600 * 1000)) * factor) / factor});
                        this.setState({duraMin: Math.round((diff1 / (60 * 1000)) * factor) / factor});

                        NetInfo.isConnected.fetch().then((isConnected) => {
                            if ( isConnected )
                            {
                                AsyncStorage.getItem('token').then((value) => {
                                    console.log('detailTime', value);

                                    fetch(URL + URL_INTAKE, {
                                        method: "PUT",
                                        headers: {
                                            'Authorization': value,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            finishTime: dat1,
                                            timeOfService : this.state.dataSource.timeOfService,
                                            id: this.state.dataSource.id,
                                            noiCustomerId : this.state.dataSource.noiCustomerId,
                                            noiLanguageId : this.state.dataSource.noiLanguageId,
                                            intakeType: this.state.dataSource.intakeType,
                                        })
                                    })
                                        .then((response) => response.text())
                                        .then((dataTake) => {
                                            console.log("send",dataTake)
                                            this.setState({
                                                success: true
                                            })
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                        })

                                });
                            }
                            else
                            {
                                alert("Network request failed")
                            }
                        });
                    }
                }
            })

        }
    }



}

showBill()
{

    if (this.state.isTime == false) {

        return (
            <View style={{
                backgroundColor: '#ffcdd2', borderColor: '#524c00',
                borderRadius: 5,
                justifyContent: 'center',
                borderWidth: 1, margin: 5, padding: 10
            }}>
                <Text style={{color: '#e60017'}}>
                    Please Enter Required Information!
                </Text>
            </View>
        );
    }
    if (this.state.isBill == false || this.state.isPay == false) {
        return (
            <View style={{
                backgroundColor: '#ffcdd2', borderColor: '#524c00',
                borderRadius: 5,
                justifyContent: 'center',
                borderWidth: 1, margin: 5, padding: 10
            }}>
                <Text style={{color: '#e60017'}}>
                    Failed to automatically add pay & bill items since there is no rate available. Please add
                    rates matching this service type then try again!
                </Text>
            </View>
        );
    }
    if (this.state.checkTime == true) {
        return (
            <View style={{
                backgroundColor: '#ffcdd2', borderColor: '#524c00',
                borderRadius: 5,
                justifyContent: 'center',
                borderWidth: 1, margin: 5, padding: 10
            }}>
                <Text style={{color: '#e60017'}}>
                    Wrong Time Finish, must be greater than Start Date and Time
                </Text>
            </View>
        );
    }
    if (this.state.success == true) {

        return (
            <View style={{
                backgroundColor: '#b3ffb3', borderColor: '#524c00',
                borderRadius: 5,
                justifyContent: 'center',
                borderWidth: 1, margin: 5, padding: 10
            }}>
                <Text style={{color: '#006600'}}>
                    Successfully Time Finished Appointment!
                </Text>
            </View>
        );
    }
    else {
        return null
    }
}

_onPressBack = () => {
    const {navigation} = this.props;
    console.log("navigation", navigation);
    navigation.goBack();
    navigation.state.params.stateReload(true);
    // this.props.dispatch({type:'APPLY'});
};

serviceType(name)
{
    if (name.indexOf("ODTI") > -1) {
        return "On-demand Telephone Interpretation";
    }
    if (name.indexOf("ODVI") > -1) {
        return "On-demand Video Interpretation";
    }
    if (name.indexOf("TI") >-1) {
        return "Telephone Interpretation - Scheduled";
    }
    if (name.indexOf("VI")>-1) {
        return "Video Interpretation - Scheduled";
    }
    else {
        return "Regular On-site Interpretation";
    }
}

genderRequest(gender)
{
    if (gender == 1) {
        return "Male";
    }
    if (gender == 2) {
        return "Female"
    }
    else {
        return "";
    }
}

typeOfCall(call)
{
    if (call == 1) {
        return "Tel Conference";
    }
    if (call == 2) {
        return "Tel Confirm"
    }
    else {
        return "";
    }
}

actualDura()
{
    if (this.state.isTime == true) {
        return this.state.dura
    } else {
        return null
    }
}

actualDuraMin()
{
    if (this.state.isTime == true) {
        return this.state.duraMin
    } else {
        return null
    }
}

loca()
{
    if (this.state.dataSource.location != null && this.state.dataSource.location != "") {
        return this.state.dataSource.location + ", "
    } else {
        return null
    }
}

finishTimeDate()
{

    var myTime = this.state.date + " " + this.state.time;
    // var dt  = myTime.split(/\-|\s/);
    var dat = new Date(myTime).toString();

    var dat1 = new Date(dat);

    var myTime2 = new Date(dat1);
    var timeType, minutes, fullTime;
    var myHours = myTime2.getHours();
    if (myHours <= 11) {
        timeType = 'AM'
    } else {
        timeType = 'PM'
    }

    if (myHours > 12) {
        myHours = myHours - 12;
    }
    if (myHours == 0) {
        myHours = 12;
    }
    if (myHours < 10) {
        myHours = '0' + myHours.toString()
    }
    minutes = myTime2.getMinutes();
    // Checking if the minutes value is less then 10 then add 0 before minutes.
    if (minutes < 10) {
        minutes = '0' + minutes.toString();
    }
    // Adding all the variables in fullTime variable.
    fullTime = myHours.toString() + ':' + minutes.toString() + ' ' + timeType.toString()

    if (this.state.finish == true) {
        return this.state.date + ", " + fullTime
    } else {
        return null
    }
}

location()
{
    try {
        if (this.state.dataSource.offSite == true) {
            if (this.state.dataSource.noiDepartmentId != null) {
                var street = this.state.department.streetAddress + ", " +
                    this.state.department.city + ", " +
                    this.state.department.noiState.name + ", " +
                    this.state.department.zipPostalCode;
                return street
            } else {
                if (this.state.dataSource.noiClinicVenueId != null) {
                    var street2 = this.state.clinic.streetAddress + ", " +
                        this.state.clinic.city + ", " +
                        this.state.clinic.noiState.name + ", " +
                        this.state.clinic.zip;
                    return street2
                } else {
                    if (this.state.dataSource.noiCustomerId != null) {
                        var street3 = this.state.customer.add1 + ", " +
                            this.state.customer.city + ", " +
                            this.state.customer.noiState.name + ", " +
                            this.state.customer.zipCode;
                        return street3
                    } else {
                        return null
                    }
                }
            }
        } else {
            if (this.state.dataSource.streetAdd != null) {
                var street4 = this.state.dataSource.streetAdd + ", " +
                    this.state.dataSource.aptSuite+", "+
                    this.state.dataSource.city + ", " +
                    this.state.dataSource.noiStateName + ", " +
                    this.state.dataSource.zipCode;
                return street4
            } else {
                return null
            }
        }
    } catch (ero) {
        console.log(ero)
    }
}

notes(){
        if(this.state.dataSource.subject != "" && this.state.dataSource.body != ""){
            return this.state.dataSource.subject+", " +this.state.dataSource.body
        }else{
            return null
        }
    }

hideView = (name)=>
{

    const {params} = this.props.navigation.state;

    var startTime = this.state.dataSource.timeOfService;
    var myDate = new Date(startTime);

    var timeZone = myDate.getTimezoneOffset();
    timeZone = timeZone / (-60);
    var mMili = myDate.getTime() - timeZone * 3600 * 1000;
    myDate = new Date(mMili);
    var myYear = myDate.getFullYear();
    var myMonth = ((myDate.getMonth() + 1) < 10 ? ("0" + (myDate.getMonth() + 1)) : (myDate.getMonth() + 1));
    var myDay = myDate.getDate();
    var myHour = myDate.getHours();
    var amPM = ((myHour >= 12) ? "PM" : "AM");
    myHour = ((myHour > 12) ? myHour - 12 : myHour);
    myHour = ((myHour < 10) ? ("0" + myHour) : myHour);
    var myMin = ((myDate.getMinutes()) < 10 ? ("0" + myDate.getMinutes()) : myDate.getMinutes());
    var myTimeStart = myMonth + "/" + myDay + "/" + myYear + ", " + myHour + ":" + myMin + " " + amPM;

    var startDate = myMonth + "-" + myDay + "-" + myYear;

    var a = this.state.dataSource.serviceRecipients + '';
    console.log('ghđ', a)

    var obj = JSON.parse(a)

    if (name.indexOf("ODTI") > -1 || name.indexOf("ODVI") > -1) {
        return (
            <View style={{flex:1}}>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Number: {this.state.dataSource.appNbr}</Text>
                </View>
                <View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Covered By</Text>
                            <Text
                                style={styles.textin}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Service Type</Text>
                            <Text style={styles.textin}>{this.serviceType(params.dataShedule.appNbr)}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Start Date & Time</Text>
                            <Text style={styles.textin}>{myTimeStart}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Estimated Duration (minutes)</Text>
                            <Text style={styles.textin}>{this.state.dataSource.duration}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Finish Date</Text>
                            <DatePicker
                                style={{width: 150}}
                                date={this.state.date}
                                mode="date"
                                placeholder=" "
                                format="MM/DD/YYYY"
                                minDate={startDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                // iconSource={require('./google_calendar.png')}
                                onDateChange={(date) => {
                                    this.setState({date: date});
                                }}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Actual Duration (minutes)</Text>
                            <Text style={styles.textin}>{this.actualDuraMin()}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Time</Text>
                            <View style={{flexDirection: 'row'}}>
                                <DatePicker
                                    style={{width: 150}}
                                    date={this.state.time}
                                    mode="time"
                                    placeholder=" "
                                    format="HH:mm"
                                    is24Hour={false}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    minuteInterval={10}
                                    onDateChange={(time) => {
                                        this.setState({time: time});
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {this.showBill()}
                    <View style={styles.viewLine}>
                        <TouchableOpacity onPress={this._onPressSave}>
                            <View style={styles.pooleantrue1}>
                                <Text style={{color: 'white'}}>Save</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableHighlight
                            activeOpacity={1}
                            onPress={this._onPressBack}
                            style={this.state.pressStatus ? styles.forgot2 : styles.forgot1}
                            onHideUnderlay={this._onHideUnderlay.bind(this)}
                            onShowUnderlay={this._onShowUnderlay.bind(this)}
                        >

                            <Text style={this.state.pressStatus ? styles.text2 : styles.text}>Back</Text>
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Requester Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Customer</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiCustomerName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiClinicVenueName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Sub-department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiDepartmentName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Name</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Email</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterEmail}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Requester Phone</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterPhone}</Text>
                    </View>
                </View>


                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Appointment Number</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.appNbr}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Start Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{myTimeStart}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Finish Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.finishTimeDate()}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Connection Time (seconds)</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.connectionTime}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Duration (minutes)</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.duration}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Language</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textR}>{this.state.dataSource.noiLanguageName}</Text>
                    </View>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Interpreter Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Interpreter Assigned</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                    </View>
                </View>
            </View>
        );
    }
    if (name.indexOf("TI") > -1) {
        return (
            <View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Number: {this.state.dataSource.appNbr}</Text>
                </View>
                <View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Covered By</Text>
                            <Text
                                style={styles.textin}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Service Type</Text>
                            <Text style={styles.textin}>{this.serviceType(params.dataShedule.appNbr)}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Start Date & Time</Text>
                            <Text style={styles.textin}>{myTimeStart}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Estimated Duration (minutes)</Text>
                            <Text style={styles.textin}>{this.state.dataSource.duration}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Finish Date</Text>
                            <DatePicker
                                style={{width: 150}}
                                date={this.state.date}
                                mode="date"
                                placeholder=" "
                                format="MM/DD/YYYY"
                                minDate={startDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                // iconSource={require('./google_calendar.png')}
                                onDateChange={(date) => {
                                    this.setState({date: date});
                                }}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Actual Duration (minutes)</Text>
                            <Text style={styles.textin}>{this.actualDuraMin()}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Time</Text>
                            <View style={{flexDirection: 'row'}}>
                                <DatePicker
                                    style={{width: 150}}
                                    date={this.state.time}
                                    mode="time"
                                    placeholder=" "
                                    format="HH:mm"
                                    is24Hour={false}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    minuteInterval={10}
                                    onDateChange={(time) => {
                                        this.setState({time: time});
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {this.showBill()}
                    <View style={styles.viewLine}>
                        <TouchableOpacity onPress={this._onPressSave}>
                            <View style={styles.pooleantrue1}>
                                <Text style={{color: 'white'}}>Save</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableHighlight
                            activeOpacity={1}
                            onPress={this._onPressBack}
                            style={this.state.pressStatus ? styles.forgot2 : styles.forgot1}
                            onHideUnderlay={this._onHideUnderlay.bind(this)}
                            onShowUnderlay={this._onShowUnderlay.bind(this)}
                        >

                            <Text style={this.state.pressStatus ? styles.text2 : styles.text}>Back</Text>
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Requester Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Customer</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiCustomerName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiClinicVenueName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Sub-department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiDepartmentName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Name</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Email</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterEmail}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Requester Phone</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterPhone}</Text>
                    </View>
                </View>


                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Appointment Number</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.appNbr}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Cover By</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Start Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{myTimeStart}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Finish Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.finishTimeDate()}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Duration (minutes)</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.duration}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Language</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiLanguageName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Type of Call</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.typeOfCall(this.state.dataSource.callType)}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Appointment Notes</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text
                            style={styles.textR}>{this.notes()}</Text>
                    </View>
                </View>
                <View style={{marginBottom: 16}}>
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTille}>Service Recipient Information</Text>
                    </View>
                    <ScrollView
                        directionalLockEnabled={false}
                        horizontal={true}
                        style={{borderColor: '#E0E0E0', borderWidth: 1, margin: 5}}>

                        <View style={{backgroundColor: 'white'}}>
                            <View style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                backgroundColor: '#eeeeee',
                                borderBottomColor: '#E0E0E0',
                                paddingBottom: 5,
                                paddingTop: 5,
                                borderBottomWidth: 1
                            }}>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Last Name
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        First Name
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Home Phone
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Work Phone
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Cell Phone
                                    </Text>
                                </View>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                paddingBottom: 2,
                                justifyContent: 'center',
                                paddingTop: 2,
                            }}>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.lastName}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.firstName}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.homePhone}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.workPhone}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.cellPhone}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
    if (name.indexOf("VI") >-1) {
        return (
            <View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Number: {this.state.dataSource.appNbr}</Text>
                </View>
                <View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Covered By</Text>
                            <Text
                                style={styles.textin}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Service Type</Text>
                            <Text style={styles.textin}>{this.serviceType(params.dataShedule.appNbr)}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Start Date & Time</Text>
                            <Text style={styles.textin}>{myTimeStart}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Estimated Duration (minutes)</Text>
                            <Text style={styles.textin}>{this.state.dataSource.duration}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Finish Date</Text>
                            <DatePicker
                                style={{width: 150}}
                                date={this.state.date}
                                mode="date"
                                placeholder=" "
                                format="MM/DD/YYYY"
                                confirmBtnText="Confirm"
                                minDate={startDate}
                                cancelBtnText="Cancel"
                                // iconSource={require('./google_calendar.png')}
                                onDateChange={(date) => {
                                    this.setState({date: date});
                                }}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Actual Duration (minutes)</Text>
                            <Text style={styles.textin}>{this.actualDuraMin()}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Time</Text>
                            <View style={{flexDirection: 'row'}}>
                                <DatePicker
                                    style={{width: 150}}
                                    date={this.state.time}
                                    mode="time"
                                    placeholder=" "
                                    format="HH:mm"
                                    is24Hour={false}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    minuteInterval={10}
                                    onDateChange={(time) => {
                                        this.setState({time: time});
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {this.showBill()}
                    <View style={styles.viewLine}>
                        <TouchableOpacity onPress={this._onPressSave}>
                            <View style={styles.pooleantrue1}>
                                <Text style={{color: 'white'}}>Save</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableHighlight
                            activeOpacity={1}
                            onPress={this._onPressBack}
                            style={this.state.pressStatus ? styles.forgot2 : styles.forgot1}
                            onHideUnderlay={this._onHideUnderlay.bind(this)}
                            onShowUnderlay={this._onShowUnderlay.bind(this)}
                        >

                            <Text style={this.state.pressStatus ? styles.text2 : styles.text}>Back</Text>
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Requester Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Customer</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiCustomerName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiClinicVenueName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Sub-department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiDepartmentName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Name</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Email</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterEmail}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Requester Phone</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterPhone}</Text>
                    </View>
                </View>


                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Appointment Number</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.appNbr}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Cover By</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Start Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{myTimeStart}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Finish Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.finishTimeDate()}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Duration (minutes)</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.duration}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Language</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiLanguageName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Type of Call</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.typeOfCall(this.state.dataSource.callType)}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Appointment Notes</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text
                            style={styles.textR}>{this.notes()}</Text>
                    </View>
                </View>
                <View style={{marginBottom: 16}}>
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTille}>Service Recipient Information</Text>
                    </View>
                    <ScrollView
                        directionalLockEnabled={false}
                        horizontal={true}
                        style={{borderColor: '#E0E0E0', borderWidth: 1, margin: 5}}>

                        <View style={{backgroundColor: 'white'}}>
                            <View style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                backgroundColor: '#eeeeee',
                                borderBottomColor: '#E0E0E0',
                                paddingBottom: 5,
                                paddingTop: 5,
                                borderBottomWidth: 1
                            }}>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Last Name
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        First Name
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Home Phone
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Work Phone
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Cell Phone
                                    </Text>
                                </View>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                paddingBottom: 2,
                                justifyContent: 'center',
                                paddingTop: 2,
                            }}>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.lastName}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.firstName}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.homePhone}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.workPhone}
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleValue}>
                                        {obj.cellPhone}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    } else {
        return (
            <View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Number: {this.state.dataSource.appNbr}</Text>
                </View>
                <View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Covered By</Text>
                            <Text
                                style={styles.textin}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Service Type</Text>
                            <Text style={styles.textin}>{this.serviceType(params.dataShedule.appNbr)}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Start Date & Time</Text>
                            <Text style={styles.textin}>{myTimeStart}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Estimated Duration (hours)</Text>
                            <Text style={styles.textin}>{this.state.dataSource.duration}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Finish Date</Text>
                            <DatePicker
                                style={{width: 150}}
                                date={this.state.date}
                                mode="date"
                                placeholder=" "
                                minDate={startDate}
                                format="MM/DD/YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                // iconSource={require('./google_calendar.png')}
                                onDateChange={(date) => {
                                    this.setState({date: date});
                                }}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Actual Duration (hours)</Text>
                            <Text style={styles.textin}>{this.actualDura()}</Text>
                        </View>
                    </View>
                    <View style={styles.viewLine}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text>Time</Text>
                            <View style={{flexDirection: 'row'}}>
                                <DatePicker
                                    style={{width: 150}}
                                    date={this.state.time}
                                    mode="time"
                                    placeholder=" "
                                    format="HH:mm"
                                    is24Hour={false}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    minuteInterval={10}
                                    onDateChange={(time) => {
                                        this.setState({time: time});
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {this.showBill()}
                    <View style={styles.viewLine}>
                        <TouchableOpacity onPress={this._onPressSave}>
                            <View style={styles.pooleantrue1}>
                                <Text style={{color: 'white'}}>Save</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableHighlight
                            activeOpacity={1}
                            onPress={this._onPressBack}
                            style={this.state.pressStatus ? styles.forgot2 : styles.forgot1}
                            onHideUnderlay={this._onHideUnderlay.bind(this)}
                            onShowUnderlay={this._onShowUnderlay.bind(this)}
                        >

                            <Text style={this.state.pressStatus ? styles.text2 : styles.text}>Back</Text>
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Requester Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Customer</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiCustomerName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiClinicVenueName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Sub-department</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiDepartmentName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Name</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Requester Email</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterEmail}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Requester Phone</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textR}>{this.state.dataSource.noiRequesterPhone}</Text>
                    </View>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={styles.textTille}>Appointment Information</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Appointment Number</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.appNbr}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Cover By</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Start Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{myTimeStart}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Finish Date and Time</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.finishTimeDate()}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Duration (hours)</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.duration}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Language</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.noiLanguageName}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Gender Request</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.genderRequest(this.state.dataSource.gender)}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Appointment Location</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>
                            {this.loca()} {this.location()}
                        </Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Subject description</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.describe}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text style={styles.textL}>Appointment Notes</Text>
                    </View>
                    <View style={{
                        width: width / 2,
                        borderLeftWidth: 1,
                        borderLeftColor: '#E0E0E0',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        borderTopColor: '#E0E0E0'
                    }}>
                        <Text
                            style={styles.textR}>{this.state.dataSource.subject} {this.state.dataSource.body}</Text>
                    </View>
                </View>
                <View style={{marginBottom: 16}}>
                    <View style={styles.viewTitle}>
                        <Text style={styles.textTille}>Service Recipient Information</Text>
                    </View>
                    <ScrollView
                        directionalLockEnabled={false}
                        horizontal={true}
                        style={{borderColor: '#E0E0E0', borderWidth: 1, margin: 5}}>

                        <View style={{backgroundColor: 'white'}}>
                            <View style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                backgroundColor: '#eeeeee',
                                borderBottomColor: '#E0E0E0',
                                paddingBottom: 5,
                                paddingTop: 5,
                                borderBottomWidth: 1
                            }}>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Last Name
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        First Name
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Home Phone
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Work Phone
                                    </Text>
                                </View>
                                <View style={styles.styleItem}>
                                    <Text style={styles.styleTitle}>
                                        Cell Phone
                                    </Text>
                                </View>

                            </View>
                            <FlatList data={obj}
                                      renderItem={({item, index}) =>
                                          <View style={{
                                              flexDirection: 'row',
                                              alignContent: 'center',
                                              paddingBottom: 2,
                                              justifyContent: 'center',
                                              paddingTop: 2,
                                          }}>
                                              <View style={styles.styleItem}>
                                                  <Text style={styles.styleValue}>
                                                      {item.lastName}
                                                  </Text>
                                              </View>
                                              <View style={styles.styleItem}>
                                                  <Text style={styles.styleValue}>
                                                      {item.firstName}
                                                  </Text>
                                              </View>
                                              <View style={styles.styleItem}>
                                                  <Text style={styles.styleValue}>
                                                      {item.homePhone}
                                                  </Text>
                                              </View>
                                              <View style={styles.styleItem}>
                                                  <Text style={styles.styleValue}>
                                                      {item.workPhone}
                                                  </Text>
                                              </View>
                                              <View style={styles.styleItem}>
                                                  <Text style={styles.styleValue}>
                                                      {item.cellPhone}
                                                  </Text>
                                              </View>

                                          </View>
                                      }
                                      keyExtractor={(item, index) => index}>

                            </FlatList>

                        </View>
                    </ScrollView>
                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            position: 'absolute',
                            alignItems: 'center',
                            backgroundColor: 'transparent'
                        }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewMap', {
                                id: this.state.dataSource.coverById,
                                lo: this.addresss()
                            })}>
                                <Image style={{width: sizeMap, height: sizeMap, margin: 16}}
                                       source={require('../images/map.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

render()
{

    if (this.state.isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    const {params} = this.props.navigation.state;

    return (
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                    {this.hideView(params.dataShedule.appNbr)}
                </ScrollView>
            </View>
        </View>

    );
}
}

export default connect()(DetailsTimeFinish)
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    viewcon: {
        width: width / 2,
        borderLeftWidth: 1,
        borderLeftColor: '#E0E0E0',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0'

    },
    viewTitle: {
        minHeight: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    textTille: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#F44336'
    },
    textL: {
        margin: 5,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    textR: {
        marginLeft: 10,
        marginTop: 3,
        marginLeft: 5,
        marginBottom: 3,
    },
    pooleantrue: {
        flex: 1,
        backgroundColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pooleanfalse: {
        flex: 10,
        backgroundColor: '#64B5F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewLine: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 10
    },
    textin: {
        fontWeight: 'bold'
    },
    pooleantrue1: {
        width: 80,
        height: 30,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pooleanfalse1: {
        width: 80,
        height: 30,
        backgroundColor: '#E8EAF6',
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        color: 'black',
        fontSize: 16
    },
    text2: {
        color: 'white',
        fontSize: 16
    },
    forgot1: {
        width: 80,
        height: 30,
        marginLeft: 5,
        backgroundColor: '#E8EAF6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgot2: {
        backgroundColor: '#F44336',
        width: 80,
        height: 30,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleTitle: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },

    styleItem: {
        flex: 1,
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        color: "black",
        justifyContent: 'center',
        alignContent: 'center'
    },
    styleValue: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16
    }
}
)