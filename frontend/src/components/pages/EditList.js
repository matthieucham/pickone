import React from 'react';
import {
    Box, Heading
} from 'grommet';
import { useParams } from 'react-router-dom';
import ChoicesListEditForm from "../lists/ChoicesListEditForm";

const EditList = ({userId}) => {
    let params = useParams();
    return (
        <Box align="center">
            {
                (params.id) ? 
                (<Heading level="3">Edition d'une liste prédéfinie</Heading>):
                (<Heading level="3">Créer une liste prédéfinie</Heading>)
            } 
            <Box align="center" justify="center">
               
                    <ChoicesListEditForm 
                        userId={userId} 
                        listId={params.id}
                        width="large"
                    />
                
            </Box>
        </Box>
    )
}

export default EditList;