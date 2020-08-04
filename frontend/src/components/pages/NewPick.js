import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Text, TextArea, TextInput
} from 'grommet';

import { DateTimeInput } from '../ext/DateTimeInput';
import ItemsField from '../fields/ItemsField';


class NewPick extends Component {

    state = {
        isError: false,
        errorMessage: '',
        loading: false
    }

    render() {
        const { isError, errorMessage, loading } = this.state;
        return (
            <Box align="center">
                <Heading level="3">Créer un Pick</Heading>
                <Box fill align="center" justify="center">
                    <Box width="large">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormField label="Titre" name="title" required>
                                <TextInput name="title" type="text" placeholder="Titre" />
                            </FormField>

                            <FormField label="Description" name="description">
                                <TextArea placeholder="Description, contexte, etc." />
                            </FormField>

                            <FormField label="Choix possibles" name="choices">

                                <ItemsField value={['énorme', 'faible', 'cigarettes', 'pourcent']}
                                    onChange={(val) => { console.log(val) }} />

                            </FormField>

                            {isError && (
                                <Box pad={{ horizontal: 'small' }}>
                                    <Text color="status-error">{errorMessage}</Text>
                                </Box>
                            )}

                            <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                                <Button type="submit" label="Créer" disabled={loading} primary />
                            </Box>
                        </Form>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default NewPick;

