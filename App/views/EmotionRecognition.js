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
    StatusBar,
    WebView
} from 'react-native'
import * as firebase from 'firebase'
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNCamera, FaceDetector } from 'react-native-camera';
import CountdownCircle from 'react-native-countdown-circle';
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class SkeletonRecognition extends Component {

    constructor(props){
        super(props)
        this.state = {
          condition: '',
          configMode: true,
          countdown: false,
          lprop: 1,
          rprop: 1
        }
        this.webView = null;
    }

    static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
          header:null,
      };
    };

    takePicture = async function() {
      if (this.camera) {
        const options = { quality: 0.5, base64: true, width: 512 };
        const data = await this.camera.takePictureAsync(options)
        const face = await FaceDetector.detectFacesAsync(data.uri)
        console.log(face)
        console.log('Sending image...')
        const sessionId = new Date().getTime()
        //this.uploadImage(data.uri,sessionId)

        this.setState({
          countdown: false
        })
      }
    };

    uploadImage = (uri, sessionId, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            const imageRef = firebase.storage().ref(`/imageEmotion`).child(`${sessionId}`)
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

    render(){
        return (
            <View style={{flex: 1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                <View style={{width:"100%", height:"90%",backgroundColor:"gray"}}>
                    <RNCamera
                        ref={ref => {
                        this.camera = ref;
                        }}
                        style = {styles.preview}
                        type={RNCamera.Constants.Type.front}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        permissionDialogTitle={'Permiso de cámara'}
                        permissionDialogMessage={'Se necesita permiso para usar la cámara'}
                    />
                </View>

                { this.state.countdown
                  ?
                  <View style={{width:"100%", height:"10%", backgroundColor:"black", justifyContent: 'center', alignItems: 'center'}}>
                    <CountdownCircle
                       seconds={3}
                       radius={30}
                       borderWidth={10}
                       color="#1E9F9F"
                       textStyle={{ fontSize: 30 }}
                       onTimeElapsed={this.takePicture.bind(this)}
                   />
                  </View>
                  :
                  <View style={{width:"100%", height:"10%", backgroundColor:"white",flexDirection:'row'}}>
                      <Button
                          title="Configuración"
                          color="gray"
                          backgroundColor="white"
                          onPress={() => this.setState({
                            countdown: true
                          })}
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
                          onPress={() => this.setState({
                            countdown: true
                          })}
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

                }

                {/* <View style={{width:"100%", height:"10%",backgroundColor:"gray",justifyContent: 'center',alignItems: 'center'}}>
                  <CountdownCircle
                     seconds={3}
                     radius={30}
                     borderWidth={10}
                     color="#1E9F9F"
                     textStyle={{ fontSize: 30 }}
                     onTimeElapsed={() => console.log('Elapsed!')}
                 />
                </View> */}

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
