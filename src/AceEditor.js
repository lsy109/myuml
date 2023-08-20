
import AceEditor from 'react-ace';
import React from "react";
//hello bitch git test
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import { plantuml } from './plantuml';
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: `@startuml
            
@enduml`,
            canvasItem: null,
            enduml: null,
        }
        this.timer = null;
        this.editorRef = React.createRef();

    }
    componentDidUpdate(prevProps, prevState) {
        // 比较前一个值与当前值
        if (prevProps.item !== this.props.item) {

            // 值发生了变化
            // 可以在这里执行您想要的操作
        }
    }

    componentDidMount() {
        // this.startText();

        // this.getDomText(this.props.startValue);
        // this.EditorTextChange(this.state.editorContent)
        // const num = this.getLineNumber('@enduml');
        // this.setState({ enduml: num })
        // this.insertStringAtLine("Hello, world!", 1);
    }

    // startText = () => {
    //     const Dom = this.props.startValue;
    //     this.getDomText(Dom)


    // }

    //從節點中取得text和line
    getDomText = (dom) => {
        let DomText = [];
        for (var i = 0; i < dom.length; i++) {
            let Dom = dom[i];
            let domtext1 = Dom.text1;
            let domtext2 = Dom.text2;
            let line = Dom.lineTo;
            DomText.push({ domtext1, domtext2, line });
        }
        this.trunToText(DomText);

    }
    //將取得的text和line打印在editor畫面上
    trunToText = (dom) => {
        // let item = dom;
        // let linenum = this.getLineNumber("@enduml");

        // this.deleteContentAtLine(linenum - 1);
        // for (var i = 0; i < item.length; i++) {
        //     linenum += 1;
        //     this.insertStringAtLine(`${item[i].domtext1} ${item[i].line} ${item[i].domtext2}\n`, linenum)

        // }
        // this.insertStringAtLine("@enduml", linenum + 2)
        // const canvasitem = item;
        // const { editorContent } = this.state;
        // const lines = editorContent.split('\n');
        // console.log(lines)
        // let dom = [];
        // for (var i = 0; i < canvasitem.length; i++) {
        //     for (var j = 0; j < canvasitem[i].length; j++) {
        //         console.log(canvasitem[i][j])
        //         if (canvasitem[i][j].type == "shape") {
        //             console.log(canvasitem)
        //             dom.push(canvasitem[i])
        //         }
        //     }

        // }

    }
    //取得指定字串的行數
    getLineNumber = (searchString) => {
        const editorInstance = this.editorRef.current.editor;
        const session = editorInstance.getSession();
        const document = session.getDocument();
        const index = this.state.editorContent.indexOf(searchString);
        const position = document.indexToPosition(index);
        return position.row + 1
    };
    //插入字串到自定位置
    insertStringAtLine = (stringToInsert, lineNumberToInsert) => {
        const text = "@enduml";
        const editorInstance = this.editorRef.current.editor;
        const session = editorInstance.getSession();
        const document = session.getDocument();
        const column = 0; // Insert at the beginning of the line

        document.insert({ row: lineNumberToInsert, column }, stringToInsert);


    };
    deleteContentAtLine = (lineNumber) => {
        if (this.editorRef.current && this.editorRef.current.editor) {
            const editor = this.editorRef.current.editor;
            const session = editor.getSession();

            // 刪除指定行數的內容
            if (lineNumber >= 0 && lineNumber < session.getLength()) {
                session.remove({
                    start: { row: lineNumber, column: 0 },
                    end: { row: lineNumber, column: Number.MAX_VALUE },
                });
            }
        }
    }

    EditorTextChange = (value) => {
        this.setState({ editorContent: value });

        // 清除之前的计时器（如果有的话）
        if (this.timer) {
            clearTimeout(this.timer);
        }

        // 设置1.5秒后的延迟调用
        this.timer = setTimeout(() => {
            // 在这里可以处理内容变化后的逻辑
            this.textToImg(value)

        }, 1500);

    }

    textToImg = (value) => {
        let getDom = plantuml(value);
        const Dom = this.findUniqueData(getDom);
        this.sendItemToMainArea(Dom);




    }
    //判斷是否有重複的字串
    isDuplicate1(obj1, obj2) {
        return (obj1.receiver === obj2.receiver && obj1.sender === obj2.sender) ||
            (obj1.receiver === obj2.sender && obj1.sender === obj2.receiver);
    }

    findUniqueData(data) {
        const uniqueData = [];
        for (let i = 0; i < data.length; i++) {
            let isDuplicate = false;
            let num = 0;
            let arrow = "";
            for (let j = 0; j < uniqueData.length; j++) {
                if (this.isDuplicate1(data[i], uniqueData[j])) {
                    num = j;
                    arrow = data[i].arrow;
                    isDuplicate = true;
                    break;
                }
            }

            if (!isDuplicate) {
                let data1 = this.trunToArray(data[i]);
                // console.log(data1)
                uniqueData.push(data1);
            } else if (isDuplicate) {
                uniqueData[num].arrow.push(data[i].arrow);

            }
        }

        return uniqueData;
    }

    trunToArray(data) {
        const dataArray = data;
        // 修改 text 屬性為包含該值的陣列
        dataArray.arrow = [dataArray.arrow];
        return (dataArray)

    }

    sendItemToMainArea = (getDom) => {
        this.props.sendDataToParent(getDom);
    }



    render() {
        const { editorContent } = this.state;
        return (

            <AceEditor
                ref={this.editorRef}
                mode="javascript" // 设置编辑器的模式
                theme="monokai" // 设置编辑器的主题
                onChange={this.EditorTextChange} // 处理编辑器内容变化的回调函数
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }} // 配置选项（根据您的需求）
                width='initial'
                height='calc(100% - 45px)'
                value={this.state.editorContent}


            />
        );
    }
}

export default Editor;