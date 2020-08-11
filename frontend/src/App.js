import React, { useState, Component } from 'react';
import { withRouter, Redirect, Route } from 'react-router-dom';
import { Box, Button, Collapsible, Heading, Grommet, Layer, Main, Menu, Nav, ResponsiveContext } from 'grommet';
import { FormClose, User } from 'grommet-icons';
import { hpe } from 'grommet-theme-hpe';

/* Load local files */
import { withAPIService, withFirebaseService } from './hoc';

import { RouterButton, RouterAnchor } from './components/ext/RoutedControls';
import Sidebar from './components/sidebar/Sidebar';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NewPick from './components/pages/NewPick';
import Dashboard from './components/pages/Dashboard';
import OpenPick from './components/pages/OpenPick';
//import Profile from './components/pages/Profile';

const theme = {
  global: {
    colors: {
      //brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    }
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);

const initialState = {
  authenticated: false,
  error: '',
  user: null,
  loading: true,
  showSidebar: false
};

const AppRoutes = ({ authenticated, user }) =>
  (authenticated) ? (
    <Box flex>
      <Route exact path="/login"> <Redirect to="/dashboard" /></Route>
      <Route exact path="/register"><Redirect to="/dashboard" /></Route>
      <Route exact path="/dashboard">
        <Dashboard user={user} />
      </Route>
      <Route exact path="/newpick">
        <NewPick user={user} />
      </Route>
      <Route exact path="/pick/:id">
        <OpenPick user={user} />
      </Route>
    </Box>
  ) : (
      <Box flex align='center' justify='center'>
        <Route exact path="/login"> <Login /></Route>
        <Route exact path="/register"><Register /></Route>
      </Box>
    )

class App extends Component {

  state = initialState;

  setApplicationUser = async (loggedInUser) => {
    const idToken = await loggedInUser.getIdToken();
    //const userPreferences = await this.state.fbDB.collection('users').doc(`${loggedInUser.uid}`).get();
    await this.setState({
      authenticated: true,
      user: {
        displayName: loggedInUser.displayName ? loggedInUser.displayName : loggedInUser.email,
        email: loggedInUser.email,
        id: loggedInUser.uid,
        idToken: idToken
      },
      //response: (userPreferences.exists ? userPreferences.data() : null),
      loading: false
    });
    //await this.getStorage();
  }

  handleAuthLogin = (user) => {
    if (user) {
      this.setApplicationUser(user);
    } else {
      this.setState(
        {
          authenticated: false,
          loggedInUser: null,
          loading: false
        }
      );
    }
  }

  signOut = async () => {
    await this.setState({ loading: true });
    await this.props.FirebaseService.getAuth().signOut();
    await this.reset();
  }

  reset = async () => {
    await this.setState(initialState);
    await this.setState({ loading: false });
  }

  componentDidMount() {
    const auth = this.props.FirebaseService.getAuth();
    if (auth.currentUser) {
      this.setApplicationUser(auth.currentUser);
    }
    auth.onAuthStateChanged(this.handleAuthLogin);
  }

  render() {
    const { authenticated, user } = this.state;
    return (
      <Grommet theme={hpe} themeMode="light" full>
        <ResponsiveContext.Consumer>
          {size => (
            <Box fill>
              <AppBar>
                <Heading level='2' margin='none'><RouterAnchor path="/" color="light-1">Pick1</RouterAnchor></Heading>
                <Box direction="row">
                  <Button icon={<User />} onClick={() => this.setState({ showSidebar: !this.state.showSidebar })} />
                  {(authenticated) ? (
                    <Menu
                      dropProps={{
                        align: { top: 'bottom', left: 'left' },
                        elevation: 'xlarge',
                      }}
                      label={user.displayName}
                      items={[
                        { label: 'Logout', onClick: this.signOut },
                      ]}
                    />
                  ) : (
                      <RouterButton path="/login" icon={<User />} label="Login"></RouterButton>
                    )
                  }
                </Box>
              </AppBar>
              <Main direction="row" flex overflow={{ horizontal: 'hidden' }}>
                {/* {(!this.state.showSidebar || size !== 'small') ? (
                  <Collapsible direction="horizontal" open={this.state.showSidebar}>
                    <Box
                      flex
                      width='medium'
                      background='light-2'
                      elevation='small'
                      align='center'
                      justify='center'
                    >
                      <Sidebar />
                    </Box>
                  </Collapsible>
                ) : (
                    <Layer>
                      <Box
                        background='light-2'
                        tag='header'
                        justify='end'
                        align='center'
                        direction='row'
                      >
                        <Button
                          icon={<FormClose />}
                          onClick={() => this.setState({ showSidebar: false })}
                        />
                      </Box>
                      <Box
                        fill
                        background='light-2'
                        align='center'
                        justify='center'
                      >
                        <Sidebar />
                      </Box>
                    </Layer>
                  )} */}
                <AppRoutes user={user} authenticated={authenticated} />
              </Main>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet >
    );
  }
}

const WrappedComponent = withRouter(withAPIService(withFirebaseService(App)));

export default WrappedComponent;
