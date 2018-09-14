import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './firebase.config.js';
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
