"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BountyHunter = exports.Monster = exports.Character = void 0;
const role_1 = require("../role/role");
const basic_sword_1 = require("../weapons/basic-sword");
const basic_wand_1 = require("../weapons/basic-wand");
class Character {
    name;
    role;
    weaponRef;
    // 在裝備武器的同時被初始化
    attackRef;
    constructor(name, role, weaponRef) {
        this.name = name;
        this.role = role;
        this.weaponRef = weaponRef;
        this.attackRef = this.weaponRef.attackStrategy;
    }
    introduce() {
        console.log(`Hi, I'm ${this.name} the ${this.role}`);
    }
    attack(target) {
        this.attackRef.attack(this, target);
    }
    // 替換攻擊策略
    switchAttackStrategy(type) {
        this.attackRef = type;
    }
    /**
     * 角色裝備武器
     * 會檢查角色是否符合武器規定
     * @param {Weapon} weapon - 武器
     */
    equip(weapon) {
        const { availableRoles: roles } = weapon;
        if (roles.length === 0 || roles.includes(this.role)) {
            console.log(`${this.name} has equipped "${weapon.name}"!`);
            this.weaponRef = weapon;
            this.attackRef = this.weaponRef.attackStrategy;
        }
        else {
            throw new Error(`${this.role} cannot equip ${weapon.name}!`);
        }
    }
}
exports.Character = Character;
class Monster extends Character {
    name;
    constructor(name) {
        super(name, role_1.Role.Monster, new basic_sword_1.BasicSword());
        this.name = name;
    }
}
exports.Monster = Monster;
class BountyHunter extends Character {
    // 賞金獵人會抓取人質或怪物，所以這裡會是用陣列型別
    hostages = [];
    constructor(name) {
        super(name, role_1.Role.BountyHunter, new basic_wand_1.BasicWand());
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
