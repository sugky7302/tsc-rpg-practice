"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warlock = void 0;
const role_1 = require("../role/role");
const basic_wand_1 = require("../weapons/basic-wand");
const character_1 = require("./character");
class Warlock extends character_1.Character {
    constructor(name) {
        super(name, role_1.Role.Warlock, new basic_wand_1.BasicWand());
    }
}
exports.Warlock = Warlock;
