
import AceEditor from 'react-ace';
import React from "react";
//hello bitch git test
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: `@startuml
Bob -> Alice
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
        // this.EditorTextChange(this.state.editorContent)
        const num = this.getLineNumber('@enduml');
        this.setState({ enduml: num })
        // this.insertStringAtLine("Hello, world!", 1);
    }

    trunToText = (item) => {
        const canvasitem = item;
        const { editorContent } = this.state;
        const lines = editorContent.split('\n');
        console.log(canvasitem)
        let dom = [];
        for (var i = 0; i < canvasitem.length; i++) {
            for (var j = 0; j < canvasitem[i].length; j++) {
                console.log(canvasitem[i][j])
                if (canvasitem[i][j].type == "shape") {
                    console.log(canvasitem)
                    dom.push(canvasitem[i])
                }
            }

        }
        this.insertStringAtLine("Hello, world!", this.state.enduml);


    }

    getLineNumber = (searchString) => {
        const editorInstance = this.editorRef.current.editor;
        const session = editorInstance.getSession();
        const document = session.getDocument();
        const index = this.state.editorContent.indexOf(searchString);
        const position = document.indexToPosition(index);
        console.log(`Line number of '${searchString}': ${position.row + 1}`);
        return position.row + 1
    };

    insertStringAtLine = (stringToInsert, lineNumberToInsert) => {
        const text = "@enduml";
        const editorInstance = this.editorRef.current.editor;
        const session = editorInstance.getSession();
        const document = session.getDocument();
        const column = 0; // Insert at the beginning of the line

        document.insert({ row: lineNumberToInsert, column }, stringToInsert);


    };

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
        let Svgdom = [];
        const text = /@startuml|@enduml/g;
        const dom = value.replace(text, "")
        const dom1 = dom.split("\n");
        for (var i = 1; i < dom1.length - 1; i++) {
            const text = dom1[i].split("->");
            Svgdom.push(text);

        }
        this.props.sendDataToParent(Svgdom);



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