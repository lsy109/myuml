

export function shape1(x, y, ctx, dongzuo, text) {

    const size = 50; // 正方形的尺寸
    const fillColor = "#AAAAAA"; // 正方形的颜色
    const lineWidth = 2; // 线条的宽度
    const text1 = text;
    const text2 = "text2";
    const font = "24px Arial";
    const borderColor = "black";
    const arrow = "->";
    const message = "";
    const radius = 20;
    const height = 50;
    const width = 100;

    if (dongzuo == "graphics1") {
        return rectangle(ctx, x, y, width, height, radius, fillColor, borderColor, text1, text2, arrow, message, font);
    } else if (dongzuo == "square") {
        return square(x, y, ctx, size, fillColor, lineWidth, text, font, borderColor);
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

function drawRoundedRectangle(ctx, x, y, width, height, radius, fillColor, borderColor) {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
}

export function rectangle(ctx, x, y, width, height, radius, fillColor, borderColor, text1, text2, arrow, message, font) {
    // let leftLineMoveX = x + (x / 4);
    // let leftLineMoveY = y + (y / 4);
    // let leftLineToX = x + (x / 4);
    // let leftLineToY = y + 150;

    let leftLine = {
        leftLineMove: { x: x + (x / 4), y: y + (y / 4) },
        leftLineTo: { x: x + (x / 4), y: y + 150 }
    }
    let rightLine = {
        rightLineMove: { x: x + 150 + (x / 4), y: y + (y / 4) },
        rightLineTo: { x: x + 150 + (x / 4), y: y + 150 }
    }



    // let rightLineMoveX = x + 150 + (x / 4);
    // let rightLineMoveY = y + (y / 4);
    // let rightLineToX = x + 150 + (x / 4);
    // let rightLineToY = y + 150;


    //畫左邊的圖
    drawRoundedRectangle(ctx, x, y, width, height, radius, fillColor, borderColor);
    // 绘制下面的长方形
    drawRoundedRectangle(ctx, x, y + 150, width, height, radius, fillColor, borderColor);

    ctx.setLineDash([5, 5]); // 设置虚线样式
    ctx.strokeStyle = borderColor; // 黑色
    ctx.lineWidth = 2; // 边框宽度
    ctx.beginPath();
    ctx.moveTo(leftLine.leftLineMove.x, leftLine.leftLineMove.y); // 上方长方形的底边中心
    ctx.lineTo(leftLine.leftLineTo.x, leftLine.leftLineTo.y); // 下方长方形的顶边中心
    ctx.stroke();

    // 绘制文本
    ctx.font = font;
    ctx.fillStyle = borderColor; // 黑色
    ctx.textAlign = "center";
    ctx.fillText(text2, x + 50, y + 25); // 上方长方形的文本位置
    ctx.fillText(text2, x + 50, y + 175); // 下方长方形的文本位置


    ctx.setLineDash([]);
    //畫右邊的圖
    drawRoundedRectangle(ctx, x + 150, y, width, height, radius, fillColor, borderColor);
    // 绘制下面的长方形
    drawRoundedRectangle(ctx, x + 150, y + 150, width, height, radius, fillColor, borderColor);

    ctx.strokeStyle = borderColor; // 黑色
    ctx.lineWidth = 2; // 边框宽度
    ctx.beginPath();
    ctx.setLineDash([5, 5]); // 设置虚线样式
    ctx.moveTo(rightLine.rightLineMove.x, rightLine.rightLineMove.y); // 上方长方形的底边中心
    ctx.lineTo(rightLine.rightLineTo.x, rightLine.rightLineTo.y); // 下方长方形的顶边中心
    ctx.stroke();

    // 绘制文本
    ctx.font = font;
    ctx.fillStyle = borderColor; // 黑色
    ctx.textAlign = "center";
    ctx.fillText(text1, x + 150 + 50, y + 25); // 上方长方形的文本位置
    ctx.fillText(text1, x + 150 + 50, y + 175); // 下方长方形的文本位置

    ctx.setLineDash([]);

    drawLine(ctx, leftLine, rightLine, arrow);



}

export function drawLine(ctx, leftLine, rightLine, arrow) {
    let context = ctx;
    let left = leftLine;
    let right = rightLine;
    let arr = arrow;

    let ArrowSize = 10;

    if (arrow == "->") {
        let moveX = leftLine.leftLineMove.x;
        let moveY = leftLine.leftLineMove.y + 50;
        let lineX = rightLine.rightLineMove.x;
        let lineY = rightLine.rightLineMove.y + 50;

        context.beginPath();
        context.moveTo(moveX, moveY);
        context.lineTo(lineX, lineY);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();

        context.beginPath();
        context.moveTo(lineX - ArrowSize, lineY - ArrowSize);
        context.lineTo(lineX, lineY);
        context.lineTo(lineX - ArrowSize, lineY + ArrowSize);
        context.strokeStyle = "black";
        context.fillStyle = "black";
        context.lineWidth = 1;
        context.fill();
        context.stroke();
    } else if (arrow == "<-") {
        let moveX = leftLine.leftLineMove.x;
        let moveY = leftLine.leftLineMove.y + 50;
        let lineX = rightLine.rightLineMove.x;
        let lineY = rightLine.rightLineMove.y + 50;

        context.beginPath();
        context.moveTo(moveX, moveY);
        context.lineTo(lineX, lineY);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();

        context.beginPath();
        context.moveTo(moveX + ArrowSize, lineY + ArrowSize);
        context.lineTo(moveX, lineY);
        context.lineTo(moveX + ArrowSize, lineY - ArrowSize);
        context.strokeStyle = "black";
        context.fillStyle = "black";
        context.lineWidth = 1;
        context.fill();
        context.stroke();
    }





}