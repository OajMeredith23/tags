import React, { useState } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'
import { Input, Group, PrimaryBtn, SecondaryBtn, Message } from 'zyppd-components'
export default function CreateAccount() {

    const [account, setAccount] = useState({ email: '', password: '' })
    const [error, setError] = useState(false)

    function createAccount(email, password) {
        firebase.auth().createUserWithEmailAndPassword(account.email, account.password)
            .then(() => console.log("Created account"))
            .catch(function (error) {
                var errorMessage = error.message;
                setError(errorMessage)
            });
    }

    function handleChange(e) {
        e = e.target || e
        setError(false)
        setAccount(prevState => {
            return {
                ...prevState,
                [e.name]: e.value
            }
        })
    }
    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Group
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '1em',
                    margin: '1em',
                }}
            >
                <h3>Create Account</h3>
                <Input
                    type="text"
                    name="email"
                    message={'Email'}
                    placeholder="email@example.com"
                    validationNeeded={false}
                    handleInput={handleChange}
                />
                <Input
                    type="password"
                    name="password"
                    message={'Password'}
                    validationNeeded={false}
                    handleInput={handleChange}
                />
                {error &&
                    <Message
                        fullWidth={true}
                        style={{
                            marginTop: '1em'
                        }}
                    >
                        {error}
                    </Message>
                }
                <PrimaryBtn
                    style={{
                        margin: '1em 0'
                    }}
                    fullWidth={true}
                    onClick={() => createAccount()}
                >
                    Create Account
                </PrimaryBtn>
                <p>Already have an account?</p>
                <Link to="/signin">
                    <SecondaryBtn
                        style={{
                            margin: '.5em 0'
                        }}
                        fullWidth={true}
                    >
                        Sign in
                    </SecondaryBtn>
                </Link>
            </Group>

        </div>
    )
}