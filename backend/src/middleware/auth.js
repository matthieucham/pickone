const { request } = require("express");

module.exports.test = async (request, response, next) => {
    request.user = {
        uid: '1'
    };
    next();
}

module.exports.requiresAuth = async (admin, request, response, next) => {
    if (!(request.headers.authorization && request.headers.authorization.startsWith('Bearer '))) {
        response.status(401).send('Unauthorized');
        return;
    }
    try {
        const idToken = request.headers.authorization.split('Bearer ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);

        request.user = decodedIdToken;

        next();

        return;
    } catch (e) {
        console.error(e);
        response.status(401).send('Unauthorized');
        return;
    }
}