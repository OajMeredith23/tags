import React, { useState, useContext } from 'react'
import { AuthContext } from '../Auth/AuthContext'
import { Link } from 'react-router-dom'
import { Group, Input, PrimaryBtn, SecondaryBtn, Message } from 'zyppd-components'

export default function SignIn() {
    const { signIn, errorMessage } = useContext(AuthContext)
    console.log(errorMessage)
    const [error, setError] = useState()
    const [account, setAccount] = useState({ email: '', password: '' })

    function handleSignIn() {
        console.log(account)

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
                <h2>Sign in</h2>
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

                {errorMessage &&
                    <Message style={{
                        marginTop: '1em'
                    }}>
                        {errorMessage}
                    </Message>
                }

                <PrimaryBtn
                    style={{
                        margin: '1em 0'
                    }}
                    fullWidth={true}
                    onClick={() => signIn(account.email, account.password)}
                >
                    Sign In
                </PrimaryBtn>

                <div
                    style={{
                        marginTop: '1em'
                    }}
                >
                    <Link to="/">
                        <SecondaryBtn
                            fullWidth={true}
                            style={{ margin: '.5em' }}
                        >

                            Create an account instead
                        </SecondaryBtn>
                    </Link>
                </div>
            </Group>
        </div>
    )
}