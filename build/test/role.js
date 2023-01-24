"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const role_1 = require("../role/role");
class RoleTest {
    // 測試列舉
    testEnumerate() {
        console.log(role_1.Role.Swordsman);
    }
}
function test() {
    const test = new RoleTest();
    test.testEnumerate();
}
exports.test = test;
