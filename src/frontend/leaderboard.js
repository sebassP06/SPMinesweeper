import config from './env.js';
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
  loadingElement.textContent = loadingElement.textContent+"."
  return ++count;
}

async function main() {
  let count = 0;
  const loadingId = setInterval(() => {
    count = loading(count);
  }, 1000);

  await login().then((key) => {
    get_all(key).then((result) => {
      fill_Table(result);
    })
  });
  clearInterval(loadingId);
  document.querySelector('#loading').hidden = true;
  document.querySelector('table').hidden = false;
}

main();