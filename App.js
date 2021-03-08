import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
//redux
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
//Firebase

import * as firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyBmUvV9nwR-QzThd8fHhTVPDtUdxHKQOPw",
  authDomain: "react-dev-895db.firebaseapp.com",
  projectId: "react-dev-895db",
  storageBucket: "react-dev-895db.appspot.com",
  messagingSenderId: "428458174891",
  appId: "1:428458174891:web:c43120bb9ce9886c268aee",
  measurementId: "G-RW7E2KKN2E"
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}
//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//Components
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import SaveScreen from './components/main/Save'
import AddScreen from './components/main/Add';
import EditScreen from './components/main/Edit'
import CommentScreen from './components/main/Comment';
import AddProfileImgScreen from './components/main/AddProfileImg'
import SaveProfilePicScreen from './components/main/SaveProfilePic';

//Middleware/navigators
const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createStackNavigator();
export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SignIn" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} 
                  options={{
              title: 'Reactagram',
              headerStyle: {
                backgroundColor: '#1a1918',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} />
              <Stack.Screen name="Edit" component={EditScreen} navigation = {this.props.navigation} />
              <Stack.Screen name="Add" component={AddScreen} navigation = {this.props.navigation}  
              options={{
                headerStyle: {
                  backgroundColor: '#1a1918',
                },
                headerTintColor: '#fff'
              }} />
              <Stack.Screen name="SaveProfilePic" component={SaveProfilePicScreen} navigation = {this.props.navigation}/>
              <Stack.Screen name="AddProfileImg" component={AddProfileImgScreen} navigation = {this.props.navigation}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation = {this.props.navigation}  />
              <Stack.Screen name="Comment" component={CommentScreen} navigation = {this.props.navigation}  />
            </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App