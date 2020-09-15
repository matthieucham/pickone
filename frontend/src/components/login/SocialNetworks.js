import React, { Component } from 'react';
import {
    Box, Button
} from 'grommet';
import { Google } from 'grommet-icons';

import { connect } from "react-redux";
import { signInWithGoogle, linkAnonymousToGoogle } from "../../store/actions/authActions";


class SocialNetworks extends Component {
    handleGoogle = () => {
        if (!this.props.auth.uid) {
            // Pure login
            this.props.signInWithGoogle()
        }
        // else {
        //     if (this.props.auth.isAnonymous) {
        //         // Link anon
        //         console.log("linkAnonymousToGoogle");
        //         this.props.linkAnonymousToGoogle()
        //     } else {
        //         console.log("Should not happen")
        //     }
        // }
    }

    render() {
        return <Box direction="row" justify="center" pad="medium" gap="small" flex={false}>
            <Button type="submit" label="Google" icon={<Google />} onClick={this.handleGoogle} />
            {/* <Button type="submit" label="Facebook" icon={<Facebook />} /> */}
        </Box>
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.ui.fetching,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signInWithGoogle: () => dispatch(signInWithGoogle())
        // ça ne marche pas:
        //linkAnonymousToGoogle: () => dispatch(linkAnonymousToGoogle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialNetworks);