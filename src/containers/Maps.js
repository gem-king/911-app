import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    BackHandler,
    Alert,
    Text,
    AsyncStorage,
    TouchableOpacity,
    ActivityIndicator,
    NetInfo
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geocoder from "react-native-geocoding";
import {URL, URL_CUSTOMER, URL_LANGUAGE, URL_TIMEFINISH} from "../components/const";

export default class ViewMap extends Component {

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
            coords: [],
            hoAddress: '',
            apAddress: '',
            department: '',
            region: {
                latitude: 49.85460579999999,
                longitude: -97.2066746,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            destination: {
                latitude: 0,
                longitude: 0,
                title: ""
            },
            isGPS: false
        };
    }

    componentWillMount() {
        console.log(this.props.navigation.state.params.address)
        this.getPosition()

    }

    getPosition() {
        Geocoder.setApiKey('AIzaSyDjiRQgNIhJkh46enu19J8s8xQO0Y-nRzs');
        Geocoder.getFromLocation(this.props.navigation.state.params.address).then(
            json => {
                var location = json.results[0].geometry.location;
                this.setState({
                    region: {
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    },
                });

                this.getPlaces()
            },
            error => {
                console.log(error);
            }
        );
    }

    getPlaces(){
        Geocoder.setApiKey('AIzaSyDjiRQgNIhJkh46enu19J8s8xQO0Y-nRzs'); // use a valid API key
        Geocoder.getFromLocation(this.props.navigation.state.params.lo).then(
            json => {
                var loca = json.results[0].geometry.location;
                this.setState({
                    destination: {
                        latitude: loca.lat,
                        longitude: loca.lng,
                        title: ""
                    },
                });
                this.getDirections(this.state.region.latitude + "," + this.state.region.longitude, this.state.destination.latitude + "," + this.state.destination.longitude)
            },
            error => {
                console.log(error);
            }
        );
    }

    componentDidMount() {

    }

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`);
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            });
            this.setState({coords: coords});
            return coords
        } catch (error) {
            console.log("ERROR", error);
            throw error
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView style={styles.map}
                         initialRegion={this.state.region}
                         followsUserLocation={true}
                         showsUserLocation={true}
                         loadingEnabled={true}
                         showsMyLocationButton={true}>

                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={5}
                        strokeColor="#03A9F4"/>
                    <MapView.Marker
                        coordinate={this.state.region}
                        title={this.state.destination.title}
                    />
                    <MapView.Marker
                        coordinate={this.state.destination}
                        title={this.state.destination.title}
                    />
                </MapView>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});