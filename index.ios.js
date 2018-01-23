/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,

} from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from "./src/App";


const reducer = (state ={isApply:false,isTimeChanged:false},action)=>{
    if(action.type==='APPLY') return {isApply:!state.isApply}
    if(action.type==='CANCEL_APPLY') return {isApply:false}
    if(action.type==='CHANGED') return {isTimeChanged:!state.isTimeChanged}
    if(action.type==='CANCEL_CHANGED') return {isTimeChanged:false}
    return state;
};

const store = createStore(reducer);


export default class App911Interpreters extends Component {
    render() {
        console.disableYellowBox = true;
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('App911Interpreters', () => App911Interpreters);
