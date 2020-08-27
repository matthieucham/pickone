import React, { Component } from 'react';
import {
    Box, Button, FormField, Keyboard, TextInput
} from 'grommet';
import { AddCircle } from 'grommet-icons';

import RemovableItemBox from "../lib/RemovableItemBox";

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
        this.setState({ items: this.state.items.filter(v => v !== val) }, this.valueChanged);
    }

    addItem(val) {
        if (val) {
            this.setState({ items: [...this.state.items, val], newvalue: "" }, this.valueChanged);
        }
    }

    render() {
        const { items, newvalue } = this.state;
        const boxes = items.map((it) => <RemovableItemBox key={"ib_" + it} label={it} confirmText={`Supprimer le choix ${it} ?`} onRemove={() => this.removeItem(it)} />)
        return (
            <Box justify="start" align="start">
                <Box direction="row" justify="start" alignContent="start" wrap>{boxes}</Box>
                <Keyboard onEnter={(event) => { event.preventDefault(); this.addItem(newvalue) }}>
                    <Box direction="row" justify="start" alignContent="start" pad="xsmall">
                        <FormField name="newvalue">
                            <TextInput placeholder="Option" size="large"
                                name="newvalue"
                                value={newvalue}
                                onChange={event => this.setState({ newvalue: event.target.value })} />
                        </FormField>
                        <Button icon={<AddCircle />} hoverIndicator onClick={() => this.addItem(newvalue)} />
                    </Box>
                </Keyboard>
            </Box>
        );
    }
}


export default ItemsField;