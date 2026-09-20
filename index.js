/* let easyBtPushed = false, medBtPushed = false, hardBtPushed = false; */
const EASYHEIGHT = 9, EASYWIDTH = 9;
const MEDHEIGHT = 16, MEDWIDTH = 16;
const HARDHEIGHT = 16, HARDWIDTH = 30;
const EASYMINES = 10, MEDMINES = 40, HARDMINES = 99;
const BUFFERSIZE = 2;

let winorlose = false;
let resetTable = false;
let mineCt = 0;
let flagCt = 0;
let boxCt = 0;
let timer, sec = 0;
let firstClick = true;
let mouseTimer;
let regexp = /android|iphone|kindle|ipad/i;

const containerDiv = document.querySelector('.container');

class box {
    constructor(num){
        this.bx = document.createElement('button');
        this.bx.setAttribute('class', 'box blank');
        this.bx.setAttribute('id', num);
    }
}

function createTable(arr) {
    const colDiv = document.createElement('div');
    colDiv.setAttribute('class', 'col');
    document.querySelector('.table').appendChild(colDiv);
    let boxCtr = 1;
    for(let i=0;i < arr.length-BUFFERSIZE; i++){
        const rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'row');
        colDiv.append(rowDiv);
        for(let j=0; j < arr[i].length-BUFFERSIZE; j++){
                const boxes = new box(boxCtr++);
                rowDiv.appendChild(boxes.bx);
        }
    }
    const btArr = document.querySelectorAll('.box');
    btArr.forEach(bt => {
        if(regexp.test(navigator.userAgent))//checking if mobile else desktop
            bt.addEventListener('pointerdown', () => {createFlagOnHold(bt)});
        bt.addEventListener('pointerup', (e) => {removebt(e, bt, arr)});
        });
    resetTable = true;
}

function refresh() {
    containerDiv.setAttribute('style', 'width:260px');
    const arr = create2DArray(EASYWIDTH, EASYHEIGHT);
    boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - EASYMINES;
    assignMines(EASYMINES, arr);
    assignNums(arr);
    createTable(arr);
}

function startGame() {
    const dropdwnbtArr = document.querySelectorAll('.dropdwnbt');
    dropdwnbtArr.forEach(bt => {
        bt.addEventListener('pointerup', initArr);});
}

function initArr(event){
    firstClick = true;
    document.querySelector('#reset').querySelector('img').setAttribute('src', './smiley-face.gif');
    if(winorlose){
        document.querySelector('.table').removeAttribute('style');
        winorlose = false;
    }
    if(resetTable){
        document.querySelector('.col').remove();
        flagCt = 0;
        sec = 0;
    }
    stopClock();
    displayTimer();
    if(event.target.textContent == 'Easy'){
        containerDiv.setAttribute('style', 'width:260px');
        const arr = create2DArray(EASYWIDTH, EASYHEIGHT);
        boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - EASYMINES;
        assignMines(EASYMINES, arr);
        assignNums(arr);
        createTable(arr);
        //console.log(arr);
    }
    else if(event.target.textContent == 'Medium'){
        containerDiv.setAttribute('style', 'width:440px');
        const arr = create2DArray(MEDWIDTH, MEDHEIGHT);
        boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - MEDMINES;
        assignMines(MEDMINES, arr);
        assignNums(arr);
        createTable(arr);
    }
    else if(event.target.textContent == 'Hard'){
        containerDiv.setAttribute('style', 'width:805px');
        const arr = create2DArray(HARDWIDTH, HARDHEIGHT);
        boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - HARDMINES;
        assignMines(HARDMINES, arr);
        assignNums(arr);
        createTable(arr);
        //console.log(arr);
    }
}

function createFlagOnHold(bt){
    mouseTimer = window.setTimeout(createFlag,750, bt);
}

function createFlag(bt){
    if(bt.querySelector('img')){
        flagCt++;
        bt.querySelector('img').remove();
        bt.setAttribute('class', 'box blank');
        window.clearTimeout(mouseTimer);
        }
    else if(!(bt.className == "empty")){
        flagCt--;
        bt.setAttribute('class', 'box flag');
        const img = document.createElement('img');
        img.setAttribute('src', './flag1.jpg');
        bt.appendChild(img);
    }
    displayFlag();
}

