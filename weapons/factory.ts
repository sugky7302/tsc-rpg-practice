import { BasicSword } from './basic-sword';
import { BasicWand } from './basic-wand';
import { Dagger } from './dagger';
import { Weapon } from './weapon';

export enum Weapons {
    BasicSword,
    BasicWand,
    Dagger,
}

/**
 * 每一次新增一個武器時，只會在 WeaponFactory 多加一個選項，
 * 沒有任何其他地方會需要重複這個過程，
 * 因此依然符合 DRY（Don't Repeat Yourself）原則！
 *! 如果還要追加 ArmorFactory、HelmetFactory、DecorationFactory，要怎麼寫比較好？
 *! 不太可能一個一個建，太浪費時間了。
 * 物件委任（也就是物件複合的根本）的概念本身就可以作為策略模式的基礎
 */
export class WeaponFactory {
    public createWeapon(type: Weapons): Weapon {
        switch (type) {
            case Weapons.BasicSword:
                return new BasicSword();
            case Weapons.BasicWand:
                return new BasicWand();
            case Weapons.Dagger:
                return new Dagger();
            default:
                throw new Error(`${Weapons[type]} isn't registered!`);
        }
    }
}
