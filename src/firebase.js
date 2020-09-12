
import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyBs5i1akrhK3T1oN_ftntt3nzPbAsn15vQ",
    authDomain: "tags-92d67.firebaseapp.com",
    databaseURL: "https://tags-92d67.firebaseio.com",
    projectId: "tags-92d67",
    storageBucket: "tags-92d67.appspot.com",
    messagingSenderId: "65876802256",
    appId: "1:65876802256:web:062dea6d38f5cc59773cd5",
    measurementId: "G-GBKTEFLERE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase