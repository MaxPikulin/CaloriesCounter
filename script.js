/* Рахівник калорійності страв 2.0
Визначити які функції знадобляться
*/

//При завантаженні сторінки або оновлені - заповнювати поля останнім рецептом.
//vars
const container = document.querySelector('.container');
const linesLive = document.getElementsByClassName('line');
const results = document.getElementById('results');
const resultsData = results.dataset;
const cookedWeightInput = document.querySelector('.cookedWeight');
const lineDiv = function() {
  let div = document.createElement('div');
  div.innerHTML =
`<div class="line">
  <input class="productName" />
  <input class="calsFor100g" />
  <input class="carbsFor100g" />
  <input class="weight" />
  <div class="totalCarbs"></div>
  <div class="totalCals"></div>
  <button class="removeLine"><i class="material-icons mi-clear">clear</i></button>
</div>`;
  return div.firstElementChild.cloneNode(true);
};
let currentRecipe = {};

function loadLastFromStorage() {
  currentRecipe = JSON.parse(localStorage.getItem('ccLastRecipe'));
}

function pagedataToRecipe() {
  let lines = document.querySelectorAll('.line');
  currentRecipe.cookedWt = cookedWeightInput.value;
  let arr = [];
  lines.forEach((line) => {
    arr.push(lineToObject(line));
  });
  currentRecipe.lines = arr;
}

function lineToObject(line) {
  let ln = {};
  ln.nm = line.querySelector('.productName').value;
  ln.kc = line.querySelector('.calsFor100g').value;
  ln.cb = line.querySelector('.carbsFor100g').value;
  ln.wt = line.querySelector('.weight').value;
  return ln;
}

function loadRecipeFromStorage(recipeTS) {
  console.log('from loadRecipeFromStorage');
  if (typeof recipeTS == 'object'){
    recipeTS = 'lastRecipe';
  }
  let recipe = localStorage.getItem(recipeTS);
  let lines = JSON.parse(recipe);
  lines.splice(0, 1);
  recipe = fromStorageJSONtoObject(recipe);
  //заповнюємо датасет на сторінці потрібною інфою.
  Object.keys(recipe.info).forEach(key => resultsData[key.toLowerCase()] = recipe.info[key]);
  lines.forEach(line => {
    let div = arrayToLine(line);
    addNewLineOnPage(div);
  });
  fromDatasetToFields();
  changeOnPageHandler();
  console.log(recipe);
}
function fromDatasetToFields() {
  results.querySelector('.cookedWeight').value = results.dataset.cookedweight;
}

function saveLastRecipeToStorage() {
  let lastRecipe;
  lastRecipe = importantFieldsFromPage();
  console.log(lastRecipe);
  lastRecipe = fromObjectToJSONstorage(lastRecipe);
  localStorage.setItem('lastRecipe', lastRecipe);
}

function fromStorageJSONtoObject(json) {
  let ccLastRecipe = {
    cookedWt: '',
    rows: [{
      nm: '',
      kc: '',
      cb: '',
      wt: '',
    },],
  };
  let recipeObject = {info:{}};
  let array = JSON.parse(json);
  recipeObject.info.timestamp = array[0][0] || '';
  recipeObject.info.recipeName = array[0][1] || '';
  recipeObject.info.cookedWeight = array[0][2] || '';
  recipeObject.info.usageCounter = array[0][3] || '';
  recipeObject.info.lastUsage = array[0][4] || '';
  recipeObject.info.recipeText = array[0][5] || '';
  recipeObject.info.calsFor100g = array[0][6] || '';
  recipeObject.info.carbsFor100g = array[0][7] || '';
  array.splice(0, 1);
  array.forEach((line, index) => recipeObject[index] = line);
  return recipeObject;
}

function fromObjectToJSONstorage(recipeObject) {
  let json = [[]];
  //не можемо просто запушити всі існуючі на resultsData елементи, бо нам потрібен чіткий порядок в масиві
  json[0][0] = recipeObject.info.timestamp || '';
  json[0][1] = recipeObject.info.recipeName || '';
  json[0][2] = recipeObject.info.cookedWeight || '';
  json[0][3] = recipeObject.info.usageCounter || '';
  json[0][4] = recipeObject.info.lastUsage || '';
  json[0][5] = recipeObject.info.recipeText || '';
  json[0][6] = recipeObject.info.calsFor100g || '';
  json[0][7] = recipeObject.info.carbsFor100g || '';
  delete recipeObject.info;
  for (let line in recipeObject) {
    json.push(recipeObject[line]);
  }
  return JSON.stringify(json);
}

function recipeObjectToPage(recipeObject) {
  //Заповнює всі потрібні форми з поля інфо, сортує лінії по номеру і ітерує по ним.
}

