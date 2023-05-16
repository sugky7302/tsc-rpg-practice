/**
 * @class Attribute
 * @description 屬性類別
 * Attribute 會應用在 角色(Character)、裝備(Equipment)、技能(Skill)、詞綴(Affix) 等等
 */
class Attribute {
    private _name: string;
    private _value: number;

    constructor(name: string, value: number) {
        this._name = name;
        this._value = value;
    }

    get name() {
        return this._name;
    }

    get value() {
        return this._value;
    }

    add(x: Attribute | number) {}

    substract(x: Attribute | number) {}

    multiply(x: number) {}

    divide(x: number) {}
}
