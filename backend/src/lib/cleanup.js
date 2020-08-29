//https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

async function deleteFromPicks({ admin }, query, batchSize) {
    const db = admin.firestore();
    const picksSnapshot = await query.get();
    picksSnapshot.docs.forEach(async (doc) => {
        // Delete registrations
        const registrationRef = db.collection("registrations").where("pickId", "==", doc.id);
        const queryReg = registrationRef.limit(batchSize);
        await new Promise((resolve, reject) => {
            deleteQueryBatch(db, queryReg, resolve).catch(reject);
        });
        // Delete votes
        const votesRef = db.collection(`picks/${doc.id}/votes`);
        const queryVotes = votesRef.limit(batchSize);
        await new Promise((resolve, reject) => {
            deleteQueryBatch(db, queryVotes, resolve).catch(reject);
        });
    });

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
        return;
    });
}


function deleteCancelledPicks({ admin }) {
    const db = admin.firestore();
    const batchSize = 20;
    const yesterday = (function (d) { d.setDate(d.getDate() - 1); return d })(new Date);
    const expireLimit = admin.firestore.Timestamp.fromDate(yesterday);
    const collectionRef = db.collection("picks").where("cancelled", "==", true).where("dateFinished", "<", expireLimit);
    const query = collectionRef.limit(batchSize);

    deleteFromPicks({ admin }, query, batchSize);
}

function deleteTerminatedPicks({ admin }) {
    const db = admin.firestore();
    const batchSize = 20;
    const lastWeek = (function (d) { d.setDate(d.getDate() - 7); return d })(new Date);
    const expireLimit = admin.firestore.Timestamp.fromDate(lastWeek);
    const collectionRef = db.collection("picks").where("dateFinished", "<", expireLimit).orderBy("dateFinished").orderBy("result");
    const query = collectionRef.limit(batchSize);

    deleteFromPicks({ admin }, query, batchSize);
}

function cleanupFromHTTPS({ admin }, request, response) {
    deleteCancelledPicks({ admin });
    deleteTerminatedPicks({ admin });
    response.send("");
}

module.exports = {
    deleteCancelledPicks,
    deleteTerminatedPicks,
    cleanupFromHTTPS
}