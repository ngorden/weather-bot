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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
require("dotenv").config();
var nedb_1 = __importDefault(require("nedb"));
var body_parser_1 = require("body-parser");
var node_fetch_1 = __importDefault(require("node-fetch"));
var http_errors_1 = __importDefault(require("http-errors"));
var weatherdb = new nedb_1.default({ filename: path_1.resolve(__dirname, "weather.db"), autoload: true });
var app = express_1.default();
var port = process.env.PORT || 3001;
app.set("view engine", "pug");
app.use(body_parser_1.json({ limit: "1mb" }));
app.use(express_1.default.static(path_1.join(__dirname, "public")));
app.get("/", function (_, res) {
    weatherdb.find({}, function (err, docs) {
        if (err)
            res.render("index", { data: null });
        else
            res.render("index", { data: docs });
    });
});
app.get('/details', function (req, res) { return res.render("details"); });
app.get("/details/:id", function (req, res) {
    weatherdb.findOne({ _id: req.params.id }, function (err, docs) {
        if (err)
            res.render("index", { data: null });
        else
            res.render("details", { data: docs });
    });
});
var nodemodulesdir = path_1.join(__dirname, "node_modules");
var jquerydir = path_1.join(nodemodulesdir, "jquery", "dist");
var popperdir = path_1.join(nodemodulesdir, "popper.js", "dist", "umd");
var bootstrapdir = path_1.join(nodemodulesdir, "bootstrap", "dist");
var apikey = process.env.WEATHER_API;
var weatherURI = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=" + apikey;
app.post("/getweather", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lon, uri, response, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, lat = _a.lat, lon = _a.lon;
                uri = weatherURI.replace(/{lat}/, lat).replace(/{lon}/, lon);
                return [4 /*yield*/, node_fetch_1.default(uri)];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _b.sent();
                weatherdb.insert(data, function (err, doc) {
                    if (err)
                        res.render("error");
                    res.send(doc._id);
                });
                return [2 /*return*/];
        }
    });
}); });
app.get("/jquery", function (req, res) { return res.sendFile("jquery.js", { root: jquerydir }); });
app.get("/popper", function (req, res) { return res.sendFile("popper.js", { root: popperdir }); });
app.get("/bootstrap/:ext", function (req, res) { return res.sendFile("bootstrap." + req.params.ext, { root: path_1.join(bootstrapdir, req.params.ext) }); });
app.use(function (req, res, next) { return next(http_errors_1.default(404)); });
app.use(function (err, req, res, next) { return res.render("error"); });
app.listen(port, function () { return console.log("Server is listening on port ", port); });
