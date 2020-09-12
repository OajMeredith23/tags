import React, { useContext } from 'react';
import { AuthContext } from './Auth/AuthContext'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { ZyppdComponents, Footer } from 'zyppd-components'
import SignIn from './Auth/SignIn'
import CreateAccount from './Auth/CreateAccount'
import MainApp from './MainApp/MainApp'

function App() {
  const { signIn, user, signOut, notes, userInfo } = useContext(AuthContext)
  // console.log(userInfo.darkmode)

  const theme = userInfo && userInfo.darkmode ? ['#333', '#444'] : ['#f9f9f9', '#f1f1f1']
  return (
    <ZyppdComponents
      brandColor="#d43159"
      range={theme}
      toastPosition="bottom-center"
    >
      <Router>

        <Route exact path="/">
          {!user ?
            <>
              <CreateAccount />

            </>
            : <MainApp user={user} signOut={signOut} notes={notes} userInfo={userInfo} />
          }
        </Route>

        <Route exact path="/signin">
          <SignIn signIn={signIn} />
        </Route>

      </Router>
      {/* <Footer /> */}
    </ZyppdComponents>
  );
}

export default App;
