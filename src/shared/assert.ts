export class Assert {
    static isTrue(condition: unknown, message?: string) {
        if (condition === false) throw new Error(message ?? 'Assertion is not true.');
    }

    static isFalse(condition: unknown, message?: string) {
        if (condition === true) throw new Error(message ?? 'Assertion is not false.');
    }

    static AreEqual<T>(a: T, b: T, message?: string) {
        if (a !== b) throw new Error(message ?? 'Two conditions are not equal.');
    }
}
