"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtract = exports.add = void 0;
const add_js_1 = require("./add.js");
Object.defineProperty(exports, "add", { enumerable: true, get: function () { return add_js_1.add; } });
const subtract_js_1 = require("./subtract.js");
Object.defineProperty(exports, "subtract", { enumerable: true, get: function () { return subtract_js_1.subtract; } });
/**
 * This means that a user can get at our functions by
 * importing just what they need, or by getting everything:
 *
 * import { add } from 'maths-package';
 * import * as MathsPackage from 'maths-package';
 */ 
