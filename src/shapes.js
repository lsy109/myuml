

export function shape1(x, y, context, dongzuo) {
    console.log(dongzuo)
    if (dongzuo == "图形1") {
        console.log("1")
    }


}

function square() {

}

function graphics1(x, y, context) {
    const size = 50; // 正方形的尺寸
    const color = "red"; // 正方形的颜色
    const lineWidth = 2; // 线条的宽度
    const text = "text";//预设字串
    const DomId = 0;
    let squareCoordinates = [];
    context.font = "24px Arial";

    context.beginPath();
    context.fillStyle = color;
    //第一個正方形
    context.fillRect(x, y, size, size);
    context.fillStyle = "blue"
    context.fillText(text, x, y + 25);
    squareCoordinates.push({ x: x, y: y, width: size, height: size, type: "shape" });
    //第二個正方形
    context.fillRect(x + 100, y, size, size);
    squareCoordinates.push({ x: x + 100, y: y, width: size, height: size, type: "shape" });
    //第三個正方形（第一個正方形下面）
    context.fillRect(x, y + 100, size, size);
    squareCoordinates.push({ x: x, y: y + 100, width: size, height: size, type: "shape" });
    //第四個正方形（第二個正方形下面）
    context.fillRect(x + 100, y + 100, size, size);
    squareCoordinates.push({ x: x + 100, y: y + 100, width: size, height: size, type: "shape" });
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

    context.lineWidth = lineWidth;
    context.stroke();
    console.log(squareCoordinates)
    const shape = [squareCoordinates]

    console.log(x)
    console.log(y + 200)

    return shape
}
function id(DomID) {
    return DomID += 1
}


