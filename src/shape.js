export function square(x, y) {
    const newShpae = {
        id: generateId(),
        type: 'rect',
        props: {
            x: x,
            y: y,
            width: 70,
            height: 50,
            fill: 'white',
            stroke: "black",
            strokeWidth: 5
        }
    }
    console.log(newShpae)

    return newShpae;

}
//橫綫
export function line(x, y) {
    const newLine = {
        type: 'line',
        points: [x - 50, y, x + 50, y], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 5,
        draggable: true,


    }


    return newLine;
}
//竪綫
export function line2(x, y) {

    const newLine = {
        type: 'line',
        points: [x, y - 50, x, y + 50], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 5,
        draggable: true,


    }


    return newLine;
}
//左往右的箭頭
export function DashLine1(x, y, arrow) {


    const newline = {
        type: 'Dashline',
        points: [x - 50, y, x + 50, y], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,


    }
    return newline






}
//右邊往左邊的箭頭
export function DashLine2(x, y) {
    const newLine = {
        type: 'Dashline',
        points: [x + 50, y, x - 50, y], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,


    }


    return newLine;
}
export function presetShape1(x, y, text1, text2, arrow) {
    const shape = [];
    const Line1 = DashLine1(x, y, arrow);
    console.log(Line1)
    const x1 = Line1.points[0];
    const y1 = Line1.points[1];
    const x2 = Line1.points[2];
    const y2 = Line1.points[3];
    const Line2 = line2(x1, y1);
    const Line3 = line2(x2, y2);

    console.log(Line2)
    const square1 = square(Line2.points[0] - 35, Line2.points[1] - 40)

    const square2 = square(Line2.points[2] - 35, Line2.points[3] - 10)

    const square3 = square(Line3.points[0] - 35, Line3.points[1] - 40)
    const square4 = square(Line3.points[2] - 35, Line3.points[3] - 10)

    const Text1 = calculateTextPositions(Line2.points[0] - 35, Line2.points[1] - 40, text1, square1.id);
    const Text2 = calculateTextPositions(Line2.points[2] - 35, Line2.points[3] - 10, text1, square2.id)
    const Text3 = calculateTextPositions(Line3.points[0] - 35, Line3.points[1] - 40, text2, square3.id)
    const Text4 = calculateTextPositions(Line3.points[2] - 35, Line3.points[3] - 10, text2, square4.id)
    shape.push(Line1, Line2, Line3, square1, square2, square3, square4, Text1, Text2, Text3, Text4);
    console.log(shape)

    // const line2 = line2(x1, y1);


    return shape
}


export function calculateTextPositions(centerX, centerY, texts, shapeID) {
    return { centerX, centerY, texts, type: "text", shapeID }
}
const generateId = (() => {
    let currentId = 0;

    return () => {
        currentId++;
        return currentId;
    };
})();


// shape = [0:
//     [
//         0: {
//             type: 'line',
//             points: [100, 100, 200, 100],
//             stroke: 'black',
//             strokeWidth: 5,
//             draggable: true,
//         },
//     1: {
//             type: 'line',
//             points: [100, 200, 100, 200],
//             stroke: 'black',
//             strokeWidth: 5,
//             draggable: true,
//         }
//     ]

//     1:[
//         0:{
//             type: 'line',
//             points: [300, 100, 200, 100],
//             stroke: 'black',
//             strokeWidth: 5,
//             draggable: true,
//         },
//         1:{
//             type: 'line',
//             points: [300, 100, 200, 100],
//             stroke: 'black',
//             strokeWidth: 5,
//             draggable: true,
//         }
//     ]

// ]