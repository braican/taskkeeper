import Firebase from 'firebase';
import Rebase from 're-base';

import config from './firebase-config';
const app = Firebase.initializeApp(config);
const base = Rebase.createClass(app.database());

export default base;
