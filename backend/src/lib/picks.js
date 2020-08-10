const dayjs = require('dayjs')
const randomstring = require('randomstring')

class ValidationError extends Error {
    constructor(fieldName) {
        super("Bad value for field " + fieldName)
    }
}

class PickNotFoundError extends Error {
    constructor(pickId) {
        super(`Pick id ${pickId} not found or invalid`);
    }
}

const create = async ({ admin }, request, response) => {
    const db = admin.firestore();

    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }

    const validate = (data) => {
        if (!data.title) {
            throw new ValidationError('title')
        }
        if ((!data.choices) || (data.choices.length == 0)) {
            throw new ValidationError('choices')
        }
        if (!data.mode) {
            throw new ValidationError('mode')
        }
    }

    const formatDoc = (user, data) => {
        return {
            title: data.title,
            description: "",
            author: {
                id: user.uid,
                name: user.displayName ? user.displayName : user.email,
                email: user.email
            },
            dateCreated: dayjs().format(),
            key: randomstring.generate({
                length: 6,
                readable: true,
                charset: 'alphanumeric',
                capitalization: 'uppercase'
            }),
            mode: (data.mode === 'random') ? 'random' : 'majority',
            suggest: (data.mode === 'random' && data.suggest) ? data.suggest : false,
            choices: [...data.choices]
        }
    }
    const pickData = request.body;
    try {
        validate(pickData);
    } catch (e) {
        return response.status(400).send({
            error: e.message
        });
    }

    try {
        const result = {
            created: false,
            pickId: null
        }
        const dbResponse = await db.collection('picks').add(formatDoc(request.user, pickData));
        result.created = true;
        result.pickId = dbResponse.id;
        return response.send(result);
    } catch (e) {
        return response.status(500).send({
            error: e.message
        });
    }
}

const getPickOr404 = async (db, pickId, openOnly) => {
    const pickDoc = await db.collection('picks').doc(pickId).get();

    if (!pickDoc.exists) {
        throw new PickNotFoundError(pickId);
    }

    const pickData = await pickDoc.data();
    if (openOnly) {
        if (pickData.result && pickData.result.length > 0) {
            // Déjà résolu => error
            throw new PickNotFoundError(pickId);
        }
        if (pickData.limit) {
            if (dayjs(new Date()).isAfter(dayjs(pickData.limit))) {
                // Limite déjà passée  => error
                throw new PickNotFoundError(pickId);
            }
        }
    }
    return pickData;
}

const vote = async ({ admin }, request, response) => {

    const validate = (data, pick) => {
        if ((!data.picked) || (data.picked.length == 0)) {
            throw new ValidationError('picked')
        }
        // check free suggest only if permitted
        data.picked.forEach(c => {
            if (!pick.choices.includes(c) && !pick.suggest) {
                // unknown choice and no suggestion allowed
                throw new ValidationError('picked');
            }
        });
    }

    const formatDoc = (user, data) => {
        return {
            name: user.displayName ? user.displayName : user.email,
            email: user.email,
            date: dayjs().format(),
            choices: [...data.picked]
        }
    }

    const db = admin.firestore();
    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }

    const pickData = await getPickOr404(db, request.params.pickId, true)
    try {
        validate(request.body, pickData);
    } catch (error) {
        return response.status(400).send({
            error: error.message
        });
    }
    const result = {
        registered: false,
    }
    var batch = db.batch();
    var voteRef = db.collection(`picks/${request.params.pickId}/votes`).doc(request.user.uid);
    batch.set(
        voteRef, formatDoc(request.user, request.body)
    );
    var pickRef = db.collection('picks').doc(request.params.pickId);
    batch.update(pickRef, {
        voters: admin.firestore.FieldValue.arrayUnion({
            id: request.user.uid,
            name: request.user.displayName ? request.user.displayName : request.user.email
        })
    });
    batch.commit().then(() => {
        result.registered = true;
        return response.send(result);
    }
    ).catch(error => {
        console.log(error);
        return response.status(500).send({
            error: error.message
        });
    });
}

const cancelVote = async ({ admin }, request, response) => {

    const validate = (data) => {
        if (!data.displayName) {
            throw new ValidationError('displayName')
        }
    }

    const db = admin.firestore();
    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }

    const pickData = await getPickOr404(db, request.params.pickId, true)
    // TODO : use rule instead of this check:
    if (request.user.uid !== pickData.author.id) {
        return response.status(403).send({
            error: "Forbidden"
        })
    }
    try {
        validate(request.body);
    } catch (error) {
        return response.status(400).send({
            error: error.message
        });
    }
    const result = {
        deleted: false,
    }
    var batch = db.batch();
    var voteRef = db.collection(`picks/${request.params.pickId}/votes`).doc(request.params.voteId);
    batch.delete(voteRef);
    var pickRef = db.collection('picks').doc(request.params.pickId);
    batch.update(pickRef, {
        voters: admin.firestore.FieldValue.arrayRemove({
            id: request.params.voteId,
            name: request.body.displayName
        })
    });
    batch.commit().then(() => {
        result.deleted = true;
        return response.send(result);
    }
    ).catch(error => {
        console.log(error);
        return response.status(500).send({
            error: error.message
        });
    });
}

module.exports = {
    create,
    vote,
    cancelVote
}