import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Layer, Text, TextInput
} from 'grommet';

import { connect } from "react-redux";
import { createList } from "../../store/actions/listActions";


class SaveListLayer extends Component {

    handleSubmit = ({ value }) => {
        this.props.createList({ ...value, choices: this.props.choices });
    }

    render() {
        const { onCancelAction, fetching, error } = this.props;
        return (
            <Layer position="center" onClickOutside={onCancelAction} onEsc={onCancelAction}>
                <Box pad="medium" gap="small" width="medium">
                    <Heading level={3} margin="none">Enregistrer comme liste</Heading>
                    <Text>Vous pourrez retrouver cette liste de choix dans vos listes prédéfinies et la réutiliser pour d'autres votes.</Text>
                    <Form onSubmit={this.handleSubmit}>
                        <FormField label="Nom de la liste" name="name" required>
                            <TextInput name="name" type="text" placeholder="Nom" />
                        </FormField>
                        {error &&
                            <Text color="status-error">{error}</Text>
                        }
                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="end"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button label="Annuler" onClick={onCancelAction} color="dark-3" />
                            <Button
                                label="Enregistrer"
                                type="submit"
                                disabled={fetching}
                                primary
                            />
                        </Box>
                    </Form>
                </Box>
            </Layer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.ui.fetching,
        error: state.list.listError
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createList: (data) => dispatch(createList(data, null)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveListLayer);