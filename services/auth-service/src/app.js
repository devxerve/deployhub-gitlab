"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Rutas
app.use('/auth', auth_routes_1.default);
// Endpoint de prueba (Healthcheck)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'auth-service' });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map