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


exports.sendBibliography = functions.https.onRequest(async (req, res) => {
    console.log(req.body)


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'oliver@zyppd.in',
            pass: 'zyFQj9VAgCPzBPr'
        }
    })

    let mailOptions = {
        from: `Tags <bookings@zyppd.in>`,
        to: req.body.to,
        subject: 'Bibliography',
        html: req.body.bibliography
    }

    try {

        const mailer = await transporter.sendMail(mailOptions, (err, data) => {

            if (!err) {
                console.log('Email sent to ', to, 'for ', subject)
                return res.send({ success: true })
            } else {
                console.log("err =>", err)
                return res.send({ err: err })
            }
        })
    } catch (err) {
        console.log("email error =>", err)
    }

    res.status(200).send("true")
})
