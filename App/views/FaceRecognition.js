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
import { RNCamera, FaceDetector } from 'react-native-camera';


export default class MainScreen extends Component {

    static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
          header:null,
      };
    };
    
    render(){
        return (
            <View style={{flex: 1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                
                <View style={{width:"100%", height:"90%",backgroundColor:"gray",}}>
                    <RNCamera
                        ref={ref => {
                        this.camera = ref;
                        }}
                        style = {styles.preview}
                        type={RNCamera.Constants.Type.front}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        permissionDialogTitle={'Permiso de cámara'}
                        permissionDialogMessage={'Se necesita permiso para usar la cámara'}
                    />
                </View>
                <View style={{width:"100%", height:"10%", backgroundColor:"green",flexDirection:'row'}}>
                    <Button
                        title="Configuración"
                        color="gray"
                        backgroundColor="white"
                        onPress={() => this.signup(this.props.navigation)}
                        buttonStyle={{
                          height: "100%",
                          backgroundColor:'white',
                          borderColor : "rgba(78, 101, 112, 1)",
                            borderWidth : 1
                        }}
                        titleStyle={{
                            color:'#444'
                        }}
                        containerStyle={{
                            width: "50%",
                            height: "100%",
                            marginTop:"auto",
                            marginBottom:"auto",
                            justifyContent: 'center'
                        }}
                      />
                      <Button
                        title="Imitar Pose"
                        color="gray"
                        backgroundColor="white"
                        onPress={() => this.signup(this.props.navigation)}
                        buttonStyle={{
                            height: "100%",
                            backgroundColor:'white',
                            borderColor : "rgba(78, 101, 112, 1)",
                            borderWidth : 1
                          }}
                          titleStyle={{
                              color:'#444'
                          }}
                          containerStyle={{
                              width: "50%",
                              height: "100%",
                              marginTop:"auto",
                              marginBottom:"auto",
                              justifyContent: 'center'
                          }}
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
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
})
