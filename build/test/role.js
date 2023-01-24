"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const role_1 = require("../role/role");
const assert_1 = require("../shared/assert");
class RoleTest {
    // 測試列舉
    testEnumerate() {
        console.log(role_1.Role.Swordsman);
    }
    // 測試職業模板需要擁有哪些基本屬性
    testRoleTemplateProperty() {
        const roleTemplate = new role_1.RoleTemplate(role_1.Role.Mage);
        console.log(roleTemplate.role);
        console.log(roleTemplate.knowledges);
        console.log(roleTemplate.skills);
        (0, assert_1.assert)(roleTemplate.match({ roles: [role_1.Role.Mage, role_1.Role.Knight, role_1.Role.Warlock] }), 'RoleTemplate.match()');
    }
}
function test() {
    const test = new RoleTest();
    test.testEnumerate();
    test.testRoleTemplateProperty();
}
exports.test = test;
