import React, { Component } from 'react';
import {
    Box, Button, Form, FormField, Heading, Keyboard, Text, TextArea, TextInput
} from 'grommet';
import { FormClose, FormAdd } from 'grommet-icons';


const ItemBox = ({ label, onClose }) =>
    <Box direction="row" pad="xsmall" align="center" border margin="xsmall">
        <Text>{label}</Text>
        <Button raw icon={<FormClose />} onClick={onClose} pad="xsmall" />
    </Box>


class ItemsField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: props.value ? props.value : [],
            newvalue: ""
        }

        // This binding is necessary to make `this` work in the callback
        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged() {
        this.props.onChange(this.state.items);
    }

    removeItem(val) {
        this.setState({ items: this.state.items.filter(v => v != val) }, this.valueChanged);
    }

    addItem(val) {
        if (val) {
            this.setState({ items: [...this.state.items, val], newvalue: "" }, this.valueChanged);
        }
    }

    render() {
        const { items, newvalue } = this.state;
        const boxes = items.map((it) => <ItemBox key={"ib_" + it} label={it} onClose={() => this.removeItem(it)} />)
        return (
            <Box justify="start" align="start">
                <Box direction="row" justify="start" alignContent="start" wrap>{boxes}</Box>
                <Keyboard onEnter={() => this.addItem(newvalue)}>
                    <Box direction="row" justify="start" alignContent="start" pad="xsmall">
                        <TextInput placeholder="Choix" size="large"
                            value={newvalue}
                            onChange={event => this.setState({ newvalue: event.target.value })} />
                        <Button icon={<FormAdd />} hoverIndicator onClick={() => this.addItem(newvalue)} />
                    </Box>
                </Keyboard>
            </Box>
        );
    }
}


export default ItemsField;