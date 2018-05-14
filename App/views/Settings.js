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
    ListView
} from 'react-native'
import * as firebase from 'firebase'
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Helpers from '../lib/helpers'
import LinearGradient from 'react-native-linear-gradient';


console.ignoredYellowBox = [
    'Setting a timer for a long period of time, i.e. multiple minutes',
  ];

export default class Settings extends Component {
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            uid: '',
            dataSource: ds.cloneWithRows([]),
            foo: "",
            email: '',
            password: '',
            response: '',

        }
        
    }

    componentWillMount() {
        try {
            let user = firebase.auth().currentUser
            this.setState({
                uid: user.uid
            })
            Helpers.getUsers((Users) => {
                if(Users){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(Users),
                        rawUsers: Users
                    })
                }
            })
        } catch(error){
            console.log(error)
        }
        this.props.navigation.setParams({ logout: this._logout.bind(this) });

    }

    deleteUser(user){
        Helpers.deleteUser(user)
        Helpers.getUsers((Users) => {
            if(Users){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(Users),
                    rawUsers: Users
                })
            }
        })
    }

    _logout = () => {
      firebase.auth().signOut().then(function(){
        this.props.navigator.navigate('Loading')
      }).catch(function(error){

      });
    }

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {}
        return{
            title: 'Users',
            headerStyle: {
                backgroundColor: '#F4A32B',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
              },
            headerRight: <FontAwesome name="user-plus" size={32} color="white" style={{marginRight:10}} onPress={()=>navigation.navigate('AddUser')} />
        }
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

    renderRow(user){
        let icon = user.mail_enviado ? "ios-mail" : "ios-mail-outline";
        return (
            <View style={{flex: 1,flexDirection: 'row', justifyContent: 'flex-end',alignItems:'center'}} >
                  <View style={[styles.footerContainer, user.completado ? styles.completado : styles.nocompletado]}>

                      <View
                          style={[styles.imageUser,{width:"10%"}]}
                      >
                      <Image
                          style={[styles.imageAvatar,{marginLeft:5,marginRight:5}]}
                          source={{uri: user.image}}
                      />
                      </View>
                      <View style={{width:"1.5%"}}>

                      </View>
                      <View style={[styles.footerTextContainer,{width: "80%",marginLeft:5}]}>
                          <Text style={[styles.text, styles.textTitle]}>{user.name}</Text>
                      </View>
                      <View style={{width: "8.5%",marginRight:5}}>
                        <FontAwesome name="user-times" size={32} color="gray" onPress={()=>this.deleteUser(user)} />
                      </View>
                  </View>
            </View>
        )
    }
    render(){
        return (
            <View style={styles.container}>
                
            <ScrollView style={{backgroundColor:'white'}}>

                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    style={{flex: 1}}
                />

            </ScrollView>

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
    actionButtonIcon: {
        fontSize: 28,
        color: 'white',
      },
      container: {
          flex: 1
      },
      footerContainer: {
         flexDirection: 'row',
         paddingHorizontal: 10,
         paddingVertical: 10,
         backgroundColor: '#FFF',
      },
      imageAvatar: {
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 0
      },
      listContainer: {
          marginHorizontal: 10
      },
      text: {
          color: '#000',
          marginLeft: 10,
          fontSize: 8
      },
      containerCell: {
          marginBottom: 10
      },
      textTitle: {
          fontSize: 18
      },
      textBy: {
          fontSize: 14,
          color: "rgb(49, 164, 247)",
          marginRight:10
      },
      textMenu: {
          fontSize: 20,
          color: '#fff'
      },
  
      inputText: {
          height: 20,
          borderWidth: 0.7,
          borderColor: 'rgb( 0, 96, 140)',
          borderRadius: 15,
          paddingHorizontal: 10,
          color: 'rgb(135,135,135)',
          backgroundColor: 'white',
          marginTop: 0,
          marginBottom: 0,
  
      },
  
      completado: {
        backgroundColor: "rgba(241, 140, 0, 0.13)"
      },
  
      nocompletado: {
        backgroundColor: "white"
  
      },
      linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
      },
})
