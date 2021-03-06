const randomstring = require('randomstring');

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

async function makeRegistration(db, userId, pickId, pickData) {
    const doc = {
        pickId: pickId,
        userId: userId,
        pickTitle: pickData.title,
        pickAuthor: pickData.author,
        pickDate: pickData.dateCreated
    };
    if (pickData.result) {
        doc.status = "TERMINATED";
    }
    if (pickData.cancelled) {
        doc.status = "CANCELLED";
    }
    await db.collection('registrations').add(
        doc
    );
}

function notifyVoteFinished(db, messaging, pickId, pickData, iscancelled) {
    db.collection("registrations").where("pickId", "==", pickId).get()
        .then(snapshot => {
            let tokensFetch = snapshot.docs.map(async (doc) => {
                let pt = await db.collection("pushTokens").doc(doc.data().userId).get();
                if (pt.exists) {
                    return pt.data().token;
                } else {
                    return null;
                }
            });
            return Promise.all(tokensFetch);
        })
        .then(
            (tokens) => {
                let message = {
                    data: {
                        pickId: pickId,
                        pickTitle: pickData.title,
                        pickStatus: iscancelled ? "CANCELLED" : "TERMINATED"
                    },
                    tokens: tokens
                };
                // Send a message to the device corresponding to the provided
                // registration token.
                return messaging.sendMulticast(message);
            }
        ).then((response) => {
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        console.log(resp);
                    }
                });
            }
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

