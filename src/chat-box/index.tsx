/// <reference path="../../../../../typings-module/react-list.d.ts" />
/// <reference path="../../../../../typings-module/react-tappable.d.ts" />
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as $ from 'jquery'
import * as module from './module'
import * as ReactList from 'react-list'
import * as Tappable from 'react-tappable'
import {others} from '../../../../common/transmit-transparently/src'
import './index.scss'

export default class ChatBox extends React.Component<module.PropsInterface,module.StateInterface> {
    static defaultProps = new module.Props()
    public state = new module.State()
    private _isMounted:boolean = false
    private _hitTop:boolean = false
    private _hasMovedAboveFirst:boolean = false
    private $scrollParent:JQuery = null
    public refs:any

    constructor(props:any) {
        super(props)
    }

    componentDidMount() {
        this.$scrollParent = $(ReactDOM.findDOMNode(this)).find('#j-scroll-parent')
        $(this.$scrollParent).on('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        this._isMounted = false
        $(this.$scrollParent).off('scroll', this.handleScroll)
    }

    alertBackBottom(number:number) {
        if (!this.props.backBottom)return
        this.setState({
            message: this.state.message + number
        })
    }

    /**
     * 处理窗口滚动
     */
    handleScroll = (event:any)=> {
        if (!this._isMounted)return

        const visibleRange = this.refs.reactList.getVisibleRange()

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

    appendAfter(toBottom:boolean, newDatasCount:number, oldCount:number) {
        if (this.refs.reactList.getVisibleRange()[1] === oldCount - 1 || toBottom) {
            // 到达了底部或强制回到底部
            this.backBottom()
        } else {
            // 总数量超过可视区,显示数量
            if (this.refs.reactList.getVisibleRange()[1] < this.state.datas.length - 1) {
                this.alertBackBottom(newDatasCount)
            }
        }
    }

    // @external
    // @desc 在底部添加 datas:添加的数据,object/array toBottom:是否滚动到底部 (滚动到底部只有fullScreen时有效)
    // @type function
    append(datas:any, toBottom:boolean = false) {
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
    prepend(datas:any, toBottom:boolean = false) {
        let count = datas.length
        let oldCount = this.state.datas.length
        let newDatas = this.state.datas
        newDatas = datas.concat(newDatas)
        this.setState({
            datas: newDatas
        }, ()=> {
            // 移动到上次位置
            this.refs.reactList.scrollTo(datas.length)
            this._hitTop = false
        })
    }

    // 滚动到底部
    backBottom() {
        this.refs.reactList.scrollTo(this.state.datas.length)
        this.setState({
            message: 0
        })
    }

    // 封装 renderItem
    renderItem(index:number, key:number) {
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
                              className="fixed-number">{this.state.message > 99 ? '99+' : this.state.message}</Tappable>
                }
            </div>
        )
    }
}