function removebt(ev, bt, arr) {
    switch(ev.button){
        case 0: //left-click
            if(mouseTimer || !regexp.test(navigator.userAgent)){
                if(bt.querySelector('img'))
                    break;
                else{
                    startClock();
                    displayNum(arr, bt);
                }
            }
            break;
        case 2: //right-click
            createFlag(bt);
            break;
    }
    if (mouseTimer) window.clearTimeout(mouseTimer);
}

function create2DArray(width, height) {
    arr = [];
    for(let i=0;i < height+BUFFERSIZE; i++){
        arr[i] = [];
        for(let j=0;j < width+BUFFERSIZE; j++){
            arr[i].push(0);
        }
    }
    return arr;
}

function assignMines(mines, arr) {
    let randNum;
    if(flagCt == 0){
        if(mines < 100)
            document.querySelector('#flagct').textContent = '0'+mines;
        else
           document.querySelector('#flagct').textContent = mines;
        flagCt = mines; 
    }
    for(let i=1;i < arr.length-1; i++){
        for(let j=1; j < arr[i].length-1;j++){
            randNum = Math.floor(Math.random() * (mines));
            if(randNum == (mines - 1) && arr[i][j] != -1){
                arr[i][j] = -1;
                mineCt++;
            }
            if(mineCt == mines){
                mineCt = 0;
                return;
            }
        }
    }
    if(mineCt < mines)
        assignMines(mines, arr);
}

function assignNums(arr) {
    let numCt = 0;
    for(let i=1, row=1;i < arr.length-1; i++, row++){
        for(let j=1, col=1; j < arr[i].length-1;j++, col++){
            if(arr[i][j] == -1)
                continue;
            else{
                for(let k=0;k < 8;k++){
                    switch(k){
                        case 0:
                            col++;
                            break;
                        case 1:
                            row--;
                            break;
                        case 2:
                            col--;
                            break;
                        case 3:
                            col--;
                            break;
                        case 4:
                            row++;
                            break;
                        case 5:
                            row++;
                            break;
                        case 6:
                            col++;
                            break;
                        case 7:
                            col++;
                            break;
                    }
                    if(arr[row][col] == -1)
                        numCt++;
                }
                arr[i][j] = numCt;
                row--;
                col--;
                numCt = 0;
            }
        }
    }
}

function displayFlag() {
    const flagbt = document.querySelector('#flagct');
    if(flagCt < 0)
        flagbt.textContent = '000';
    else if(flagCt < 10)
        flagbt.textContent = '00'+flagCt;
    else if(flagCt < 100){
        flagbt.textContent = '0'+flagCt;
    }
    else{
        flagbt.textContent = flagCt;
    }
}

function gameWin() {
    stopClock();
    const resetbt = document.querySelector('#reset');
    resetbt.querySelector('img').setAttribute('src', './smiley-win.png');
    document.querySelector('.table').setAttribute('style', 'pointer-events: none;');
    winorlose = true;
    
}

function gameOver(arr, bt) {
    stopClock();
    const resetbt = document.querySelector('#reset');
    bt.setAttribute('class', 'mine');
    bt.setAttribute('style', 'background-color: red; border: 0px; padding: 0px;');
    const img = document.createElement('img');
    img.setAttribute('style', 'width: 26px; height: 26px');
    img.setAttribute('src', './Mine-loss.png');
    bt.appendChild(img);
    document.querySelector('.table').setAttribute('style', 'pointer-events: none;');
    resetbt.querySelector('img').setAttribute('src', './smiley-loss.png');
    const btArr = document.querySelectorAll('.box');
    btArr.forEach(but => {
        const row = Math.ceil((Number)(but.id) / (arr[0].length-BUFFERSIZE));
        let col = (Number)(but.id) % (arr[0].length-BUFFERSIZE);
        if(col == 0)
            col = arr[0].length-BUFFERSIZE;
        if(arr[row][col] == -1){
            if(!but.querySelector('img')){
                but.setAttribute('class', 'mine');
                const img = document.createElement('img');
                img.setAttribute('src', './Mine.png');
                but.appendChild(img);
            }
        }
    });
    winorlose = true;
}


