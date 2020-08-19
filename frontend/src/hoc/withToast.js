import React from 'react';
import { useToasts } from 'react-toast-notifications'

function withToast(Component) {
    return function WrappedComponent(props) {
        const toastFuncs = useToasts()
        return <Component {...props} {...toastFuncs} />;
    }
}
export default withToast;