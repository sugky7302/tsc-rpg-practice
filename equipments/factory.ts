import { Armor } from '../armors/armor';
import { BasicArmor } from '../armors/basicarmor';
import { BasicRobe } from '../armors/basicrobe';
import { BasicSword } from '../weapons/basic-sword';
import { BasicWand } from '../weapons/basic-wand';
import { Weapon } from '../weapons/weapon';

export enum Equipments {
    Weapon = 'Weapon',
    Armor = 'Armor',
    Glove = 'Glove',
    Boots = 'Boots',
    Helmet = 'Helmet',
}

export interface EquipmentFactory {
    createWeapon(): Weapon;
    createArmor(): Armor;
}

export class WarlockEquipmentFactory implements EquipmentFactory {
    createWeapon(): Weapon {
        return new BasicWand();
    }

    createArmor(): Armor {
        return new BasicRobe();
    }
}

export class SwordsmanEquipmentFactory implements EquipmentFactory {
    createWeapon(): Weapon {
        return new BasicSword();
    }

    createArmor(): Armor {
        return new BasicArmor();
    }
}
