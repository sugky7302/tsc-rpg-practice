"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerCharacter = void 0;
const character_1 = require("./character");
class PlayerCharacter extends character_1.Character {
    constructor(name, roles) {
        super(name, roles);
    }
}
exports.PlayerCharacter = PlayerCharacter;
