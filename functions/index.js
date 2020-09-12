const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore()
console.log("functions");

exports.userCreation = functions.auth.user()
    .onCreate(async (user) => {
        return db.collection('users').doc(user.uid).set({
            email: user.email,
            tags: [],
            authors: []
        })
    })


exports.userDeleted = functions.auth.user()
    .onDelete(async (user) => {
        console.log("user uid =>", user.uid)
        console.log("user email =>", user.email)

        const doc = admin.firestore().collection('users').doc(user.uid)

        doc.delete().then(() => console.log(`doc for ${user.uid} deleted`)).catch(err => console.log(err))

    })
