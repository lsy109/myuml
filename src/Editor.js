import React from "react";
import AceEditor from "react-ace";
import 'brace/mode/dot';
import 'brace/theme/twilight';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.aceRef = React.createRef();
        this.state = {
            value: '', // 假設你的原始代碼在這裡
        };
    }

    handleChange = (value) => {

        this.props.onTextChange(value);
    }

    graphChangeText = (value1, value2, value3) => {
        const editor = this.aceRef.current.editor;
        const editText = editor.getValue();
        if (value1 != null && value2 != null && value3 == null) {
            if (editText.includes(value1)) {
                const range = editor.find(value1, {
                    caseSensitive: true // 设置为 true 以确保区分大小写
                });

                // Replace the found range with value2
                editor.replace(value2);

                // If you want to replace all occurrences of value1 with value2, 
                // you can use a loop to continuously find and replace until no more instances of value1 are found.
                while (editor.find(value1, {
                    caseSensitive: true // 同样在这里设置
                })) {
                    editor.replace(value2);
                }
            }

        }
        else if (value1 != null && value2 != null && value3 != null) {
            const session = editor.getSession();
            const lines = session.getDocument().getAllLines();

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(value1) && lines[i].includes(value3)) {
                    lines[i] = lines[i].replace(value1, value2);
                }
            }

            // 将修改后的行重新设置到编辑器中
            session.setValue(lines.join('\n'));
        }


        console.log(value1, value2, value3)
    }

    // insertStringAboveFirstSymbol(inputString) {
    //     const editor = this.aceRef.current.editor;
    //     const content = editor.getValue(); // 从AceEditor中获取当前内容
    //     const lines = content.split('\n');
    //     const symbols = ['->', '<-', '-->', '<--'];

    //     // 寻找第一次出现符号的行数
    //     let indexToInsert = -1;
    //     for (let i = 0; i < lines.length; i++) {
    //         for (let symbol of symbols) {
    //             if (lines[i].includes(symbol)) {
    //                 indexToInsert = i + 1; // 修改此处，使得新的字符串插入到符号所在行的下方
    //                 break;
    //             }
    //         }
    //         if (indexToInsert !== -1) {
    //             break;
    //         }
    //     }

    //     // 如果找到符号，则在它的下一行插入新的字符串
    //     if (indexToInsert !== -1) {
    //         lines.splice(indexToInsert, 0, inputString);
    //     }
    //     // 如果没有找到特定符号，则搜索@enduml
    //     else {
    //         indexToInsert = lines.indexOf('@enduml');
    //         if (indexToInsert !== -1) {
    //             lines.splice(indexToInsert, 0, inputString);
    //         }
    //     }

    //     if (indexToInsert !== -1) {
    //         const updatedValue = lines.join('\n');
    //         // 使用定时器来确保内容被正确更新
    //         this.interval = setInterval(() => {
    //             this.handleChange(updatedValue);
    //             clearInterval(this.interval);
    //         }, 1);

    //         // 打印更改后的字符串
    //         console.log(updatedValue);
    //     }
    //     else {
    //         // 如果都没有找到符号或@enduml，则打印一条消息或其他处理
    //         console.log("没有找到匹配的符号或@enduml");
    //     }
    // }
    // insertStringAboveFirstSymbol(inputString) {
    //     const editor = this.aceRef.current.editor;
    //     const content = editor.getValue(); // 从AceEditor中获取当前内容
    //     const lines = content.split('\n');

    //     // 搜索@enduml的行数
    //     let indexToInsert = lines.indexOf('@enduml');
    //     if (indexToInsert !== -1) {
    //         lines.splice(indexToInsert, 0, inputString); // 插入新的字符串
    //     }

    //     if (indexToInsert !== -1) {
    //         const updatedValue = lines.join('\n');
    //         // 使用定时器来确保内容被正确更新
    //         this.interval = setInterval(() => {
    //             this.handleChange(updatedValue);
    //             clearInterval(this.interval);
    //         }, 1);

    //         // 打印更改后的字符串
    //         console.log(updatedValue);
    //     }
    //     else {
    //         // 如果没有找到@enduml，则打印一条消息或其他处理
    //         console.log("没有找到@enduml");
    //     }
    // }
    insertStringAboveFirstSymbol(inputString) {
        const editor = this.aceRef.current.editor;
        const content = editor.getValue();
        const lines = content.split('\n');

        let activateIndices = [];
        let deactivateIndices = [];
        let indexToInsert = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("activate") && !lines[i].includes("deactivate")) {
                activateIndices.push(i);
            } else if (lines[i].includes("deactivate")) {
                deactivateIndices.push(i);
            }
        }

        if (inputString.includes('participant')) {
            let startUmlIndex = lines.indexOf('@startuml');
            indexToInsert = startUmlIndex + 1;
            while (lines[indexToInsert] && lines[indexToInsert].includes('participant')) {
                indexToInsert++;
            }
        } else if (inputString.includes('->')) {
            if (activateIndices.length) {
                for (let i = 0; i < activateIndices.length; i++) {
                    if (activateIndices[i] > 0 && (lines[activateIndices[i] - 1].includes('->') || lines[activateIndices[i] - 1].includes('<-'))) {
                        continue;
                    } else {
                        indexToInsert = activateIndices[i];
                        break;
                    }
                }
            } else {
                indexToInsert = lines.indexOf('@enduml');
            }
        } else if (inputString.includes('<-') || inputString.includes('<--')) {
            for (let i = 0; i < deactivateIndices.length; i++) {
                if (deactivateIndices[i] > 0 && !lines[deactivateIndices[i] - 1].includes('<-')) {
                    indexToInsert = deactivateIndices[i];
                    break;
                }
            }
        } else if (inputString.includes('activate') || inputString.includes('deactivate') || inputString.includes('destroy')) {
            if (activateIndices.length) {
                indexToInsert = Math.max(...activateIndices) + 1;
            } else {
                indexToInsert = lines.indexOf('@enduml');
            }
        }

        // 如果都沒有符合的條件，一律插入到 "@enduml" 這一行前面
        if (indexToInsert === -1) {
            indexToInsert = lines.indexOf('@enduml');
        }

        lines.splice(indexToInsert, 0, inputString);
        const updatedValue = lines.join('\n');

        this.interval = setInterval(() => {
            this.handleChange(updatedValue);
            clearInterval(this.interval);
        }, 1);

        console.log(updatedValue);
    }

















    // handleChange = (newValue) => {
    //     console.log(newValue)
    //     this.setState({ value: newValue });
    // }

    render() {
        let annotations = null;

        if (this.props.error) {
            annotations = [{
                row: this.props.error.line - 1,
                column: 0,
                text: this.props.error.message,
                type: "error", // also warning and information
                dummy: Date.now(),
            }];
        }

        return (

            <AceEditor
                fontSize="15px"
                width='initial'
                height='calc(100% - 45px)'
                mode="dot"
                theme="twilight"
                value={this.props.dotSrc}
                debounceChangePeriod={2000}
                onChange={this.handleChange}
                annotations={annotations}
                ref={this.aceRef}
                editorProps={{ $blockScrolling: true }}
            />
        );
    }
}

export default Editor;