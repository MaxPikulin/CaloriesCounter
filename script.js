/* Рахівник калорійності страв 2.0
Визначити які функції знадобляться
*/

//При завантаженні сторінки або оновлені - заповнювати поля останнім рецептом.
//vars
const container = document.querySelector('.container');
const lineDiv = function() {
  let div = document.createElement('div');
  div.innerHTML =
`<div class="line">
  <input class="productName" />
  <input class="calFor100g" />
  <input class="carbsFor100g" />
  <input class="weight" />
  <div class="totalWeight"></div>
  <button><i class="material-icons mi-clear">clear</i></button>
</div>`;
  return div.firstElementChild.cloneNode(true);
};

function loadLastRecipeFromStorage() {
  let lastRecipe = localStorage.getItem('lastRecipe');
  lastRecipe = fromStorageJSONtoObject(lastRecipe);
}

function fromStorageJSONtoObject(json) {
  let recipeObject = {info:{}};
  let array = JSON.parse(json);
  recipeObject.info.timestamp = array[0][0] || '';
  recipeObject.info.recipeName = array[0][1] || '';
  recipeObject.info.usageCounter = array[0][2] || '';
  recipeObject.info.lastUsage = array[0][3] || '';
  recipeObject.info.recipeText = array[0][4] || '';
  array.splice(0, 1);
  array.forEach((line, index) => recipeObject[line + index] = line);
  return recipeObject;
}

function fromObjectToJSONstorage(recipeObject) {
  let json = [[]];
  json[0][0] = recipeObject.info.timestamp || '';
  json[0][1] = recipeObject.info.recipeName || '';
  json[0][2] = recipeObject.info.usageCounter || '';
  json[0][3] = recipeObject.info.lastUsage || '';
  json[0][4] = recipeObject.info.recipeText || '';
  delete recipeObject.info;
  for (let line in recipeObject) {
    json.push(recipeObject[line]);
  }
  return JSON.stringify(json);
}

function recipeObjectToPage(recipeObject) {
  //Заповнює всі потрібні форми з поля інфо, сортує лінії по номеру і ітерує по ним.
}

function pageToRecipeObject() {
  //forEach(lineToArray(div))
}

function lineToArray(div) {
  let array = [
    div.dataset.number,
    div.querySelector('.productName').value,
    div.querySelector('.calFor100g').value,
    div.querySelector('.carbsFor100g').value,
    div.querySelector('.weight').value
  ];
  return array;
}

function arrayToLine(array, div = lineDiv()) {
  div.dataset.number = array[0];
  div.querySelector('.productName').value = array[1];
  div.querySelector('.calFor100g').value = array[2];
  div.querySelector('.carbsFor100g').value = array[3];
  div.querySelector('.weight').value = array[4];
  return div;
}

function loadHistoryRecipies() {

}

//Зберігання рецепту в localStorage.
function saveRecipeToLocalStorage() {

}


//Додавання нової стоки в рецепт і на сторінку.
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
  } else if (classList.contains('mi-clear')) {
    removeLineFromPage(e.target.closest('.line'));
  } else if (classList.contains('btn')) {

  }
}


//eventListeners
// document.querySelector('.new-line').addEventListener('click', addNewLineOnPageHelper);
document.body.addEventListener('click', clickOnPageHandler);
