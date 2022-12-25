"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeleeAttack = void 0;
class MeleeAttack {
    attack(self, target) {
        console.log(`${self.name} strikes ${target.name} with a big sword!`);
    }
}
exports.MeleeAttack = MeleeAttack;
