//+++---Utils---+++//
MaryManage.define("utils", [
], function utils(require) {

/* constants */
const utils = Object.create(null);

/* methods */
utils.newObj = (proto = null) => Object.create(proto);

utils.padOneNumber = function (number) {
  let num = String(number);
  num = (num.length < 2) ?
    "0" + num : num;
  return num;
};

utils.parseEquinox = function (equinox) {
  const timeArray = equinox.split(/ |:/);
  const obj = Object.create(null);
  obj.month = timeArray[0];
  obj.day = timeArray[1];
  obj.hours = timeArray[2];
  obj.minutes = timeArray[3];
  obj.cycle = timeArray[4];
  obj.year = timeArray[5];
  return obj;
};

utils.parseSunDown = function (sunDown) {
  const timeArray = sunDown.split(":");
  const obj = Object.create(null);
  obj.hours = timeArray[0];
  obj.minutes = timeArray[1];
  return obj;
};

utils.parseHours24 = function (hours24) {
  const hours12 = Object.create(null);
  if (hours24 > 12) {
    hours12.hours = hours24 - 12;
    hours12.cycle = "PM";
  } else if (hours24 === 12) {
    hours12.hours = 12;
    hours12.cycle = "PM";
  } else if (hours24 === 0) {
    hours12.hours = 12;
    hours12.cycle = "AM";
  } else {
    hours12.hours = hours24;
    hours12.cycle = "AM";
  }
  return hours12;
};

utils.parseStatement = function (statement, delimiter) {
  const result = [];
  let isAssigned, left, right, removes;
  if (utils.isArray(statement)) {
    // assumed to already be parsed
    return statement;
  }
  if (delimiter === ":") {
    isAssigned = /:(\s*)?\S/;
    left = /[^:]+/;
    right = /:.+/;
    removes = /:\s*|;/g;
  } else if (delimiter === "=") {
    isAssigned = /=(\s*)?\S/;
    left = /[^=]+/;
    right = /=.+/;
    removes = /=\s*|'|"/g;
  }
  result[0] = statement.match(left)[0].trim();
  if (isAssigned.test(statement)) {
    result[1] = statement.match(right)[0].replace(removes, "").trim();
  } else {
    result[1] = "";
  }
  return result;
};

utils.parseStyle = (declaration) => utils.parseStatement(declaration, ":");

utils.parseAttribute = (pair) => utils.parseStatement(pair, "=");

utils.numberize = function (string) {
  if (string !== "") {
    return Number(string);
  }
};

utils.freezeEvent = function (event) {
  event.preventDefault();
  event.stopPropagation();
};

utils.toString = function (value) {
  return Object.prototype.toString.call(value);
};

utils.isNode = function (node) {
  if (node.nodeType) {
    return true;
  } else {
    return false;
  }
};

utils.isWindow = function (win) {
  if (utils.toString(win) === "[object Window]") {
    return true;
  } else {
    return false;
  }
};

utils.isString = function (string) {
  if (utils.toString(string) === "[object String]") {
    return true;
  } else {
    return false;
  }
};

utils.isBoolean = function (boolean) {
  if (utils.toString(boolean) === "[object Boolean]") {
    return true;
  } else {
    return false;
  }
};

utils.isFunction = function (func) {
  if (utils.toString(func) === "[object Function]") {
    return true;
  } else {
    return false;
  }
};

utils.isArray = function (array) {
  if (utils.toString(array) === "[object Array]") {
    return true;
  } else {
    return false;
  }
};

utils.isObject = function (object) {
  if (utils.toString(object) === "[object Object]") {
    return true;
  } else {
    return false;
  }
};

utils.isMap = function (map) {
  if (utils.toString(map) === "[object Map]") {
    return true;
  } else {
    return false;
  }
};

utils.isNumber = function (num) {
  if (num !== num) { // isNaN
    return false;
  } else if (utils.toString(num) === "[object Number]") {
    return true;
  } else {
    return false;
  }
};

utils.multiplyString = function (string, multiple) {
  if (utils.isNumber(multiple)) {
    return Array(multiple + 1).join(string);
  } else {
    return "";
  }
};

utils.getIteratorNodes = function (iterator, array = []) {
  const node = iterator.nextNode();
  if (node !== null) {
    array.push(node);
    return utils.getIteratorNodes(iterator, array);
  } else {
    return array;
  }
};

utils.bubbleCheck = function (target, classes) {
  if (target === document.documentElement) {
    return false;
  }
  classes = [].concat(classes);
  for (let className of classes) {
    if (target.classList && target.classList.contains(className)) {
      return true;
    }
  }
  return utils.bubbleCheck(target.parentNode, classes);
};

utils.isStandAlone = function () {
  const title = document.querySelector("title");
  if (title && title.textContent === "Hebrew Calendar (by נהאלך)") {
    return true;
  } else {
    return false;
  }
};

/* exports */
return utils;

});
