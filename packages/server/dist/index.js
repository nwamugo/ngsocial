"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 8081;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Express is successfully running!');
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
