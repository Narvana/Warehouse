"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
require('dotenv').config();
var Register = require('../model/register.model');
var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');
var validatePassword = require('../middleware/passwordValidation');
var generateAccessToken = require('../middleware/token/generateAccessToken');
var generateRefreshToken = require('../middleware/token/generateRefreshToken');
var ApiErrors = require('../utils/ApiResponse/ApiErrors');
var ApiResponse = require('../utils/ApiResponse/ApiResponse');
var SignUp = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
    var _req$body, firstname, lastname, username, contactNo, email, password, existingUsername, existingEmail, existingContact, isValidPassword, hashedPassword, register, data, errorMessages;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, username = _req$body.username, contactNo = _req$body.contactNo, email = _req$body.email, password = _req$body.password;
          if (!(!firstname || !lastname || !username || !email || !contactNo || !password || firstname.trim() === '' || lastname.trim() === '' || username.trim() === '' || contactNo.trim() === '' || email.trim() === '' || password.trim() === '')) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", next(ApiErrors(400, "All Fields are required")));
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return Register.findOne({
            username: username
          });
        case 6:
          existingUsername = _context.sent;
          _context.next = 9;
          return Register.findOne({
            email: email
          });
        case 9:
          existingEmail = _context.sent;
          _context.next = 12;
          return Register.findOne({
            contactNo: contactNo
          });
        case 12:
          existingContact = _context.sent;
          if (!existingEmail) {
            _context.next = 17;
            break;
          }
          return _context.abrupt("return", next(ApiErrors(400, "".concat(email, " email already exist. Enter a new one."))));
        case 17:
          if (!existingUsername) {
            _context.next = 21;
            break;
          }
          return _context.abrupt("return", next(ApiErrors(400, "".concat(username, " username already exist. Enter a new one."))));
        case 21:
          if (!existingContact) {
            _context.next = 25;
            break;
          }
          return _context.abrupt("return", next(ApiErrors(400, "".concat(contactNo, " Contact Number already exist. Enter a new one."))));
        case 25:
          isValidPassword = validatePassword(password);
          if (!isValidPassword) {
            _context.next = 35;
            break;
          }
          hashedPassword = bcryptjs.hashSync(password, 10);
          register = new Register({
            firstname: firstname,
            lastname: lastname,
            username: username,
            contactNo: contactNo,
            email: email,
            password: hashedPassword,
            role: req.role
          });
          _context.next = 31;
          return register.save();
        case 31:
          data = _context.sent;
          return _context.abrupt("return", next(ApiResponse(201, data, "".concat(username, " Registered Successfully"))));
        case 35:
          return _context.abrupt("return", next(ApiErrors(400, "Enter a valid password. Atleast Min 8 Character, 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number ")));
        case 36:
          _context.next = 44;
          break;
        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](3);
          if (!(_context.t0.name === 'ValidationError')) {
            _context.next = 43;
            break;
          }
          errorMessages = Object.values(_context.t0.errors).map(function (error) {
            return error.message;
          });
          return _context.abrupt("return", next(ApiErrors(500, errorMessages[0])));
        case 43:
          return _context.abrupt("return", next(ApiErrors(500, _context.t0)));
        case 44:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 38]]);
  }));
  return function SignUp(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
    var _req$body2, email, password, existingEmail, checkPassword, accessToken, refreshToken, loggedIn, options;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password || email.trim() === "" || password.trim() === "")) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(400, "All Fields are required")));
        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return Register.findOne({
            email: email
          });
        case 6:
          existingEmail = _context2.sent;
          if (existingEmail) {
            _context2.next = 11;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(400, "".concat(email, " email don't Exist. Either Enter a correct one or Register Yourself with this email."))));
        case 11:
          if (!(existingEmail.role !== req.role)) {
            _context2.next = 15;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(400, "email ".concat(email, " is not assigned with ").concat(req.role, " role"))));
        case 15:
          checkPassword = bcryptjs.compareSync(password, existingEmail.password);
          if (checkPassword) {
            _context2.next = 20;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(400, "Wrong Password, Try Again")));
        case 20:
          _context2.next = 22;
          return generateAccessToken(existingEmail._id);
        case 22:
          accessToken = _context2.sent;
          _context2.next = 25;
          return generateRefreshToken(existingEmail._id);
        case 25:
          refreshToken = _context2.sent;
          _context2.next = 28;
          return Register.findById(existingEmail._id).select("-password -refreshToken");
        case 28:
          loggedIn = _context2.sent;
          options = {
            httpOnly: true,
            secure: true
          };
          return _context2.abrupt("return", res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
            user: loggedIn,
            accessToken: accessToken,
            refreshToken: refreshToken
          }));
        case 31:
          _context2.next = 36;
          break;
        case 33:
          _context2.prev = 33;
          _context2.t0 = _context2["catch"](3);
          return _context2.abrupt("return", next(ApiErrors(500, _context2.t0)));
        case 36:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 33]]);
  }));
  return function login(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
module.exports = {
  SignUp: SignUp,
  login: login
};