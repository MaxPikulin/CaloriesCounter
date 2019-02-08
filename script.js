//vars
const saveRecipeBtn = document.querySelector('.saveRecipe');
const recipeName = document.querySelector('.recipeName');
const recipiesList = document.querySelector('.recipiesList');
const menuBtn = document.querySelector('.menu');
const allWeightDiv = document.querySelector('.allWeight');
const allCalsDiv = document.querySelector('.allCals');
const allCarbsDiv = document.querySelector('.allCarbs');
const container = document.querySelector('.container');
let lines = document.querySelectorAll('.line');
const results = document.querySelector('#results');
const cookedWeightInput = document.querySelector('.cookedWeight');
const lineDiv = function (ts = '', nm = '', kc = '', cb = '', wt = '', ttcb = '', ttkc = '') {
  let div = document.createElement('div');
  div.innerHTML =
    `<div class="line" data-ts="${ts}">
<input class="productName" value="${nm}"/>
<input class="calsFor100g" value="${kc}" type="tel"/>
<input class="carbsFor100g" value="${cb}" type="tel"/>
<input class="weight" value="${wt}" type="tel"/>
<div class="totalCarbs">${ttcb}</div>
<div class="totalCals">${ttkc}</div>
<button class="removeLine"><i class="material-icons mi-clear">clear</i></button>
</div>`;
  div = div.firstElementChild.cloneNode(true);
  return div;
};
let userData = {};
let calculations = {};
let recipies = [];

function loadLastFromStorage() {
  userData = JSON.parse(localStorage.getItem('ccLastRecipe')) || {};
  recipies = JSON.parse(localStorage.getItem('ccRecipies')) || [];
  populateRecipiesList(recipies);
  userDataToPage();
  updatePage();
}

function saveLastToStorage() {
  localStorage.setItem('ccLastRecipe', JSON.stringify(userData));
}

function userDataToPage() {
  if (userData.lines) {
    userData.lines.forEach((data) => {
      let line = lineDiv(data.ts, data.nm, data.kc, data.cb, data.wt, data.ttcb, data.ttkc);
      container.appendChild(line);
    });
  }
  cookedWeightInput.value = userData.cookedWt || '';
}

function updateUserData() {
  function lineTotals(data) {
    data.ttcb = (data.cb * data.wt / 100).toFixed(1);
    data.ttkc = Math.ceil(data.kc * data.wt / 100);
    return data;
  }
  function evCalc(str) {
    str = str.replace(/[^-()\d/*+.]/g, '');
    let result = str.replace(/[^\d]/g, '');
    try {
      result = eval(str);

    } catch (e) { }
    if (isNaN(result)) result = 0;
    return result;
  }
  let lines = document.querySelectorAll('.line');
  let linesArr = [];
  let totcb = 0;
  let totkc = 0;
  let totwt = 0;
  lines.forEach((line) => {
    let data = {
      ts: line.dataset.ts,
      nm: line.querySelector('.productName').value,
      kc: evCalc(line.querySelector('.calsFor100g').value),
      cb: evCalc(line.querySelector('.carbsFor100g').value),
      wt: evCalc(line.querySelector('.weight').value),
    };
    data = lineTotals(data);
    totcb += +data.ttcb;
    totkc += +data.ttkc;
    totwt += +data.wt;
    linesArr.push(data);
  });
  userData.lines = linesArr;
  userData.cookedWt = evCalc(cookedWeightInput.value);
  userData.totcb = totcb.toFixed(1);
  userData.totkc = Math.ceil(totkc);
  userData.totwt = Math.ceil(totwt);

}

function updatePage() {
  if (userData.lines) {
    userData.lines.forEach(line => {
      updateLine(container.querySelector('[data-ts="' + line.ts + '"]'), line);
    });
  }
  allWeightDiv.textContent = userData.totwt;
  allCalsDiv.textContent = userData.totkc;
  allCarbsDiv.textContent = userData.totcb;
  resulting();
}

function updateLine(line, data) {
  line.querySelector('.totalCarbs').textContent = data.ttcb;
  line.querySelector('.totalCals').textContent = data.ttkc;
}

function resulting() {
  let field = document.querySelector('.counting1');
  let [cb100, kc100] = calculateResulting(userData);
  field.textContent = `На 100гр:  ${kc100} Ккал,  ${cb100} Карбс`;
}

function calculateResulting(userData) {
  let { cookedWt, totkc, totcb } = userData;
  let kc100 = totkc / cookedWt * 100;
  let cb100 = totcb / cookedWt * 100;
  if (!isFinite(kc100)) kc100 = 0;
  if (!isFinite(cb100)) cb100 = 0;
  cb100 = cb100.toFixed(1);
  kc100 = Math.ceil(kc100);
  return [cb100, kc100];
}

function addNewLine() {
  let line = lineDiv(Date.now());
  container.appendChild(line);
  changeHandler();
  return line;
}

function removeLine(e) {
  e.target.closest('.line').remove();
  changeHandler();
}

function changeHandler() {
  updateUserData();
  updatePage();
  saveLastToStorage();
}

function clickHandler(e) {
  switch (true) {
    case e.target.parentNode.classList.contains('removeLine'):
      removeLine(e);
      break;
    case e.target.classList.contains('saveRecipe'):
      saveRecipe();
      break;
    case e.target.parentNode.classList.contains('menu'):
      menuHandler();
      break;
  }
}

function keyPressHandler(e) {
  if (e.keyCode != 13) return;
  let target = e.target;
  let parent = target.parentNode;
  if (parent.classList.contains('line')) {
    if (target.classList.contains('weight')) {
      if (parent.nextElementSibling) {
        parent.nextElementSibling.firstElementChild.focus();
        return;
      }
      let line = addNewLine();
      line.firstElementChild.focus();
      return;
    }
    target.nextElementSibling.focus();
  }
}

// Recipe.
function saveRecipe() {
  userData.name = recipeName.value;
  userData.ts = Date.now();
  recipies = recipies.concat(userData);
  localStorage.setItem('ccRecipies', JSON.stringify(recipies));



  console.log(recipies);
}
function populateRecipiesList(recipies) {
  let list = '';
  for (let i = 0; i < recipies.length; i++) {
    let [cb100, kc100] = calculateResulting(recipies[i]);
    list = `<div data-id="${recipies[i].ts}">${recipies[i].name} (${kc100} Ккал, ${cb100} Карбс) - ${new Date(+recipies[i].ts).toLocaleString('en-GB')}</div>` + list;
  }
  recipiesList.innerHTML = list;
  return list;
}

function menuHandler() {
  recipiesList.classList.toggle('invisible');
}

// Recipe end.

// //eventListeners
document.querySelector('.new-line').addEventListener('click', addNewLine);
document.body.addEventListener('click', clickHandler);
document.body.addEventListener('input', changeHandler);
// // document.body.addEventListener('input', saveLastRecipeToStorage);
document.addEventListener('DOMContentLoaded', loadLastFromStorage);
document.addEventListener('keyup', keyPressHandler);
// document.addEventListener('load', loadLastFromStorage);
