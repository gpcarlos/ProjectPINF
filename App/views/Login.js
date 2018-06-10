import React, {Component} from 'react'
import Consent from './Consent'
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
    KeyboardAvoidingView,
    StatusBar
} from 'react-native'
import * as firebase from 'firebase'
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Kaede,
  Hoshi,
  Jiro,
  Isao,
  Madoka,
  Akira,
  Hideo,
  Kohana,
  Makiko,
  Sae,
  Fumi,
} from 'react-native-textinput-effects';



export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            mail: '',
            password: '',
        }
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
    }

    static navigationOptions = {
      header:null,
    }

    async login(navigation) {
      firebase.auth().signInWithEmailAndPassword(this.state.mail, this.state.password).then(function(){
        navigation.navigate('RootStack')
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        ToastAndroid.showWithGravityAndOffset(errorMessage, ToastAndroid.LONG,  ToastAndroid.BOTTOM,0,100);
      });
    }

    async signup(navigation) {
      firebase.auth().createUserWithEmailAndPassword(this.state.mail, this.state.password).then(function(){
        navigation.navigate('RootStack')
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        ToastAndroid.showWithGravityAndOffset(errorMessage, ToastAndroid.LONG,  ToastAndroid.BOTTOM,0,100);
      });
    }
    render(){
        return (

              <ScrollView style={styles.container}>
                <Consent pagekey={"rgpd"} title={"Uso de datos"} description={` De acuerdo con la RGPD, le informamos que no se hará uso de ningún dato, ni será procesado.

  Las funcionalidades de detección de emociones y de detección del esqueleto requieren el uso de la cámara, pero en ningún momento se almacena ningún tipo de dato. `}/>
                <View style={styles.containerImage}>
                  <StatusBar
                    backgroundColor= "white"
                    barStyle="dark-content"
                  />
                  <Image
                    style={{width: 160, height: 160, borderRadius: 50, justifyContent: 'center', alignItems: 'center',}}
                    source={{uri:'http://promostimey.uca.es/wp-content/uploads/2016/12/stimey_brain-1.png'}}
                  />
                </View>
                  <View style={styles.containerInputs}>
                    <View style={{flex: 1,flexDirection: 'row', justifyContent: 'flex-start',alignItems:'center',paddingVertical:20, marginTop:15 }}>
                      <Icon name="ios-mail-outline" size={28} color="gray" style={{marginLeft:15, marginRight:-5 }}  />
                       <Hoshi
                            style={[styles.input, { width: "80%",flexDirection: 'row', alignItems: 'center', marginLeft:25, justifyContent: 'center'}]}
                            label={'Correo'}
                            borderColor={'#1E9F9F'}
                            secureTextEntry={false}
                            inputStyle={[styles.inputText]}

                            onChangeText={(mail) => this.setState({mail})}

                          />
                    </View>

                    <View style={{flex: 1,flexDirection: 'row', justifyContent: 'flex-start',alignItems:'center',paddingVertical:20, marginBottom:20 }}>
                      <Icon name="ios-lock-outline" size={28} color="gray" style={{marginLeft:15, marginRight:-5 }}  />
                        <Hoshi
                            style={[styles.input, { width:  "80%",flexDirection: 'row', alignItems: 'center', marginLeft:25, justifyContent: 'center'}]}
                            label={'Contraseña'}
                            borderColor={'#F4A32B'}
                            secureTextEntry={true}
                            inputStyle={[styles.inputText]}

                            onChangeText={(password) => this.setState({password})}

                          />
                    </View>
                  </View>
                  <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between',alignItems:'center',}}>
                    <View></View>
                    <View >
                      <Button
                        title="Registrarse"
                        color="white"
                        backgroundColor="#1E9F9F"
                        onPress={() => this.signup(this.props.navigation)}
                        buttonStyle={{
                          width: 120,
                          height: 45,
                          marginTop: 0,
                          borderRadius: 5,
                          // borderColor : "rgba(78, 101, 112, 0.25)",
                          // borderWidth : 0
                        }}
                      />
                      </View>
                      <View></View>
                      <View >
                      <Button
                        title="Iniciar sesión"
                        color="white"
                        backgroundColor="#F4A32B"
                        onPress={() => this.login(this.props.navigation)}
                        buttonStyle={{
                          width: 120,
                          height: 45,
                          marginTop: 0,
                          borderRadius: 5,
                          // borderColor : "rgba(78, 101, 112, 0.25)",
                          // borderWidth : 0
                        }}

                      />
                    </View>
                    <View></View>
                  </View>
              </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        marginHorizontal: 0,
        backgroundColor: 'white'
    },

    input: {
      height: 50,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginTop: 5,
      marginBottom: 15,
    },

    bgImage: {
      flex: 1,
      top: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },

    containerImage: {
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputText: {
      marginLeft:-10,
    },


    containerInputs: {
        marginBottom: 20
    }
})
