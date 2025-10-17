"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.connectDB = connectDB;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'not-pokemon',
    port: parseInt(process.env.DB_PORT || '5432'),
});
async function connectDB() {
    try {
        await exports.pool.connect();
        console.log('Connexion à PostgreSQL réussie');
    }
    catch (error) {
        console.error('Erreur de connexion à PostgreSQL:', error);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map