"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTemplate = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Swordsman"] = "\u528D\u58EB";
    Role["Warlock"] = "\u8853\u58EB";
    Role["Archer"] = "\u5F13\u7BAD\u624B";
    Role["Priest"] = "\u7267\u5E2B";
    Role["Assassin"] = "\u523A\u5BA2";
    Role["Mage"] = "\u6CD5\u5E2B";
    Role["Knight"] = "\u9A0E\u58EB";
})(Role = exports.Role || (exports.Role = {}));
const TEMPLATES = new Map([
    [
        Role.Swordsman,
        {
            knowledges: ['劍術入門'],
            skills: ['斬擊'],
        },
    ],
    [
        Role.Warlock,
        {
            knowledges: ['黑暗契約'],
            skills: ['詛咒'],
        },
    ],
    [
        Role.Mage,
        {
            knowledges: ['元素導論'],
            skills: ['火球術'],
        },
    ],
]);
class RoleTemplate {
    role;
    knowledges;
    skills;
    constructor(role) {
        this.role = role;
        this.knowledges = TEMPLATES.get(role)?.knowledges ?? [];
        this.skills = TEMPLATES.get(role)?.skills ?? [];
    }
    /**
     * 檢查角色是否擁有此職業
     * @param {IRole} pool - 角色裡的職業池
     * @return {boolean} - 是否擁有此職業
     */
    match(pool) {
        return pool.roles.includes(this.role);
    }
}
exports.RoleTemplate = RoleTemplate;
