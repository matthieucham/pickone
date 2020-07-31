import React from 'react';
import { FirebaseService } from '../service';
import config from '../config.json';

const withFirebaseService = (Component) => {

    class HOC extends React.Component {

        FirebaseServiceInstance = new FirebaseService(config);

        render() {
            return (
                <Component
                    FirebaseService={this.FirebaseServiceInstance}
                    {...this.props}
                />
            )
        }
    }

    return HOC;

}

export default withFirebaseService;