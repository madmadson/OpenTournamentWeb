"use strict";
exports.LOGIN_ACTION = 'LOGIN_ACTION';
var LoginAction = (function () {
    function LoginAction(payload) {
        this.payload = payload;
        this.type = 'LOGIN_ACTION';
    }
    return LoginAction;
}());
exports.LoginAction = LoginAction;
