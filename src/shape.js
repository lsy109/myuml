import { type } from "@testing-library/user-event/dist/type";

export function square(x, y, text) {
    const shapeid = generateId()
    const newShpae = {
        id: shapeid,
        type: 'rect',
        props: {
            x: x,
            y: y,
            width: 70,
            height: 50,
            fill: 'white',
            stroke: "black",
            strokeWidth: 5
        },
        text: {
            text: text,
            x: x,
            y: y,
            shapeID: shapeid,

        }
    }


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
export function line2(x, y,) {

    const newLine = {
        type: 'line',
        points: [x, y - 50, x, y + 50], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 5,
        draggable: true,


    }


    return newLine;
}
////往左的斜綫
export function line3(x, y) {

    const newLine = {
        type: 'line',
        points: [x, y, x + 50, y + 40], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 5,
        draggable: true,


    }


    return newLine;
}
//往右的斜綫
export function line4(x, y) {

    const newLine = {
        type: 'line',
        points: [x, y, x - 50, y + 40], // 线的起点和终点坐标
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
        dash: [5, 5]


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
        dash: [5, 5]
    }


    return newLine;
}
//左邊往右邊的實綫
export function Arrow1(x, y) {
    const newline = {
        type: 'Dashline',
        points: [x - 50, y, x + 50, y], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        dash: [0, 0]


    }
    return newline
}
//右邊往左邊的實綫
export function Arrow2(x, y) {
    const newline = {
        type: 'Dashline',
        points: [x + 50, y, x - 50, y], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        dash: [0, 0]


    }
    return newline
}

export function Dash(x, y) {
    const newline = {
        type: 'Dashline',
        points: [x, y + 50, x, y + 250], // 线的起点和终点坐标
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        dash: [9, 9]


    }
    return newline
}

export function picture(x, y, image) {
    const img = new window.Image();
    const newImg = {
        type: 'img',
        props: {
            x: x,
            y: y,
            width: 90,
            height: 60,
            fill: 'white',
            stroke: "black",
            strokeWidth: 2
        },
        Img: {
            x: x,
            y: y,
            width: 90,
            height: 60,
            image: image,
        },
        Img2: {
            x: x,
            y: y + 400,
            width: 90,
            height: 60,
            image: image,
        },
        DashLine: {
            points: [x + 45, y + 90, x + 45, y + 320], // 线的起点和终点坐标
            stroke: 'black',
            strokeWidth: 4,
            draggable: true,
            dash: [9, 9]
        },

    }
    return newImg


}


////////////////////////////////////////////////////////////////








export function presetShape1(x, y, text1, text2, arrow) {
    const shape = [];
    const spacing = 20;
    console.log(arrow)
    for (let i = 0; i < arrow.length; i++) {
        const Y = y + (i - (arrow.length - 1) / 2) * spacing;
        const X = x;
        console.log(arrow[i])
        if (arrow[i] === '-->') {
            shape.push(DashLine1(X, Y))
        } else if (arrow[i] === '->') {
            shape.push(Arrow1(X, Y))
        } else if (arrow[i] === '<--') {
            shape.push(DashLine2(X, Y))
        } else if (arrow[i] === '<-') {

            shape.push(Arrow2(X, Y))
        }

    }

    const Line1 = DashLine2(x, y, arrow);

    const x1 = Line1.points[0];
    const y1 = Line1.points[1];
    const x2 = Line1.points[2];
    const y2 = Line1.points[3];

    const Y1 = shape[0].points[1]
    const Y2 = shape[arrow.length - 1].points[1]
    const Line2 = line2(x1, y1, Y2);
    const Line3 = line2(x2, y2, Y2);

    const square1 = square(Line2.points[0] - 35, Line2.points[1] - 40, text2)
    const square2 = square(Line2.points[2] - 35, Line2.points[3] - 10, text2)
    const square3 = square(Line3.points[0] - 35, Line3.points[1] - 40, text1)
    const square4 = square(Line3.points[2] - 35, Line3.points[3] - 10, text1)

    // const Text1 = calculateTextPositions(Line2.points[0] - 35, Line2.points[1] - 40, text1, square1.id);
    // const Text2 = calculateTextPositions(Line2.points[2] - 35, Line2.points[3] - 10, text1, square2.id)
    // const Text3 = calculateTextPositions(Line3.points[0] - 35, Line3.points[1] - 40, text2, square3.id)
    // const Text4 = calculateTextPositions(Line3.points[2] - 35, Line3.points[3] - 10, text2, square4.id)
    shape.push(Line2, Line3, square1, square2, square3, square4);


    // const line2 = line2(x1, y1);


    return shape
}


export function calculateTextPositions(centerX, centerY, texts, shapeID) {
    return { centerX, centerY, texts, type: "text", shapeID }
}

export function Circle(x, y) {

    const newCircle = {
        type: 'circle',
        props: {
            x: x,
            y: y - 30,
            radius: 30,
            fill: 'white',
            stroke: "black",
            strokeWidth: 5
        }, // 线的起点和终点坐标
        body: line2(x, y + 20),
        hands: line(x, y),
        LeftLeg: line3(x, y + 70),
        Right: line4(x, y + 70),
        DashLine: Dash(x, y + 60),
        circle2: {
            props: {
                x: x,
                y: y - 30 + 400,
                radius: 30,
                fill: 'white',
                stroke: "black",
                strokeWidth: 5
            }, // 线的起点和终点坐标
            body: line2(x, y + 20 + 400),
            hands: line(x, y + 400),
            LeftLeg: line3(x, y + 70 + 400),
            Right: line4(x, y + 70 + 400),

        }



    }

    return newCircle
}


export function Actor(x, y) {
    const shape = [];
    const circle1 = Circle(x, y)

    shape.push(circle1)
    return shape


}



export function Databases(x, y, image) {
    const shape = []
    const img = picture(x, y, image)
    console.log(img)
    shape.push(img);
    return shape

}


export function Boundary(x, y) {
    const shape = [{
        type: 'Boundary',
        props: {
            x: x,
            y: y,
            radius: 30,
            fill: 'white',
            stroke: "black",
            strokeWidth: 5
        },
        line1: {
            points: [x - 30, y, x - 70, y],
            stroke: "black",
            strokeWidth: 5,
            type: "line"
        },
        line2: {
            points: [x - 70, y - 30, x - 70, y + 30],
            stroke: "black",
            strokeWidth: 5,
            type: "line"
        },
        DashLine: {
            type: "DashLine",
            points: [x - 25, y + 55, x - 25, y + 280],
            stroke: "black",
            strokeWidth: 5,
            dash: [9, 9],


        },
        Child: {
            props: {
                x: x,
                y: y + 350,
                radius: 30,
                fill: 'white',
                stroke: "black",
                strokeWidth: 5
            },
            line1: {
                points: [x - 30, y + 350, x - 70, y + 350],
                stroke: "black",
                strokeWidth: 5,
                type: "line"
            },
            line2: {
                points: [x - 70, y + 320, x - 70, y + 380],
                stroke: "black",
                strokeWidth: 5,
                type: "line"
            },
        },
        text: {
            x: x - 75,
            y: y + 20,
            x1: x - 75,
            y1: y + 250,

        }
    }]

    return shape
}

export function Entity(x, y) {
    const shape = [{
        type: "Entity",
        props: {
            x: x,
            y: y,
            radius: 30,
            fill: 'white',
            stroke: "black",
            strokeWidth: 5

        }

    }]
    return shape

}


const generateId = (() => {
    let currentId = 0;

    return () => {
        currentId++;
        return currentId;
    };
})();