// function pageToRecipeObject() {
//   let recipeObject = {};
//   // Створюєм об"єкт, заносимо туди всі важливі поля і масиви, вертаємо.
//   //forEach(lineToArray(div))
//   console.log(linesLive);
// }

function importantFieldsFromPage() {
  let object = {
    info: {
      timestamp: resultsData.timestamp || '',
      cookedWeight: resultsData.cookedweight || '',
      // recipeName: document.querySelector('.recipeName').value || '',
      // usageCounter: document.querySelector('.usageCounter').value || '',
      // lastUsage: document.querySelector('.lastUsage').value || '',
      // recipeText: document.querySelector('.recipeText').value || '',
      // calsFor100g: document.querySelector('.calsFor100g').value || '',
      // carbsFor100g: document.querySelector('.carbsFor100g').value || '',
    },
  };
  Array.from(linesLive).forEach((line, index) => object[index] = lineToArray(line));
  return object;
}

function lineToArray(div) {
  let array = [
    // div.dataset.number,
    div.querySelector('.productName').value,
    div.querySelector('.calsFor100g').value,
    div.querySelector('.carbsFor100g').value,
    div.querySelector('.weight').value
  ];
  return array;
}

function arrayToLine(array, div = lineDiv()) {
  // div.dataset.number = array[0];
  div.querySelector('.productName').value = array[0];
  div.querySelector('.calsFor100g').value = array[1];
  div.querySelector('.carbsFor100g').value = array[2];
  div.querySelector('.weight').value = array[3];
  return div;
}

function loadHistoryRecipies() {

}

//Зберігання рецепту в localStorage.
function saveRecipeToLocalStorage() {

}


//Додавання нової стоки в рецепті на сторінку.
function addNewLineOnPage(div = lineDiv()) {
  container.appendChild(div.cloneNode(true));
}

function removeLineFromPage(div) {
  div.remove();
}

function clickOnPageHandler(e) {
  let classList = e.target.classList;
  if (classList.contains('new-line')) {
    let ts = +new Date();
    let newDiv = lineDiv();
    newDiv.dataset.number = ts;
    addNewLineOnPage(newDiv);
    changeOnPageHandler();
  } else if (classList.contains('removeLine') || e.target.parentNode.classList.contains('removeLine')) {
    removeLineFromPage(e.target.closest('.line'));
  } else if (classList.contains('btn')) {

  }
}

function changeOnPageHandler(e) {
  let recipeObject = {info:{}};
  let allWeight = 0;
  let allCals = 0;
  let allCarbs = 0;
  Array.from(linesLive).forEach((lineDiv, index) => {
    let array = countUpdateLine(lineDiv);
    allWeight += +array[3];
    allCarbs += +array[4];
    allCals += +array[5];
    recipeObject[index] = array;
  });
  recipeObject.info.allWeight = allWeight.toFixed(1);
  recipeObject.info.allCarbs = allCarbs.toFixed(1);
  recipeObject.info.allCals = allCals.toFixed(1);
  document.querySelector('.allWeight').textContent = allWeight.toFixed(1);
  document.querySelector('.allCarbs').textContent = allCarbs.toFixed(1);
  document.querySelector('.allCals').textContent = allCals.toFixed(1);

  saveLastRecipeToStorage();
}

function countUpdateLine(lineDiv) {
  let productName = lineDiv.querySelector('.productName').value || '';
  let calsFor100g = +lineDiv.querySelector('.calsFor100g').value || '';
  let carbsFor100g = +lineDiv.querySelector('.carbsFor100g').value || '';
  let weight = +lineDiv.querySelector('.weight').value || '';
  let totalCarbs = lineDiv.querySelector('.totalCarbs').value || '';
  let totalCals = lineDiv.querySelector('.totalCals').value || '';

  totalCarbs = +(carbsFor100g * (weight / 100)).toFixed(1);
  totalCals = +(calsFor100g * (weight / 100)).toFixed(1);

  lineDiv.querySelector('.totalCarbs').textContent = totalCarbs;
  lineDiv.querySelector('.totalCals').textContent = totalCals;
  let array = [productName, calsFor100g, carbsFor100g, weight, totalCarbs, totalCals];
  return array;
}



//eventListeners
// document.querySelector('.new-line').addEventListener('click', addNewLineOnPageHelper);
document.body.addEventListener('click', clickOnPageHandler);
document.body.addEventListener('input', changeOnPageHandler);
// document.body.addEventListener('input', saveLastRecipeToStorage);
document.addEventListener('DOMContentLoaded', loadRecipeFromStorage);
// document.body.addEventListener('load', loadLastRecipeFromStorage);
