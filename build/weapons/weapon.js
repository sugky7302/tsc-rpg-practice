"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weapon = void 0;
const factory_1 = require("../equipments/factory");
class Weapon {
    type = factory_1.Equipments.Weapon;
    // 更換攻擊策略
    switchAttackStrategy(type) {
        this.attackStrategy = type;
    }
    /**
     * 藉由 attackStrategy 參考點呼叫 attack 方法
     * @param {Character} self - 攻擊者
     * @param {Character} target - 目標
     */
    attack(self, target) {
        this.attackStrategy.attack(self, target);
    }
}
exports.Weapon = Weapon;
