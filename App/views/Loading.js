import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Image, Dimensions } from 'react-native'
import * as firebase from 'firebase'
import Firebase from '../lib/firebase'


export default class Loading extends React.Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'RootStack' : 'Login')
    })
  }

  constructor(props){
    super(props)
    if (!firebase.apps.length) {
        Firebase.init();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri:"http://promostimey.uca.es/wp-content/uploads/2016/12/stimey_brain-1.png"}} style={{flex:1,width:"80%",height:"80%"}} resizeMode="contain"/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
})
