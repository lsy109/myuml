export let module1 = {
    resizable_3area: function resizable_3area(matrix) {
        let container = document.getElementById("container");
        let left = document.getElementById("sourceArea");
        let resizor1 = document.getElementById("resizor1");
        let middle = document.getElementById("editPanelArea");
        let resizor2 = document.getElementById("resizor2");
        let right = document.getElementById("treeArea");

        // let leftPer;
        // let middlePer;
        // let rightPer;
        // let resizorPer = 0.005;

        // let matrix = [1, 1, 1];

        //移動左邊邊界
        resizor1.onmousedown = function (e) {
            let maxWidth = container.clientWidth;

            let startX = e.clientX;
            resizor1.left = resizor1.offsetLeft;

            document.onmousemove = function (e) {
                let endX = e.clientX;
                let moveLen = resizor1.left + (endX - startX);
                let maxL = left.clientWidth + middle.clientWidth - resizor1.offsetWidth;

                if (moveLen < 100) moveLen = 100;
                if (moveLen > maxL - 100) moveLen = maxL - 100;

                resizor1.style.left = moveLen - 3 + "px";
                left.style.width = moveLen + "px";
                //將middle的左側位置設定為left區塊的寬
                middle.style.left = left.style.width;
                middle.style.width = (container.clientWidth - right.clientWidth - moveLen) + "px";

                // percentage
                resizor1.style.left = ((moveLen - 3) / maxWidth) * 100 + "%";
                left.style.width = (moveLen / maxWidth) * 100 + "%";
                middle.style.left = left.style.width;
                middle.style.width = ((container.clientWidth - right.clientWidth - moveLen) / maxWidth) * 100 + "%";

            }
            document.onmouseup = function (evt) {
                document.onmousemove = null;
                document.onmoveup = null;
                resizor1.releaseCapture && resizor1.releaseCapture();

            }
            resizor1.setCapture && resizor1.Capture();
            return false;
        }

        //移動右邊邊界
        resizor2.onmousedown = function (e) {
            if (matrix[0] === true && matrix[1] === false && matrix[2] === true) {
                // console.log(matrix);
                let maxWidth = container.clientWidth;

                let startX = e.clientX;
                resizor2.left = resizor2.offsetLeft;

                document.onmousemove = function (e) {
                    let endX = e.clientX;
                    let moveLen = resizor2.left + (endX - startX);
                    let maxM = left.clientWidth + right.clientWidth - resizor2.offsetWidth;

                    if (moveLen < 100) moveLen = 100;
                    if (moveLen > maxM - 100) moveLen = maxM - 100;

                    resizor1.style.left = moveLen - 3 + "px";
                    resizor2.style.left = moveLen - 3 + "px";
                    left.style.width = moveLen + "px";
                    middle.style.width = 0 + "%";
                    right.style.width = (container.clientWidth - moveLen) + "px";
                    //將middle的左側位置設定為left區塊的寬
                    middle.style.left = left.style.width;

                    // percentage
                    // leftPer = left.style.width + moveLen;
                    // console.log(left.style.width);
                    // console.log(moveLen);
                    // console.log(maxWidth);
                    // console.log(leftPer);
                    resizor1.style.left = ((moveLen - 3) / maxWidth) * 100 + "%";
                    resizor2.style.left = ((moveLen - 3) / maxWidth) * 100 + "%";
                    left.style.width = (moveLen / maxWidth) * 100 + "%";
                    middle.style.width = 0 + "%";
                    right.style.width = ((container.clientWidth - moveLen) / maxWidth) * 100 + "%";
                    //將middle的左側位置設定為left區塊的寬
                    middle.style.left = left.style.width;

                }
                document.onmouseup = function (evt) {
                    document.onmousemove = null;
                    document.onmoveup = null;
                    resizor2.releaseCapture && resizor2.releaseCapture();

                }
                resizor2.setCapture && resizor2.Capture();
                return false;
            }

            // console.log(matrix);
            let maxWidth = container.clientWidth;

            let startX = e.clientX;
            resizor2.left = resizor2.offsetLeft;
            resizor1.left = resizor1.offsetLeft;

            document.onmousemove = function (e) {
                let endX = e.clientX;
                let moveLen = resizor2.left - resizor1.left + (endX - startX);
                let maxR = middle.clientWidth + right.clientWidth - resizor2.offsetWidth + resizor1.offsetWidth;

                if (moveLen < 100) moveLen = 100;
                if (moveLen > maxR - 100) moveLen = maxR - 100;

                resizor2.style.left = resizor1.left + moveLen - 3 + "px";
                middle.style.width = resizor1.left + moveLen - left.clientWidth + "px";
                right.style.width = (container.clientWidth - resizor1.left - moveLen) + "px";
                //將middle的左側位置設定為left區塊的寬
                middle.style.left = left.style.width;

                // percentage
                resizor2.style.left = ((resizor1.left + moveLen - 3) / maxWidth) * 100 + "%";
                middle.style.width = ((resizor1.left + moveLen - left.clientWidth) / maxWidth) * 100 + "%";
                right.style.width = ((container.clientWidth - resizor1.left - moveLen) / maxWidth) * 100 + "%";
                //將middle的左側位置設定為left區塊的寬
                middle.style.left = left.style.width;

            }
            document.onmouseup = function (evt) {
                document.onmousemove = null;
                document.onmoveup = null;
                resizor2.releaseCapture && resizor2.releaseCapture();
            }
            resizor2.setCapture && resizor2.Capture();
            return false;
        }

        return false;
    },

    //     $("#cb_0").click(function () {
    //         checkbox();
    //     });

    //     $("#cb_1").click(function () {
    //         checkbox();
    //     });

    //     $("#cb_2").click(function () {
    //         checkbox();
    //     });

    checkBox: function checkbox(matrix, lastArea) {
        let left = document.getElementById("sourceArea");
        let resizor1 = document.getElementById("resizor1");
        let middle = document.getElementById("editPanelArea");
        let resizor2 = document.getElementById("resizor2");
        let right = document.getElementById("treeArea");

        if (matrix[0] === true && matrix[1] === true && matrix[2] === true) {
            left.style.display = "block";
            left.style.width = 33 + "%";
            left.style.left = 0 + "%";

            resizor1.style.display = "block";
            resizor1.style.width = 0.5 + "%";
            resizor1.style.left = 33 + "%";

            middle.style.display = "block";
            middle.style.width = 33 + "%";
            middle.style.left = 33.5 + "%";

            resizor2.style.display = "block";
            resizor2.style.width = 0.5 + "%";
            resizor2.style.left = 66.5 + "%";

            right.style.display = "block";
            right.style.width = 33 + "%";
            right.style.right = 0 + "%";

            lastArea = '';

        } else if (matrix[0] === true && matrix[1] === true && matrix[2] === false) {
            left.style.display = "block";
            left.style.width = 50 + "%";
            left.style.left = 0 + "%";

            resizor1.style.display = "block";
            resizor1.style.width = 0.5 + "%";
            resizor1.style.left = 49.75 + "%";

            middle.style.display = "block";
            middle.style.width = 50 + "%";
            middle.style.left = 50 + "%";

            resizor2.style.display = "none";
            resizor2.style.width = 0 + "%";

            right.style.display = "none";
            right.style.width = 0 + "%";

            lastArea = '';

        } else if (matrix[0] === true && matrix[1] === false && matrix[2] === true) {
            left.style.display = "block";
            left.style.width = 50 + "%";
            left.style.left = 0 + "%";

            resizor1.style.display = "block";
            resizor1.style.width = 0.5 + "%";
            resizor1.style.left = 49.75 + "%";

            middle.style.display = "none";
            middle.style.width = 0 + "%";

            resizor2.style.display = "block";
            resizor2.style.width = 0.5 + "%";
            resizor2.style.left = 49.75 + "%";

            right.style.display = "block";
            right.style.width = 50 + "%";
            right.style.right = 0 + "%";

            lastArea = '';

        } else if (matrix[0] === false && matrix[1] === true && matrix[2] === true) {
            left.style.display = "none";
            left.style.width = 0 + "%";

            resizor1.style.display = "none";
            resizor1.style.width = 0 + "%";

            middle.style.display = "block";
            middle.style.width = 50 + "%";
            middle.style.left = 0 + "%";

            resizor2.style.display = "block";
            resizor2.style.width = 0.5 + "%";
            resizor2.style.left = 49.75 + "%";

            right.style.display = "block";
            right.style.width = 50 + "%";
            right.style.right = 0 + "%";

            lastArea = '';

        } else if (matrix[0] === true && matrix[1] === false && matrix[2] === false) {
            left.style.display = "block";
            left.style.width = 100 + "%";
            left.style.left = 0 + "%";

            resizor1.style.display = "none";
            resizor1.style.width = 0 + "%";

            middle.style.display = "none";
            middle.style.width = 0 + "%";

            resizor2.style.display = "none";
            resizor2.style.width = 0 + "%";

            right.style.display = "none";
            right.style.width = 0 + "%";

            lastArea = 'source';

        } else if (matrix[0] === false && matrix[1] === true && matrix[2] === false) {
            left.style.display = "none";
            left.style.width = 0 + "%";

            resizor1.style.display = "none";
            resizor1.style.width = 0 + "%";

            middle.style.display = "block";
            middle.style.width = 100 + "%";
            middle.style.left = 0 + "%";

            resizor2.style.display = "none";
            resizor2.style.width = 0 + "%";

            right.style.display = "none";
            right.style.width = 0 + "%";

            lastArea = 'edit';

        } else if (matrix[0] === false && matrix[1] === false && matrix[2] === true) {
            left.style.display = "none";
            left.style.width = 0 + "%";

            resizor1.style.display = "none";
            resizor1.style.width = 0 + "%";

            middle.style.display = "none";
            middle.style.width = 0 + "%";

            resizor2.style.display = "none";
            resizor2.style.width = 0 + "%";

            right.style.display = "block";
            right.style.width = 100 + "%";
            right.style.right = 0 + "%";

            lastArea = 'tree';

        } 
        // else if (matrix[0] === false && matrix[1] === false && matrix[2] === false) {
            // this.lastArea = [];
            // window.alert("不能全部不選");
        // }
        return lastArea;
    }
}