function displayNum(arr, bt){
    const btID = bt.id;
    let row = Math.ceil((Number)(bt.id) / (arr[0].length-BUFFERSIZE));
    let col = (Number)(bt.id) % (arr[0].length-BUFFERSIZE);
    if(col == 0)
        col = arr[0].length-BUFFERSIZE;
    if(arr[row][col] == -1 && firstClick){
        let randCol = Math.floor(Math.random() * (arr[0].length-BUFFERSIZE-1)+1);
        while(arr[row][randCol] == -1){
            randCol = Math.floor(Math.random() * (arr[0].length-BUFFERSIZE-1)+1);
        }
        arr[row][col] = 0;
        arr[row][randCol] = -1;
        assignNums(arr);
    }
    if(arr[row][col] == -1){
        gameOver(arr, bt);
        return;
    }
    else if(arr[row][col] > 0){
        bt.textContent = arr[row][col];
        styleNum(arr[row][col], bt);
    }
    else if(arr[row][col] == 0){ //remove all boxes that contain 0
        reveal(arr, row, col);
        boxCt++;
    }
    if(firstClick)
        firstClick = false;
    boxCt--;
    if(boxCt == 0)
        gameWin();
    bt.setAttribute('class', 'empty');
    bt.setAttribute('id', btID);
}

function reveal(arr, row, col){
    if(!isInBounds(row, col, arr) || document.getElementById(row*(arr[0].length-BUFFERSIZE) - (arr[0].length-BUFFERSIZE+1-col-1)).className == 'empty')
        return;
    const but = document.getElementById(row*(arr[0].length-BUFFERSIZE) - (arr[0].length-BUFFERSIZE+1-col-1));
    if(but.querySelector('img')){
        but.querySelector('img').remove();
        flagCt++;
        displayFlag();
    }
    but.setAttribute('class', 'empty');
    if(arr[row][col] > 0){
        but.textContent = arr[row][col];
        styleNum(arr[row][col], but);
    }
    if(arr[row][col] == 0){
        for(let k=0;k < 8;k++){
                    switch(k){
                        case 0:
                            reveal(arr, row, col+1);
                            break;
                        case 1:
                            reveal(arr, row-1, col+1);
                            break;
                        case 2:
                            reveal(arr, row-1, col);
                            break;
                        case 3:
                            reveal(arr, row-1, col-1);
                            break;
                        case 4:
                            reveal(arr, row, col-1);
                            break;
                        case 5:
                            reveal(arr, row+1, col-1);
                            break;
                        case 6:
                            reveal(arr, row+1, col);
                            break;
                        case 7:
                            reveal(arr, row+1, col+1);
                            break;
                    }
        }
    }
    boxCt--;
}

function isInBounds(row, col, arr){
    if(row < 1 || col < 1 || row > (arr.length-BUFFERSIZE) || col > (arr[0].length-BUFFERSIZE))
        return false;
    else
        return true;
}

function styleNum(num, bt){
    switch(num){
            case 1:
                bt.setAttribute('style', 'color: blue;');
                break;
            case 2:
                bt.setAttribute('style', 'color: green;');
                break;
            case 3:
                bt.setAttribute('style', 'color: red;');
                break;
            case 4:
                bt.setAttribute('style', 'color: navy;');
                break;
            case 5:
                bt.setAttribute('style', 'color: #800508;');
                break;
            case 6:
                bt.setAttribute('style', 'color: cyan;');
                break;
            case 7:
                bt.setAttribute('style', 'color: black;');
                break;
            default:
                bt.setAttribute('style', 'color: #7F7F7F;');
                break;
    }
}

function startClock() {
    if(!timer)
        timer = setInterval(incTimer, 1000);
}

function incTimer(){
    sec++;
    displayTimer();
}

function stopClock(){
    clearInterval(timer);
    timer = undefined;
}

function displayTimer(){
    const timebt = document.getElementById('time');
    if(sec < 10)
        timebt.textContent = '00'+sec;
    else if(sec < 100){
        timebt.textContent = '0'+sec;
    }
    else if(sec < 1000){
        timebt.textContent = sec;
    }
    else{
        stopClock();
    }
}

refresh();
startGame();