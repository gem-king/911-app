import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native'
import SideMenu from './router/Navigation';

export default class App extends Component {
    render (){
        return(
            <SideMenu/>
        );
    }
}