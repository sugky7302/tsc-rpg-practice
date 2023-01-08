"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BountyHunter = exports.Monster = exports.Character = void 0;
const armor_1 = require("../armors/armor");
const basicarmor_1 = require("../armors/basicarmor");
const basicrobe_1 = require("../armors/basicrobe");
const role_1 = require("../role/role");
const basic_sword_1 = require("../weapons/basic-sword");
const basic_wand_1 = require("../weapons/basic-wand");
const weapon_1 = require("../weapons/weapon");
class Character {
    name;
    role;
    weaponRef;
    armorRef;
    constructor(name, role, weaponRef, armorRef) {
        this.name = name;
        this.role = role;
        this.weaponRef = weaponRef;
        this.armorRef = armorRef;
    }
    introduce() {
        console.log(`Hi, I'm ${this.name} the ${this.role}`);
    }
    attack(target) {
        this.weaponRef.attack(this, target);
    }
    /**
     * 角色裝備武器
     * 會檢查角色是否符合武器規定
     * @param {Equipment} equipment - 武器
     */
    equip(equipment) {
        const { availableRoles: roles } = equipment;
        if (roles.length === 0 || roles.includes(this.role)) {
            console.log(`${this.name} has equipped "${equipment.name}"!`);
            if (equipment instanceof weapon_1.Weapon) {
                this.weaponRef = equipment;
            }
            else if (equipment instanceof armor_1.Armor) {
                this.armorRef = equipment;
            }
        }
        else {
            throw new Error(`${this.role} cannot equip ${equipment.name}!`);
        }
    }
}
exports.Character = Character;
class Monster extends Character {
    name;
    constructor(name) {
        super(name, role_1.Role.Monster, new basic_sword_1.BasicSword(), new basicarmor_1.BasicArmor());
        this.name = name;
    }
}
exports.Monster = Monster;
class BountyHunter extends Character {
    // 賞金獵人會抓取人質或怪物，所以這裡會是用陣列型別
    hostages = [];
    constructor(name) {
        super(name, role_1.Role.BountyHunter, new basic_wand_1.BasicWand(), new basicrobe_1.BasicRobe());
    }
    /**
     * 捕捉敵人
     * 如果 p 落在成功區間中，表示成功捕獲
     * @param {Character} target - 捕捉目標
     * @param {number} successRate - 捕捉到目標的機率
     */
    capture(target, successRate) {
        const randomNumber = Math.random();
        let message;
        let targetTitle = `${target.name} the ${target.role}`;
        if (randomNumber <= successRate) {
            this.hostages.push(target);
            message = `${this.name} has captured ${targetTitle}`;
        }
        else {
            message = `${this.name} failed to capture ${targetTitle}`;
        }
        console.log(message);
    }
    sellHostages() {
        const totalPrice = this.hostages.length * 1000;
        const hostagesInfo = this.hostages
            .map((hostage) => `${hostage.name} the ${hostage.role}`)
            .join('\n');
        console.log(`${this.name} sells all the hostages, including: ${hostagesInfo}\n\nReceive Gold: $${totalPrice}`);
        this.hostages = [];
    }
}
exports.BountyHunter = BountyHunter;
