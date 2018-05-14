import * as firebase from 'firebase'

class Firebase {
    static init(){
        firebase.initializeApp({
            apiKey: "AIzaSyD58oW2abP4r3NE2wg-iqidnePDQVsWQNU",
            authDomain: "projectpinf.firebaseapp.com",
            databaseURL: "https://projectpinf.firebaseio.com",
            projectId: "projectpinf",
            storageBucket: "projectpinf.appspot.com",
            messagingSenderId: "776987899707"
        });
    }
}

module.exports = Firebase
