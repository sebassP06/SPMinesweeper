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
    let boxCt = 1;
    for(let i=0;i < arr.length-BUFFERSIZE; i++){
        const rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'row');
        colDiv.append(rowDiv);
        for(let j=0; j < arr[i].length-BUFFERSIZE; j++){
                const boxes = new box(boxCt++);
                rowDiv.appendChild(boxes.bx);
        }
    }
    const btArr = document.querySelectorAll('.box');
    btArr.forEach(bt => {
        bt.addEventListener('mousedown', (e) => {removebt(e, bt, arr)});
        });
    resetTable = true;
}

function refresh() {
    containerDiv.setAttribute('style', 'width:260px');
    const arr = create2DArray(EASYWIDTH, EASYHEIGHT);
    boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - EASYMINES;
    createTable(arr);
    assignMines(EASYMINES, arr);
}

function startGame() {
    const dropdwnbtArr = document.querySelectorAll('.dropdwnbt');
    dropdwnbtArr.forEach(bt => {
        bt.addEventListener('mouseup', initArr);});
}

function initArr(event){
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
        createTable(arr);
        assignMines(EASYMINES, arr);
        //console.log(arr);
    }
    else if(event.target.textContent == 'Medium'){
        containerDiv.setAttribute('style', 'width:440px');
        const arr = create2DArray(MEDWIDTH, MEDHEIGHT);
        boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - MEDMINES;
        createTable(arr);
        assignMines(MEDMINES, arr);
    }
    else if(event.target.textContent == 'Hard'){
        containerDiv.setAttribute('style', 'width:805px');
        const arr = create2DArray(HARDWIDTH, HARDHEIGHT);
        boxCt = (arr.length-BUFFERSIZE) * (arr[0].length-BUFFERSIZE) - HARDMINES;
        createTable(arr);
        assignMines(HARDMINES, arr);
        //console.log(arr);
    }
}

function removebt(ev, bt, arr) {
    switch(ev.button){
        case 0:
            if(bt.querySelector('img'))
                break;
            else{
                startClock();
                createDiv(arr, bt);
            }
            break;
        case 2:
            if(bt.querySelector('img')){
                flagCt++;
                bt.querySelector('img').remove();
                bt.setAttribute('class', 'box blank');
                }
            else{
                flagCt--;
                bt.setAttribute('class', 'box flag');
                const img = document.createElement('img');
                img.setAttribute('src', './flag1.jpg');
                bt.appendChild(img);
            }
            displayFlag();
            break;
    }
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

function assignNums(arr, bt) {
    let row = Math.ceil((Number)(bt.id) / (arr[0].length-BUFFERSIZE));
    let col = (Number)(bt.id) % (arr[0].length-BUFFERSIZE);
    if(col == 0)
        col = arr[0].length-BUFFERSIZE;
    let numCt = 0;
    //console.log('Row '+row+' col '+col);
    if(arr[row][col] == -1){
        gameOver(arr, bt);
        return;
    }
    
    for(let i=0;i < 8;i++){
        switch(i){
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
    if(numCt != 0){
        bt.textContent = numCt;
        switch(numCt){
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

    boxCt--;
    if(boxCt == 0)
        gameWin();

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
    bt.setAttribute('style', 'background-color: red;');
    bt.textContent = '*';
    document.querySelector('.table').setAttribute('style', 'pointer-events: none;');
    resetbt.querySelector('img').setAttribute('src', './smiley-loss.png');
    const btArr = document.querySelectorAll('.box');
    btArr.forEach(but => {
        const row = Math.ceil((Number)(but.id) / (arr[0].length-BUFFERSIZE));
        let col = (Number)(but.id) % (arr[0].length-BUFFERSIZE);
        if(col == 0)
            col = arr[0].length-BUFFERSIZE;
        if(arr[row][col] == -1){
            const parentDiv = but.parentElement;
            const prevbt = but.previousSibling;
            but.remove();
            const newBt = document.createElement('div');
            newBt.setAttribute('class', 'mine');
            newBt.textContent = '*';
            if(prevbt == null)
                parentDiv.insertBefore(newBt, parentDiv.firstChild);
            else
                parentDiv.insertBefore(newBt, prevbt.nextSibling);
        }
    });
    winorlose = true;
}

function createDiv(arr, bt) {
    const parentDiv = bt.parentElement;
    const prevbt = bt.previousSibling;
    const btID = bt.id;
    bt.remove();
    bt = document.createElement('div');
    bt.setAttribute('class', 'empty');
    bt.setAttribute('id', btID);
    assignNums(arr, bt);
    if(prevbt == null)
        parentDiv.insertBefore(bt, parentDiv.firstChild);
    else
        parentDiv.insertBefore(bt, prevbt.nextSibling);
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