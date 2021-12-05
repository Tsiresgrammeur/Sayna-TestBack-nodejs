'use strict';

const User = class {
    constructor(firstname, lastname, email, password, date_naissance, sexe) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.date_naissance = date_naissance;
        this.sexe = sexe;
    }

    getFirstName() {
        return this.firstname;
    }
    setFirstName(firstname) {
        this.firstname = firstname;
    }

    getLastName() {
        return this.lastname;
    }
    setLastName(lastname) {
        this.lastname = lastname;
    }

    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }

    getPassword() {
        return this.password;
    }
    setPassword(password) {
        this.password = password;
    }

    getDateNaissance() {
        return this.date_naissance;
    }
    setDateNaissance(date_naissance) {
        this.date_naissance = date_naissance;
    }
    getSexe() {
        return this.sexe;
    }
    setSexe(sexe) {
        this.sexe = sexe;
    }
};

module.exports = User;