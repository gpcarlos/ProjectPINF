import React, { Component, PropTypes } from "react";
import {
  AsyncStorage,
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from "react-native";

export default class Consent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.decline = this.decline.bind(this);
  }

  async decline(){
    AsyncStorage.setItem(this.props.pagekey, JSON.stringify({"value":"true"}), (err,result) => {
            });
  }
  componentDidMount() {
    AsyncStorage.getItem(this.props.pagekey, (err, result) => {
      if (err) {
      } else {
        if (result == null || result == true ) {
          console.log("null value recieved", result);
          this.setModalVisible(true);
        } else {
          console.log("result", result);
        }
      }
    });
    AsyncStorage.setItem(this.props.pagekey, JSON.stringify({"value":"true"}), (err,result) => {
            console.log("error",err,"result",result);
            });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
    render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          style={styles.OutContainer}
          visible={this.state.modalVisible}
          onRequestClose={() => { }}
        >
          <View style={styles.OutContainer}>
            <View style={styles.Title}>
              <Text style={styles.Title2}>{this.props.title}</Text>
            </View>
            <View style={styles.DescriptionContainer}>
              <Text style={styles.Description} allowFontScaling={true}>
                {this.props.description}
              </Text>
            </View>
            <View style={styles.ExitContainer}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
              <View style={{flexWrap: 'wrap',
        alignItems: 'flex-end',
        flexDirection:'row',}}>

                <View style={styles.Accept}>
                  <Text style={styles.AcceptButton} >Aceptar</Text>
                </View>
              </View>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}


const styles = StyleSheet.create({
OutContainer:{
		backgroundColor:'rgba(230,230, 230, 0.75)',
		flex:1,
		marginTop:40,
		marginBottom:40,
		marginLeft:20,
		marginRight:20,
		borderRadius:10,
		borderWidth:2,
		borderColor:'rgba(244, 163, 43,0.5)'
	},
	Title2:{
		color:'#4F4A4A',
		fontSize:20,
		textAlign:'center',
		margin:10,
	},
	Description:{
		color:'#4F4A4A',
    fontSize:16,
		marginRight:20,
		marginLeft:20,
    textAlign:'justify',
	},
	Title:{
		flex:1,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	},
	DescriptionContainer:{
		flex:6.5
	},
	Decline:{
		flex:2,
		justifyContent:'flex-start',
		alignItems:'center',
	},
  Accept:{
		flex:2,
		justifyContent:'flex-start',
		alignItems:'center',
	},
	DeclineButton:{
		width:100,
		height:40,
		backgroundColor:'rgba(244, 91, 43, 0.7)',
		borderRadius:10,
		justifyContent:'center',
    marginLeft:10,
    marginRight: 10,
    color:'white',
		fontSize:20,
		fontWeight:'bold',
		textAlign:'center'
	},
  AcceptButton:{
		width:100,
		height:40,
		backgroundColor:'rgba(65, 244, 43, 0.7)',
		borderRadius:10,
		justifyContent:'center',
    marginLeft:10,
    marginRight: 10,
    color:'white',
		fontSize:20,
		fontWeight:'bold',
		textAlign:'center'
	},
	ExitButton:{

	}
});
