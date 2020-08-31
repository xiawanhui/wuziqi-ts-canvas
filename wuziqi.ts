/**画布 */
var myCanvas = document.querySelector('#qipan') as HTMLCanvasElement;
/**悔棋按钮 */
var btnhui = document.querySelector('.btnhui') as HTMLDivElement;
/**撤销按钮 */
var btnche = document.querySelector('.btnche') as HTMLDivElement;
/**重置按钮 */
var btncz = document.querySelector('.btncz') as HTMLDivElement;
/**撤棋状态； */
var cheqi: boolean = false ;
/**悔棋状态； */
var huiqi: boolean = false ;
/**格子的尺寸的数量 */
var size: number = 25, sizeNumber: number = 21;
/**圆的半径 */
var r: number = 10;
/**最后一步的位置信息 */
var weizi: number[] = [0, 0];
/**棋子颜色类型 */
type Pawn = 0|1|3; 
/**下棋颜色，1是红色，0是黑色； */
var qiziColor: Pawn = 1;
/**棋盘上位置的颜色信息 */
var qiziColorData: Pawn[][] = new Array(sizeNumber);
for (var i = 0; i < sizeNumber; i++) {
    qiziColorData[i] = new Array(sizeNumber);
}
for (var n = 0; n < sizeNumber; n++) {
    for (var m = 0; m < sizeNumber; m++) {
        qiziColorData[n][m] = 3;
    }
}
var ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;
/**
 * 绘制棋盘
 */
function qipan(): void {
    for (i = 0; i < sizeNumber; i++) {
        ctx.beginPath();
        ctx.moveTo(0, size * i);
        ctx.lineTo(500, size * i);
        ctx.moveTo(size * i, 0);
        ctx.lineTo(size * i, 500);
        ctx.stroke();
        ctx.closePath();
    }
}
qipan();
/**
 *绘制棋子
 * @param row x轴坐标
 * @param col y轴坐标
 * @param color 棋子颜色 
 */
function qizi(row: number, col: number, color: string): void {
    ctx.beginPath();
    ctx.arc(row, col, r, 0, 2 * Math.PI)
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
/**
 * 下棋
 * @param e 事件
 */
myCanvas.onclick = function (e: MouseEvent): void {
    var x: number = e.clientX - myCanvas.offsetLeft;
    var y: number = e.clientY - myCanvas.offsetTop;
    var i: number = Math.round(x / size);
    var j: number = Math.round(y / size);
    weizi = [i, j];
    if (qiziColorData[i][j] == 3) {
        if (qiziColor) {
            qizi(i * size, j * size, 'red');
            qiziColor = 0;
            qiziColorData[i][j] = 1;
        } else {
            qizi(i * size, j * size, 'black');
            qiziColor = 1;
            qiziColorData[i][j] = 0;
        }
    }
    judge(i, j) //判断输赢
    cheqi = false;
    huiqi = true;
}
/**
 * 悔棋
 */
btnhui.onclick = function (): void {
    if (huiqi == true) {
        ctx.clearRect(weizi[0] * size - r, weizi[1] * size - r, size, size);
        ctx.beginPath();

        ctx.moveTo((weizi[0] - 1) * size, weizi[1] * size)
        ctx.lineTo((weizi[0] + 1) * size, weizi[1] * size)

        ctx.moveTo(weizi[0] * size, (weizi[1] - 1) * size)
        ctx.lineTo(weizi[0] * size, (weizi[1] + 1) * size)

        ctx.stroke();
        ctx.closePath;
        qiziColor = qiziColor == 1 ? 0 : 1;
        cheqi = true;
        qiziColorData[weizi[0]][weizi[1]] = 3;
    }

}
/**
 * 撤销悔棋
 */
btnche.onclick = function (): void {
    if (cheqi == true) {
        ctx.beginPath();
        ctx.arc(weizi[0] * size, weizi[1] * size, r, 0, 2 * Math.PI)
        if (qiziColor == 1) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }
        ctx.fill();
        ctx.closePath();
        qiziColorData[weizi[0]][weizi[1]] = qiziColor;
        qiziColor = qiziColor == 1 ? 0 : 1
        cheqi = false;
    }
}
btncz.onclick = function (): void {
    ctx.clearRect(0, 0, 500, 500);
    qipan();
}
/**
 * 输赢的逻辑
 * @param row x轴 
 * @param col y轴 
 */

function judge(row: number, col: number): void {
    const directionData: Array<any> = [
        [-1, 0], [1, 0],//x轴
        [0, -1], [0, 1],//y轴
        [-1, 1], [1, -1],//左上到右下
        [-1, -1], [1, 1]//左下到右上
    ]
    for (let i = 0; i < 8; i++) {
        let color = qiziColorData[row][col];
        let nextX = 0, nextY = 0, offsetX = 0, offsetY = 0;
        let count = 1;
        if (i % 2 == 0) {
            count = 1;
        }
        [offsetX, offsetY] = directionData.pop();
        nextX = row;
        nextY = col;
        while (nextX + offsetX >= 0 && nextX + offsetX < 21 &&
            nextY + offsetY >= 0 && nextY + offsetY < 21 &&
            qiziColorData[nextX += offsetX][nextY += offsetY] == color) {
            count++;
        }
        if (count >= 5) {
            setTimeout(() => alert(`恭喜${'黑红'[color]}色棋子获胜!`));
            break;
        }
    }
}