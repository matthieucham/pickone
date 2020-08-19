// https://github.com/grommet/grommet/issues/2855
import * as React from "react";
import { withRouter } from "react-router";

import { Anchor, Button } from "grommet";


const RouterAnchorBase = (props) => {
    const anchorProps = props;
    return <Anchor {...anchorProps} onClick={() => props.history.push(props.path)} />;
};

const RouterAnchor = withRouter(RouterAnchorBase);

const RouterButtonBase = (props) => {
    const buttonProps = props;
    return <Button {...buttonProps} onClick={() => props.history.push(props.path)} />;
};

const RouterButton = withRouter(RouterButtonBase);

export { RouterAnchor, RouterButton };