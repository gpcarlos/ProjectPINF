import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ScrollView,
    KeyboardAvoidingView,
    StatusBar
} from 'react-native'
import * as firebase from 'firebase'
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import  Icon from 'react-native-vector-icons/Ionicons'
import { Hoshi } from 'react-native-textinput-effects';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { RNCamera, FaceDetector } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker'
import Helpers from '../lib/helpers'
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

console.ignoredYellowBox = [
    'Setting a timer for a long period of time, i.e. multiple minutes',
  ];

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
          imagePath: '',
          imageHeight: '',
          imageWidth: '',
          nickname:''
      }
    }

    static navigationOptions = {
      header:null,
    }

    uploadImage = (uri, sessionId, mime = 'image/jpg') => {
      return new Promise((resolve, reject) => {
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          let uploadBlob = null
          const imageRef = firebase.storage().ref(`/images`).child(`${sessionId}`)
          fs.readFile(uploadUri, 'base64')
              .then((data) => {
                  return Blob.build(data, {type: `${mime};BASE64`})
              })
              .then((blob) => {
                  uploadBlob = blob
                  return imageRef.put(uploadBlob, {contentType: mime})
              })
              .then(() => {
                  uploadBlob.close()
                  return imageRef.getDownloadURL()
              })
              .then((url) => {
                resolve(url)
              })
              .catch((error) => {
                  reject(error)
              })
      })
  }
  openImagepicker(){
      const options = {
          title: 'Select Avatar',
          storageOptions: {
              skipBackup: true,
              path: 'images'
          }
      }
      ImagePicker.showImagePicker(options, (response) => {
          if(response.didCancel){
              /*Error -> Toast? */
          } else if (response.error){
              /* Error por Toast */
          } else if(response.customButton){
              /* No se muestra */
          } else {
              this.setState({
                  imagePath: response.uri,
                  imageHeight: response.height,
                  imageWidth: response.width
              })
          }
      })
  }
  saveData(){
    try {
        const sessionId = new Date().getTime()
        const obj = {
            name: this.state.nickname,
            image: "",
            session: sessionId
        }
        Helpers.setTest(obj)
        this.props.navigation.dispatch(NavigationActions.back())
    } catch(error){
        console.log(error)
    }

  }
  render(){
      return (
          <View style={styles.container}>
              <View style={styles.content}>
                  <View>
                    <Hoshi
                        style={[styles.inputT,{ width:  "90%",flexDirection: 'row', alignItems: 'center', marginLeft:25, justifyContent: 'center'}]}
                        label={'Nickname'}
                        borderColor={'#1E9F9F'}
                        secureTextEntry={false}
                        inputStyle={[styles.inputText]}
                        onChangeText={(nickname) => this.setState({nickname})}
                    />

                      <View style={styles.containerImage}>
                          {this.state.imagePath ? <Image
                              style={{width:  "80%", height: 100, flex: 1, marginRight: 10}}
                              source={{uri: this.state.imagePath}}
                          /> : null }
                      
                  </View>
                  </View>
              </View>
              <View>
                  <TouchableHighlight
                      onPress={this.saveData.bind(this)}
                      style={[styles.button, {marginBottom: 10}]}
                  >
                      <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableHighlight>
              </View>
          </View>
      )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: 'space-between'
    },
    label: {
        flex: 1,
        fontSize: 18
    },
    input: {
        flex: 2,
        fontSize: 18,
        height: 40
    },
    inputT: {
      height: 50,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginTop: 5,
      marginBottom: 15,
    },
    inputTextArea: {
        height: 200,
        flex: 1,
        fontSize: 18
    },
    containerInput: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#cecece',
        alignItems: 'center',
        marginBottom: 10
    },
    containerImage: {
        flexDirection: 'row'
    },
    button: {
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 3
    },
    saveButtonText: {
        color: 'gray'
    },
    noteText:{
      fontWeight: "800"
    }
})
