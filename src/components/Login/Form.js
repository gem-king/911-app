import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import {
    StyleSheet,
    KeyboardAvoidingView,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';

import images from "../images";
import UserInput from "./UserInput";

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPass: true,
            press: false,
            IsLogin: false
        };
        this.showPass = this.showPass.bind(this);

    }

    showPass() {
        this.state.press === false ? this.setState({ showPass: false, press: true }) :this.setState({ showPass: true, press: false });
    }

    render() {
        // const { data } = this.state;
        const { getEmail, getPass } = this.props;

        return (
            <KeyboardAvoidingView behavior='padding'
                                  style={styles.container}>
                <UserInput source={images.username}
                           placeholder='Username'
                           autoCapitalize={'none'}
                           returnKeyType={'done'}
                           autoCorrect={false}
                           getData = {getEmail}

                />
                <UserInput source={images.password}
                           secureTextEntry={this.state.showPass}
                           placeholder='Password'
                           returnKeyType={'done'}
                           autoCapitalize={'none'}
                           autoCorrect={false}
                           getData = {getPass}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.btnEye}
                    onPress={this.showPass}
                >
                    <Image source={images.eye} style={styles.iconEye} />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    btnEye: {
        position: 'absolute',
        top: '54%',
        right: 28,
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.2)',
    },
});