const create = async ({ admin }, request, response) => {
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
        if (!data.title) {
            throw new ValidationError('title')
        }
        if ((!data.choices) || (data.choices.length == 0)) {
            throw new ValidationError('choices')
        }
        if (!data.mode) {
            throw new ValidationError('mode')
        }
        if (!data.cardinality) {
            throw new ValidationError('cardinality')
        }
    }

    const formatDoc = (user, userInfo, data) => {
        return {
            title: data.title,
            description: data.description || "",
            author: {
                id: user.uid,
                name: userInfo.displayName ? userInfo.displayName : userInfo.email,
                email: userInfo.email
            },
            dateCreated: admin.firestore.Timestamp.now(),
            key: randomstring.generate({
                length: 6,
                readable: true,
                charset: 'alphanumeric',
                capitalization: 'uppercase'
            }),
            mode: (data.mode === 'random') ? 'random' : 'majority',
            suggest: (data.mode === 'random' && data.suggest) ? data.suggest : false,
            multiple: (data.cardinality === 'multiple'),
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
        const userInfo = await admin.auth().getUser(request.user.uid);
        const docData = formatDoc(request.user, userInfo, pickData)
        const dbResponse = await db.collection('picks').add(docData);
        result.created = true;
        result.pickId = dbResponse.id;
        makeRegistration(db, request.user.uid, result.pickId, docData);
        return response.send(result);
    } catch (e) {
        console.log(e);
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

    const pickData = pickDoc.data();
    if (openOnly) {
        if (pickData.result && pickData.result.length > 0) {
            // Déjà résolu => error
            throw new PickNotFoundError(pickId);
        }
        if (pickData.cancelled) {
            // Vote annulé => error
            throw new PickNotFoundError(pickId);
        }
        // if (pickData.limit) {
        //     if (dayjs(new Date()).isAfter(dayjs(pickData.limit))) {
        //         // Limite déjà passée  => error
        //         throw new PickNotFoundError(pickId);
        //     }
        // }
    }
    return pickData;
}

const vote = async ({ admin }, request, response) => {

    const validate = (data, pick) => {
        console.log(pick.choices);
        if ((!data.picked) || (data.picked.length == 0)) {
            console.log("b");
            throw new ValidationError('picked')
        }
        // check free suggest only if permitted
        data.picked.forEach(c => {
            if (!pick.choices.includes(c) && !pick.suggest) {
                console.log(c);
                // unknown choice and no suggestion allowed
                throw new ValidationError('picked');
            }
        });
    }

    const formatDoc = (user, data) => {
        return {
            name: user.displayName ? user.displayName : user.email,
            date: admin.firestore.Timestamp.now(),
            choices: [...data.picked]
        }
    }

    const db = admin.firestore();
    if (!request.body) {
        console.log("d");
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
    const userInfo = await admin.auth().getUser(request.user.uid);
    let batch = db.batch();
    let voteRef = db.collection(`picks/${request.params.pickId}/votes`).doc(request.user.uid);
    batch.set(
        voteRef, formatDoc(userInfo, request.body)
    );
    let pickRef = db.collection('picks').doc(request.params.pickId);
    batch.update(pickRef, {
        voters: admin.firestore.FieldValue.arrayUnion({
            id: request.user.uid,
            name: userInfo.displayName ? userInfo.displayName : userInfo.email
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
    let batch = db.batch();
    let voteRef = db.collection(`picks/${request.params.pickId}/votes`).doc(request.params.voteId);
    batch.delete(voteRef);
    let pickRef = db.collection('picks').doc(request.params.pickId);
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

const cancel = async ({ admin }, request, response) => {
    const db = admin.firestore();
    const messaging = admin.messaging();
    const pickData = await getPickOr404(db, request.params.pickId, true)
    if (request.user.uid !== pickData.author.id) {
        return response.status(403).send({
            error: "Forbidden"
        })
    }
    try {
        const result = {
            cancelled: false,
        }
        let batch = db.batch();
        let pickRef = db.collection(`picks`).doc(request.params.pickId);
        batch.update(pickRef, { cancelled: true, dateFinished: admin.firestore.Timestamp.now() });
        db.collection(`registrations`).where("pickId", "==", request.params.pickId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    batch.update(doc.ref, { status: "CANCELLED" });
                });
                return null;
            }
            )
            .then(() => {
                return batch.commit();
            })
            .then(() => {
                result.cancelled = true;
                return response.send(result);
            }
            ).then(
                () => notifyVoteFinished(db, messaging, request.params.pickId, pickData, true)
            ).catch(error => {
                console.log(error);
                return response.status(500).send({
                    error: error.message
                });
            });
    } catch (e) {
        return response.status(500).send({
            error: e.message
        });
    }
}

function rand(items) {
    // "|" for a kinda "int div"
    let item = items[Math.floor(Math.random() * items.length)];
    return item;
}

/**
 *  Sorting an array order by frequency of occurence in javascript
 *  @param {array} array An array to sort
 *  @returns {array} array of item order by frequency
 **/
function sortByFrequency(array) {
    var frequency = {};
    var sortAble = [];
    var newArr = [];

    array.forEach(function (value) {
        if (value in frequency)
            frequency[value] = frequency[value] + 1;
        else
            frequency[value] = 1;
    });
    for (var key in frequency) {
        sortAble.push([key, frequency[key]])
    }
    sortAble.sort(function (a, b) {
        return b[1] - a[1]
    })
    sortAble.forEach(function (obj) {
        for (var i = 0; i < obj[1]; i++) {
            newArr.push(obj[0]);
        }
    })
    return newArr;
}

const resolve = async ({ admin }, request, response) => {
    const db = admin.firestore();
    const messaging = admin.messaging();
    try {
        const pickData = await getPickOr404(db, request.params.pickId, true)
        // grab all votes:
        const query = await db.collection(`picks/${request.params.pickId}/votes`).get()
        let winner;
        const bag = [];
        query.forEach((doc) => {
            bag.push(...doc.data().choices);
        });
        if (pickData.mode === "random") {
            // Build a big bag with all values, then pick one
            winner = rand(bag);
        } else if (pickData.mode === "majority") {
            sorted = sortByFrequency(bag);
            winner = sorted[0];
        }
        let scores = bag.reduce((scoresMap, vote) => (
            vote in scoresMap ? scoresMap[vote] = scoresMap[vote] + 1 : scoresMap[vote] = 1, scoresMap), {})

        const result = {
            resolved: false,
        }

        let batch = db.batch();
        let pickRef = db.collection(`picks`).doc(request.params.pickId);
        batch.update(pickRef,
            {
                result: {
                    winner: winner,
                    scores: scores
                },
                dateFinished: admin.firestore.Timestamp.now()
            }
        );
        db.collection(`registrations`).where("pickId", "==", request.params.pickId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    batch.update(doc.ref, { status: "TERMINATED" });
                });
                return null;
            }
            )
            .then(() => {
                return batch.commit();
            })
            .then(() => {
                result.resolved = true;
                return response.send(result);
            }).then(
                () => notifyVoteFinished(db, messaging, request.params.pickId, pickData)
            ).catch(error => {
                console.log(error);
                return response.status(500).send({
                    error: error.message
                });
            });
    } catch (e) {
        console.log(e.message);
        return response.status(500).send({
            error: e.message
        });
    }
}

const createRegistration = async ({ admin }, request, response) => {
    const db = admin.firestore();

    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }

    const validate = (data) => {
        if (!data.code) {
            throw new ValidationError('code')
        }
    }

    try {
        validate(request.body);
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
        const snapshot = await db.collection('picks').where('key', '==', request.body.code).get();
        if (snapshot.empty) {
            return response.status(404).send({
                error: "Ce code est inconnu"
            });
        }
        snapshot.forEach(doc => {
            // On vérifie si la registration existe déjà pour ce user et ce pick
            db.collection("registrations").where("userId", "==", request.user.uid).where("pickId", "==", doc.id).get().then(
                (snapshot) => {
                    if (snapshot.empty) {
                        makeRegistration(db, request.user.uid, doc.id, doc.data());
                    }
                    return;
                }
            )
            result.created = true;
            result.pickId = doc.id;

            // On peut s'arrêter dès le premier résultat trouvé (clés uniques)
            return response.send(result);
        });
    } catch (e) {
        return response.status(500).send({
            error: e.message
        });
    }
}

const storePushToken = async ({ admin }, request, response) => {
    const db = admin.firestore();
    if (!request.body) {
        return response.status(400).send({
            error: 'No data in body'
        });
    }
    try {
        const result = {
            stored: false,
        }
        const ptRef = db.collection('pushTokens').doc(request.user.uid);
        const res = await ptRef.set({
            token: request.body
        });
        result.stored = true;
        return response.send(result);
    } catch (e) {
        console.log(e);
        return response.status(500).send({
            error: e.message
        });
    }
}

module.exports = {
    create,
    vote,
    cancelVote,
    cancel,
    resolve,
    createRegistration,
    storePushToken
}