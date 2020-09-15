import React from 'react';
import {
    Box, Button, CheckBoxGroup, Form, FormField, RadioButtonGroup, TextInput
} from 'grommet';

const OpenPickForm = ({ pick, values, suggest, multiple, disabled, onSubmit }) => {
    const [pickedList, setPickedList] = React.useState(values ? values.filter(v => pick.choices.includes(v)) : []);
    const [suggested, setSuggested] = React.useState(values ? values.filter(v => !pick.choices.includes(v)).shift() : "");
    const handleSubmit = (submitVal) => {
        const submitted = submitVal.value;
        let val;
        if (pick.suggest === true && submitted.suggested) {
            Array.isArray(submitted.picked) ?
                val = [...submitted.picked, submitted.suggested] :
                val = [submitted.picked, submitted.suggested];
        } else {
            Array.isArray(submitted.picked) ?
                val = [...submitted.picked] :
                val = [submitted.picked];
        }
        onSubmit(val);
    }
    return (
        <Box pad="small" align="center" border="all" round="xsmall">
            <Form onSubmit={handleSubmit} align="center">
                <FormField label="Je vote pour :" name="picked" required>
                    {(multiple) ?
                        (<CheckBoxGroup name="picked" options={pick.choices} value={pickedList}
                            onChange={({ value: nextValue }) => setPickedList(nextValue)} />)
                        :
                        (<RadioButtonGroup name="picked" options={pick.choices} value={pickedList ? pickedList[0] : undefined}
                            onChange={(event) => { setPickedList([event.target.value]) }} />)
                    }
                </FormField>
                {
                    suggest && multiple &&
                    <FormField label="Une autre suggestion ?" name="suggested">
                        <TextInput name="suggested" size="large" value={suggested} onChange={event => setSuggested(event.target.value)} />
                    </FormField>
                }

                <Button type="submit" label="Voter" primary disabled={disabled} />
            </Form>
        </Box>)
}

export default OpenPickForm;