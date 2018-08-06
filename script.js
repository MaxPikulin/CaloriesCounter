/* Рахівник калорійності страв 2.0
Визначити які функції знадобляться
*/

//При завантаженні сторінки або оновлені - заповнювати поля останнім рецептом.
//vars
const container = document.querySelector('.container');
const linesLive = document.getElementsByClassName('line');
const resultsDiv = document.querySelector('.results');
const lineDiv = function() {
  let div = document.createElement('div');
  div.innerHTML =
`<div class="line">
  <input class="productName" />
  <input class="calFor100g" />
  <input class="carbsFor100g" />
  <input class="weight" />
  <div class="totalCarbs"></div>
  <div class="totalWeight"></div>
  <button class="removeLine"><i class="material-icons mi-clear">clear</i></button>
</div>`;
  return div.firstElementChild.cloneNode(true);
};

function loadLastRecipeFromStorage() {
  console.log('from loadLastRecipeFromStorage');
  let lastRecipe = localStorage.getItem('lastRecipe');
  lastRecipe = JSON.parse(lastRecipe);
  lastRecipe.splice(0, 1);
  lastRecipe.forEach(line => {
    let div = arrayToLine(line);
    addNewLineOnPage(div);
  });
  console.log(lastRecipe);
}

function saveLastRecipeToStorage() {
  let lastRecipe;
  lastRecipe = importantFieldsFromPage();
  console.log(lastRecipe);
  lastRecipe = fromObjectToJSONstorage(lastRecipe);
  localStorage.setItem('lastRecipe', lastRecipe);
}

function fromStorageJSONtoObject(json) {
  let recipeObject = {info:{}};
  let array = JSON.parse(json);
  recipeObject.info.timestamp = array[0][0] || '';
  recipeObject.info.recipeName = array[0][1] || '';
  recipeObject.info.usageCounter = array[0][2] || '';
  recipeObject.info.lastUsage = array[0][3] || '';
  recipeObject.info.recipeText = array[0][4] || '';
  recipeObject.info.calsFor100g = array[0][5] || '';
  recipeObject.info.carbsFor100g = array[0][6] || '';
  array.splice(0, 1);
  array.forEach((line, index) => recipeObject[index] = line);
  return recipeObject;
}

function fromObjectToJSONstorage(recipeObject) {
  let json = [[]];
  json[0][0] = recipeObject.info.timestamp || '';
  json[0][1] = recipeObject.info.recipeName || '';
  json[0][2] = recipeObject.info.usageCounter || '';
  json[0][3] = recipeObject.info.lastUsage || '';
  json[0][4] = recipeObject.info.recipeText || '';
  json[0][5] = recipeObject.info.calsFor100g || '';
  json[0][6] = recipeObject.info.carbsFor100g || '';
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
      timestamp: document.querySelector('.timestamp') ? document.querySelector('.timestamp').value : '99999',
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
    div.querySelector('.calFor100g').value,
    div.querySelector('.carbsFor100g').value,
    div.querySelector('.weight').value
  ];
  return array;
}

function arrayToLine(array, div = lineDiv()) {
  // div.dataset.number = array[0];
  div.querySelector('.productName').value = array[0];
  div.querySelector('.calFor100g').value = array[1];
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
function addNewLineOnPageHelper() {
  addNewLineOnPage();
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
  } else if (classList.contains('removeLine') || e.target.parentNode.classList.contains('removeLine')) {
    removeLineFromPage(e.target.closest('.line'));
  } else if (classList.contains('btn')) {

  }
}

function changeOnPageHandler(e) {
  // console.log(e);
}



//eventListeners
// document.querySelector('.new-line').addEventListener('click', addNewLineOnPageHelper);
document.body.addEventListener('click', clickOnPageHandler);
document.body.addEventListener('input', saveLastRecipeToStorage);
document.addEventListener('DOMContentLoaded', loadLastRecipeFromStorage);
// document.body.addEventListener('load', loadLastRecipeFromStorage);
