//vars
const allWeightDiv = document.querySelector('.allWeight');
const allCalsDiv = document.querySelector('.allCals');
const allCarbsDiv = document.querySelector('.allCarbs');
const container = document.querySelector('.container');
let lines = document.querySelectorAll('.line');
const results = document.querySelector('#results');
const cookedWeightInput = document.querySelector('.cookedWeight');
const lineDiv = function (ts= '', nm = '', kc = '', cb = '', wt = '', ttcb = '', ttkc = '') {
  let div = document.createElement('div');
  div.innerHTML =
    `<div class="line" data-ts="${ts}">
<input class="productName" value="${nm}"/>
<input class="calsFor100g" value="${kc}"/>
<input class="carbsFor100g" value="${cb}"/>
<input class="weight" value="${wt}"/>
<div class="totalCarbs">${ttcb}</div>
<div class="totalCals">${ttkc}</div>
<button class="removeLine"><i class="material-icons mi-clear">clear</i></button>
</div>`;
  div = div.firstElementChild.cloneNode(true);
  return div;
};
let userData = {};
let calculations = {};

function loadLastFromStorage() {
  userData = JSON.parse(localStorage.getItem('ccLastRecipe'));
  userDataToPage();
  updatePage();
}

function saveLastToStorage() {
  localStorage.setItem('ccLastRecipe', JSON.stringify(userData));
}

function userDataToPage() {
  userData.lines.forEach((data) => {
    let line = lineDiv(data.ts, data.nm, data.kc, data.cb, data.wt, data.ttcb, data.ttkc);
    container.appendChild(line);
  });
  cookedWeightInput.value = userData.cookedWt;
}

function updateUserData() {
  function lineTotals(data) {
    data.ttcb = data.cb * data.wt / 100;
    data.ttkc = data.kc * data.wt / 100;
    return data;
  }
  function evCalc(str) {
    str = str.replace(/[^-()\d/*+.]/g, '');
    let result = str.replace(/[^\d]/g, '');
    try {
      result = eval(str);
      
    } catch (e) {}
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
  userData.cookedWt = cookedWeightInput.value;
  userData.totcb = Math.ceil(totcb);
  userData.totkc = Math.ceil(totkc);
  userData.totwt = Math.ceil(totwt);
  
}

function updatePage() {
  userData.lines.forEach(line => {
    updateLine(container.querySelector('[data-ts=' + line.ts + ']'), line);
  });
  allWeightDiv.textContent = userData.totwt;
  allCalsDiv.textContent =  userData.totkc;
  allCarbsDiv.textContent = userData.totcb;
}

function updateLine(line, data) {
    line.querySelector('.totalCarbs').textContent = data.ttcb;
    line.querySelector('.totalCals').textContent = data.ttkc;
}

function addNewLine() {
  container.appendChild(lineDiv(Date.now()));
  changeHandler();
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
  }
  // console.log(e.target.parentNode);
}

// //eventListeners
document.querySelector('.new-line').addEventListener('click', addNewLine);
document.body.addEventListener('click', clickHandler);
document.body.addEventListener('input', changeHandler);
// // document.body.addEventListener('input', saveLastRecipeToStorage);
document.addEventListener('DOMContentLoaded', loadLastFromStorage);
// document.addEventListener('load', loadLastFromStorage);
