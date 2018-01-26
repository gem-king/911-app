
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity

} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons'

export default class InfoProfile extends Component{

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

    constructor(props){
        super(props)
    }

    phone(){
        const { params } = this.props.navigation.state;
        try {
            var obj = JSON.parse(params.dataAccount.phones);
        }catch (er){
            console.log(er)
        }
        if(obj == null){
            return null;
        }else{
            return obj[0].phoneNo;
        }
    }

    language(){
        const { params } = this.props.navigation.state;
        if(params.dataAccount.languageDTOs == null){
            return null;
        }else {
            return (
                <View>
                    {params.dataAccount.languageDTOs.map(language=>(
                        <Text style = {styles.textValue} key = {language.name}>{language.name}</Text>
                    ))}
                </View>
            )
        }
    }

    date(){
        const { params } = this.props.navigation.state;
        var startTime = params.dataAccount.createdDate;

        var myDate = new Date(startTime);

        var timeZone = myDate.getTimezoneOffset();
        timeZone = timeZone / (-60);
        var mMili = myDate.getTime()-timeZone*3600*1000;
        myDate = new Date(mMili);
        var myYear = myDate.getFullYear();
        var myMonth = myDate.getMonth()+1;
        var myDay = myDate.getDate();
        var myHour = myDate.getHours();
        var amPM = ((myHour >= 12) ? "PM" : "AM");
        myHour = ((myHour>12)? myHour-12 : myHour);
        myHour = ((myHour<10)?("0"+myHour):myHour);
        var myMin = ((myDate.getMinutes())<10?("0"+myDate.getMinutes()): myDate.getMinutes());

        var myTime = myDay+"/"+myMonth+"/"+myYear+", "+myHour+":"+myMin+" "+amPM;

        if(startTime == null){
            return null;
        }else {
            return myTime
        }
    }

    render (){
        const { params } = this.props.navigation.state;

        return(
            <View style = {{flex:1, backgroundColor:'white'}}>
                <Text style = {styles.textTitle}>Username</Text>
                <Text style = {styles.textValue}>{params.dataAccount.firstName} {params.dataAccount.lastName}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>

                <Text style = {styles.textTitle}>Email</Text>
                <Text style = {styles.textValue}>{params.dataAccount.email}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>
                <Text style = {styles.textTitle}>Phone Number</Text>
                <Text style = {styles.textValue}>{this.phone()}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>
                <Text style = {styles.textTitle}>Language</Text>
                {this.language()}
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>
                <Text style = {styles.textTitle}>Join Date</Text>
                <Text style = {styles.textValue}>{this.date()}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>

            </View>

        );

    }
}
const styles = StyleSheet.create({
    textTitle: {
        marginTop:10,
        marginLeft:16,
        color:'#212121'
    },
    textValue: {
        marginLeft:16,
        marginTop:5
    }

});