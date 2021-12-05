'use strict';

const Cart = class {
    constructor(cartNumber, month, year, defaults) {
        this.cartNumber = cartNumber;
        this.month = month;
        this.year = year;
        this.defaults = defaults;
    }

    getCartNumber() {
        return this.cartNumber;
    }
    setCartNumber(cartNumber) {
        this.cartNumber = cartNumber;
    }

    getMonth() {
        return this.month;
    }
    setMonth(month) {
        this.month = month;
    }

    getYear() {
        return this.year;
    }
    setYear(year) {
        this.year = year;
    }

    getDefaults() {
        return this.defaults;
    }
    setDefaults(defaults) {
        this.defaults = defaults;
    }
};

module.exports = Cart;