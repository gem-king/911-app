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
    BackHandler,
    ActivityIndicator,
    NetInfo,
    FlatList
} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import {URL, URL_CUSTOMER, URL_DECLINE, URL_IDTIMEFINISH, URL_TAKE, URL_TIMEFINISH} from "../components/const";
import {connect} from 'react-redux';

var {height, width} = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width;

var sizeMap = 0;
if (DEVICE_WIDTH>=500){
    sizeMap = 70;
} else {
    sizeMap = 50
}

class DetailsFolder extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            dataSource: '',
            department: '',
            customer: '',
            clinic: '',
            lomap: '',
        };
    }

    componentWillMount(){
        NetInfo.isConnected.fetch().done((isConnected) => {
            if ( isConnected )
            {
                AsyncStorage.getItem('token').then((value) => {
                    fetch(URL+URL_IDTIMEFINISH+this.props.navigation.state.params.id,{
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log('789',responseData)
                            this.setState({
                                isLoading: false,
                                dataSource: responseData,
                            });
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

                    fetch(URL + "api/noi-interpreters/get-home-address-info", {
                        method: "GET",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response6) => response6.json())
                        .then((responseData6) => {
                            console.log("map", responseData6)
                            this.setState({
                                lomap: responseData6
                            })
                        })
                        .done();
                });
            }
            else
            {
                alert("Network request failed")
            }
        });
    }

    _onPressTake = (id) => {
        NetInfo.isConnected.fetch().done((isConnected) => {
            if ( isConnected )
            {
                AsyncStorage.getItem('token').then((value) => {
                    fetch(URL+URL_TAKE, {
                        method: "PUT",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        },
                        body: id+ ''
                    })
                        .then((response) => response.json())
                        .then((dataTake) => {
                            console.log('result takeit', dataTake)
                            const { navigation } = this.props;
                            navigation.goBack();
                            navigation.state.params.stateReload(true);
                        })
                        .catch((error)=>{console.log(error)})

                });
            }
            else
            {
                alert("Network request failed")
            }
        });

    };

    _onPressDecline(id){
        NetInfo.isConnected.fetch().done((isConnected) => {
            if ( isConnected )
            {
                AsyncStorage.getItem('token').then((value) => {
                    fetch(URL+URL_DECLINE, {
                        method: "PUT",
                        headers: {
                            'Authorization': value,
                            'Content-Type': 'application/json',
                        },
                        body: id+ ''
                    })
                        .then((response) => response.json())
                        .then((dataTake) => {
                            console.log('result decline', dataTake)
                            const { navigation } = this.props;
                            navigation.goBack();
                            navigation.state.params.stateReload(true);

                        })
                        .catch((error)=>{console.log(error)})

                });
            }
            else
            {
                alert("Network request failed")
            }
        });

    }

    documentType(type){
        if(type == 1){
            return "Legal";
        }
        if(type == 2){
            return "Medical";
        }
        else {
            return "Other"
        }
    }

    genderRequest(gender){
        if(gender == 1){
            return "Male";
        }
        if (gender == 2){
            return "Female"
        }
        else {
            return "";
        }
    }

    typeOfCall(call){
        if(call == 1){
            return "Tel Conference";
        }
        if (call == 2){
            return "Tel Confirm"
        }
        else {
            return "";
        }
    }

    translated(tran){
        if(tran == null){
            return null;
        }else {
            return(
                <View style={styles.container}>
                    <View style={styles.viewcon}>
                        <Text style={styles.textL}>Translated Files</Text>
                    </View>
                    <View style={styles.viewcon}>
                        <Text style={styles.textR}>{this.state.dataSource.translatedFile}</Text>
                    </View>
                </View>
            );
        }
    }

    loca(){
        if(this.state.dataSource.location != null && this.state.dataSource.location != ""){
            return this.state.dataSource.location + ", "
        }else {
            return null
        }
    }

    location() {
        try{
            if (this.state.dataSource.offSite == true) {
                if (this.state.dataSource.noiDepartmentId != null) {
                    var street = this.state.department.streetAddress + ", " +
                        this.state.department.city + ", " +
                        this.state.department.noiState.name + ", " +
                        this.state.department.zipPostalCode;
                    this.address = street
                    return street
                } else {
                    if (this.state.dataSource.noiClinicVenueId != null) {
                        var street2 = this.state.clinic.streetAddress + ", " +
                            this.state.clinic.city + ", " +
                            this.state.clinic.noiState.name + ", " +
                            this.state.clinic.zip;
                        this.address = street2
                        return street2
                    } else {
                        if (this.state.dataSource.noiCustomerId != null) {
                            var street3 = this.state.customer.add1 + ", " +
                                this.state.customer.city + ", " +
                                this.state.customer.noiState.name + ", " +
                                this.state.customer.zipCode;
                            this.address = street3
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
                    this.address = street4
                    return street4
                } else {
                    return null
                }
            }
        }catch (ero){
            console.log(ero)
        }
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

    finishDate(){
        if(this.state.dataSource.finishTime != null){
            var finishTime = this.state.dataSource.finishTime;
            var myDate2 = new Date(finishTime);

            var timeZone2 = myDate2.getTimezoneOffset();
            timeZone2 = timeZone2 / (-60);
            var mMili = myDate2.getTime()-timeZone2*3600*1000;
            myDate2 = new Date(mMili);
            var myYear2 = myDate2.getFullYear();
            var myMonth2 = ((myDate2.getMonth()+1)<10?("0"+(myDate2.getMonth()+1)):(myDate2.getMonth()+1));
            var myDay2 = myDate2.getDate();
            var myHour2 = myDate2.getHours();
            var amPM2 = ((myHour2 >= 12) ? "PM" : "AM");
            myHour2 = ((myHour2>12)? myHour2-12 : myHour2);
            myHour2 = ((myHour2<10)?("0"+myHour2):myHour2);
            var myMin2 = ((myDate2.getMinutes())<10?("0"+myDate2.getMinutes()): myDate2.getMinutes());
            var myTime3 = myMonth2+"/"+myDay2+"/"+myYear2+", "+myHour2+":"+myMin2+" "+amPM2;

            return myTime3
        }else {
            return null
        }
    }

    notes(){
        if(this.state.dataSource.subject != "" && this.state.dataSource.body != ""){
            return this.state.dataSource.subject+", " +this.state.dataSource.body
        }else{
            return null
        }
    }

    hideView(name){

        var startTime = this.state.dataSource.timeOfService;
        var myDate = new Date(startTime);

        var timeZone = myDate.getTimezoneOffset();
        timeZone = timeZone / (-60);
        var mMili = myDate.getTime()-timeZone*3600*1000;
        myDate = new Date(mMili);
        var myYear = myDate.getFullYear();
        var myMonth = ((myDate.getMonth()+1)<10?("0"+(myDate.getMonth()+1)):(myDate.getMonth()+1));
        var myDay = myDate.getDate();
        var myHour = myDate.getHours();
        var amPM = ((myHour >= 12) ? "PM" : "AM");
        myHour = ((myHour>12)? myHour-12 : myHour);
        myHour = ((myHour<10)?("0"+myHour):myHour);
        var myMin = ((myDate.getMinutes())<10?("0"+myDate.getMinutes()): myDate.getMinutes());
        var myTime = myMonth+"/"+myDay+"/"+myYear+", "+myHour+":"+myMin+" "+amPM;
        var myTime2 = myMonth+"/"+myDay+"/"+myYear;

        var obj = JSON.parse(this.state.dataSource.serviceRecipients);

        if(name.indexOf("ODTI") > -1 || name.indexOf("ODVI") > -1){
            return(
                <View>
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
                            <Text style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
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
                            <Text style={styles.textR}>{myTime}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Finish Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.finishDate()}</Text>
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
                    <View style = {styles.viewTitle}>
                        <Text style = {styles.textTille}>Interpreter Information</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                    </View>
                </View>
            );
        }if (name.indexOf("TI") > -1){
            return(
                <View>
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
                            <Text style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Start Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{myTime}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Finish Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.finishDate()}</Text>
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
        } if (name.indexOf("VI") > -1){
            return(
                <View>
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
                            <Text style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Start Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{myTime}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Finish Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.finishDate()}</Text>
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
        } if(name.indexOf("DOC") > -1){
            return(
                <View>
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
                            <Text style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
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
                            <Text style={styles.textL}>Expected Date of Completion</Text>
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
                            <Text style={styles.textR}>{myTime2}</Text>
                        </View>
                    </View>

                    <View style={styles.viewTitle}>
                        <Text style={styles.textTille}>Translation Information</Text>
                    </View>

                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Attach File(upload)</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.state.dataSource.attachFile}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Source Language</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.state.dataSource.sourceLanguageName}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Target Language</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.state.dataSource.targetLanguageName}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Document Type</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.documentType(this.state.dataSource.noiDocumentTypeId)}</Text>
                        </View>
                    </View>
                    {this.translated(this.state.dataSource.translatedFile)}
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
                            <Text style={styles.textL}>Additional Notes</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.note}</Text>
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

        }else {
            return(
                <View>
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
                            <Text style={styles.textR}>{this.state.dataSource.noiRequesterFirstName} {this.state.dataSource.noiRequesterLastName}</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.coverByFirstName} {this.state.dataSource.coverByLastName}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Start Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{myTime}</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.viewcon}>
                            <Text style={styles.textL}>Finish Date and Time</Text>
                        </View>
                        <View style={styles.viewcon}>
                            <Text style={styles.textR}>{this.finishDate()}</Text>
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
                            <Text style={styles.textR}>{this.state.dataSource.subject} {this.state.dataSource.body}</Text>
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
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Map', {
                                    address: this.state.lomap.streetAddress + ", " +
                                        this.state.lomap.city + ", " +
                                        this.state.lomap.noiState.name,
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

    render() {

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1,justifyContent:'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            );
        }

        const {params} = this.props.navigation.state;

        return (
            <View style={{flex:1, justifyContent: 'flex-end',alignItems:'flex-end'}}>
                <View style={{flex:1}}>
            <ScrollView style = {{flex:1, backgroundColor:'white'}}>

                {this.hideView(params.dataShedule.appNbr)}

                <View style = {{flexDirection:'row', flex:1, minHeight:30, marginTop:10}}>
                    <TouchableOpacity style = {styles.pooleantrue}
                                      onPress = {()=>{this._onPressTake(params.dataShedule.id)}}>
                        <View style = {styles.pooleantrue}>
                            <Text style = {{color:'white', fontWeight:'bold'}}>I will take it</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  style = {styles.pooleanfalse}
                                       onPress = {()=>{this._onPressDecline(params.dataShedule.id)}}>
                        <View style = {styles.pooleanfalse}>
                            <Text style = {{color:'white', fontWeight:'bold'}}>Decline</Text>
                        </View>
                    </TouchableOpacity>

                </View>


            </ScrollView>
                </View>
            </View>
        );
    }
}
export default connect()(DetailsFolder)
const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap:'wrap'
    },
    viewcon:{
        width: width/2,
        borderLeftWidth: 1,
        borderLeftColor: '#E0E0E0',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0'

    },
    viewTitle: {
        minHeight:35,
        backgroundColor:'white',
        justifyContent: 'center',
    },
    textTille: {
        marginLeft:5,
        fontSize:15,
        fontWeight:'bold',
        color: '#F44336'
    },
    textL: {
        marginLeft: 10,
        margin: 5,
        fontWeight:'bold',
    },
    textR: {
        marginTop:3,
        marginLeft:10,
        marginRight:5,
        marginBottom:3,
    },
    pooleantrue:{
        flex:1,
        backgroundColor:'#D2232A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pooleanfalse:{
        flex:1,
        backgroundColor:'#718792',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pooleanL:{
        flex:1,
        backgroundColor:'#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pooleanR:{
        flex:10,
        backgroundColor:'#64B5F6',
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
})