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
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = require("aws-sdk");
//import { APIGatewayProxyEvent, DynamoDBRecord } from 'aws-lambda';
var dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
});
var millisecperday = 24 * 3600 * 1000;
//
//
// async functions for dynamo operations
var batchWrite = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                dynamoDb.batchWrite(params, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            })];
    });
}); };
var put = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                dynamoDb.put(params, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            })];
    });
}); };
var query = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                dynamoDb.query(params, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            })];
    });
}); };
//
// endpoints
//
exports.add = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, _a, id, seen, timestamp, params, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = event.body || '';
                _a = JSON.parse(body), id = _a.id, seen = _a.seen;
                timestamp = new Date().getTime();
                params = {
                    RequestItems: {
                        Entry: [
                            {
                                PutRequest: {
                                    Item: {
                                        Id: id + ":REL",
                                        Seen: seen,
                                        T: timestamp
                                    }
                                }
                            },
                            {
                                PutRequest: {
                                    Item: {
                                        Id: seen + ":REL",
                                        Seen: id,
                                        T: timestamp
                                    }
                                }
                            }
                        ]
                    }
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, batchWrite(params)];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: 
            // todo: respond with OK and dispatch next as job (sns/sqs)
            // classify what's been seen (reverse)
            return [4 /*yield*/, classifySeen(id, seen, timestamp)];
            case 5:
                // todo: respond with OK and dispatch next as job (sns/sqs)
                // classify what's been seen (reverse)
                _b.sent();
                return [4 /*yield*/, classifySeen(seen, id, timestamp)];
            case 6:
                _b.sent();
                return [2 /*return*/, 'done!'];
        }
    });
}); };
var classifySeen = function (id, seen, timestamp) { return __awaiter(void 0, void 0, void 0, function () {
    var params, data, level;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    TableName: 'Entry',
                    KeyConditionExpression: 'Id=:seen AND Timestamp>:num',
                    ExpressionAttributeValues: {
                        ':seen': seen,
                        ':num': timestamp - 20 * millisecperday
                    },
                    AttributesToGet: ['Level', 'Id'],
                    ScanIndexForward: true,
                    Limit: 1,
                    Select: 'SPECIFIC_ATTRIBUTES'
                };
                return [4 /*yield*/, query(params)];
            case 1:
                data = _a.sent();
                if (!data.Items) return [3 /*break*/, 3];
                level = data.Items[0].Level;
                return [4 /*yield*/, exports.classify(id, level + 1, timestamp)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var listRelationship = function (id, timestamp) { return __awaiter(void 0, void 0, void 0, function () {
    var params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    TableName: 'Entry',
                    KeyConditionExpression: 'Id=:seen AND Timestamp>:num',
                    ExpressionAttributeValues: {
                        ':seen': id + ":REL",
                        ':num': timestamp - 20 * millisecperday
                    },
                    AttributesToGet: ['Id', 'timestamp'],
                    ScanIndexForward: true,
                    Select: 'SPECIFIC_ATTRIBUTES'
                };
                return [4 /*yield*/, query(params)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.report = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, timestamp, data, _a, _b, _i, idSeen, body;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = event.queryStringParameters.id;
                timestamp = new Date().getTime();
                return [4 /*yield*/, listRelationship(id, timestamp)];
            case 1:
                data = _c.sent();
                if (!data.Items) return [3 /*break*/, 5];
                _a = [];
                for (_b in data.Items)
                    _a.push(_b);
                _i = 0;
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                idSeen = _a[_i];
                return [4 /*yield*/, exports.classify(idSeen, 1, timestamp)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                body = { result: 'OK' };
                return [2 /*return*/, {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                            'Content-Type': 'application/json'
                        },
                        body: body
                    }];
        }
    });
}); };
exports.check = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body;
    return __generator(this, function (_a) {
        id = event.queryStringParameters.id;
        body = '';
        return [2 /*return*/, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: body
            }];
    });
}); };
exports.classify = function (id, level, timestamp) { return __awaiter(void 0, void 0, void 0, function () {
    var params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    TableName: 'Table',
                    Item: {
                        Id: id,
                        Level: level,
                        T: timestamp
                    }
                };
                return [4 /*yield*/, put(params)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
//# sourceMappingURL=index.js.map