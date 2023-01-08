"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaponFactory = exports.Weapons = void 0;
const basic_sword_1 = require("./basic-sword");
const basic_wand_1 = require("./basic-wand");
const dagger_1 = require("./dagger");
var Weapons;
(function (Weapons) {
    Weapons[Weapons["BasicSword"] = 0] = "BasicSword";
    Weapons[Weapons["BasicWand"] = 1] = "BasicWand";
    Weapons[Weapons["Dagger"] = 2] = "Dagger";
})(Weapons = exports.Weapons || (exports.Weapons = {}));
/**
 * 每一次新增一個武器時，只會在 WeaponFactory 多加一個選項，
 * 沒有任何其他地方會需要重複這個過程，
 * 因此依然符合 DRY（Don't Repeat Yourself）原則！
 *! 如果還要追加 ArmorFactory、HelmetFactory、DecorationFactory，要怎麼寫比較好？
 *! 不太可能一個一個建，太浪費時間了。
 * 物件委任（也就是物件複合的根本）的概念本身就可以作為策略模式的基礎
 */
class WeaponFactory {
    createWeapon(type) {
        switch (type) {
            case Weapons.BasicSword:
                return new basic_sword_1.BasicSword();
            case Weapons.BasicWand:
                return new basic_wand_1.BasicWand();
            case Weapons.Dagger:
                return new dagger_1.Dagger();
            default:
                throw new Error(`${Weapons[type]} isn't registered!`);
        }
    }
}
exports.WeaponFactory = WeaponFactory;
