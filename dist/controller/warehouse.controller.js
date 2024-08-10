"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Warehouse = require('../model/warehouse.model');
var Register = require('../model/register.model');
var mongoose = require('mongoose');
var ApiErrors = require('../utils/ApiResponse/ApiErrors');
var ApiResponses = require('../utils/ApiResponse/ApiResponse');
var _require = require('../middleware/ImageUpload/cloudinaryConfig'),
  uploadOnCloudinary = _require.uploadOnCloudinary;
var AddWareHouse = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
    var _req$body, basicInfo, layout, floorRent, checkUser, imageURL, link, uploadResult, warehouse, data, errorMessages;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, basicInfo = _req$body.basicInfo, layout = _req$body.layout, floorRent = _req$body.floorRent; // const {warehouseID}=req.params;
          _context2.next = 3;
          return Register.findOne({
            _id: req.user.id
          });
        case 3:
          checkUser = _context2.sent;
          if (checkUser) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(401, "Unauthenticaed User. Your Data do not exist in the database")));
        case 6:
          if (!(req.user.id != checkUser._id)) {
            _context2.next = 8;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(401, "Unauthenticaed User. You are not allowed to add products")));
        case 8:
          if (!(req.user.role !== req.role)) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(403, "Unauthorized User. Only user assign with Warehouse role can access this")));
        case 10:
          if (!(!basicInfo || !layout || !floorRent)) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(400, "All Feilds are required")));
        case 12:
          _context2.prev = 12;
          imageURL = [];
          if (!(req.files && req.files.wareHouseImage && req.files.wareHouseImage.length > 0)) {
            _context2.next = 19;
            break;
          }
          _context2.next = 17;
          return Promise.all(req.files.wareHouseImage.map( /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(file) {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return uploadOnCloudinary(file.path);
                  case 2:
                    uploadResult = _context.sent;
                    link = uploadResult.url;
                    imageURL.push(link);
                  case 5:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x4) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 17:
          _context2.next = 20;
          break;
        case 19:
          return _context2.abrupt("return", next(ApiErrors(400, "No file uploaded. Please upload some pictures")));
        case 20:
          warehouse = new Warehouse({
            wareHouseLister: req.user.id,
            basicInfo: basicInfo,
            layout: layout,
            floorRent: floorRent,
            wareHouseImage: imageURL
          });
          _context2.next = 23;
          return warehouse.save();
        case 23:
          data = _context2.sent;
          return _context2.abrupt("return", next(ApiResponses(201, data, 'WareHouse Added Successfully')));
        case 27:
          _context2.prev = 27;
          _context2.t0 = _context2["catch"](12);
          if (!(_context2.t0.name === 'ValidationError')) {
            _context2.next = 34;
            break;
          }
          errorMessages = Object.values(_context2.t0.errors).map(function (error) {
            return error.message;
          });
          return _context2.abrupt("return", next(ApiErrors(500, errorMessages[0])));
        case 34:
          if (!(_context2.t0.code === 11000)) {
            _context2.next = 43;
            break;
          }
          if (!_context2.t0.errorResponse.errmsg.includes('contactNo')) {
            _context2.next = 39;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(500, "This Contact no is already taken")));
        case 39:
          if (!_context2.t0.errorResponse.errmsg.includes('email')) {
            _context2.next = 41;
            break;
          }
          return _context2.abrupt("return", next(ApiErrors(500, "This Email is already taken")));
        case 41:
          _context2.next = 44;
          break;
        case 43:
          return _context2.abrupt("return", next(ApiErrors(500, "Internal Serve Error, Error -: ".concat(_context2.t0, " "))));
        case 44:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[12, 27]]);
  }));
  return function AddWareHouse(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var allWareHouse = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res, next) {
    var warehouses;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return Warehouse.find();
        case 3:
          warehouses = _context3.sent;
          if (warehouses) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", next(ApiErrors(400, "No Warehouse found")));
        case 6:
          return _context3.abrupt("return", next(ApiResponses(200, warehouses, 'List of All Warehouse')));
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", next(ApiErrors(500, "Internal Serve Error, Error -: ".concat(_context3.t0, " "))));
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function allWareHouse(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
var getWarehouse = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res, next) {
    var id;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          id = req.user.id; // try {
          Warehouse.find({
            wareHouseLister: new mongoose.Types.ObjectId(id)
          }).populate('wareHouseLister') // Optional: populate the referenced Register data
          .then(function (warehouse) {
            if (!warehouse) {
              return next(ApiErrors(400, "No warehouse found with this wareHouseLister ID."));
            }
            return next(ApiResponses(200, warehouse, 'WareHouse List'));
          })["catch"](function (err) {
            return next(ApiErrors(500, "Error finding warehouse: ".concat(err)));
          });
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getWarehouse(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var singleWareHouse = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next) {
    var id, SingleWarehouse;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          id = req.query.id;
          _context5.prev = 1;
          _context5.next = 4;
          return Warehouse.findOne({
            _id: id
          });
        case 4:
          SingleWarehouse = _context5.sent;
          if (SingleWarehouse) {
            _context5.next = 7;
            break;
          }
          return _context5.abrupt("return", next(ApiErrors(404, "Warehouse with this id not found")));
        case 7:
          return _context5.abrupt("return", next(ApiResponses(200, SingleWarehouse, 'WareHouse Detail')));
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          return _context5.abrupt("return", next(ApiErrors(500, "Error retrieving warehouse: ".concat(_context5.t0))));
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 10]]);
  }));
  return function singleWareHouse(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
module.exports = {
  AddWareHouse: AddWareHouse,
  allWareHouse: allWareHouse,
  getWarehouse: getWarehouse,
  singleWareHouse: singleWareHouse
};

// {
//     "basicInfo": {
//         "name": "ABCD",
//         "contactNo": "2234567892",
//         "email": "abcdefh@gmail.com",
//         "ownerShipType": "Owner",
//         "locality": "Industrial Area",
//         "city": "CityName",
//         "state": "StateName",
//         "address": "123 Lane",
//         "pincode": 1234567
//     },
//     "layout": {
//         "warehouseType": "RCC",
//         "buildUpArea": 5000,
//         "totalPlotArea": 10000,
//         "totalParkingArea": 2000,
//         "plotStatus": "Industrial",
//         "listingFor": "Selling",
//         "plinthHeight": 5,
//         "door": 10,
//         "electricity": 400,
//         "additionalDetails": [
//             "Toilet",
//             "Close to highway",
//             "24/7 security"
//         ]
//     },
//     "floorRent": {
//         "floors": [
//             {
//                 "floor": "Ground",
//                 "area": 2500,
//                 "height": 29,
//                 "length": 50,
//                 "breadth": 50,
//                 "_id": "66b338cb3b673a52ad57946b"
//             },
//             {
//                 "floor": "First",
//                 "area": 2500,
//                 "height": 20,
//                 "length": 50,
//                 "breadth": 50,
//                 "_id": "66b338cb3b673a52ad57946c"
//             }
//         ],
//         "warehouseDirection": "NorthEast",
//         "roadAccess": "Main Road Access",
//         "expectedRent": 10000,
//         "expectedDeposit": 10000,
//         "warehouseDescription": "Spacious warehouse with ample parking"
//     },
//     "_id": "66b338cb3b673a52ad57946a",
//     "wareHouseLister": {
//         "_id": "66b33763cea6a137d4d3ffff",
//         "firstname": "Nitin",
//         "lastname": "Singh",
//         "username": "Nitin",
//         "contactNo": "2234567890",
//         "email": "Nitinn3@gmail.com",
//         "password": "$2a$10$jZyLQHY9gPm3GZ.dd06VPu0gzjKpiQaspn/diER9h0uQZH.PMNwY2",
//         "role": "WAREHOUSE",
//         "__v": 0,
//         "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjMzNzYzY2VhNmExMzdkNGQzZmZmZiIsInJvbGUiOiJXQVJFSE9VU0UiLCJpYXQiOjE3MjMwMjEyMTcsImV4cCI6MTcyMzg4NTIxN30.mf7w8BlmjgFUf8Cj4FPMJKHMl12xlohUyEcxNiEZpAI"
//     },
//     "wareHouseImage": [
//         "http://res.cloudinary.com/dm6yqgvm4/image/upload/v1723021514/mf7aogwlnnpdekxkxybl.jpg",
//         "http://res.cloudinary.com/dm6yqgvm4/image/upload/v1723021515/aph03pd6bntsbobcgrai.jpg"
//     ],
//     "__v": 0
// }