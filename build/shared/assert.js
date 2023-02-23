"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assert = void 0;
class Assert {
    static isTrue(condition, message) {
        if (condition === false)
            throw new Error(message ?? 'Assertion is not true.');
    }
    static isFalse(condition, message) {
        if (condition === true)
            throw new Error(message ?? 'Assertion is not false.');
    }
    static AreEqual(a, b, message) {
        if (a !== b)
            throw new Error(message ?? 'Two conditions are not equal.');
    }
}
exports.Assert = Assert;
