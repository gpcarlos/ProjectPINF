/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import { View, TouchableHighlight, Text, WebView } from 'react-native';

type Props = {};
export default class App extends Component<Props> {
	constructor( props ) {
        super( props );
        this.webView = null;
    }

	onMessage( event ) {
		console.warn(event.nativeEvent.data);
		//**AÑADIDO POR AARON**
		/*configMode debe ser modificada cuando se pulsan los botones
		'configuracion' y 'imitar pose'*/
		if(configMode){
			configurePose(event.nativeEvent.data);
		}else{
			calculateAngles(event.nativeEvent.data);
		}
    }

    configurePose( data ){
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

        //**rprop y lprop son variables globales**
        rprop = Math.sqrt(relbow_rwrist_x*relbow_rwrist_x + relbow_rwrist_y*relbow_rwrist_y) / Math.sqrt(relbow_rshoulder_x*relbow_rshoulder_x + relbow_rshoulder_y*relbow_rshoulder_y);
        lprop = Math.sqrt(lelbow_lwrist_x*lelbow_lwrist_x + lelbow_lwrist_y*lelbow_lwrist_y) / Math.sqrt(lelbow_lshoulder_x*lelbow_lshoulder_x + lelbow_lshoulder_y*lelbow_lshoulder_y);
    }

    calculateAngles( data ){
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

        //R-Alfa angle
        var rshoulder_relbow_x = relbow_x - rshould_x;
        var rshoulder_relbow_y = relbow_y - rshould_y;
        var rshoulder_rhip_x = rhip_x - rshould_x;
        var rshoulder_rhip_y = rhip_y - rshould_y;
        var cos_alfa = rshoulder_relbow_x*rshoulder_rhip_x + rshoulder_relbow_y*rshoulder_rhip_y;
        cos_alfa = cos_alfa / (Math.sqrt(rshoulder_relbow_x*rshoulder_relbow_x + rshoulder_relbow_y*rshoulder_relbow_y) * Math.sqrt(rshoulder_rhip_x*rshoulder_rhip_x + rshoulder_rhip_y*rshoulder_rhip_y));

        var ralfa = Math.acos(cos_alfa)*180 / Math.PI; //angle in the right shoulder

        //L-Alfa angle
        var lshoulder_lelbow_x = lelbow_x - lshould_x;
        var lshoulder_lelbow_y = lelbow_y - lshould_y;
        var lshoulder_lhip_x = lhip_x - lshould_x;
        var lshoulder_lhip_y = lhip_y - lshould_y;
        var cos_alfa2 = lshoulder_lelbow_x*lshoulder_lhip_x + lshoulder_lelbow_y*lshoulder_lhip_y;
        cos_alfa2 = cos_alfa2 / (Math.sqrt(lshoulder_lelbow_x*lshoulder_lelbow_x + lshoulder_lelbow_y*lshoulder_lelbow_y) * Math.sqrt(lshoulder_lhip_x*lshoulder_lhip_x + lshoulder_lhip_y*lshoulder_lhip_y));

        var lalfa = Math.acos(cos_alfa2)*180 / Math.PI; //angle in the left shoulder

        //R-Beta angle
        var relbow_rwrist_x = rwrist_x - relbow_x;
        var relbow_rwrist_y = rwrist_y - relbow_y;
        var relbow_rshoulder_x = rshould_x - relbow_x;
        var relbow_rshoulder_y = rshould_y - relbow_y;
        var cos_beta = relbow_rwrist_x*relbow_rshoulder_x + relbow_rwrist_y*relbow_rshoulder_y;
        cos_beta = cos_beta / (Math.sqrt(relbow_rwrist_x*relbow_rwrist_x + relbow_rwrist_y*relbow_rwrist_y) * Math.sqrt(relbow_rshoulder_x*relbow_rshoulder_x + relbow_rshoulder_y*relbow_rshoulder_y));

        var rbeta = Math.acos(cos_beta)*180 / Math.PI;

        //L-Beta angle
        var lelbow_lwrist_x = lwrist_x - lelbow_x;
        var lelbow_lwrist_y = lwrist_y - lelbow_y;
        var lelbow_lshoulder_x = lshould_x - lelbow_x;
        var lelbow_lshoulder_y = lshould_y - lelbow_y;
        var cos_beta2 = lelbow_lwrist_x*lelbow_lshoulder_x + lelbow_lwrist_y*lelbow_lshoulder_y;
        cos_beta2 = cos_beta2 / (Math.sqrt(lelbow_lwrist_x*lelbow_lwrist_x + lelbow_lwrist_y*lelbow_lwrist_y) * Math.sqrt(lelbow_lshoulder_x*lelbow_lshoulder_x + lelbow_lshoulder_y*lelbow_lshoulder_y));

        var lbeta = Math.acos(cos_beta2)*180 / Math.PI;

        //****Rotation calculation****

        var rforearm_nuevo = Math.sqrt(relbow_rshoulder_x*relbow_rshoulder_x + relbow_rshoulder_y*relbow_rshoulder_y);
        var rarm_nuevo = Math.sqrt(relbow_rwrist_x*relbow_rwrist_x + relbow_rwrist_y*relbow_rwrist_y);
        var lforearm_nuevo = Math.sqrt(lelbow_lshoulder_x*lelbow_lshoulder_x + lelbow_lshoulder_y*lelbow_lshoulder_y);
        var larm_nuevo = Math.sqrt(lelbow_lwrist_x*lelbow_lwrist_x + lelbow_lwrist_y*lelbow_lwrist_y);

        var rrotation;
        var lrotation;

        var rmaximo = rprop / rbeta;
        var lmaximo = lprop / lbeta;

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

        console.warn("****Valores de los angulos****");
        console.warn("ralfa: "+ralfa);
        console.warn("lalfa: "+lalfa);
        console.warn("rbeta: "+rbeta);
        console.warn("lbeta: "+lbeta);
        console.warn("rrotation: "+rrotation);
        console.warn("lrotation: "+lrotation);

        sendParams(ralfa,lalfa,rbeta,lbeta,rrotation,lrotation);
    }

    sendParams( ralfa, lalfa, rbeta, lbeta, rrotation, lrotation ){
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

    sendPostMessage() {
        console.warn( "Sending post message" );
        //this.webView.postMessage( "" );
    }

	render() {
		return (
			<View style={{flex: 1}}>
                <TouchableHighlight style={{padding: 10, backgroundColor: 'blue', marginTop: 20}} onPress={() => this.sendPostMessage()}>
                    <Text style={{color: 'white'}}>Send post message from react native</Text>
                </TouchableHighlight>
                <WebView
                    style={{flex: 1}}
                    source={{uri: 'file:///android_asset/page2.html'}}
                    ref={( webView ) => this.webView = webView}
                    onMessage={this.onMessage}
                />
            </View>
		);
	}
}
