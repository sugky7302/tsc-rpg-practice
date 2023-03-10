"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicarmor_1 = require("../armors/basicarmor");
const character_1 = require("../character/character");
const swordsman_1 = require("../character/swordsman");
const warlock_1 = require("../character/warlock");
const role_1 = require("../role/role");
const basic_sword_1 = require("../weapons/basic-sword");
let a = new character_1.Character('abc', role_1.Role.Highwayman, new basic_sword_1.BasicSword(), new basicarmor_1.BasicArmor());
let b = new swordsman_1.Swordsman('jsq');
let c = new warlock_1.Warlock('12qiw');
const bountyHunter = new character_1.BountyHunter('Maxwell');
const wantedCharacter = new character_1.Character('Martin', role_1.Role.Highwayman, new basic_sword_1.BasicSword(), new basicarmor_1.BasicArmor());
const wantedMonster = new character_1.Monster('Eikthyrnir');
bountyHunter.capture(wantedCharacter, 1);
bountyHunter.capture(wantedMonster, 0.5);
bountyHunter.capture(a, 0.01);
bountyHunter.sellHostages();
