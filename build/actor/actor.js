"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Actor {
    get volume() {
        return this.len * this.width * this.height;
    }
}
exports.default = Actor;
