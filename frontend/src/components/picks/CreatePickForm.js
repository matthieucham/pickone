import React from "react";
import { Box, Button, CheckBox, Form, FormField, RadioButtonGroup, Text, TextArea, TextInput, } from "grommet";
import { Group, Risk } from "grommet-icons";

import PickChoicesField from "./PickChoicesField";

class CreatePickForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: props.choices || [],
            showFieldSuggest: false,
            multipleSelected: false,
        }
    }

    handleSubmit = ({ value }) => {
        this.props.onSubmit(
            {
                ...value,
                choices: this.state.choices
            }
        )
    }

    render() {
        const { lists, onSaveList, error, fetching } = this.props;
        const { showFieldSuggest, multipleSelected, choices } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormField label="Titre" name="title" required>
                    <TextInput name="title" type="text" placeholder="Titre" />
                </FormField>

                <FormField
                    label="Description"
                    name="description"
                    info={
                        <Box>
                            <Text size="small">Quel est le contexte du vote : pour qui, pour quoi faire...</Text>
                        </Box>
                    }>
                    <TextArea placeholder="Description" name="description" />
                </FormField>

                <FormField
                    label="Mode de vote"
                    name="mode"
                    info={
                        <Box>
                            <Text size="small">Au hasard: le gagnant sera tiré au sort parmi les choix des votants</Text>
                            <Text size="small">A la majorité: le gagnant sera le choix ayant obtenu le plus de voix</Text>
                        </Box>
                    }
                    required>
                    <RadioButtonGroup
                        name="mode"
                        options={['random', 'majority']}
                        direction="row"
                        onChange={event => this.setState({ showFieldSuggest: event.target.value === 'random' })}>
                        {(option, { checked, hover }) => {
                            const Icon = option === 'random' ? Risk : Group;
                            const label = option === 'random' ? "Au hasard" : "A la majorité";
                            let background;
                            if (checked) background = 'brand';
                            else if (hover) background = 'light-4';
                            else background = 'light-2';
                            return (
                                <Box background={background} pad="small" direction="row" gap="small">
                                    <Icon />
                                    <Text>{label}</Text>
                                </Box>
                            );
                        }}
                    </RadioButtonGroup>
                </FormField>

                <FormField
                    label="Mode de choix"
                    name="cardinality"
                    required>
                    <RadioButtonGroup
                        name="cardinality"
                        options={[
                            { value: "multiple", label: "Choix multiples" },
                            { value: "unique", label: "Choix unique" }
                        ]}
                        direction="row"
                        onChange={event => this.setState({ multipleSelected: event.target.value === 'multiple' })}
                    />
                </FormField>

                {showFieldSuggest && multipleSelected && (
                    <FormField name="suggest" label="Suggestions libres">
                        <CheckBox
                            name="suggest"
                            label="Autoriser" />
                    </FormField>
                )}

                <FormField
                    name="choices" error={choices.length === 0 ? "Ce champ est requis" : ""}>
                    <PickChoicesField
                        lists={lists}
                        onSaveListButtonClick={() => onSaveList(choices)}
                        onChange={(val) => this.setState({ choices: val })} />
                </FormField>

                {error && (
                    <Box pad={{ horizontal: 'small' }}>
                        <Text color="status-error">{error}</Text>
                    </Box>
                )}

                <Box direction="row" justify="center" margin={{ top: 'medium' }}>
                    <Button type="submit" label="Créer" disabled={fetching} primary />
                </Box>
            </Form>
        );
    }
}

export default CreatePickForm;