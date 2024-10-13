"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appMain = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const logger_1 = require("./services/logger");
const routes_1 = require("./routes");
const appMain = () => {
    const app = (0, express_1.default)();
    // Set up Cross Origin Request Scripting
    app.use((0, cors_1.default)());
    // API
    const apiRootName = '/api';
    app.use(`${apiRootName}/media`, routes_1.mediaRouter);
    // Get PORT from environment
    const { port } = config_1.config.env;
    app.listen(port, () => {
        logger_1.logger.info(`Started server at port ${port}`);
    });
};
exports.appMain = appMain;
