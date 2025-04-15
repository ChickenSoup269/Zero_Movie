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
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
// import { fetchMoviesFromTMDB } from "./services/fetchmovieServices";
// import { fetchAndStoreGenres } from "./services/fetchgenresServices";
// import {seedCinemas} from "./services/seedData"
const cronUtils_1 = require("./utils/cronUtils");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("combined"));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
(0, db_1.connectDB)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Kết nối MongoDB thành công!");
    // await fetchMoviesFromTMDB();
    // await fetchAndStoreGenres();
    // await seedCinemas();
    (0, cronUtils_1.startCronJobs)();
}));
(0, appRoutes_1.default)(app);
// Start server
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
