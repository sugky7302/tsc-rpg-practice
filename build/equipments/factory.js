"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwordsmanEquipmentFactory = exports.WarlockEquipmentFactory = exports.Equipments = void 0;
const basicarmor_1 = require("../armors/basicarmor");
const basicrobe_1 = require("../armors/basicrobe");
const basic_sword_1 = require("../weapons/basic-sword");
const basic_wand_1 = require("../weapons/basic-wand");
var Equipments;
(function (Equipments) {
    Equipments["Weapon"] = "Weapon";
    Equipments["Armor"] = "Armor";
    Equipments["Glove"] = "Glove";
    Equipments["Boots"] = "Boots";
    Equipments["Helmet"] = "Helmet";
})(Equipments = exports.Equipments || (exports.Equipments = {}));
class WarlockEquipmentFactory {
    createWeapon() {
        return new basic_wand_1.BasicWand();
    }
    createArmor() {
        return new basicrobe_1.BasicRobe();
    }
}
exports.WarlockEquipmentFactory = WarlockEquipmentFactory;
class SwordsmanEquipmentFactory {
    createWeapon() {
        return new basic_sword_1.BasicSword();
    }
    createArmor() {
        return new basicarmor_1.BasicArmor();
    }
}
exports.SwordsmanEquipmentFactory = SwordsmanEquipmentFactory;
