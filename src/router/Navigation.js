import React, {Component} from 'react'
import {StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation';
import Login from "../containers/Login";
import MyFolder from "../containers/MyFolder";
import Profile from "../containers/Profile";
import MyShedule from "../containers/MyShedule";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/FontAwesome';
import InfoProfile from "../containers/InfoProfile";
import Details from "../containers/Details";
import Launcher from "../containers/Launcher";
import InterpreterTimeFinish from "../containers/InterpreterTimeFinish";
import DetailsFolder from "../containers/DetailsFolder";
import DetailsTimeFinish from "../containers/DetailsTimeFinish";
import ViewMap from "../containers/ViewMap";
import Map from "../containers/Maps";
import ChangePassword from "../containers/ChangePassword";
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
var widthMenu = 0;

if (DEVICE_WIDTH >= 500) {
    widthMenu = DEVICE_WIDTH*1/2;
} else {
    widthMenu = DEVICE_WIDTH*3/4;
}



const Tab = TabNavigator({
        MyShedule: {
            screen: MyShedule,
            navigationOptions: {
                title: 'My Schedule',
                tabBarLabel: 'My Schedule',
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#D2232A'},
                tabBarIcon: ({tintColor}) =>
                    <Icons name="calendar" size={23}
                          style={{ color: tintColor }}/>
            },
        },
        MyFolder: {
            screen: MyFolder,
            navigationOptions: {
                title: 'My Folder',
                tabBarLabel: 'My Folder',
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#D2232A'},
                tabBarIcon: ({tintColor}) =>
                    <Icons name="folder-open-o" size={23}
                          style={{ color: tintColor }}/>
            }
        },
        InterpreterTimeFinish: {
            screen: InterpreterTimeFinish,
            navigationOptions: {
                title: 'Interpreter Time Finish',
                headerTintColor: 'white',
                tabBarLabel: 'Interpreter Time Finish',
                headerStyle: { backgroundColor: '#D2232A'},
                tabBarIcon: ({tintColor}) =>
                    <Icons name="calendar-check-o" size={23}
                          style={{ color: tintColor }}/>
            }
        }
    },
    {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            showIcon: true,
            indicatorStyle: {
                backgroundColor: '#D2232A'
            },
            labelStyle: {
                marginTop: 0,
                padding: 0,
                fontSize: 10,
            },
            style: {
                backgroundColor: '#1c313a',
            },
            activeTintColor: '#D2232A',
            inactiveTintColor: 'white',
            upperCaseLabel: false, //chu thuong
            pressOpacity: 0.1
        },
        animationEnabled: false,
    });


const HomeStack = StackNavigator({
    Tab: {
        screen: Tab,
        navigationOptions: {}
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            header: null,
        },
    },
    InfoProfile: {
        screen: InfoProfile,
        navigationOptions: {
            title: 'Account',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            drawerLockMode: 'locked-closed'
        }
    },
    Details: {
        screen: Details,
        navigationOptions: {
            title: 'Appointment Details',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            drawerLockMode: 'locked-closed'
        }
    },
    DetailsFolder: {
        screen: DetailsFolder,
        navigationOptions: {
            title: 'Appointment Details',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            drawerLockMode: 'locked-closed'
        }
    },
    DetailsTimeFinish: {
        screen: DetailsTimeFinish,
        navigationOptions: {
            title: 'Time Finish Appointment Detail',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            drawerLockMode: 'locked-closed'
        }
    },
    ViewMap: {
        screen: ViewMap,
        navigationOptions: {
            title: 'Maps',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            drawerLockMode: 'locked-closed'
        }
    },
    Map: {
        screen: Map,
        navigationOptions: {
            title: 'Maps',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            drawerLockMode: 'locked-closed'
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        }
    },
    ChangePassword:{
        screen: ChangePassword,
        navigationOptions: {
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#D2232A'},
            title: 'Change Password ',
            drawerLockMode: 'locked-closed'
        }
    }

}, {
    initialRouteName: "Tab"
});


const defaultGetStateForAction = HomeStack.router.getStateForAction;

HomeStack.router.getStateForAction = (action, state) => {
    if (action.type.startsWith('Navigation/')) {
        const {type, routeName} = action;
        if (state) {
            const lastRoute = state.routes[state.routes.length - 1];
            if (type === 'Navigation/NAVIGATE' && routeName === lastRoute.routeName) {
                return
            }
        }
    }
    return defaultGetStateForAction(action, state)
};


const SideMenu = DrawerNavigator({

        HomeStack: {
            screen: HomeStack
        }
    },
    {
        drawerWidth:widthMenu,
        drawerPosition: "left",
        contentComponent: props => <Profile {...props}/>
    }
);


const FirstStack = StackNavigator({
    Launcher: {
        screen: Launcher,
        navigationOptions: {
            header: null
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'
        }
    },
    SideMenu: {
        screen: SideMenu,
        navigationOptions: {
            header: null
        }
    },

}, {
    initialRouteName: "Launcher"
});


export default FirstStack;


