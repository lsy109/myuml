

export function shape1(x, y, context, dongzuo, text) {

    const size = 50; // 正方形的尺寸
    const color = "red"; // 正方形的颜色
    const lineWidth = 2; // 线条的宽度
    const text1 = text;
    const font = "24px Arial";
    const textcolor = "black";
    if (dongzuo == "graphics1") {
        return graphics1(x, y, context, size, color, lineWidth, text, font, textcolor);
    } else if (dongzuo == "square") {
        return square(x, y, context, size, color, lineWidth, text, font, textcolor);
    }


}

function square(x, y, context, size, color, lineWidth, text, font, textcolor) {
    let squareCoordinates = []
    context.beginPath();
    context.fillStyle = color
    context.fillRect(x, y, size, size);
    context.font = font;
    context.fillStyle = textcolor;
    context.fillText(text, x, y + 25)
    context.stroke();
    squareCoordinates.push({ x: x, y: y, width: size, height: size, type: "shape", text: text, fontsize: font, textcolor: textcolor, color: color, textX: x, textY: y + 25 });
    const shape = squareCoordinates
    return shape

}

function graphics1(x, y, context, size, color, lineWidth, text, font, textcolor) {
    //预设字串
    let squareCoordinates = [];

    context.beginPath();
    context.fillStyle = color;
    //第一個正方形
    context.fillRect(x, y, size, size);

    //第二個正方形
    context.fillRect(x + 100, y, size, size);

    //第三個正方形（第一個正方形下面）
    context.fillRect(x, y + 100, size, size);

    //第四個正方形（第二個正方形下面）
    context.fillRect(x + 100, y + 100, size, size);

    //第一條綫（連接第一個正方形和第三個正方形）
    context.moveTo(x + size / 2, y + size); // 将线条起点移动到第一个正方形的右下角
    context.lineTo(x + 25, y + 100); // 绘制线条到第三个正方形的左上角
    squareCoordinates.push({ movex: x + size / 2, movey: y + size, linex: x + 25, liney: y + 100, type: "line" });
    //第二條綫（連接第二個正方形和第四個正方形）
    context.moveTo(x + 100 + size / 2, y + size); // 将线条起点移动到第一个正方形的右下角
    context.lineTo(x + 125, y + 100); // 绘制线条到第三个正方形的左上角
    squareCoordinates.push({ movex: x + 100 + size / 2, movey: y + size, linex: x + 125, liney: y + 100, type: "line" })
    //連接兩條綫之間的綫
    context.moveTo(x + size - 25, y + size + 25); // 将线条起点移动到竖直线条的中点
    context.lineTo(x + 100 + size / 2, y + size + 25); // 绘制线条到第二个正方形的中点
    squareCoordinates.push({ movex: x + size - 25, movey: y + size + 25, linex: x + 100 + size / 2, liney: y + size + 25, type: "line" })


    context.font = font;
    context.fillStyle = textcolor
    context.fillText(text, x, y + 25);
    context.fillText(text, x + 100, y + 25);
    context.fillText(text, x, y + 125);
    context.fillText(text, x + 100, y + 125);
    context.lineWidth = lineWidth;

    squareCoordinates.push({ x: x, y: y, width: size, height: size, type: "shape", text: text, fontsize: font, textcolor: textcolor, color: color, textX: x, textY: y + 25 });
    squareCoordinates.push({ x: x + 100, y: y, width: size, height: size, type: "shape", text: text, fontsize: font, textcolor: textcolor, color: color, textX: x + 100, textY: y + 25 });
    squareCoordinates.push({ x: x, y: y + 100, width: size, height: size, type: "shape", text: text, fontsize: font, textcolor: textcolor, color: color, textX: x, textY: y + 125 });
    squareCoordinates.push({ x: x + 100, y: y + 100, width: size, height: size, type: "shape", text: text, fontsize: font, textcolor: textcolor, color: color, textX: x + 100, textY: y + 125 });



    context.stroke();
    console.log(squareCoordinates)
    const shape = squareCoordinates
    console.log(shape)

    console.log(x)
    console.log(y + 200)

    return shape
}
function id(DomID) {
    return DomID += 1
}



