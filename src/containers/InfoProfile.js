
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,


} from 'react-native';

export default class InfoProfile extends Component{

    constructor(props){
        super(props)
    }


    render (){
        const { params } = this.props.navigation.state;
        console.log("My Account", params);

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
        try {
            var obj = JSON.parse(params.dataAccount.phones);
        }catch (er){
            console.log(er)
        }

        return(
            <View style = {{flex:1, backgroundColor:'white'}}>
                <Text style = {styles.textTitle}>Username</Text>
                <Text style = {styles.textValue}>{params.dataAccount.firstName} {params.dataAccount.lastName}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>

                <Text style = {styles.textTitle}>Email</Text>
                <Text style = {styles.textValue}>{params.dataAccount.email}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>
                <Text style = {styles.textTitle}>Phone Number</Text>
                <Text style = {styles.textValue}>{obj[0].phoneNo}</Text>
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>
                <Text style = {styles.textTitle}>Language</Text>
                {params.dataAccount.languageDTOs.map(language=>(
                    <Text style = {styles.textValue} key = {language.name}>{language.name}</Text>
                ))}
                <View style = {{height:1, backgroundColor:'#cccccc', marginTop:5}}/>
                <Text style = {styles.textTitle}>Join Date</Text>
                <Text style = {styles.textValue}>{myTime}</Text>
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