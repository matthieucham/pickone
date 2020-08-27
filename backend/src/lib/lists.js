const dayjs = require('dayjs')

// Create a list of choices
const createList = async ({ admin }, request, response) => {
    const db = admin.firestore();

    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }

    if (request.user.firebase.sign_in_provider == 'anonymous') {
        return response.status(403).send({
            error: "Forbidden to anonymous users"
        });
    }

    const validate = (data) => {
        if (!data.name) {
            throw new ValidationError('name')
        }
        if ((!data.choices) || (data.choices.length == 0)) {
            throw new ValidationError('choices')
        }
    }

    const formatDoc = (data) => {
        return {
            name: data.name,
            dateUpdated: dayjs().format(),
            choices: [...data.choices]
        }
    }
    const listData = request.body;
    try {
        validate(listData);
    } catch (e) {
        return response.status(400).send({
            error: e.message
        });
    }

    try {
        const result = {
            created: false,
        }
        const docData = formatDoc(listData)
        const dbResponse = await db.collection(`users/${request.user.uid}/lists`).add(docData);
        result.created = true;
        return response.send(result);
    } catch (e) {
        return response.status(500).send({
            error: e.message
        });
    }
}

// Edit a list of choices
const editList = async ({ admin }, request, response) => {
    const db = admin.firestore();

    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }

    if (request.user.firebase.sign_in_provider == 'anonymous') {
        return response.status(403).send({
            error: "Forbidden to anonymous users"
        });
    }

    const validate = (data) => {
        if (!data.name) {
            throw new ValidationError('name')
        }
        if ((!data.choices) || (data.choices.length == 0)) {
            throw new ValidationError('choices')
        }
    }

    const formatDoc = (data) => {
        return {
            name: data.name,
            dateUpdated: dayjs().format(),
            choices: [...data.choices]
        }
    }
    const listData = request.body;
    try {
        validate(listData);
    } catch (e) {
        return response.status(400).send({
            error: e.message
        });
    }

    try {
        const result = {
            updated: false,
        }
        const docData = formatDoc(listData)
        const dbResponse = await db.collection(`users/${request.user.uid}/lists`).doc(request.params.listId).set(docData);
        result.updated = true;
        return response.send(result);
    } catch (e) {
        return response.status(500).send({
            error: e.message
        });
    }
}

// Delete a list of choices
const deleteList = async ({ admin }, request, response) => {
    const db = admin.firestore();

    if (request.user.firebase.sign_in_provider == 'anonymous') {
        return response.status(403).send({
            error: "Forbidden to anonymous users"
        });
    }

    try {
        const result = {
            deleted: false,
        }
        const dbResponse = await db.collection(`users/${request.user.uid}/lists`).doc(request.params.listId).delete();
        result.deleted = true;
        return response.send(result);
    } catch (e) {
        console.log(e);
        return response.status(500).send({
            error: e.message
        });
    }
}

module.exports = {
    createList,
    editList,
    deleteList
}