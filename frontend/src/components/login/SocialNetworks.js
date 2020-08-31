import React, { Component } from 'react';
import {
    Box, Button
} from 'grommet';
import { Google } from 'grommet-icons';

import firebase from 'firebase/app';

import { withFirebaseService } from '../../hoc'


class SocialNetworks extends Component {
    handleGoogle = async () => {
        let auth = this.props.FirebaseService.getAuth();
        let provider = new firebase.auth.GoogleAuthProvider();
        if (!this.props.user) {
            auth.signInWithPopup(provider).then((result) => {
                console.log(result);
                // // This gives you a Google Access Token. You can use it to access the Google API.
                // var token = result.credential.accessToken;
                // // The signed-in user info.
                // var user = result.user;
                // ...
            }).catch(async (error) => {
                console.error(error);
                // // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // // The email of the user's account used.
                // var email = error.email;
                // // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // // ...
            });
        } else if (this.props.user.anonymous) {
            auth.linkWithPopup(provider).then((result) => {
                // Accounts successfully linked.
                console.log(result)
            }).catch(async (error) => {
                console.error(error);
                // // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // // The email of the user's account used.
                // var email = error.email;
                // // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // // ...
            });
        }
    }

    render() {
        return <Box direction="row" justify="center" pad="medium" gap="small" flex={false}>
            <Button type="submit" label="Google" icon={<Google />} onClick={this.handleGoogle} />
            {/* <Button type="submit" label="Facebook" icon={<Facebook />} /> */}
        </Box>
    }
}

const WrappedComponent = withFirebaseService(SocialNetworks);

export default WrappedComponent;