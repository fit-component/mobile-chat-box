"use strict";
var Props = (function () {
    function Props() {
        this.height = 200;
        this.renderItem = function (item, index) {
        };
        this.fullScreen = false;
        this.backBottom = false;
        this.onHitTop = function () {
        };
        this.onScroll = function (offsetTop, range) {
        };
    }
    return Props;
}());
exports.Props = Props;
var State = (function () {
    function State() {
        this.newMessage = 0;
        this.datas = new Array();
        this.message = 0;
    }
    return State;
}());
exports.State = State;
