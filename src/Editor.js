import React from "react";
import AceEditor from "react-ace";
import 'brace/mode/dot';
import 'brace/theme/twilight';
import { line } from "d3";

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
    downLoadTEXT = () => {
        const text = this.aceRef.current.editor.getValue();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'editor-content.txt';
        a.click();

        URL.revokeObjectURL(url);
    };
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


    }


    modifySequenceDiagram = (originalCode, test1, test2, test3, text4) => {
        const lines = originalCode.split('\n');
        const modifiedLines = [];
        let insertIndex = -1;

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            modifiedLines.push(line);

            if (line.includes(test1) && line.includes(test2)) {
                insertIndex = index;
            }

            if (line.trim() === 'end' && insertIndex !== -1) {
                test3.forEach(item => modifiedLines.splice(index, 0, item));
                insertIndex = -1;  // Reset insert index
            }
        }

        return modifiedLines.join('\n');
    }

    rearrangeLines = (text1, text2, currentText) => {
        // 將當前文本分割成行


        let lines = currentText.match(/[^\r\n]+/g);

        // 找到 text1 所在的行數


        // 找到 text2 中每個元素所在的行數及內容
        let text2Lines = text2.map(text => {
            let lineIndex = lines.findIndex(line => line.includes(text));
            return { line: lines[lineIndex], index: lineIndex };
        });

        // // 過濾掉未找到的行
        text2Lines = text2Lines.filter(line => line.index !== -1);

        // // 對 text2Lines 進行排序，以確保按文本原始順序移動
        text2Lines.sort((a, b) => a.index - b.index);
        const len = text2Lines.length

        // // 從原文本中移除這些行
        text2Lines.forEach(line => {

            const index = lines.indexOf(line.line);
            if (index > -1) {
                // 存在，使用splice方法删除它
                lines.splice(index, 1);
            }
            // lines.splice(line.index, len);
        });
        let text1LineIndex = lines.findIndex(line => line.includes(text1));

        // 將這些行插入到 text1 所在行的下面
        lines.splice(text1LineIndex + 1, 0, ...text2Lines.map(line => line.line));

        // // 重新組合成新的文本
        return lines.join('\n');
    }


    ifelseFunction = (text1, text2, text3) => {
        if (text1 != null && text2 == null && text3 == null) {

            this.insertStringAboveFirstSymbol(text1)
        } else if (text1 != null && text2 === "" && text3 === "") {

        }
    }
    ifelseFunction2 = (text1, text2) => {
        if (text1 != null && text2 != null) {


            const originalCode = this.aceRef.current.editor.getValue();
            console.log(originalCode)
            const newValue = this.rearrangeLines(text2, text1, originalCode);

            this.aceRef.current.editor.setValue(newValue)
        }
    }
    updateAndPrintContent = (text1, text2, num) => {
        const editor = this.aceRef.current.editor;
        const session = editor.getSession();
        const lines = session.getDocument().getAllLines();
        let matchCount = 0;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(text1)) {
                matchCount += 1;
                if (matchCount === num) {
                    session.getDocument().insert({
                        row: i,
                        column: lines[i].length
                    }, text2);
                    break;
                }
            }
        }

        // 獲取更改後的內容
        const updatedContent = session.getValue();

        // 如果需要對更新後的內容進行進一步處理，可以在這裡進行
        // ...

        // 將更新後的內容重新設置到Ace Editor
        session.setValue(updatedContent);

        console.log('更改並重新設置後的內容:', updatedContent);
    }

    wirteText = (text) => {
        console.log(text)
        const editor = this.aceRef.current.editor;
        const session = editor.getSession();
        session.setValue(text);
    }









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