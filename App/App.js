import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator, SwitchNavigator} from 'react-navigation'
import * as firebase from 'firebase'
import Login from './views/Login'
import MainScreen from './views/MainScreen'
import Settings from './views/Settings'
import Loading from './views/Loading'
import AddUser from './views/AddUser'
import SkeletonRecognition from './views/SkeletonRecognition'

import Firebase from './lib/firebase'
import { YellowBox } from 'react-native';
import _ from 'lodash';

console.ignoredYellowBox = [
  'Setting a timer for a long period of time, i.e. multiple minutes',
];

const RootStack = StackNavigator({
      MainScreen: {
        screen: MainScreen,
      },
      Settings: {
        screen: Settings,
      },
      AddUser: {
        screen: AddUser
      },
      SkeletonRecognition:{
        screen: SkeletonRecognition
      }
    },
    {
      initialRouteName: 'MainScreen'
    });


const App = SwitchNavigator(
  {
    Loading,
    RootStack,
    Login,
  },
  {
    initialRouteName: 'Loading'
  }
)
export default App
