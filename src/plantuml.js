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


    // 使用map函数处理每一行文本
    const lines = text2.trim().split('\n');

    // 定义一个空数组来存储解析后的数据
    const parsedData = [];

    // 遍历每一行文本并解析
    lines.forEach(line => {
        const [senderReceiver, message] = line.split(': ');
        const matchResult = senderReceiver.match(/(Alice|Bob)\s*(->|-->|<--|<-)\s*(Alice|Bob)/);

        if (matchResult) {
            const [_, sender, arrow, receiver] = matchResult;

            parsedData.push({
                sender,
                receiver,
                arrow,
                message,
                style,
            });
        }
    });

    return (parsedData);

}


