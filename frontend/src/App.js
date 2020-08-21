import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications'

import {
  Anchor,
  Box,
  Button,
  Collapsible,
  Grommet,
  Header,
  Layer,
  List,
  Main,
  ResponsiveContext,
  Sidebar,
  Text
} from 'grommet';
import { Chat, CircleInformation, FormClose, Menu, User } from 'grommet-icons';

/* Load local files */
import { withAPIService, withFirebaseService } from './hoc';

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
    <Box align="center">
      <Anchor href="/" color="brand" icon={<Chat />} label="On vote ?" />
    </Box>
    <Box align="center">
      {hasOpenButton &&
        <Button icon={<Menu color="brand" />}
          onClick={onOpenButtonClick}
          pad="xsmall" />}
    </Box>

  </Header>
)

const AppSidebar = ({ user, onCloseButtonClick, onLogout, ...props }) => {
  let history = useHistory();
  const isLoggedIn = user && !user.anonymous;
  const menuLinks = [
    { label: "Accueil", path: "/" },
    { label: "Rejoindre un vote" }
  ];
  if (user) {
    menuLinks.push({ label: "Mes votes", path: "/dashboard" });
  }
  if (isLoggedIn) {
    menuLinks.push({ label: "Nouveau vote", path: "/newpick" }, { label: "Mes listes" });
  }
  return (
    <Sidebar width="medium" background="brand" pad="xsmall"
      footer=
      {
        <Text textAlign="end">MG 2020</Text>
      }
      {...props}
    >
      <Header justify="end">
        <Button icon={<FormClose color="light-1" />}
          onClick={onCloseButtonClick}
          pad="xsmall" />
      </Header>
      <Box>
        <List primaryKey="label"
          data={menuLinks}
          onClickItem={(event) => { history.push(event.item.path) }} />
        <Box margin={{ vertical: "large", horizontal: "none" }}>
          {
            isLoggedIn ? (
              <List
                data={[
                  { label: "Déconnexion" },
                ]}
                primaryKey={item => (
                  <Text weight="bold" color="accent-1">
                    {item.label}
                  </Text>
                )}
                onClickItem={onLogout}
              />
            ) : (
                <Box>
                  <List
                    data={[
                      { label: "Se connecter", path: "/login" },
                    ]}
                    primaryKey={item => (
                      <Text weight="bold" color="accent-1">
                        {item.label}
                      </Text>
                    )}
                    onClickItem={(event) => { history.push(event.item.path) }}
                  />
                  <Box direction="row" align="center" justify="center">
                    <Box pad="xsmall">
                      <CircleInformation />
                    </Box>
                    <Box pad="xsmall" flex>
                      <Text size="small">En étant connecté vous pourrez organiser des votes</Text>
                    </Box>
                  </Box>
                </Box>
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
    </Sidebar>
  )
}

const initialState = {
  authenticated: false,
  error: '',
  user: null,
  loading: true,
  showSidebar: false
};

const AppRoutes = ({ user, onAnonymousLogin }) => {
  return (user) ? (
    <Box flex>
      <Switch>
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
        <Route exact path="/"><Home user={user} onAnonymousLogin={onAnonymousLogin} /></Route>
      </Switch>
    </Box>
  ) : (
      <Box flex align='center' justify='center'>
        <Switch>
          <Route exact path="/login"> <Login /></Route>
          <Route exact path="/register"><Register /></Route>
          <Route exact path="/"><Home user={user} onAnonymousLogin={onAnonymousLogin} /></Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Box>
    )
}

class App extends Component {

  state = initialState;


  setApplicationUser = async (loggedInUser) => {
    const idToken = await loggedInUser.getIdToken();
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
    const { user } = this.state;
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {size => (
            <Main direction="row" overflow={{ horizontal: 'hidden' }}>
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
                  <AppRoutes user={user} onAnonymousLogin={(displayName) => {
                    let user = { ...this.state.user }
                    user.displayName = displayName;
                    this.setState({ user })
                  }} />
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
                      fill />
                  </Layer>
                )}

            </Main>
          )}
        </ResponsiveContext.Consumer>
      </Grommet >
    );
  }
}

const WrappedComponent = withRouter(withAPIService(withFirebaseService(App)));

export default WrappedComponent;
