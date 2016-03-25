import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import $ from 'jquery'
import ReactList from 'react-list'
import Tappable from 'react-tappable'
import _ from 'lodash'
import './index.scss'

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newMessage: 0,
            datas: [],
            // 未读消息数量
            message: 0
        }

        this.handleScroll = (event)=> {
            if (!this._isMounted)return

            const visibleRange = this.refs['reactList'].getVisibleRange()

            this.props.onScroll(this.$scrollParent.scrollTop(), visibleRange)

            if (!this._hasMovedAboveFirst && visibleRange[0] > 0) {
                this._hasMovedAboveFirst = true
            }

            if (visibleRange[0] === 0) {
                // 到顶部了且曾经有移动到第一个下面
                if (!this._hitTop && this._hasMovedAboveFirst) {
                    this.props.onHitTop()
                    this._hitTop = true
                }
            } else if (visibleRange[1] === this.state.datas.length - 1) {
                // 到底部了
                this.setState({
                    message: 0
                })
            }

            if (visibleRange[0] > 0) {
                this._hitTop = false
            }
        }
    }

    componentWillMount() {
        this._isMounted = true
        this._hitTop = false
        this._hasMovedAboveFirst = false
    }

    componentDidMount() {
        this.$scrollParent = $(ReactDOM.findDOMNode(this)).find('#j-scroll-parent')
        $(this.$scrollParent).on('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        this._isMounted = false
        $(this.$scrollParent).off('scroll', this.handleScroll)
    }

    alertBackBottom(number) {
        if (!this.props.backBottom)return
        let allNumber = parseInt(this.state.message) + number
        if (allNumber > 99) {
            allNumber = '99+'
        }
        this.setState({
            message: allNumber
        })
    }

    appendAfter(toBottom, newDatasCount, oldCount) {
        if (this.refs['reactList'].getVisibleRange()[1] === oldCount - 1 || toBottom) {
            // 到达了底部或强制回到底部
            this.backBottom()
        } else {
            // 总数量超过可视区,显示数量
            if (this.refs['reactList'].getVisibleRange()[1] < this.state.datas.length - 1) {
                this.alertBackBottom(newDatasCount)
            }
        }
    }

    // @external
    // @desc 在底部添加 datas:添加的数据,object/array toBottom:是否滚动到底部 (滚动到底部只有fullScreen时有效)
    // @type function
    append(datas, toBottom = false) {
        let count = datas.length
        let oldCount = this.state.datas.length
        let newDatas = this.state.datas
        newDatas = newDatas.concat(datas)
        this.setState({
            datas: newDatas
        }, ()=> {
            this.appendAfter(toBottom, count, oldCount)
        })
    }

    // @external
    // @desc 在顶部添加 datas:添加的数据,object/array toBottom:是否滚动到底部
    // @type function
    prepend(datas, toBottom = false) {
        let count = datas.length
        let oldCount = this.state.datas.length
        let newDatas = this.state.datas
        newDatas = datas.concat(newDatas)
        this.setState({
            datas: newDatas
        }, ()=> {
            // 移动到上次位置
            this.refs['reactList'].scrollTo(datas.length)
            this._hitTop = false
        })
    }

    // 滚动到底部
    backBottom() {
        this.refs['reactList'].scrollTo(this.state.datas.length)
        this.setState({
            message: 0
        })
    }

    // 封装 renderItem
    renderItem(index, key) {
        return this.props.renderItem(this.state.datas[index], index)
    }

    render() {
        let containerStyle = {
            height: this.props.height
        }

        return (
            <div className="_namespace"
                 style={containerStyle}>
                <div className="child-container"
                     id="j-scroll-parent"
                     style={containerStyle}>
                    <ReactList
                        id="j-scroll-content"
                        itemRenderer={this.renderItem.bind(this)}
                        length={this.state.datas.length}
                        useTranslate3d={true}
                        pageSize={this.props.fullScreen?this.state.datas.length:10}
                        initialIndex={this.props.fullScreen?-1:null}
                        threshold={300}
                        type="variable"
                        ref="reactList"/>
                </div>
                {this.state.message === 0 ? null :
                    <Tappable onTap={this.backBottom.bind(this)}
                              className="fixed-number">{this.state.message}</Tappable>
                }
            </div>
        )
    }
}

ChatBox.defaultProps = {
    // @desc 高度
    // @type int/string
    height: 200,

    // @desc 渲染每个元素的方法
    // @type function
    renderItem: (item, index)=> {

    },

    // @desc 是否显示完全（不完全的地方会随着滚动渐渐补全）
    // @type bool
    fullScreen: false,

    // @desc 开启后可以提示回到底部,当最后一个元素可见时,末尾追加内容会强制回到底部
    // @type bool
    backBottom: false,

    // @desc 触碰到顶部的回调函数,只有调用了prepend方法后才会继续触发
    // @type function
    onHitTop: ()=> {
    },

    // @desc 滚动时回调函数
    // @type function
    onScroll: (offsetTop, range)=> {
    }
}