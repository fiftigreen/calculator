"use strict";
let el = function (element) {
  if (element.charAt(0) === "#") {
    return document.querySelector(element);
  } else {
    return document.querySelectorAll(element);
  }
};

function sceleton(el) {
  let main = document.querySelector(el);

  main.append(new but("input", "viewer", "main__result", ""));

  let div = new but("div", "", "button-contain", "");
  main.append(div);

  div.append(
    new but("button", "plusMinus", "button-contain__button-plusMinus", "+/-")
  );
  div.append(new but("button", "point", "button-contain__button-point", ","));
  div.append(new but("button", "result", "button-contain__button-result", "="));
  div.append(
    new but("button", "", "button-contain__button-minus operator", "-")
  );
  div.append(
    new but("button", "", "button-contain__button-plus operator", "+")
  );
  div.append(
    new but("button", "", "button-contain__button-multiplication operator", "×")
  );
  div.append(
    new but("button", "percent", "button-contain__button-percent", "%")
  );
  div.append(new but("button", "clear", "button-contain__button-c", "C"));
  div.append(new but("button", "back", "button-contain__button-back", "<<"));
  div.append(
    new but("button", "", "button-contain__button-division operator", "÷")
  );

  for (let i = 0; i < 10; i++) {
    div.append(new but("button", "", "number button-contain__button-" + i, i));
  }
}

function but(ob = "div", id = "", cls = "", html = "") {
  this.obj = document.createElement(ob);
  this.obj.id = id;
  this.obj.className = cls;
  this.obj.innerHTML = html;
  return this.obj;
}

window.onload = function (e) {
  this.sceleton(".main");
  let viewer = el("#viewer"),
    result = el("#result"),
    operator = el(".operator"),
    number = el(".number"),
    clear = el("#clear"),
    back = el("#back"),
    resultDisplayed = false;

  // добавляем обработчики кликов к цифровым кнопкам
  for (let i = 0; i < number.length; i++) {
    number[i].addEventListener("click", function (e) {
      // сохранить текущую входную строку и ее последний символ в переменные - используется позже
      let currentString = viewer.value;
      let lastChar = currentString[currentString.length - 1];

      // если результат не отображается, просто продолжаем добавлять
      if (resultDisplayed === false) {
        viewer.value += e.target.innerHTML;
      } else if (
        (resultDisplayed === true && lastChar === "+") ||
        lastChar === "-" ||
        lastChar === "×" ||
        lastChar === "÷"
      ) {
        // если результат отображается в данный момент и пользователь нажал оператор
        // нам нужно продолжать добавлять в строку для следующей операции
        resultDisplayed = false;
        viewer.value += e.target.innerHTML;
      } else {
        // если результат отображается в данный момент и пользователь нажал число
        // нам нужно очистить строку ввода и добавить новый ввод, чтобы начать новую операцию
        resultDisplayed = false;
        viewer.value = "";
        viewer.value += e.target.innerHTML;
      }
    });
  }

  // добавляем обработчики кликов к цифровым кнопкам
  for (let i = 0; i < operator.length; i++) {
    operator[i].addEventListener("click", function (e) {
      // сохранение текущей входной строки и ее последнего символа в переменных - используется позже
      let currentString = viewer.value;
      let lastChar = currentString[currentString.length - 1];

      // если последний введенный символ является оператором, замените его на текущий нажатый
      if (
        lastChar === "+" ||
        lastChar === "-" ||
        lastChar === "×" ||
        lastChar === "÷"
      ) {
        let newString =
          currentString.substring(0, currentString.length - 1) +
          e.target.innerHTML;
        viewer.value = newString;
      } else if (currentString.length == 0) {
        // если первая нажатая клавиша является оператором, ничего не делать
        console.log("Первым должна быть цифра");
      } else {
        // иначе просто добавляем оператор, нажатый на вход
        viewer.value += e.target.innerHTML;
      }
    });
  }

  // при нажатии кнопки «равно»
  result.addEventListener("click", function () {
    // это строка, которую мы будем обрабатывать, например. -10 + 26 + 33-56 * 34/23
    let inputString = viewer.value;

    // формируем массив чисел. например, для приведенной выше строки это будет: numbers = ["10", "26", "33", "56", "34", "23"]
    let numbers = inputString.split(/\+|\-|\×|\÷/g); // сначала мы заменяем все числа и точку на пустую строку, а затем разделяем

    // формируем массив операторов. для приведенной выше строки это будет: operator = ["+", "+", "-", "*", "/"]
    let operators = inputString.replace(/[0-9]|\./g, "").split("");

    console.log(inputString);
    console.log(operators);
    console.log(numbers);
    console.log("----------------------------");
    // сначала делим, потом умножаем, потом вычитаем и потом складываем // по мере продвижения мы чередуем исходные числа и массив операторов // последний элемент, оставшийся в массиве, будет выходным

    // теперь мы перебираем массив и делаем одну операцию за раз.
    let divide = operators.indexOf("÷");
    while (divide != -1) {
      numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
      operators.splice(divide, 1);
      divide = operators.indexOf("÷");
    }

    let multiply = operators.indexOf("×");
    while (multiply != -1) {
      numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
      operators.splice(multiply, 1);
      multiply = operators.indexOf("×");
    }

    let subtract = operators.indexOf("-");
    while (subtract != -1) {
      numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
      operators.splice(subtract, 1);
      subtract = operators.indexOf("-");
    }

    let add = operators.indexOf("+");
    while (add != -1) {
      // использование parseFloat необходимо, иначе это приведет к конкатенации строк :)
      numbers.splice(
        add,
        2,
        parseFloat(numbers[add]) + parseFloat(numbers[add + 1])
      );
      operators.splice(add, 1);
      add = operators.indexOf("+");
    }

    viewer.value = numbers[0]; // отображаем вывод

    resultDisplayed = true; // поворачиваем флаг, если отображается результат
  });

  // очищаем ввод при нажатии clear
  clear.addEventListener("click", function () {
    viewer.value = "";
  });
};
