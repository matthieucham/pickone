import React, { Component } from "react";

import { Accordion, AccordionPanel, Box, Button, Heading, Text } from "grommet";
import { AddCircle, FormEdit, FormTrash } from "grommet-icons";

import { RouterButton } from "../ext/RoutedControls";
import ConfirmationLayer from "../lib/ConfirmationLayer";
import { withFirebaseService, withAPIService, withToast } from '../../hoc';
import LoadingLayer from "../lib/LoadingLayer";


const TrashButton = ({ list, onDelete, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const onCloseConfirm = () => setOpenConfirm(false);
    const onConfirmAndDelete = () => {
        setOpenConfirm(false);
        onDelete(list.id);
    }
    return <Box>
        <Button onClick={() => setOpenConfirm(true)} {...props}></Button>
        {openConfirm && (
            <ConfirmationLayer
                onCancelAction={onCloseConfirm}
                onConfirmAction={onConfirmAndDelete}
                title="Confirmation"
                text={`Supprimer la liste ${list.data.name} ?`}
                actionLabel="Confirmer" cancelLabel="Annuler" />
        )}
    </Box>
}

class ChoicesLists extends Component {
    state = {
        lists: [],
        loading: false
    }

    componentDidMount() {
        this.setState({ loading: true })
        const user = this.props.user;
        this.props.FirebaseService.getDb().collection(`/users/${user.id}/lists`)
            .orderBy('dateUpdated', 'desc')
            .onSnapshot(querySnapshot => {
                let foundlists = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                this.setState({
                    lists: foundlists
                });
                this.setState({ loading: false })
                return null;
            });
    }

    onDelete = (listId) => {
        this.setState({
            loading: true
        });
        const user = this.props.user;
        this.props.APIService.callAPIWithAuth(
            `picks/lists/${listId}`,
            user.idToken,
            {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json'
                }
            }
        )
            .then(response => response.json())
            .then(
                response => {
                    if ("error" in response) {
                        this.setState({ loading: false });
                        this.props.addToast(`Echec de la suppression: ${response.error.message}`, { appearance: "error" })
                    } else {
                        this.setState({ loading: false });
                        this.props.addToast(`Liste supprimée`, { appearance: "success" })
                    }
                }
            ).catch(
                e => {
                    this.setState({ loading: false });
                    this.props.addToast(`Echec de la suppression: ${e}`, { appearance: "error" })
                }
            );
    };

    render() {
        const { lists, loading } = this.state;
        return (
            <Box align="center" pad="small">
                <Heading level="3">Listes de choix prédéfinis</Heading>
                <Box width="large" align="center">
                    <RouterButton path="/newlist" label="Nouvelle liste" icon={<AddCircle />} />
                    <Accordion pad="small" fill="horizontal">
                        {
                            lists.map(l =>
                                <AccordionPanel key={`ap${l.id}`}
                                    label={
                                        <Box pad="small"><Text weight="bold">{l.data.name}</Text></Box>
                                    }
                                    background="light-2">
                                    <Box direction="row" pad="xsmall" align="center" justify="between">
                                        <Box direction="row-responsive" justify="start">
                                            {l.data.choices.map((ch, idx) => <Box key={`ap${l.id}_${idx}`} pad="xsmall"><Text size="small">{ch}</Text></Box>)}
                                        </Box>
                                        <Box direction="row" gap="small">
                                            <RouterButton
                                                path={`/editlist/${l.id}`}
                                                icon={<FormEdit />}
                                                plain />
                                            <TrashButton
                                                icon={<FormTrash />}
                                                list={l}
                                                onDelete={this.onDelete}
                                                plain />
                                        </Box>
                                    </Box>
                                </AccordionPanel>)
                        }
                    </Accordion>
                </Box>
                {
                    loading && <LoadingLayer />
                }
            </Box>
        );
    }
}

const WrappedComponent = withToast(withFirebaseService(withAPIService(ChoicesLists)));
export default WrappedComponent;