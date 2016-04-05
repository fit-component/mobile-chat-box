/// <reference path="../../../../../typings-module/react-list.d.ts" />
/// <reference path="../../../../../typings-module/react-tappable.d.ts" />
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
        /**
         * 处理窗口滚动
         */
        this.handleScroll = function (event) {
            if (!_this._isMounted)
                return;
            var visibleRange = _this.refs.reactList.getVisibleRange();
            _this.props.onScroll(_this.$scrollParent.scrollTop(), visibleRange);
            if (!_this._hasMovedAboveFirst && visibleRange[0] > 0) {
                _this._hasMovedAboveFirst = true;
            }
            if (visibleRange[0] === 0) {
                // 到顶部了且曾经有移动到第一个下面
                if (!_this._hitTop && _this._hasMovedAboveFirst) {
                    _this.props.onHitTop();
                    _this._hitTop = true;
                }
            }
            else if (visibleRange[1] === _this.state.datas.length - 1) {
                // 到底部了
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
            // 到达了底部或强制回到底部
            this.backBottom();
        }
        else {
            // 总数量超过可视区,显示数量
            if (this.refs.reactList.getVisibleRange()[1] < this.state.datas.length - 1) {
                this.alertBackBottom(newDatasCount);
            }
        }
    };
    // @external
    // @desc 在底部添加 datas:添加的数据,object/array toBottom:是否滚动到底部 (滚动到底部只有fullScreen时有效)
    // @type function
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
    // @external
    // @desc 在顶部添加 datas:添加的数据,object/array toBottom:是否滚动到底部
    // @type function
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
            // 移动到上次位置
            _this.refs.reactList.scrollTo(datas.length);
            _this._hitTop = false;
        });
    };
    // 滚动到底部
    ChatBox.prototype.backBottom = function () {
        this.refs.reactList.scrollTo(this.state.datas.length);
        this.setState({
            message: 0
        });
    };
    // 封装 renderItem
    ChatBox.prototype.renderItem = function (index, key) {
        return this.props.renderItem(this.state.datas[index], index);
    };
    ChatBox.prototype.render = function () {
        var containerStyle = {
            height: this.props.height
        };
        return (<div className="_namespace" style={containerStyle}>
                <div className="child-container" id="j-scroll-parent" style={containerStyle}>
                    <ReactList id="j-scroll-content" itemRenderer={this.renderItem.bind(this)} length={this.state.datas.length} useTranslate3d={true} pageSize={this.props.fullScreen ? this.state.datas.length : 10} initialIndex={this.props.fullScreen ? -1 : null} threshold={300} type="variable" ref="reactList"/>
                </div>
                {this.state.message === 0 ? null :
            <Tappable onTap={this.backBottom.bind(this)} className="fixed-number">{this.state.message > 99 ? '99+' : this.state.message}</Tappable>}
            </div>);
    };
    ChatBox.defaultProps = new module.Props();
    return ChatBox;
}(React.Component));
exports.__esModule = true;
exports["default"] = ChatBox;
