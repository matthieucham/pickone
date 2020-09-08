import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import {
  Anchor,
  Box,
  Button,
  Collapsible,
  Grommet,
  Header,
  Layer,
  ResponsiveContext,
  Text
} from 'grommet';
import { Chat, Menu, Notification } from 'grommet-icons';

/* Load local files */
import { withAPIService, withFirebaseService, withToast } from './hoc';

import NotificationToast from './components/lib/NotificationToast';
import PushMessageToast from './components/lib/PushMessageToast';

import { RouterAnchor } from "./components/ext/RoutedControls";

import Login from './components/login/Login';
import Register from './components/pages/Register';
import NewPick from './components/pages/NewPick';
import Dashboard from './components/pages/Dashboard';
import OpenPick from './components/pages/OpenPick';
import Home from './components/pages/Home';
import ChoicesLists from './components/pages/ChoicesLists';
import EditList from './components/pages/EditList';
import About from './components/pages/About';
import AppSidebar from './components/pages/Sidebar';


import { connect } from "react-redux";


const theme = {
  global: {
    colors: {
      brand: '#3D138D',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    }
  }
};


const AppHeader = ({ hasOpenButton, hasNotif, onOpenButtonClick, user, messaging, ...props }) => (
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
    <Box align="center">
      <Anchor href="/" color="brand" icon={<Chat />} label="On vote ?" />
    </Box>
    <Box align="center" direction="row">
      {
        hasNotif &&
        <ToastProvider autoDismiss
          autoDismissTimeout={30000}
          components={{ Toast: PushMessageToast }}
          placement="top-right">
          <DecoratedPushMessageNotifier messaging={messaging} />
        </ToastProvider>
      }
      {hasOpenButton &&
        <Button icon={<Menu color="brand" />}
          onClick={onOpenButtonClick}
          pad="xsmall" />}
    </Box>

  </Header>
)

class PushMessageNotifier extends Component {
  componentDidMount() {
    this.props.messaging.onMessage((payload) => {
      if (payload.data.pickStatus === "TERMINATED") {
        this.props.addToast(
          <Box>
            <Text>Vote terminé : {payload.data.pickTitle}</Text>
            <RouterAnchor path={`/pick/${payload.data.pickId}`} label="Cliquer pour voir le résultat" />
          </Box>
          , { appearance: "info" });
      } else if (payload.data.pickStatus === "CANCELLED") {
        this.props.addToast(`Vote annulé : ${payload.data.pickTitle}`, { appearance: "warning" });
      }
    });
  }

  render() {
    return (
      <Button icon={<Notification color="brand" />}
        onClick={() => { }}
        pad="xsmall" />);
  }
}

const DecoratedPushMessageNotifier = withToast(withFirebaseService(PushMessageNotifier));


const WrappedOpenPick = withRouter(OpenPick);

const AppRoutes = ({ user, onDisplayNameChanged }) => {
  return (user) ? (
    <Box flex>
      <Switch>
        <Route exact path="/login">
          <Redirect to="/dashboard" />
        </Route>
        <Route exact path="/register">
          {user.anonymous ? <Register user={user} onDisplayNameChanged={onDisplayNameChanged} /> : <Redirect to="/dashboard" />}</Route>
        <Route exact path="/dashboard">
          <Dashboard user={user} />
        </Route>
        <Route exact path="/lists">
          <ChoicesLists user={user} />
        </Route>
        <Route exact path="/newlist">
          <EditList user={user} />
        </Route>
        <Route exact path="/editlist/:id">
          <EditList user={user} />
        </Route>
        <Route exact path="/newpick">
          <NewPick user={user} />
        </Route>
        <Route exact path="/pick/:id">
          <WrappedOpenPick user={user} />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/"><Home user={user} onAnonymousLogin={onDisplayNameChanged} /></Route>
      </Switch>
    </Box>
  ) : (
      <Box flex align='center' justify='center'>
        <Switch>
          <Route exact path="/login"> <Login /></Route>
          <Route exact path="/register"><Register user={user} onDisplayNameChanged={onDisplayNameChanged} /></Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/"><Home user={user} onAnonymousLogin={onDisplayNameChanged} /></Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Box>
    )
}

