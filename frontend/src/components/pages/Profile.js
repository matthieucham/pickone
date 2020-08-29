import React, { Component } from 'react';
import {
    Box,
    Button,
    Form,
    FormField,
    TextInput,
    Heading
} from 'grommet';
import { withFirebaseService } from '../../hoc';


class Profile extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false
    }

    handleSubmit = async ({ value, touched }) => {

        await this.setState({
            isError: false,
            errorMessage: '',
            loading: true
        });

        if (value.display) { }
        this.props.FirebaseService.getAuth().currentUser
            .updateProfile({ displayName: value.display })
            .then((result) => {
                console.log(result);
            }).catch(async (error) => {
                await this.setState({
                    errorMessage: error.message,
                    isError: true,
                    loading: false
                });
            })

    }

    render() {
        const { user } = this.props;
        return (<Box fill>
            <Box pad="small" background="dark-3">
                <Heading level="4">{user.email}</Heading>
            </Box>
            <Box fill align="center" justify="center">
                <Box width="medium">
                    <Form onSubmit={this.handleSubmit}>

                        <FormField label="Pseudo" name="display">
                            <TextInput name="display" type="text" />
                        </FormField>

                        {isError && (
                            <Box pad={{ horizontal: 'small' }}>
                                <Text color="status-error">{errorMessage}</Text>
                            </Box>
                        )}

                        <Box direction="row" justify="center" margin="medium">
                            <Button type="submit" label="Enregistrer" disabled={loading} primary />
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Box>);
    }
}

const WrappedComponent = withFirebaseService(Profile);

export default WrappedComponent;