"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const fetchmovieServices_1 = require("./services/fetchmovieServices");
const fetchgenresServices_1 = require("./services/fetchgenresServices");
// import {seedCinemas} from "./services/seedData"
const cronUtils_1 = require("./utils/cronUtils");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("combined"));
(0, db_1.connectDB)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Kết nối MongoDB thành công!");
    yield (0, fetchmovieServices_1.fetchMoviesFromTMDB)();
    yield (0, fetchgenresServices_1.fetchAndStoreGenres)();
    // await seedCinemas();
    (0, cronUtils_1.startCronJobs)();
}));
(0, appRoutes_1.default)(app);
// Start server
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
