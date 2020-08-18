import React, { Component } from 'react';
import { withRouter, Redirect, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications'

import {
  Anchor,
  Box,
  Button,
  Collapsible,
  Grommet,
  Header,
  Heading,
  Layer,
  List,
  Main,
  Nav,
  ResponsiveContext,
  Sidebar,
  Text
} from 'grommet';
import { FormClose, Chat, User } from 'grommet-icons';

/* Load local files */
import { withAPIService, withFirebaseService } from './hoc';

import { RouterButton, RouterAnchor } from './components/ext/RoutedControls';
import NotificationToast from './components/lib/NotificationToast';

import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NewPick from './components/pages/NewPick';
import Dashboard from './components/pages/Dashboard';
import OpenPick from './components/pages/OpenPick';
import Home from './components/pages/Home';

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

const AppHeader = ({ hasOpenButton, onOpenButtonClick, user, ...props }) => (
  <Header
    direction="row"
    fill="horizontal"
    style={{ zIndex: '1' }}
    border={{
      color: "dark-3",
      size: "xsmall",
      style: "solid",
      side: "bottom"
    }}
    {...props}
    pad="xsmall"
    height="xxsmall"
  >
    <Box direction="row" align="center">
      {hasOpenButton &&
        <Button icon={<Chat size="medium" color="brand" />}
          onClick={onOpenButtonClick}
          pad="xsmall" />
      }
      <RouterAnchor path="/">On vote ?</RouterAnchor>
    </Box>
    <Nav direction="row">
      {(user) ? (
        <Text size="small">{user.displayName}</Text>
      ) : (
          <Anchor icon={<User />} href="/login" hoverIndicator />
        )
      }
    </Nav>

  </Header>
)

const AppSidebar = ({ user, onCloseButtonClick, onLogout, ...props }) => (
  <Sidebar width="medium" background="brand" pad="xsmall"
    footer=
    {<Box align="start" pad="xsmall">
      <Button icon={<User size="medium" color="light-1" />}
        label="Log out"
        onClick={onLogout}
        pad="xsmall"
        plain />
    </Box>}
    {...props}
  >
    <Header>
      <Button icon={<Chat size="medium" color="light-1" />}
        onClick={onCloseButtonClick}
        pad="xsmall" />

      <Button icon={<FormClose size="medium" color="light-1" />}
        onClick={onCloseButtonClick}
        pad="xsmall" />
    </Header>
    <Box>
      <List primaryKey="label"
        data={[
          { label: "Mes votes" },
          { label: "Nouveau vote" },
          { label: "Rejoindre un vote" },
          { label: "Mes listes" }
        ]}></List>
    </Box>
  </Sidebar>
)

const initialState = {
  authenticated: false,
  error: '',
  user: null,
  loading: true,
  showSidebar: false
};

const AppRoutes = ({ authenticated, user }) => {
  return (authenticated) ? (
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
      <Route exact path="/"><Home /></Route>
    </Box>
  ) : (
      <Box flex align='center' justify='center'>
        <Route exact path="/login"> <Login /></Route>
        <Route exact path="/register"><Register /></Route>
        <Route exact path="/"><Home /></Route>
      </Box>
    )
}

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
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {size => (
            <Main direction="row" flex overflow={{ horizontal: 'hidden' }}>
              {(!this.state.showSidebar || size !== 'small') ? (
                <Collapsible direction="horizontal" open={this.state.showSidebar}>
                  <AppSidebar onCloseButtonClick={() => this.setState({ showSidebar: false })}
                    onLogout={this.signOut} />
                </Collapsible>
              ) : (
                  <Layer>
                    <AppSidebar onCloseButtonClick={() => this.setState({ showSidebar: false })}
                      onLogout={this.signOut}
                      fill />
                  </Layer>
                )}
              <Box fill="horizontal">
                <AppHeader
                  hasOpenButton={!this.state.showSidebar}
                  onOpenButtonClick={() => this.setState({ showSidebar: true })}
                  user={user}
                />

                <ToastProvider autoDismiss
                  autoDismissTimeout={6000}
                  components={{ Toast: NotificationToast }}
                  placement="bottom-center">
                  <AppRoutes user={user} authenticated={authenticated} />
                </ToastProvider>
              </Box>
            </Main>
          )}
        </ResponsiveContext.Consumer>
      </Grommet >
    );
  }
}

const WrappedComponent = withRouter(withAPIService(withFirebaseService(App)));

export default WrappedComponent;
