export class Assert {
    static isTrue(condition: unknown): asserts condition {
        if (condition === false) throw new Error('Assertion is not true.');
    }

    static isFalse(condition: unknown): asserts condition {
        if (condition === true) throw new Error('Assertion is not false.');
    }

    static isEqual<T>(a: T, b: T): asserts a is T {
        if (a !== b) throw new Error('Two conditions are not equal.');
    }
}
