import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Collapsible,
  Grommet,
  Header,
  Layer,
  ResponsiveContext,
} from 'grommet';
import { Chat, Menu } from 'grommet-icons';
import { compose } from "redux";
import { connect, useSelector } from "react-redux";
import { isLoaded, isEmpty } from 'react-redux-firebase'
import LoadingLayer from "./components/lib/LoadingLayer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Load local files */

import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NewPick from './components/pages/NewPick';
import Dashboard from './components/pages/Dashboard';
import OpenPick from './components/pages/OpenPick';
import Home from './components/pages/Home';
import ChoicesLists from './components/pages/ChoicesLists';
import EditList from './components/pages/EditList';
import About from './components/pages/About';
import AppSidebar from './components/pages/Sidebar';
import Messaging from "./components/pages/Messaging";



const grommetTheme = {
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

const AppHeader = ({ hasOpenButton, hasNotif, onOpenButtonClick, messaging, ...props }) => (
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
        <Messaging />
      }
      {hasOpenButton &&
        <Button icon={<Menu color="brand" />}
          onClick={onOpenButtonClick}
          pad="xsmall" />}
    </Box>

  </Header>
)

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated or if auth is not
// yet loaded
function PrivateRoute({ children, anonymousPermitted = false, redirectPath = "/login", ...rest }) {
  const auth = useSelector(state => state.firebase.auth)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) && (anonymousPermitted || !auth.isAnonymous) ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: redirectPath,
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

// A wrapper for <Route> that redirects to the specified path
// screen if you're authenticated
function UnidentifiedRoute({ children, anonymousPermitted = false, redirectPath, ...rest }) {
  const auth = useSelector(state => state.firebase.auth)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && (isEmpty(auth) || (anonymousPermitted && auth.isAnonymous)) ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: redirectPath,
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

const AppRoutes = () => {
  const auth = useSelector(state => state.firebase.auth)
  return (
    <Box flex>
      <Switch>
        <UnidentifiedRoute exact path="/login" redirectPath="/dashboard" anonymousPermitted>
          <Login />
        </UnidentifiedRoute>
        <UnidentifiedRoute exact path="/register" redirectPath="/dashboard" anonymousPermitted>
          <Register />
        </UnidentifiedRoute>
        <PrivateRoute exact path="/dashboard" anonymousPermitted>
          <Dashboard userId={auth.uid} />
        </PrivateRoute>
        <PrivateRoute exact path="/lists">
          <ChoicesLists userId={auth.uid} />
        </PrivateRoute>
        <PrivateRoute exact path="/newlist">
          <EditList userId={auth.uid} />
        </PrivateRoute>
        <PrivateRoute exact path="/editlist/:id">
          <EditList userId={auth.uid} />
        </PrivateRoute>
        <PrivateRoute exact path="/newpick">
          <NewPick userId={auth.uid} />
        </PrivateRoute>
        <PrivateRoute exact path="/pick/:id" anonymousPermitted>
          <OpenPick userId={auth.uid} />
        </PrivateRoute>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/"><Home /></Route>
      </Switch>
    </Box>
  )
}

class App extends Component {

  state = {
    showSidebar: false
  }

  render() {
    const { showSidebar } = this.state;
    const { fetching, pushMessaging } = this.props;
    return (
      <Grommet theme={grommetTheme} full>
        <ResponsiveContext.Consumer>
          {size => (
            <Box direction="row" as="main" flex="grow"
              overflow={{ horizontal: 'hidden', vertical: 'hidden' }} height={{ min: '100%' }}>
              <Box fill="horizontal">
                <AppHeader
                  hasOpenButton={!showSidebar}
                  hasNotif={pushMessaging}
                  onOpenButtonClick={() => this.setState({ showSidebar: true })}
                />

                <AppRoutes />
                <ToastContainer
                  autoClose={5000}
                  position="top-right"
                  hideProgressBar
                  newestOnTop
                  draggable={false}
                  closeButton={false}
                  limit={3} />
                {
                  fetching && <LoadingLayer />
                }
              </Box>

              {(!this.state.showSidebar || size !== 'small') ? (
                <Collapsible direction="horizontal" open={showSidebar}>
                  <AppSidebar
                    onCloseButtonClick={() => this.setState({ showSidebar: false })} />
                </Collapsible>
              ) : (
                  <Layer>
                    <AppSidebar
                      onCloseButtonClick={() => this.setState({ showSidebar: false })}
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
  //console.log(state)
  return {
    fetching: state.ui.fetching,
    pushMessaging: state.ui.pushMessaging
  }
}

export default compose(
  connect(mapStateToProps),
  withRouter
)(App);
