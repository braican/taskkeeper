import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import settings from './.runtimeconfig.json';

const config = {
    apiKey: settings.config.key,
    authDomain: 'taskkeeper-v2-9dbdd.firebaseapp.com',
    databaseURL: 'https://taskkeeper-v2-9dbdd.firebaseio.com',
    projectId: 'taskkeeper-v2-9dbdd',
    storageBucket: 'taskkeeper-v2-9dbdd.appspot.com',
    messagingSenderId: '816495353954'
};

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });
// export const provider = new firebase.auth.GoogleAuthProvider();
// export const auth = firebase.auth();
export default firebase;
