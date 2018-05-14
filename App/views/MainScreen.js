import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Dimensions,
    TouchableHighlight,
    Platform,
    ToastAndroid,
    ScrollView,
    StatusBar
} from 'react-native'
import * as firebase from 'firebase'
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

export default class MainScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            response: '',
        }
    }

    static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
          header:null,
      };
    };

    async login(navigation) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(){
        navigation.navigate('Test')
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        ToastAndroid.showWithGravityAndOffset(errorMessage, ToastAndroid.LONG,  ToastAndroid.BOTTOM,0,100);
      });

    }
    render(){
        return (
            <View style={{flex: 1, flexDirection: 'column',justifyContent: 'center',alignItems: 'stretch'}}>
                <View style={{position: 'absolute', top: 50,}}>
                    <Icon name="ios-settings" size={32} color="gray" style={{marginLeft:15, marginRight:-5 }} onPress={()=>this.props.navigation.navigate('Settings')} />

                </View>
                <View style={styles.containerImage}>
                    <Button
                      title="Faces/Emotions"
                      color="#1E9F9F"
                      backgroundColor="rgba(255,255,255,1)"
                      buttonStyle={{
                        width: 200,
                        height: 200,
                        marginTop: 0,
                        borderRadius: 5,
                        borderColor : "#1E9FFF",
                        borderWidth : 1,
                        backgroundColor:"rgba(255,255,255,1)",
                    }}
                    titleStyle={{
                        color: "#1E9F9F"
                    }}
                    // onPress={()=>this.props.navigation.navigate('FaceRecognition')}
                    />
                </View>
                <View style={styles.containerImage}>
                    <Button
                      title="Pose Estimation"
                      color="#F4A32B"
                      backgroundColor="rgba(255,255,255,1)"
                      buttonStyle={{
                        width: 200,
                        height: 200,
                        marginTop: 0,
                        borderRadius: 5,
                        borderColor : "#F4A32B",
                        borderWidth : 1,
                        backgroundColor:"rgba(255,255,255,1)",
                        }}
                        titleStyle={{
                            color: "#F4A32B"
                        }}
                      onPress={()=>this.props.navigation.navigate('SkeletonRecognition')}
                    />
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        marginHorizontal: 0,
        backgroundColor: 'white',
    },
    containerImage: {
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 20,
        textAlign: 'center',
    },
    textTitle2: {
        fontSize: 20,
        textAlign: 'center',
        color: "#F4A32B"
    },
    textTitle3: {
        fontSize: 15,
        textAlign: 'center',
    },
    containerInputs: {
        marginBottom: 20
    }
})
