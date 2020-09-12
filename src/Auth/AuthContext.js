import React, { useState, useEffect } from 'react'
import firebase from '../firebase'

export const AuthContext = React.createContext([() => { }, () => { }, {}]);


const AuthContextProvider = ({ children }, props) => {
    const db = firebase.firestore()
    const [user, setUser] = useState(false)
    const [notes, setNotes] = useState(false)
    const [userInfo, setUserInfo] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    function signIn(email, password) {

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((data) => {
                setUser(data)
                window.location.href = '/';
            })
            .catch(function (error) {
                var errorCode = error.code;
                console.log(errorCode)
                var errorMessage = error.message;
                setErrorMessage(errorMessage)
            });
    }

    async function getNotes(user) {

        db.collection(`users/${user.uid}/notes`)
            // .doc(user.uid)
            .onSnapshot((snapshot) => {
                const n = []
                snapshot.forEach(doc => n.push(doc.data()))
                setNotes(n)
            })
        db.collection(`users`).doc(user.uid)
            // .doc(user.uid)
            .onSnapshot((doc) => {
                setUserInfo(doc.data())
            })
        // .then((doc) => console.log(doc))
        // .catch(err => console.log(err))

    }

    function signOut() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            setUser({})
        }).catch(function (error) {
            // An error happened.
        });
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUser(user)
                getNotes(user)
            } else {
                // User is signed out.
                setUser(false)
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AuthContext.Provider value={{ signIn, signOut, user, userInfo, notes, errorMessage }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider