import * as firebase from 'firebase'
import {ToastAndroid} from 'react-native'

class Helpers {
    static setTest(obj){
      let path  =  "/" +firebase.auth().currentUser.uid + '/Usuarios/'
      firebase.database().ref(path).push(obj);


    }

    static getUsers(callback){
        let path = "/" +firebase.auth().currentUser.uid + '/Usuarios/'
        let arrayOfUsers = []

        firebase.database().ref(path).on('value', (snapshot) => {
            let data = snapshot.val()
            if(data){
                for(let key in data){
                    let user = data[key]
                    console.warn(data[key]);
                    arrayOfUsers.push({
                      key: key,
                      name: user.name,
                      image: user.image,
                      session: user.session
                    })
                }
            }
            callback(arrayOfUsers)
        })
    }

    static deleteUser(user){
        let path = "/" +firebase.auth().currentUser.uid + '/Usuarios/'
        var storage = firebase.storage();

// Create a storage reference from our storage service
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('images');
        console.log(user.session)
        var userRef = firebase.storage().ref(`/images`).child(String(user.session));
        // Delete the file
        userRef.delete().then(function() {
            console.log("good")
        }).catch(function(error) {
            console.log('bad')
        });
        firebase.database().ref(path+user.key).remove()

    }

}

module.exports = Helpers
