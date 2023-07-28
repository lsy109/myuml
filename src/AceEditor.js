
import AceEditor from 'react-ace';
import React from "react";
//hello bitch git test
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "startUml",
            canvasItem: null,
        }

    }
    // componentDidUpdate(prevProps, prevState) {
    //     // 比较前一个 canvasItem 的值与当前的 canvasItem 的值
    //     if (prevState.canvasItem !== this.state.canvasItem) {
    //         console.log("ff")
    //         // canvasItem 发生了变化
    //         // 可以在这里执行您想要的操作
    //     }
    // }

    componentDidMount() {

        this.state.canvasItem = this.props.value;
        console.log(this.state.canvasItem);
    }


    render() {

        return (

            <AceEditor
                mode="javascript" // 设置编辑器的模式
                theme="monokai" // 设置编辑器的主题
                onChange={this.handleEditorChange} // 处理编辑器内容变化的回调函数
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }} // 配置选项（根据您的需求）
                width='initial'
                height='calc(100% - 45px)'
                value={this.state.value}


            />
        );
    }
}

export default Editor;