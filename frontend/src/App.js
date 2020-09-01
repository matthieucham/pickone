import React, { Component, useState } from 'react';
import { withRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
//mport customTheme from "./theme/Light.json";
//import { customTheme } from "./theme/Light";

import {
  Anchor,
  Box,
  Button,
  Collapsible,
  Grommet,
  Header,
  Layer,
  ResponsiveContext,
  Sidebar,
  Text
} from 'grommet';
import { Chat, CircleInformation, FormClose, Menu, Notification, User } from 'grommet-icons';

/* Load local files */
import { withAPIService, withFirebaseService, withToast } from './hoc';

import NotificationToast from './components/lib/NotificationToast';
import PushMessageToast from './components/lib/PushMessageToast';

import { RouterAnchor } from "./components/ext/RoutedControls";

import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NewPick from './components/pages/NewPick';
import Dashboard from './components/pages/Dashboard';
import OpenPick from './components/pages/OpenPick';
import Home from './components/pages/Home';
import ChoicesLists from './components/pages/ChoicesLists';
import EditList from './components/pages/EditList';
import JoinPick from './components/login/JoinPick';
import About from './components/pages/About';



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

const AppSidebar = ({ user, onCloseButtonClick, onLogout, onAnonymousLogin, ...props }) => {
  const history = useHistory();
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const isLoggedIn = user && !user.anonymous;
  const menuLinks = [
    { label: "Accueil", path: "/" },
    { label: "Rejoindre un vote", onClick: () => setOpenCodeDialog(true) }
  ];
  if (user) {
    menuLinks.push({ label: "Mes votes", path: "/dashboard" });
  }
  if (isLoggedIn) {
    menuLinks.push({ label: "Nouveau vote", path: "/newpick" }, { label: "Mes listes", path: "/lists" });
  }
  return (
    <Sidebar width="medium" background="brand" pad="xsmall"
      footer=
      {
        <Button hoverIndicator onClick={() => { history.push("/about"); onCloseButtonClick() }}>
          <Box pad={{ horizontal: "medium", vertical: "small" }} align="end">
            <Text weight="bold">A propos</Text>
          </Box>
        </Button>
      }
      {...props}
    >
      <Header justify="end">
        <Button icon={<FormClose color="light-1" />}
          onClick={onCloseButtonClick}
          pad="xsmall" />
      </Header>
      <Box>
        <Box>
          {menuLinks.map((ml) => (
            <Box border="bottom" key={`menu${ml.label.replace(" ", "_")}`}>
              <Button
                hoverIndicator
                onClick={() => {
                  if (ml.onClick) {
                    ml.onClick();
                  }
                  if (ml.path) {
                    history.push(ml.path);
                  }
                  onCloseButtonClick()
                }
                }>
                <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                  <Text weight="bold">{ml.label}</Text>
                </Box>
              </Button>
            </Box>
          ))}
        </Box>
        <Box margin={{ vertical: "large", horizontal: "none" }}>
          {
            isLoggedIn ? (
              <Box border="bottom">
                <Button hoverIndicator onClick={onLogout}>
                  <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                    <Text weight="bold" color="accent-1">Déconnexion</Text>
                  </Box>
                </Button>
              </Box>
            ) : (
                user ? (
                  <Box>
                    <Box border="bottom">
                      <Button hoverIndicator onClick={() => { history.push("/register"); onCloseButtonClick() }}>
                        <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                          <Text weight="bold" color="accent-1">Créer un compte</Text>
                        </Box>
                      </Button>
                    </Box>
                    <Box direction="row" align="center" justify="center">
                      <Box pad="xsmall">
                        <CircleInformation />
                      </Box>
                      <Box pad="xsmall" flex>
                        <Text size="small">Avec un compte vous pourrez organiser des votes</Text>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                    <Box border="bottom">
                      <Button hoverIndicator onClick={() => { history.push("/login"); onCloseButtonClick() }}>
                        <Box pad={{ horizontal: "medium", vertical: "small" }} align="start">
                          <Text weight="bold" color="accent-1">Se connecter</Text>
                        </Box>
                      </Button>
                    </Box>

                  )
              )
          }
          {user &&
            <Box direction="row" align="center" justify="center">
              <Box pad="xsmall">
                <User />
              </Box>
              <Box direction="row" pad="xsmall" flex align="center" gap="xsmall">
                <Text weight="bold">{user.displayName}</Text>
                {
                  user.anonymous &&
                  <Button plain icon={<FormClose />} label="(invité)" onClick={onLogout} hoverIndicator pad="xsmall" reverse />
                }
              </Box>
            </Box>}
        </Box>
      </Box>
      {
        openCodeDialog &&
        <JoinPick user={user}
          onClose={() => setOpenCodeDialog(false)}
          onAnonymousLogin={onAnonymousLogin} />
      }
    </Sidebar>
  )
}

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
          <OpenPick user={user} />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/"><Home user={user} onAnonymousLogin={onDisplayNameChanged} /></Route>
      </Switch>
      <Box height="small" fill="horizontal" />
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
        <Box height="small" fill="horizontal" />
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

  signOut = async () => {
    await this.setState({ loading: true });
    await this.props.FirebaseService.getAuth().signOut();
    await this.reset();
  }

  reset = async () => {
    await this.setState(initialState);
    await this.setState({ loading: false });
  }

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
                    onLogout={this.signOut} />
                </Collapsible>
              ) : (
                  <Layer>
                    <AppSidebar
                      user={user}
                      onCloseButtonClick={() => this.setState({ showSidebar: false })}
                      onLogout={this.signOut}
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

const WrappedComponent = withRouter(withAPIService(withFirebaseService(App)));

export default WrappedComponent;