const initialState = {
  authenticated: false,
  error: '',
  user: null,
  loading: true,
  showSidebar: false
};

class App extends Component {

  state = initialState;


  setApplicationUser = async (loggedInUser) => {
    // force refresh
    const idToken = await loggedInUser.getIdToken(true);
    await this.setState({
      authenticated: true,
      user: {
        anonymous: loggedInUser.isAnonymous,
        displayName: loggedInUser.displayName,
        email: loggedInUser.email,
        id: loggedInUser.uid,
        idToken: idToken
      },
      loading: false
    });
  }

  async sendTokenToServer(user, token) {
    try {
      const response = await this.props.APIService.callAPIWithAuth(
        `picks/pushtokens/`,
        user.idToken,
        {
          method: 'POST',
          body: token,
          headers: {
            'content-type': 'text/plain'
          }
        }
      )
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  setupPushMessaging = () => {
    const messaging = this.props.FirebaseService.getMessaging();
    messaging.getToken({ vapidKey: this.props.FirebaseService.getVapidKey() }).then((currentToken) => {
      if (currentToken) {
        //sendTokenToServer(currentToken);
        this.sendTokenToServer(this.state.user, currentToken).then(
          resp => {
            this.setState({ pushMessaging: true, messaging: messaging });
          }
        )
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  handleAuthLogin = async (user) => {
    if (user) {
      await this.setApplicationUser(user);
      await this.setupPushMessaging();
    } else {
      this.setState(
        {
          authenticated: false,
          loggedInUser: null,
          loading: false,
          pushMessaging: false
        }
      );
    }
  }

  // signOut = async () => {
  //   await this.setState({ loading: true });
  //   await this.props.FirebaseService.getAuth().signOut();
  //   await this.reset();
  // }

  // reset = async () => {
  //   await this.setState(initialState);
  //   await this.setState({ loading: false });
  // }

  onDisplayNameChanged = (displayName, notanonymous) => {
    let user = { ...this.state.user }
    user.displayName = displayName;
    user.anonymous = !notanonymous;
    this.setState({ user })
  }

  componentDidMount() {
    const auth = this.props.FirebaseService.getAuth();
    if (auth.currentUser) {
      this.setApplicationUser(auth.currentUser);
    }
    auth.onAuthStateChanged(this.handleAuthLogin);
  }

  render() {
    const { user, messaging } = this.state;
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {size => (

            <Box direction="row" as="main" flex="grow" overflow={{ horizontal: 'hidden', vertical: 'hidden' }} height={{ min: '100%' }}>
              <Box fill="horizontal">
                <AppHeader
                  hasOpenButton={!this.state.showSidebar}
                  hasNotif={this.state.pushMessaging}
                  onOpenButtonClick={() => this.setState({ showSidebar: true })}
                  user={user}
                  messaging={messaging}
                />

                <ToastProvider autoDismiss
                  autoDismissTimeout={6000}
                  components={{ Toast: NotificationToast }}
                  placement="bottom-center">
                  <AppRoutes user={user} onDisplayNameChanged={this.onDisplayNameChanged} />
                </ToastProvider>
              </Box>

              {(!this.state.showSidebar || size !== 'small') ? (
                <Collapsible direction="horizontal" open={this.state.showSidebar}>
                  <AppSidebar
                    user={user}
                    onCloseButtonClick={() => this.setState({ showSidebar: false })}
                    onAnonymousLogin={this.onDisplayNameChanged} />
                </Collapsible>
              ) : (
                  <Layer>
                    <AppSidebar
                      user={user}
                      onCloseButtonClick={() => this.setState({ showSidebar: false })}
                      onAnonymousLogin={this.onDisplayNameChanged}
                      fill />
                  </Layer>
                )}
            </Box>

          )}
        </ResponsiveContext.Consumer>
      </Grommet >
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {

  }
}

const WrappedComponent = withRouter(withAPIService(withFirebaseService(App)));

export default connect(mapStateToProps)(WrappedComponent);
