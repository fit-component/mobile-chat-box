"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var module = require('./module');
var ReactList = require('react-list');
var Tappable = require('react-tappable');
require('./index.scss');
var ChatBox = (function (_super) {
    __extends(ChatBox, _super);
    function ChatBox(props) {
        var _this = this;
        _super.call(this, props);
        this.state = new module.State();
        this._isMounted = false;
        this._hitTop = false;
        this._hasMovedAboveFirst = false;
        this.$scrollParent = null;
        this.handleScroll = function (event) {
            if (!_this._isMounted)
                return;
            var visibleRange = _this.refs.reactList.getVisibleRange();
            _this.props.onScroll(_this.$scrollParent.scrollTop(), visibleRange);
            if (!_this._hasMovedAboveFirst && visibleRange[0] > 0) {
                _this._hasMovedAboveFirst = true;
            }
            if (visibleRange[0] === 0) {
                if (!_this._hitTop && _this._hasMovedAboveFirst) {
                    _this.props.onHitTop();
                    _this._hitTop = true;
                }
            }
            else if (visibleRange[1] === _this.state.datas.length - 1) {
                _this.setState({
                    message: 0
                });
            }
            if (visibleRange[0] > 0) {
                _this._hitTop = false;
            }
        };
    }
    ChatBox.prototype.componentDidMount = function () {
        this.$scrollParent = $(ReactDOM.findDOMNode(this)).find('#j-scroll-parent');
        $(this.$scrollParent).on('scroll', this.handleScroll);
    };
    ChatBox.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        $(this.$scrollParent).off('scroll', this.handleScroll);
    };
    ChatBox.prototype.alertBackBottom = function (number) {
        if (!this.props.backBottom)
            return;
        this.setState({
            message: this.state.message + number
        });
    };
    ChatBox.prototype.appendAfter = function (toBottom, newDatasCount, oldCount) {
        if (this.refs.reactList.getVisibleRange()[1] === oldCount - 1 || toBottom) {
            this.backBottom();
        }
        else {
            if (this.refs.reactList.getVisibleRange()[1] < this.state.datas.length - 1) {
                this.alertBackBottom(newDatasCount);
            }
        }
    };
    ChatBox.prototype.append = function (datas, toBottom) {
        var _this = this;
        if (toBottom === void 0) { toBottom = false; }
        var count = datas.length;
        var oldCount = this.state.datas.length;
        var newDatas = this.state.datas;
        newDatas = newDatas.concat(datas);
        this.setState({
            datas: newDatas
        }, function () {
            _this.appendAfter(toBottom, count, oldCount);
        });
    };
    ChatBox.prototype.prepend = function (datas, toBottom) {
        var _this = this;
        if (toBottom === void 0) { toBottom = false; }
        var count = datas.length;
        var oldCount = this.state.datas.length;
        var newDatas = this.state.datas;
        newDatas = datas.concat(newDatas);
        this.setState({
            datas: newDatas
        }, function () {
            _this.refs.reactList.scrollTo(datas.length);
            _this._hitTop = false;
        });
    };
    ChatBox.prototype.backBottom = function () {
        this.refs.reactList.scrollTo(this.state.datas.length);
        this.setState({
            message: 0
        });
    };
    ChatBox.prototype.renderItem = function (index, key) {
        return this.props.renderItem(this.state.datas[index], index);
    };
    ChatBox.prototype.render = function () {
        var containerStyle = {
            height: this.props.height
        };
        return (React.createElement("div", {className: "_namespace", style: containerStyle}, React.createElement("div", {className: "child-container", id: "j-scroll-parent", style: containerStyle}, React.createElement(ReactList, {id: "j-scroll-content", itemRenderer: this.renderItem.bind(this), length: this.state.datas.length, useTranslate3d: true, pageSize: this.props.fullScreen ? this.state.datas.length : 10, initialIndex: this.props.fullScreen ? -1 : null, threshold: 300, type: "variable", ref: "reactList"})), this.state.message === 0 ? null :
            React.createElement(Tappable, {onTap: this.backBottom.bind(this), className: "fixed-number"}, this.state.message > 99 ? '99+' : this.state.message)));
    };
    ChatBox.defaultProps = new module.Props();
    return ChatBox;
}(React.Component));
exports.__esModule = true;
exports["default"] = ChatBox;
