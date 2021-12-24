'use strict';

const Tentative = class {
    constructor(email, nbTentative, token) {
        this.email = email;
        this.nbTentative = nbTentative;
        this.token = token;
    }

    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }

    getNbTentative() {
        return this.nbTentative;
    }
    setNbTentative(nbTentative) {
        this.nbTentative = nbTentative;
    }

    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }
};

module.exports = Tentative;
