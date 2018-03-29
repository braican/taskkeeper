
import Firebase from 'firebase';
import Rebase from 're-base';

// Initialize Firebase
const config = {
    apiKey            : 'AIzaSyBFdTYZohTWBQeL65icj1x-LaSsfCaRVOI',
    authDomain        : 'taskkeeper-v2.firebaseapp.com',
    databaseURL       : 'https://taskkeeper-v2.firebaseio.com',
    projectId         : 'taskkeeper-v2',
    storageBucket     : 'taskkeeper-v2.appspot.com',
    messagingSenderId : '510225209007',
};
const app = Firebase.initializeApp(config);
const base = Rebase.createClass(app.database());

export default base;
