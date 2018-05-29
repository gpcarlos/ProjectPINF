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
          rprop: 1,
          realtime: true
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
        this.webView.postMessage(data.base64)
        const sessionId = new Date().getTime()
        //this.uploadImage(data.uri,sessionId)

        this.setState({
          countdown: false,
          realtime: false
        })
      }
    };

    uploadImage = (uri, sessionId, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            const imageRef = firebase.storage().ref(`/imageSkeleton`).child(`${sessionId}`)
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

    onMessage( event ) {
        pose = event.nativeEvent.data;
        pose = JSON.parse(pose)
        console.log(pose)

        //**AÑADIDO POR AARON**
        /*configMode debe ser modificada cuando se pulsan los botones
        'configuracion' y 'imitar pose'*/
        console.log('Config mode')
        console.log(this.state.configMode)
        if(this.state.configMode){
            this.configurePose(pose);
        }else{
            this.calculateAngles(pose);
        }
    }

    configurePose = ( data ) => {
        var relbow_x=0.0;
        var relbow_y=0.0;
        var lelbow_x=0.0;
        var lelbow_y=0.0;
        var lwrist_x=0.0;
        var lwrist_y=0.0;
        var rwrist_x=0.0;
        var rwrist_y=0.0;
        var rshould_x=0.0;
        var rshould_y=0.0;
        var lshould_x=0.0;
        var lshould_y=0.0;
        console.log('Configurando pose')
        for (i in data.keypoints){
            if(data.keypoints[i].part == "rightElbow"){
                relbow_x = data.keypoints[i].position.x;
                relbow_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftElbow"){
                lelbow_x = data.keypoints[i].position.x;
                lelbow_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftWrist"){
                lwrist_x = data.keypoints[i].position.x;
                lwrist_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "rightWrist"){
                rwrist_x = data.keypoints[i].position.x;
                rwrist_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "rightShoulder"){
                rshould_x = data.keypoints[i].position.x;
                rshould_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftShoulder"){
                lshould_x = data.keypoints[i].position.x;
                lshould_y = data.keypoints[i].position.y;
            }
        }

        var relbow_rwrist_x = rwrist_x - relbow_x;
        var relbow_rwrist_y = rwrist_y - relbow_y;
        var relbow_rshoulder_x = rshould_x - relbow_x;
        var relbow_rshoulder_y = rshould_y - relbow_y;

        var lelbow_lwrist_x = lwrist_x - lelbow_x;
        var lelbow_lwrist_y = lwrist_y - lelbow_y;
        var lelbow_lshoulder_x = lshould_x - lelbow_x;
        var lelbow_lshoulder_y = lshould_y - lelbow_y;

        console.log('Calculando rprop y lpropr')
        //**rprop y lprop son variables globales**
        rprop_tmp = Math.sqrt(relbow_rwrist_x*relbow_rwrist_x + relbow_rwrist_y*relbow_rwrist_y) / Math.sqrt(relbow_rshoulder_x*relbow_rshoulder_x + relbow_rshoulder_y*relbow_rshoulder_y);
        lprop_tmp = Math.sqrt(lelbow_lwrist_x*lelbow_lwrist_x + lelbow_lwrist_y*lelbow_lwrist_y) / Math.sqrt(lelbow_lshoulder_x*lelbow_lshoulder_x + lelbow_lshoulder_y*lelbow_lshoulder_y);
        console.log('Fin configurePose')
        this.setState({
          rprop: rprop_tmp,
          lprop: lprop_tmp
        })
    }

    calculateAngles = ( data ) => {
        var rhip_x=0.0;
        var rhip_y=0.0;
        var lhip_x=0.0;
        var lhip_y=0.0;
        var rshould_x=0.0;
        var rshould_y=0.0;
        var relbow_x=0.0;
        var relbow_y=0.0;
        var lshould_x=0.0;
        var lshould_y=0.0;
        var lelbow_x=0.0;
        var lelbow_y=0.0;
        var lwrist_x=0.0;
        var lwrist_y=0.0;
        var rwrist_x=0.0;
        var rwrist_y=0.0;
        console.log('Configurando ángulos')
        for (i in data.keypoints){
            if(data.keypoints[i].part == "rightElbow"){
                relbow_x = data.keypoints[i].position.x;
                relbow_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftElbow"){
                lelbow_x = data.keypoints[i].position.x;
                lelbow_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftWrist"){
                lwrist_x = data.keypoints[i].position.x;
                lwrist_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "rightWrist"){
                rwrist_x = data.keypoints[i].position.x;
                rwrist_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "rightShoulder"){
                rshould_x = data.keypoints[i].position.x;
                rshould_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftShoulder"){
                lshould_x = data.keypoints[i].position.x;
                lshould_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "leftHip"){
                lhip_x = data.keypoints[i].position.x;
                lhip_y = data.keypoints[i].position.y;
            }else if(data.keypoints[i].part == "rightHip"){
                rhip_x = data.keypoints[i].position.x;
                rhip_y = data.keypoints[i].position.y;
            }
        }

        console.log('Calculando R-alpha')
        console.log('relbow_x')
        console.log(relbow_x)
        console.log('rshould_x')
        console.log(rshould_x)
        console.log('relbow_y')
        console.log(relbow_y)
        console.log('rshould_y')
        console.log(rshould_y)
        console.log('rhip_x')
        console.log(rhip_x)
        console.log('rhip_y')
        console.log(rhip_y)
        //R-Alfa angle
        var rshoulder_relbow_x = relbow_x - rshould_x;
        var rshoulder_relbow_y = relbow_y - rshould_y;
        var rshoulder_rhip_x = rhip_x - rshould_x;
        var rshoulder_rhip_y = rhip_y - rshould_y;
        var cos_alfa = rshoulder_relbow_x*rshoulder_rhip_x + rshoulder_relbow_y*rshoulder_rhip_y;
        cos_alfa = cos_alfa / (Math.sqrt(rshoulder_relbow_x*rshoulder_relbow_x + rshoulder_relbow_y*rshoulder_relbow_y) * Math.sqrt(rshoulder_rhip_x*rshoulder_rhip_x + rshoulder_rhip_y*rshoulder_rhip_y));

        var ralfa = Math.acos(cos_alfa)*180 / Math.PI; //angle in the right shoulder

        console.log('Calculando L-alpha')
        //L-Alfa angle
        var lshoulder_lelbow_x = lelbow_x - lshould_x;
        var lshoulder_lelbow_y = lelbow_y - lshould_y;
        var lshoulder_lhip_x = lhip_x - lshould_x;
        var lshoulder_lhip_y = lhip_y - lshould_y;
        var cos_alfa2 = lshoulder_lelbow_x*lshoulder_lhip_x + lshoulder_lelbow_y*lshoulder_lhip_y;
        cos_alfa2 = cos_alfa2 / (Math.sqrt(lshoulder_lelbow_x*lshoulder_lelbow_x + lshoulder_lelbow_y*lshoulder_lelbow_y) * Math.sqrt(lshoulder_lhip_x*lshoulder_lhip_x + lshoulder_lhip_y*lshoulder_lhip_y));

        var lalfa = Math.acos(cos_alfa2)*180 / Math.PI; //angle in the left shoulder

        console.log('Calculando R-beta')
        //R-Beta angle
        var relbow_rwrist_x = rwrist_x - relbow_x;
        var relbow_rwrist_y = rwrist_y - relbow_y;
        var relbow_rshoulder_x = rshould_x - relbow_x;
        var relbow_rshoulder_y = rshould_y - relbow_y;
        var cos_beta = relbow_rwrist_x*relbow_rshoulder_x + relbow_rwrist_y*relbow_rshoulder_y;
        cos_beta = cos_beta / (Math.sqrt(relbow_rwrist_x*relbow_rwrist_x + relbow_rwrist_y*relbow_rwrist_y) * Math.sqrt(relbow_rshoulder_x*relbow_rshoulder_x + relbow_rshoulder_y*relbow_rshoulder_y));

        var rbeta = Math.acos(cos_beta)*180 / Math.PI;

        console.log('Calculando L-beta')
        //L-Beta angle
        var lelbow_lwrist_x = lwrist_x - lelbow_x;
        var lelbow_lwrist_y = lwrist_y - lelbow_y;
        var lelbow_lshoulder_x = lshould_x - lelbow_x;
        var lelbow_lshoulder_y = lshould_y - lelbow_y;
        var cos_beta2 = lelbow_lwrist_x*lelbow_lshoulder_x + lelbow_lwrist_y*lelbow_lshoulder_y;
        cos_beta2 = cos_beta2 / (Math.sqrt(lelbow_lwrist_x*lelbow_lwrist_x + lelbow_lwrist_y*lelbow_lwrist_y) * Math.sqrt(lelbow_lshoulder_x*lelbow_lshoulder_x + lelbow_lshoulder_y*lelbow_lshoulder_y));

        var lbeta = Math.acos(cos_beta2)*180 / Math.PI;

        //****Rotation calculation****
        console.log('Rotation calculation')
        var rforearm_nuevo = Math.sqrt(relbow_rshoulder_x*relbow_rshoulder_x + relbow_rshoulder_y*relbow_rshoulder_y);
        var rarm_nuevo = Math.sqrt(relbow_rwrist_x*relbow_rwrist_x + relbow_rwrist_y*relbow_rwrist_y);
        var lforearm_nuevo = Math.sqrt(lelbow_lshoulder_x*lelbow_lshoulder_x + lelbow_lshoulder_y*lelbow_lshoulder_y);
        var larm_nuevo = Math.sqrt(lelbow_lwrist_x*lelbow_lwrist_x + lelbow_lwrist_y*lelbow_lwrist_y);

        var rrotation;
        var lrotation;

        var rmaximo = this.state.rprop / rbeta;
        var lmaximo = this.state.lprop / lbeta;

        var rprop_nuevo = rarm_nuevo / rforearm_nuevo;
        var lprop_nuevo = larm_nuevo / lforearm_nuevo;

        var raux = rprop_nuevo / rbeta;
        var laux = lprop_nuevo / lbeta;

        if(rwrist_y >= relbow_y){
            rrotation = 90 - (raux*90) / rmaximo;
        }else{
            rrotation = 90 + (raux*90) / rmaximo;
        }

        if(lwrist_y >= lelbow_y){
            lrotation = 90 - (laux*90) / lmaximo;
        }else{
            lrotation = 90 + (laux*90) / lmaximo;
        }

        console.log("****Valores de los angulos****");
        console.log("ralfa: "+ralfa);
        console.log("lalfa: "+lalfa);
        console.log("rbeta: "+rbeta);
        console.log("lbeta: "+lbeta);
        console.log("rrotation: "+rrotation);
        console.log("lrotation: "+lrotation);

        this.sendParams(ralfa,lalfa,rbeta,lbeta,rrotation,lrotation);
    }

    sendParams = ( ralfa, lalfa, rbeta, lbeta, rrotation, lrotation ) => {
        //**Real range adaptation**
        if(ralfa > 130) ralfa=130;
        if(lalfa > 130) lalfa=130;
        rbeta = 180-rbeta;
        lbeta = 180-lbeta;
        if(rbeta > 90) rbeta=90;
        if(lbeta > 90) lbeta=90;
        rrotation = 180-rrotation;
        lrotation = 180-lrotation;

        //**Range value adaptation**
        var servo_1 = Math.floor((ralfa*100) / 130);
        var servo_4 = Math.floor((lalfa*100) / 130);

        var servo_2 = Math.floor((rrotation*100) / 180);
        var servo_5 = Math.floor((lrotation*100) / 180);

        var servo_3 = Math.floor((rbeta*100) / 90);
        var servo_6 = Math.floor((lbeta*100) / 90);

        //**Message construction**
        var msg_servo1 = 0;
        msg_servo1 |= ((servo_1&0xFF) << 8) | (6 << 16);

        var msg_servo4 = 0;
        msg_servo4 |= ((servo_4&0xFF) << 8) | (9 << 16);

        var msg_servo2 = 0;
        msg_servo2 |= ((servo_2&0xFF) << 8) | (7 << 16);

        var msg_servo5 = 0;
        msg_servo5 |= ((servo_5&0xFF) << 8) | (10 << 16);

        var msg_servo3 = 0;
        msg_servo3 |= ((servo_3&0xFF) << 8) | (8 << 16);

        var msg_servo6 = 0;
        msg_servo6 |= ((servo_6&0xFF) << 8) | (11 << 16);

        //**Send params**
        /*TODO*/
    }

    render(){
        return (
            <View style={{flex: 1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                <View style={{width:"100%", height:(this.state.realtime) ? '0%' : '90%' ,backgroundColor:"gray"}}>
                    <WebView
                        style={{flex: 1}}
                        source={{ uri: 'file:///android_asset/skeleton.html'}}
                        ref={( webView ) => this.webView = webView}
                        onMessage={this.onMessage.bind(this)}
                    />
                </View>
                <View style={{width:"100%", height:(this.state.realtime) ? '90%': '0%',backgroundColor:"gray"}}>
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
                    {this.state.realtime ?
                      <Button
                          title="Configuración"
                          color="gray"
                          backgroundColor="white"
                          onPress={() => this.setState({
                            countdown: true,
                            configMode: true
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
                        :null}
                    {this.state.realtime ?
                        <Button
                          title="Imitar Pose"
                          color="gray"
                          backgroundColor="white"
                          onPress={() => this.setState({
                            countdown: true,
                            configMode: false
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
                    :
                    <Button
                          title="Volver"
                          color="gray"
                          backgroundColor="white"
                          onPress={() => this.setState({
                            realtime: true
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
                    }
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
