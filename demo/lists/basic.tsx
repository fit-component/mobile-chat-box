import * as React from 'react'
import Chat from '../../../chat/src'
import ChatBox from '../../src'

export default class Demo extends React.Component<any,any> {
    private index:number
    public refs:any

    componentWillMount() {
        this.index = 0
    }

    handleAdd(toBottom:any) {
        let datas:any = []
        let count = Math.round(Math.random() * 500) + 500
        while (count > 0) {
            let random = Math.round(Math.random() * 50) + 1
            let str = 'asd'
            for (let i = 0; i < random; i++) {
                str += 'asd'
            }
            datas.push({
                name: 'test',
                content: this.index++ + ',' + str
            })
            count--
        }

        this.refs['chatBox'].append(datas, toBottom)
    }

    renderItem(item:any, index:any) {
        return (
            <Chat key={index}
                  name={item.name}
                  content={item.content}
                  portrait="http://himg.bdimg.com/sys/portrait/item/052ee28496e7bfb1e7be8ae7bebde5a4a7e7a9ba4620.jpg"/>
        )
    }

    render() {
        return (
            <div>
                <ChatBox
                    height={300}
                    renderItem={this.renderItem.bind(this)}
                    ref="chatBox"/>

                <button onClick={this.handleAdd.bind(this,false)}
                        style={{marginTop:10}}>新增500~1000个
                </button>
            </div>
        )
    }
}