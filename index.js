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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var readline = require("readline");
var PaymentAuthorizer = /** @class */ (function () {
    function PaymentAuthorizer() {
        this.paymentRules = { maxLimit: 0 };
        this.paymentSessions = [];
        this.paymentDates = [];
        this.duplicatedPayments = [];
    }
    PaymentAuthorizer.prototype.start = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var rl, _d, rl_1, rl_1_1, line, operation, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                            terminal: false
                        });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _d = true, rl_1 = __asyncValues(rl);
                        _e.label = 2;
                    case 2: return [4 /*yield*/, rl_1.next()];
                    case 3:
                        if (!(rl_1_1 = _e.sent(), _a = rl_1_1.done, !_a)) return [3 /*break*/, 5];
                        _c = rl_1_1.value;
                        _d = false;
                        try {
                            line = _c;
                            operation = JSON.parse(line);
                            if ('payment-rules' in operation) {
                                this.handlePaymentRules(operation['payment-rules']);
                            }
                            else if ('payment-rules-log' in operation) {
                                this.handlePaymentRulesLog(operation['payment-rules-log']);
                            }
                            else if ('payment-session' in operation) {
                                if (operation['payment-session'].hasOwnProperty('cc') == true && operation['payment-session'].hasOwnProperty('amount') == true && operation['payment-session'].hasOwnProperty('time') == true) {
                                    this.handlePaymentAuthorization(operation['payment-session']);
                                }
                                else {
                                    this.handlePaymentSession(operation['payment-session']);
                                }
                            }
                            else if ('payment-sessions-log' in operation) {
                                this.handlePaymentSessionsLog(operation['payment-sessions-log']);
                            }
                        }
                        finally {
                            _d = true;
                        }
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(!_d && !_a && (_b = rl_1["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(rl_1)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    PaymentAuthorizer.prototype.handlePaymentRules = function (paymentRules) {
        this.paymentRules = paymentRules;
        console.log(JSON.stringify({ paymentRules: paymentRules }));
    };
    PaymentAuthorizer.prototype.handlePaymentRulesLog = function (paymentRules) {
        console.log(JSON.stringify(paymentRules));
    };
    PaymentAuthorizer.prototype.handlePaymentSession = function (paymentSession) {
        var paymentId = paymentSession['payment-id'];
        // Check if session already exist: 'payment-session-already-initialized'
        var sessionIndex = this.paymentSessions.findIndex(function (session) { return session.paymentId === paymentId; });
        if (sessionIndex !== -1) {
            console.log(JSON.stringify({ paymentSession: { paymentId: paymentId }, violations: ['payment-session-already-initialized'] }));
            return;
        }
        this.paymentSessions.push({
            paymentId: paymentId,
            availableLimit: this.paymentRules['max-limit'],
            violations: [],
            time: '',
            cc: '',
            amount: 0
        });
        console.log(JSON.stringify({ paymentSession: { paymentId: paymentId, availableLimit: this.paymentRules.maxLimit }, violations: [] }));
    };
    PaymentAuthorizer.prototype.handlePaymentSessionsLog = function (paymentSession) {
        console.log(JSON.stringify(paymentSession));
    };
    PaymentAuthorizer.prototype.handlePaymentAuthorization = function (payment) {
        var paymentId = payment['payment-id'];
        var violations = [];
        // No payments should be accepted without a properly rules initialization: `paymentrules-not-initialized`
        if (this.paymentRules.maxLimit === 0) {
            violations.push('paymentrules-not-initialized');
        }
        var sessionIndex = this.paymentSessions.findIndex(function (session) { return session.paymentId === paymentId; });
        var foundPaymentObject = this.paymentSessions.find(function (session) { return session.paymentId === paymentId; });
        if (foundPaymentObject != undefined) {
            foundPaymentObject.time = payment['time'];
            foundPaymentObject.cc = payment['cc'];
            foundPaymentObject.amount = payment['amount'];
        }
        // No payments should be accepted without a properly initialized payment: `paymentsession-not-initialized`
        if (sessionIndex === -1) {
            violations.push('paymentsession-not-initialized');
        }
        if (violations.length > 0) {
            console.log(JSON.stringify({ payment: payment, violations: violations }));
            return;
        }
        var state = foundPaymentObject;
        if (state != undefined) {
            // The transaction amount should not exceed the global limit: `insufficient-limit`
            if (state.availableLimit < payment.amount) {
                console.log(JSON.stringify({ payment: payment, violations: ['insufficient-limit'] }));
                return;
            }
            this.paymentDates.push(new Date(state.time));
            this.duplicatedPayments.push({
                time: state.time,
                cc: '',
                amount: state.amount,
                paymentId: '',
                availableLimit: 0,
                violations: []
            });
            var twoMinutes = 2 * 60 * 1000;
            // The should not have been 3 transactions in a two minutes interval: `high-frequency-small-interval`
            this.paymentDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
            for (var i = 0; i < this.paymentDates.length - 2; i++) {
                var diff1 = this.paymentDates[i + 1].getTime() - this.paymentDates[i].getTime();
                var diff2 = this.paymentDates[i + 2].getTime() - this.paymentDates[i + 1].getTime();
                if (diff1 <= twoMinutes && diff2 <= twoMinutes) {
                    this.paymentDates.pop();
                    console.log(JSON.stringify({ payment: payment, violations: ['high-frequency-small-interval'] }));
                    return;
                }
            }
            // Same session id should not have 2 transactions with the same amount in a two minutes interval: `doubled-transaction`
            for (var i = 0; i < this.duplicatedPayments.length; i++) {
                for (var j = i + 1; j < this.duplicatedPayments.length; j++) {
                    if (this.duplicatedPayments[i].paymentId === this.duplicatedPayments[j].paymentId && this.duplicatedPayments[i].amount === this.duplicatedPayments[j].amount) {
                        var diff = new Date(this.duplicatedPayments[j].time).getTime() - new Date(this.duplicatedPayments[i].time).getTime();
                        if (diff <= twoMinutes) {
                            this.duplicatedPayments.pop();
                            console.log(JSON.stringify({ payment: payment, violations: ['doubled-transaction'] }));
                            return;
                        }
                    }
                }
            }
            // update the state of payment session 
            state.cc = payment.cc;
            state.amount = payment.amount;
            state.time = payment.time;
            state.availableLimit -= payment.amount;
        }
        console.log(JSON.stringify({ state: state, violations: [] }));
    };
    return PaymentAuthorizer;
}());
var authorizer = new PaymentAuthorizer();
authorizer.start();
