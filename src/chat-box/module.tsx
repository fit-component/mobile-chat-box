export interface PropsInterface {
    /**
     * 高度
     */
    height?:number

    /**
     * 渲染每个元素的方法
     */
    renderItem:(item:any, index:number)=> any

    /**
     * 是否显示完全（不完全的地方会随着滚动渐渐补全）
     */
    fullScreen?:boolean

    /**
     * 开启后可以提示回到底部,当最后一个元素可见时,末尾追加内容会强制回到底部
     */
    backBottom?:boolean

    /**
     * 触碰到顶部的回调函数,只有调用了prepend方法后才会继续触发
     */
    onHitTop?:()=> void

    /**
     * 滚动时回调函数
     */
    onScroll?:(offsetTop:number, range:any)=>void

    [x:string]:any
}

export class Props implements PropsInterface {
    height = 200
    renderItem = (item:any, index:number)=> {
    }
    fullScreen = false
    backBottom = false
    onHitTop = ()=> {
    }
    onScroll = (offsetTop:number, range:any)=> {
    }
}

export interface StateInterface {
    /**
     * 新消息数量
     */
    newMessage?:number

    /**
     * 消息数组
     */
    datas?:any[]

    /**
     * 未读消息数
     */
    message?:number
}

export class State implements StateInterface {
    newMessage = 0
    datas = new Array()
    message = 0
}