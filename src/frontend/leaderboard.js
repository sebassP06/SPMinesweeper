import config from './env.js';

export let allTablesArr = [];

async function login() {
  const url = config.MY_URL+"login";
  const formData = new FormData();
  formData.append("username", config.MY_USER);
  formData.append("password", config.MY_PASS);
  try {
      const response = await fetch(url, {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
      console.error(error.message);
  }
    
}

async function get_table(token, tableName){
  const url = config.MY_URL+tableName;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization' : `Bearer ${token}`
        }
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

async function get_all(key){
  try{  
    const easy = await get_table(key.access_token, "easy/");
    const medium = await get_table(key.access_token, "medium/");
    const hard = await get_table(key.access_token, "hard/");
    return [easy, medium, hard];
  }
  catch(error){
    console.error("One of the requests failed", error);
  }
}

function fill_Column(table, col){
  for(let row = 1; row < table.length + 1; row++){
    const dataCell1 = document.getElementById(`${row} ${col}`);
    dataCell1.textContent = table[row-1].username;
    const dataCell2 = document.getElementById(`${row} ${col+1}`);
    dataCell2.textContent = table[row-1].time_data;
  }
}

function fill_Table(tableArr){
  let col = 1;
  for(const table of tableArr){
    fill_Column(table, col);
    col += 2;
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
  const key = await login();
  const url = config.MY_URL+tableName+'/';

  const userData = {
    username: username,
    time_data: timeData,
  }
  /* const formData = new FormData();
  formData.append("username", username);
  formData.append("time_data", timeData); */
  try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Authorization' : `Bearer ${key.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json());
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    document.getElementById('winnerForm').replaceChildren();
    
  } catch (error) {
      console.error(error.message);
  }
}


async function main() {
  let count = 0;
  const loadingId = setInterval(() => {
    count = loading(count);
  }, 1000);

  const key = await login();
  allTablesArr = await get_all(key);
  fill_Table(allTablesArr);
  
  clearInterval(loadingId);
  document.querySelector('#loading').hidden = true;
  document.querySelector('table').hidden = false;
}

main();
