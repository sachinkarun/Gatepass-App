import React, { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import * as firebase from 'firebase'
import { Provider } from 'react-redux'
import { store } from './redux/app-redux';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import HodScreen from './components/auth/Hod';
import TeacherScreen from './components/auth/Teacher';
import SignupScreen from './components/auth/Signup';
import TeacherSignupScreen from './components/auth/TeacherSignup';
import ForgotPasswordScreen from './components/auth/ForgotPassword';
import TeacherForgotPasswordScreen from './components/auth/TeacherForgotPassword';
import MainScreen from './components/Main';
import InfoScreen from './components/Info';

const stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator color='#262A43' size='large' />
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <stack.Navigator initialRouteName ="Landing">
            <stack.Screen name="Landing" component={LandingScreen} options={{headerShown:false}}/>
            <stack.Screen name="Hod" component={HodScreen} options={{headerShown:false}}/>
            <stack.Screen name="Teacher" component={TeacherScreen} options={{headerShown:false}}/>
            <stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false}}/>
            <stack.Screen name="TeacherSignup" component={TeacherSignupScreen} options={{headerShown: false}}/>
            <stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown:false}}/>
            <stack.Screen name="TeacherForgotPassword" component={TeacherForgotPasswordScreen} options={{headerShown:false}}/>
          </stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <Provider store={store}>
      <NavigationContainer>
        <stack.Navigator initialRouteName ="Main">
          <stack.Screen name="Main" component={MainScreen} options={{headerShown:false}}/>
          <stack.Screen name="Info" component={InfoScreen} options={{headerTransparent:true,headerTintColor:'#fff'}}/>
        </stack.Navigator>
      </NavigationContainer>
      </Provider>
    )
  }
}

export default App
