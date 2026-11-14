
export let allTablesArr = [];

async function get_tables(){
  const url = '/api/all';
    try {
      const response = await fetch(url, {
        method: "GET"
    });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const tableArr = await response.json();
      return tableArr;
    }
    catch (error) {
      console.error(error.message);
    }
}

function fill_Table(tableArr){
  let col = 1, row = 1;
  let difficulty = 'easy';
  for(let i = 0;i < tableArr.length;i++){
    if(difficulty != tableArr[i].difficulty){
      difficulty = tableArr[i].difficulty;
      col += 2;
      row = 1;
    }
    const dataCell1 = document.getElementById(`${row} ${col}`);
    dataCell1.textContent = tableArr[i].username;
    const dataCell2 = document.getElementById(`${row} ${col+1}`);
    dataCell2.textContent = tableArr[i].time_data;
    row++;
  }
}

function loading(count){
  const loadingElement = document.querySelector('#loading');
  if(count % 4 == 0){
    loadingElement.textContent = "Loading"
  }
  else{
  loadingElement.textContent = loadingElement.textContent+"."
  }
  return ++count;
}

function global(){
  document.getElementById('global').disabled = true;
  document.getElementById('personal').disabled = false;
  document.querySelector("#ptablediv").hidden = true;
  document.getElementById("registerorlogin").hidden = true;
  document.querySelector("#gtable").hidden = false;
}

function personal(){
  document.getElementById('personal').disabled = true;
  document.getElementById('global').disabled = false;
  document.getElementById("gtable").hidden = true;
  document.getElementById("ptablediv").hidden = false;
  document.getElementById("registerorlogin").hidden = false;

}

export function createForm(tableName, timeData){
  const formDiv = document.getElementById('winnerForm');
  const pDiv = document.createElement('p')
  pDiv.setAttribute('style', 'color:white');
  pDiv.textContent = "Congratulations!! Your score is within the 10 top. Would you like to submit your score to the leaderboard?";
  formDiv.append(pDiv);

  const form = document.createElement('form');

  const input1 = document.createElement('input');
  input1.setAttribute('type', 'text');
  input1.setAttribute('id', 'uname');
  input1.setAttribute('name', 'uname');
  input1.setAttribute('placeholder', 'Username');
  input1.required = true;

  const input2 = document.createElement('input');
  input2.setAttribute('type', 'submit');
  input2.setAttribute('name', 'submit');
  input2.setAttribute('id', 'submit');

  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('id', 'cancel');
  cancelButton.textContent = 'Cancel';
  
  form.append(input1);
  form.append(input2);
  form.append(cancelButton);

  formDiv.append(form);
  //formDiv.append(cancelButton);

  form.addEventListener('submit', (e) => submit(e, tableName.toLowerCase(), timeData));
  cancelButton.addEventListener('pointerup',(e) => cancel(e));

}

function cancel(event){
  event.preventDefault();
  document.getElementById('winnerForm').replaceChildren();
}

async function submit(event, tableName, timeData){
  event.preventDefault();
  const username = document.getElementById('uname').value;
  const url = '/api/'+tableName+'/';

  const userData = {
    username: username,
    time_data: timeData,
  }
  document.getElementById('winnerForm').replaceChildren();
  try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    //console.log(await response.json());
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    
  } catch (error) {
      console.error(error.message);
  }
}

function refresh(){
  if(document.querySelector('#loading').hidden || !(allTablesArr[0] == null)){
    document.querySelector('#gtable').style.removeProperty('filter');
    document.querySelector('#loading').hidden = false;
    main();
  }

}

async function main() {
  let count = 0;
  const loadingId = setInterval(() => {
    count = loading(count);
  }, 1000);

  allTablesArr = await get_tables();
  fill_Table(allTablesArr);
  clearInterval(loadingId);
  document.querySelector('#gtable').style.removeProperty('filter');
  document.querySelector('#loading').hidden = true;

}

const personalBt = document.getElementById('personal');
personalBt.addEventListener('pointerdown', () => personal());
const globalBt = document.getElementById('global');
globalBt.addEventListener('pointerdown', () => global());
main();
const refreshBt = document.getElementById('refresh');
refreshBt.addEventListener('pointerup',() => refresh());

