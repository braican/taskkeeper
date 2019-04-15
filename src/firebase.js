import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBPvqwp8mNKe4CSI1KCAhO4g2t9t_gIZb8',
  authDomain: 'taskkeeper-v2-759a9.firebaseapp.com',
  databaseURL: 'https://taskkeeper-v2-759a9.firebaseio.com',
  projectId: 'taskkeeper-v2-759a9',
  storageBucket: 'taskkeeper-v2-759a9.appspot.com',
  messagingSenderId: '326865321890',
};

firebase.initializeApp(config);

export default firebase;
