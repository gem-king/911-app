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

const defaultState = {isApply:false};
const reducer = (state ={isApply:false},action)=>{
    if(action.type==='APPLY') return {isApply:!state.isApply}
    if(action.type==='CANCEL_APPLY') return {isApply:false}
    return state;
};
const store = createStore(reducer);

export default class App911Interpreters extends Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('App911Interpreters', () => App911Interpreters);
