export function plantuml(value) {
    const style = {
        height: 50,
        width: 100,
        fillstyle: "#AAAAAA",//底的顔色 灰色
        cornerRadius: 20, //圓角
        strokeStyle: "#000000", //邊的顔色
        font: "16px Arial",
        x: 200,
        y: 200,
        borderColor: "#000000",



    };
    const text1 = value;

    const startText = "@startuml";
    const endText = "@enduml";

    let text = text1.replace(startText, '');
    let text2 = text.replace(endText, '')

    const linesArray = text2.split('\n');

    // 初始化結果陣列
    const resultArray = [];

    // 遍歷每行
    for (const line of linesArray) {
        const parts = line.split(':');
        if (parts.length > 1) {
            if (parts.length === 2) {
                const arrowPart = parts[0].trim();
                const lineText = parts[1].trim();

                const arrowMatch = arrowPart.match(/\s*->|-->|<--|<-\s*/);

                if (arrowMatch) {
                    const arrowSymbol = arrowMatch[0].trim();
                    const [receiver, sender] = arrowPart.split(arrowSymbol).map(part => part.trim());

                    resultArray.push({
                        receiver: receiver,
                        sender: sender,
                        lineText: lineText,
                        arrow: arrowSymbol,
                        style,
                    });
                }
            }
        } else {
            const arrowPart = parts[0].trim();


            const arrowMatch = arrowPart.match(/\s*->|-->|<--|<-\s*/);

            if (arrowMatch) {
                const arrowSymbol = arrowMatch[0].trim();
                const [receiver, sender] = arrowPart.split(arrowSymbol).map(part => part.trim());

                resultArray.push({
                    receiver: receiver,
                    sender: sender,
                    lineText: "",
                    arrow: arrowSymbol,
                    style,
                });
            }
        }


    }

    // 打印結果陣列
    return (resultArray)


    // 使用map函数处理每一行文本
    // const lines = text2.trim().split('\n');

    // // 定义一个空数组来存储解析后的数据
    // const parsedData = [];
    // console.log(lines)

    // // 遍历每一行文本并解析
    // lines.forEach(line => {
    //     const [senderReceiver, message] = line.split(': ');
    //     console.log(senderReceiver)
    //     const matchResult = senderReceiver.match(/(Alice|Bob)\s*(->|-->|<--|<-)\s*(Alice|Bob)/);
    //     console.log(matchResult)
    //     if (matchResult) {
    //         const [_, sender, arrow, receiver] = matchResult;

    //         parsedData.push({
    //             sender,
    //             receiver,
    //             arrow,
    //             message,
    //             style,
    //         });
    //     }
    // });
    // console.log(parsedData)
    // return (parsedData);

}

