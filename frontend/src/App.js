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
import { Chat, FormClose, Menu, User } from 'grommet-icons';

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
      {(user) ? (
        hasOpenButton &&
        <Button icon={<Menu color="brand" />}
          onClick={onOpenButtonClick}
          pad="xsmall" />
      ) : (
          <Anchor icon={<User />} href="/login" hoverIndicator />
        )
      }
    </Box>

  </Header>
)

const AppSidebar = ({ user, onCloseButtonClick, onLogout, ...props }) => {
  let history = useHistory();
  return (
    <Sidebar width="medium" background="brand" pad="xsmall"
      footer=
      {user && <Box pad="xsmall" gap="small" align="end">
        <Text>{user.displayName}</Text>
        <Text size="small">{user.email}</Text>

        <Button icon={<User color="light-1" />}
          label="Log out"
          onClick={onLogout}
          pad="small"
          hoverIndicator
          reverse
          secondary
          plain />
      </Box>}
      {...props}
    >
      <Header justify="end">
        <Button icon={<FormClose color="light-1" />}
          onClick={onCloseButtonClick}
          pad="xsmall" />
      </Header>
      <Box>
        <List primaryKey="label"
          data={[
            { label: "Mes votes", path: "/dashboard" },
            { label: "Nouveau vote", path: "/newpick" },
            { label: "Rejoindre un vote" },
            { label: "Mes listes" }
          ]}
          onClickItem={(event) => { history.push(event.item.path) }}></List>
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

const AppRoutes = ({ user }) => {
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
        <Route exact path="/"><Home user={user} /></Route>
      </Switch>
    </Box>
  ) : (
      <Box flex align='center' justify='center'>
        <Switch>
          <Route exact path="/login"> <Login /></Route>
          <Route exact path="/register"><Register /></Route>
          <Route exact path="/"><Home user={user} /></Route>
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
                  <AppRoutes user={user} />
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
