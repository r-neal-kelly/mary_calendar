/*
    Copyright © 2022 r-neal-kelly
    Copyright © 2017 נהאל
    https://github.com/r-neal-kelly/mary_calendar

    Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
    https://creativecommons.org/licenses/by-nc-sa/4.0/
*/

(function MaryCalendar() {

"use strict";

//+++---Version---+++//
const MaryCalendarVersion = "v1.0.0";

//+++---Config---+++//
const config = {
  disableSaving: false,
  disableSettings: false,
  disableNotes: false,
  disableAlarm: false,
  defaultNoSeconds: false,
  defaultTheme: "Sky",
  defaultEquinoxes: {
    // these are UTC + 02:00, Jerusalem time
    // but can be any time zone or length
    "2017": "March 20 12:29 PM 2017",
    "2018": "March 20 6:15 PM 2018",
    "2019": "March 20 11:58 PM 2019",
    "2020": "March 20 5:50 AM 2020",
    "2021": "March 20 11:37 AM 2021",
    "2022": "March 20 5:33 PM 2022",
    "2023": "March 20 11:24 PM 2023",
    "2024": "March 20 5:06 AM 2024",
    "2025": "March 20 11:01 AM 2025",
    "2026": "March 20 4:46 PM 2026",
    "2027": "March 20 10:25 PM 2027",
    "2028": "March 20 4:17 AM 2028"
  }
};

//+++---Manager---+++//
const MaryManage = (function () {

  const manager = Object.create(null);
  const modules = Object.create(null);
  const singletons = Object.create(null);
  const instances = Object.create(null);
  const error = "Cannot require a module that doesn't exist.";

  manager.define = function (name, requires, definition, instance) {
    requires.forEach(function gatherRequires(name, index, array) {
      if (instances[name]) {
        array[index] = modules[name]();
      } else if (singletons[name]) {
        array[index] = modules[name];
      } else {
        throw new Error(error);
      }
    });
    requires.push(manager.require);
    if (instance) {
      instances[name] = true;
      modules[name] = function () {
        return definition.apply(definition, requires);
      };
    } else {
      singletons[name] = true;
      modules[name] = definition.apply(definition, requires);
    }
  };

  manager.require = function (name) {
    if (instances[name]) {
      return modules[name]();
    } else if (singletons[name]) {
      return modules[name];
    } else {
      throw new Error(error);
    }
  };

  manager.isSingleton = function (name) {
    if (singletons[name]) {
      return true;
    } else {
      return false;
    }
  };

  manager.isInstance = function (name) {
    if (instances[name]) {
      return true;
    } else {
      return false;
    }
  };

  manager.requireList = function () {
    return JSON.stringify(Object.keys(modules), null, "  ");
  };

  return manager;

}());

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

MaryManage.define("MaryMessage", [
  "utils"
], function MaryMessage(utils, require) {

/* constants */
const newObj = utils.newObj;
const isNumber = utils.isNumber;
const pubSub = newObj();
const messages = newObj();
const register = [];

/* methods */
pubSub.subscribe = function (message, callback, priority) {
  if (!messages[message]) {
    messages[message] = newObj();
  }
  if (!isNumber(priority)) {
    priority = 0;
  }
  if (!messages[message][priority]) {
    messages[message][priority] = [];
  }
  messages[message][priority].push(callback);
  register.push(message + " : " + callback.name + " : " + priority);
};

pubSub.publish = function (message, data) {
  // 1 is invoked after 0, and 0 after -1, etc.
  if (!messages[message]) {
    return;
  }
  let priorities = Object.keys(messages[message])
    .map(function (key) {
      return Number(key);
    })
    .sort();
  priorities.forEach(function (priority) {
    messages[message][priority].forEach(function (callback) {
      callback(data);
    });
  });
};

/* exports */
return pubSub;

});

MaryManage.define("MaryDom", [
  "utils"
], function MaryDom(utils, require) {

/* constants */
const newObj = utils.newObj;
const parseStyle = utils.parseStyle;
const parseAttribute = utils.parseAttribute;
const isNode = utils.isNode;
const isWindow = utils.isWindow;
const isString = utils.isString;
const isBoolean = utils.isBoolean;
const isFunction = utils.isFunction;
const isArray = utils.isArray;
const isObject = utils.isObject;
const isMap = utils.isMap;
const isNumber = utils.isNumber;
const multiplyString = utils.multiplyString;
const getIteratorNodes = utils.getIteratorNodes;

/* constructor */
const MaryDom = function (args, context, multiple) {
  const MaryDomObj = newObj(MaryDom.prototype);
  Object.defineProperty(MaryDomObj, "size", {
    value: 0,
    writable: true
  });
  Object.defineProperty(MaryDomObj, "first", {
    writable: true
  });
  Object.defineProperty(MaryDomObj, "last", {
    writable: true
  });
  Object.defineProperty(MaryDomObj, "length", {
    writable: true
  });
  Object.defineProperty(MaryDomObj, "parent", {
    writable: true
  });
  const results = filter(args, context, multiple);
  for (let node of results) {
    MaryDomObj[MaryDomObj.size] = node;
    MaryDomObj.size += 1;
  }
  MaryDomObj.first = MaryDomObj[0];
  MaryDomObj.last = MaryDomObj[MaryDomObj.size - 1];
  MaryDomObj.length = MaryDomObj.size;
  return MaryDomObj;
};

/* filters */
const filter = function (args, context, multiple) {
  let result;
  if (args == null) {
    result = whenNull;
  } else if (args.constructor === MaryDom) {
    result = whenMaryDom;
  } else if (isNode(args)) {
    result = whenNode;
  } else if (isWindow(args)) {
    result = whenWindow;
  } else if (isString(args) && args !== "") {
    result = whenString;
  } else if (isBoolean(args)) {
    result = whenBoolean;
  } else if (isNumber(args)) {
    result = whenNumber;
  } else if (isFunction(args)) {
    result = whenFunction;
  } else if (isObject(args)) {
    result = whenObject;
  } else if (isMap(args)) {
    result = whenMap;
  } else if (isArray(args)) {
    result = whenArray;
  } else {
    result = whenNull;
  }
  return result(args, context, multiple);
};

const whenNull = function () {
  /**
   * constructs: nothing
   * context: not used
   * multiple: not used
   */
  return [];
};

const whenMaryDom = function (MaryDomObj, context, multiple) {
  /**
   * constructs: MaryDomObj
   * context: pattern
   * multiple: node clones
   */
  let results = [];
  MaryDomObj = MaryDomObj.array();
  if (multiple == null) {
    return MaryDomObj;
  }
  if (context === "between") {
    MaryDomObj.forEach(function (node) {
      results = results.concat(whenNode(node, null, multiple));
    });
    return results;
  }
  MaryDomObj.forEach(function (node) {
    results = results.concat(whenNode(node, null, multiple).slice(1));
  });
  if (context === "before") {
    results = results.concat(MaryDomObj);
  } else {
    // defaults to "after"
    results = MaryDomObj.concat(results);
  }
  return results;
};

const whenNode = function (node, context, multiple) {
  /**
   * constructs: node
   * context: not used
   * multiple: node clones
   */
  let results = [];
  if (multiple == null) {
    multiple = 1;
  }
  results.push(node);
  multiple -= 1;
  for (let i = 0; i < multiple; i += 1) {
    results.push(node.cloneNode(true));
  }
  return results;
};

const whenWindow = function (win) {
  /**
   * constructs: window
   * context: not used
   * multiple: not used
   */
  return [win];
};

const whenString = function (string, context, multiple) {
  /**
   * constructs: html/node iterator/querySelectorAll
   * context: parent node
   * multiple: copies/node limit
   */
  let results, wrap;
  context = filter(context)[0] || document;
  if (/^<\S[^>]*>/.test(string)) {
    // html
    if (isNumber(multiple)) {
      string = multiplyString(string, multiple);
    }
    wrap = document.createElement("div");
    wrap.innerHTML = string;
    results = Array.from(wrap.children);
    results.forEach(function (node) {
      node.remove();
    });
  } else if (/^SHOW_/.test(string)) {
    // node iterator
    results = whenNumber(NodeFilter[string], context, multiple);
  } else {
    // querySelectorAll
    results = Array.from(context.querySelectorAll(string));
    if (isNumber(multiple)) {
      results = results.slice(0, multiple);
    }
  }
  return results;
};

const whenBoolean = function (boolean, context, multiple) {
  /**
   * constructs: node iterator/false = reversed
   * context: parent node
   * multiple: node limit
   */
  let results = whenNumber(-1, context, multiple);
  if (boolean === false) {
    results = results.reverse();
  }
  return results;
};

const whenNumber = function (number, context, multiple) {
  /**
   * constructs: node iterator
   * context: parent node
   * multiple: node limit
   */
  let results, iterator;
  context = filter(context)[0] || document;
  iterator = document.createNodeIterator(context, number);
  results = getIteratorNodes(iterator);
  if (isNumber(multiple)) {
    results = results.slice(0, multiple);
  }
  return results;
};

const whenFunction = function (func, context, multiple) {
  /**
   * constructs: recursive return
   * context: carried
   * multiple: carried
   */
  let results = [];
  results = results.concat(filter(func(), context, multiple));
  return results;
};

const whenObject = function (object, context, multiple) {
  /**
   * constructs: recursive values
   * context: carried
   * multiple: carried
   */
  let results = [];
  Object.keys(object).forEach(function (key) {
    let value = object[key];
    results = results.concat(filter(value, context, multiple));
  });
  return results;
};

const whenMap = function (map, context, multiple) {
  /**
   * constructs: recursive values
   * context: carried
   * multiple: carried
   */
  return whenArray(map, context, multiple);
};

const whenArray = function (array, context, multiple) {
  /**
   * constructs: recursive elements
   * context: carried
   * multiple: carried
   */
  let results = [];
  array.forEach(function (element) {
    results = results.concat(filter(element, context, multiple));
  });
  return results;
};

/* prototype */
MaryDom.prototype = newObj();
MaryDom.prototype.constructor = MaryDom;

/* base */
MaryDom.prototype.forEach = function (callback) {
  const iterator = Array.from(this).entries();
  for (let [i, node] of iterator) {
    let result = callback.call(this[i], this[i], i, this);
    if (result === "break") {
      break;
    }
  }
  return this;
};

MaryDom.prototype.wrapEach = function (callback) {
  const iterator = Array.from(this).entries();
  for (let [i, node] of iterator) {
    let node = MaryDom(this[i]);
    let result = callback.call(node, node, i, this);
    if (result === "break") {
      break;
    }
  }
  return this;
};

MaryDom.prototype.contains = function (node) {
  // chain-breaker
  let result = false;
  this.forEach(function (dNode) {
    if (dNode === node) {
      result = true;
    }
  });
  return result;
};

MaryDom.prototype.restore = function () {
  return this.parent || this;
};

/* nodes */
MaryDom.prototype.array = function () {
  const result = Array.from(this);
  Object.defineProperty(result, "restore", {
    value: this.restore,
    writable: true
  });
  Object.defineProperty(result, "parent", {
    value: this,
    writable: true
  });
  return result;
};

MaryDom.prototype.findIndex = function (query) {
  // chain-breaker
  let result = null;
  this.forEach(function (dNode, dIndex, dObj) {
    if (result !== null) {
      return;
    }
    if (isNode(query) && query === dNode) {
      result = dIndex;
    }
    if (isFunction(query) && query(dNode, dIndex, dObj) === true) {
      result = dIndex;
    }
  });
  return result;
};

MaryDom.prototype.eq = function (indexes) {
  let result = [];
  if (indexes == null) {
    return this;
  }
  indexes = [].concat(indexes);
  for (let index of indexes) {
    if (this[index] != null) {
      result.push(this[index]);
    }
  }
  result = MaryDom(result);
  result.parent = this;
  return result;
};

MaryDom.prototype.filter = function (query, posCall, negCall) {
  let positives = [];
  let negatives = [];
  if (query == null) {
    return this;
  }
  if (isNode(query) || isNumber(query)) {
    // if a node or a number
    this.forEach(function (dNode, dIndex) {
      if (query === dNode || query === dIndex) {
        positives.push(dNode);
      } else {
        negatives.push(dNode);
      }
    });
  } else if (isFunction(query)) {
    // if a function
    this.forEach(function (dNode, dIndex, dObj) {
      if (query.call(dNode, dNode, dIndex, dObj)) {
        positives.push(dNode);
      } else {
        negatives.push(dNode);
      }
    });
  } else {
    // assumed to be a querySelectorAll string
    this.forEach(function (dNode) {
      var foster, clone, parent, result;
      if (dNode === window || dNode === document) {
        return;
      }
      if (dNode.parentNode != null) {
        parent = dNode.parentNode;
      } else {
        clone = dNode.cloneNode(true);
        foster = MaryDom("<div></div>")
          .appendChildren(clone);
      }
      result = MaryDom(query, parent || foster);
      if (result.contains(dNode) || result.contains(clone)) {
        positives.push(dNode);
      } else {
        negatives.push(dNode);
      }
    });
  }
  positives = MaryDom(positives);
  negatives = MaryDom(negatives);
  if (!isFunction(posCall) && !isFunction(negCall)) {
    // just return positives
    positives.parent = this;
    return positives;
  } else {
    // invoke callbacks
    if (isFunction(posCall)) {
      this.forEach(function (dNode, dIndex, dObj) {
        if (positives.contains(dNode)) {
          posCall.call(dObj, dNode, dIndex, dObj);
        }
      });
    }
    if (isFunction(negCall)) {
      this.forEach(function (dNode, dIndex, dObj) {
        if (negatives.contains(dNode)) {
          negCall.call(dObj, dNode, dIndex, dObj);
        }
      });
    }
    return this;
  }
};

MaryDom.prototype.find = function (query, posCall, negCall) {
  let positives = [];
  let negatives = [];
  if (query == null) {
    return this;
  }
  if (isNode(query) || isNumber(query)) {
    // if a node or a number
    this.forEach(function (dNode, dIndex) {
      this.children(dIndex).forEach(function (cNode, cIndex) {
        if (query === cNode || query === cIndex) {
          positives.push(cNode);
        } else {
          negatives.push(cNode);
        }
      });
    }.bind(this));
  } else if (isFunction(query)) {
    // if a function
    this.children().forEach(function (cNode, cIndex, cObj) {
      if (query.call(cNode, cNode, cIndex, cObj)) {
        positives.push(cNode);
      } else {
        negatives.push(cNode);
      }
    });
  } else {
    // assumed to be a querySelectorAll string
    this.forEach(function (dNode) {
      if (dNode === window) {
        return;
      }
      let result = MaryDom(query, dNode)
        .forEach(function (node) {
          positives.push(node);
        });
      this.children().forEach(function (cNode) {
        if (!result.contains(cNode)) {
          negatives.push(cNode);
        }
      });
    }.bind(this));
  }
  positives = MaryDom(positives);
  negatives = MaryDom(negatives);
  if (!isFunction(posCall) && !isFunction(negCall)) {
    // just return positives
    positives.parent = this;
    return positives;
  } else {
    // invoke callbacks
    if (isFunction(posCall)) {
      this.forEach(function (dNode, dIndex, dObj) {
        if (positives.contains(dNode)) {
          posCall.call(dObj, dNode, dIndex, dObj);
        }
      });
    }
    if (isFunction(negCall)) {
      this.forEach(function (dNode, dIndex, dObj) {
        if (negatives.contains(dNode)) {
          negCall.call(dObj, dNode, dIndex, dObj);
        }
      });
    }
    return this;
  }
};

MaryDom.prototype.reverse = function () {
  const result = MaryDom(this.array.reverse());
  result.parent = this.parent;
  return result;
};

MaryDom.prototype.add = function (args, context, multiple) {
  const additions = MaryDom(args, context, multiple).array();
  return MaryDom([this].concat(additions));
};

MaryDom.prototype.remove = function (index) {
  if (isNumber(index) || isArray(index)) {
    this.eq(index).remove();
  } else {
    this.forEach(function (dNode) {
      dNode.remove();
    });
  }
  return this;
};

/* text */
MaryDom.prototype.setHTML = function (HTML, index) {
  if (HTML == null) {
    return this;
  }
  HTML = [].concat(HTML);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).setHTML(HTML);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (HTML[dIndex] != null) {
        dNode.innerHTML = HTML[dIndex];
      }
    });
  } else {
    this.forEach(function (dNode) {
      dNode.innerHTML = HTML.join("");
    });
  }
  return this;
};

MaryDom.prototype.addHTML = function (HTML, index) {
  if (HTML == null) {
    return this;
  }
  HTML = [].concat(HTML);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).addHTML(HTML);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (HTML[dIndex] != null) {
        dNode.insertAdjacentHTML("beforeend", HTML[dIndex]);
      }
    });
  } else {
    this.forEach(function (dNode) {
      dNode.insertAdjacentHTML("beforeend", HTML.join(""));
    });
  }
  return this;
};

MaryDom.prototype.getHTML = function (index) {
  // chain-breaker
  if (isNumber(index)) {
    return this[index].innerHTML;
  } else {
    return this.first.innerHTML;
  }
};

MaryDom.prototype.getAsHTML = function (index) {
  // chain-breaker
  if (isNumber(index)) {
    return this[index].outerHTML;
  } else {
    return this.first.outerHTML;
  }
};

MaryDom.prototype.setText = function (text, index) {
  if (text == null) {
    return this;
  }
  text = [].concat(text);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).setText(text);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (text[dIndex] != null) {
        dNode.textContent = text[dIndex];
      }
    });
  } else {
    this.forEach(function (dNode) {
      dNode.textContent = text.join("");
    });
  }
  return this;
};

MaryDom.prototype.addText = function (text, index) {
  if (text == null) {
    return this;
  }
  text = [].concat(text);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).addText(text);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (text[dIndex] != null) {
        dNode.insertAdjacentText("beforeend", text[dIndex]);
      }
    });
  } else {
    this.forEach(function (dNode) {
      dNode.insertAdjacentText("beforeend", text.join(""));
    });
  }
  return this;
};

MaryDom.prototype.getText = function (index) {
  // chain-breaker
  if (isNumber(index)) {
    return this[index].textContent;
  } else {
    return this.first.textContent;
  }
};

/* values */
MaryDom.prototype.value = function (values, index) {
  if (values == null) {
    // chain-breaker
    if (isNumber(index)) {
      return this[index].value;
    } else {
      return this.first.value;
    }
  }
  values = [].concat(values);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).value(values);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (values[dIndex] != null) {
        dNode.value = values[dIndex];
      }
    });
  } else {
    this.forEach(function (dNode) {
      dNode.value = values.join("");
    });
  }
  return this;
};

MaryDom.prototype.placeholder = function (holders, index) {
  if (holders == null) {
    // chain-breaker
    if (isNumber(index)) {
      return this[index].placeholder;
    } else {
      return this.first.placeholder;
    }
  }
  holders = [].concat(holders);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).placeholder(holders);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (holders[dIndex] != null) {
        dNode.placeholder = holders[dIndex];
      }
    });
  } else {
    this.forEach(function (dNode) {
      dNode.placeholder = holders.join("");
    });
  }
  return this;
};

MaryDom.prototype.checked = function (checks, index) {
  if (checks == null) {
    // chain-breaker
    if (isNumber(index)) {
      return this[index].checked;
    } else {
      return this.first.checked;
    }
  }
  checks = [].concat(checks);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).checked(checks);
  } else if (index === "all") {
    this.forEach(function (dNode) {
      dNode.checked = checks[0];
    });
  } else {
    // defaults to "spread" behavior
    this.forEach(function (dNode, dIndex) {
      if (checks[dIndex] != null) {
        dNode.checked = checks[dIndex];
      }
    });
  }
  return this;
};

MaryDom.prototype.src = function (sources, index) {
  if (sources == null) {
    // chain-breaker
    if (isNumber(index)) {
      return this[index].src;
    } else {
      return this.first.src;
    }
  }
  sources = [].concat(sources);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).src(sources);
  } else {
    // defaults to "spread" behavior
    this.forEach(function (dNode, dIndex) {
      if (sources[dIndex] != null) {
        dNode.src = sources[dIndex];
      }
    });
  }
  return this;
};

MaryDom.prototype.option = function (options, index) {
  if (options == null) {
    return this;
  }
  options = [].concat(options).map(function (option) {
    return "<option>" + option + "</option>";
  });
  this.setHTML(options, index);
  return this;
};

MaryDom.prototype.selectOption = function (options, index) {
  if (options == null) {
    return this;
  }
  options = [].concat(options);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).selectOption(options);
  } else {
    // defaults to "spread" behavior
    this.wrapEach(function (dNode, dI) {
      dNode.find("option").wrapEach(function (cNode, cI) {
        if (cNode.getText() === options[dI] || cI === options[dI]) {
          cNode.attr("selected=true");
        }
      });
    });
  }
  return this;
};

/* children */
MaryDom.prototype.children = function (index) {
  let results = [];
  if (isNumber(index) || isArray(index)) {
    results = this.eq(index).children();
  } else {
    this.forEach(function (dNode) {
      results = results.concat(Array.from(dNode.children));
    });
  }
  results = MaryDom(results);
  results.parent = this;
  return results;
};

MaryDom.prototype.firstChildren = function (index) {
  let results = [];
  if (isNumber(index) || isArray(index)) {
    results = this.eq(index).firstChildren();
  } else {
    this.forEach(function (dNode) {
      results.push(dNode.firstChild);
    });
  }
  results = MaryDom(results);
  results.parent = this;
  return results;
};

MaryDom.prototype.appendTo = function (parents, index) {
  parents = MaryDom(parents);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).appendTo(parents);
  } else if (index === "spread") {
    parents.forEach(function (pNode, pIndex) {
      if (this[pIndex]) {
        pNode.appendChild(this[pIndex]);
      }
    }.bind(this));
  } else {
    this.forEach(function (dNode) {
      parents.forEach(function (pNode) {
        pNode.appendChild(dNode);
      });
    });
  }
  return this;
};

MaryDom.prototype.appendChildren = function (children, index) {
  children = MaryDom(children);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).appendChildren(children);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (children[dIndex]) {
        dNode.appendChild(children[dIndex]);
      }
    });
  } else {
    this.forEach(function (dNode) {
      children.forEach(function (cNode) {
        dNode.appendChild(cNode);
      });
    });
  }
  return this;
};

MaryDom.prototype.removeChildren = function (index) {
  if (isNumber(index) || isArray(index)) {
    this.eq(index).children().remove();
  } else {
    this.forEach(function (dNode) {
      MaryDom(dNode).children().remove();
    });
  }
  return this;
};

/* styles */
MaryDom.prototype.style = function (styles, index) {
  // ex. "color: red" styles and just "color" unstyles
  if (styles == null) {
    return this;
  }
  styles = [].concat(styles);
  styles.forEach(function (declaration, i) {
    styles[i] = parseStyle(declaration);
  });
  if (isNumber(index) || isArray(index)) {
    this.eq(index).style(styles);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (styles[dIndex] != null) {
        dNode.style[styles[dIndex][0]] = styles[dIndex][1];
      }
    });
  } else {
    this.forEach(function (dNode) {
      styles.forEach(function (declaration) {
        dNode.style[declaration[0]] = declaration[1];
      });
    });
  }
  return this;
};

MaryDom.prototype.getStyle = function (style, index) {
  // chain-breaker
  if (style == null) {
    return this;
  }
  if (isNumber(index)) {
    return this[index].style[style];
  } else {
    return this.first.style[style];
  }
};

MaryDom.prototype.class = function (classes, index) {
  if (classes == null) {
    // chain-breaker
    if (isNumber(index)) {
      return this.getAttr("class", index);
    } else {
      return this.getAttr("class", 0);
    }
  }
  classes = [].concat(classes);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).class(classes);
  } else if (index === "spread") {
    this.wrapEach(function (dNode, dIndex) {
      if (classes[dIndex] != null) {
        dNode.class(classes[dIndex]);
      }
    });
  } else if (index === "checker") {
    this.forEach(function (dNode, dIndex) {
      if (classes[dIndex] == null) {
        classes = classes.concat(classes);
      }
      dNode.classList.add(classes[dIndex]);
    });
  } else {
    this.forEach(function (dNode) {
      classes.forEach(function (className) {
        dNode.classList.add(className);
      });
    });
  }
  return this;
};

MaryDom.prototype.removeClass = function (classes, index) {
  if (classes == null) {
    if (isNumber(index) || isArray(index)) {
      this.eq(index).removeClass();
    } else {
      this.wrapEach(function (dNode) {
        dNode.removeAttr("class");
      });
    }
    return this;
  }
  classes = [].concat(classes);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).removeClass(classes);
  } else {
    this.forEach(function (dNode) {
      classes.forEach(function (className) {
        dNode.classList.remove(className);
      });
    });
  }
  return this;
};

MaryDom.prototype.hasClass = function (classes, index) {
  // chain-breaker
  classes = [].concat(classes);
  if (isNumber(index)) {
    for (let className of classes) {
      if (!this[index].classList.contains(className)) {
        return false;
      }
    }
  } else {
    for (let className of classes) {
      if (!this.first.classList.contains(className)) {
        return false;
      }
    }
  }
  return true;
};

MaryDom.prototype.defaultClass = function (index) {
  if (isNumber(index) || isArray(index)) {
    this.eq(index).defaultClass();
  } else {
    this.forEach(function (dNode) {
      if (dNode.classList && dNode.classList[0]) {
        dNode.setAttribute("class", dNode.classList[0]);
      }
    });
  }
  return this;
};

/* attributes */
MaryDom.prototype.attr = function (attributes, index) {
  // ex. "class = MyClass" sets and just "class" sets ""
  if (attributes == null) {
    return this;
  }
  attributes = [].concat(attributes);
  attributes.forEach(function (pair, i) {
    attributes[i] = parseAttribute(pair);
  });
  if (isNumber(index) || isArray(index)) {
    this.eq(index).attr(attributes);
  } else if (index === "spread") {
    this.forEach(function (dNode, dIndex) {
      if (attributes[dIndex] != null) {
        dNode.setAttribute(
          attributes[dIndex][0],
          attributes[dIndex][1]
        );
      }
    });
  } else {
    this.forEach(function (dNode) {
      attributes.forEach(function (pair) {
        dNode.setAttribute(pair[0], pair[1]);
      });
    });
  }
  return this;
};

MaryDom.prototype.removeAttr = function (attributes, index) {
  // completely removes attribute
  if (attributes == null) {
    return this;
  }
  attributes = [].concat(attributes);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).removeAttr(attributes);
  } else {
    this.forEach(function (dNode) {
      attributes.forEach(function (attribute) {
        dNode.removeAttribute(attribute);
      });
    });
  }
  return this;
};

MaryDom.prototype.getAttr = function (attribute, index) {
  // chain-breaker
  if (attribute == null) {
    return this;
  }
  if (isNumber(index)) {
    return this[index].getAttribute(attribute);
  } else {
    return this.first.getAttribute(attribute);
  }
};

/* handlers */
MaryDom.prototype.on = function (type, listeners, index) {
  if (type == null || listeners == null) {
    return this;
  }
  listeners = [].concat(listeners);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).on(type, listeners);
  } else {
    this.forEach(function (dNode, dIndex, dObj) {
      listeners.forEach(function (listener) {
        listener = listener.bind({
          node: dNode,
          index: dIndex,
          obj: dObj
        });
        listener.type = type;
        dNode.listeners = dNode.listeners || newObj();
        dNode.listeners[listener.name.replace(/bound /, "")] = listener;
        dNode.addEventListener(type, listener, false);
      });
    });
  }
  return this;
};

MaryDom.prototype.off = function (type, listeners, index) {
  if (type == null || listeners == null) {
    return this;
  }
  listeners = [].concat(listeners);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).off(type, listeners);
  } else {
    this.forEach(function (dNode) {
      listeners.forEach(function (listener) {
        const listenerName = listener.name || String(listener);
        listener = dNode.listeners[listenerName];
        dNode.removeEventListener(type, listener, false);
        if (listener.type === type) {
          delete dNode.listeners[listenerName];
        }
      });
    });
  }
  return this;
};

MaryDom.prototype.once = function (type, listeners, index) {
  if (type == null || listeners == null) {
    return this;
  }
  listeners = [].concat(listeners);
  if (isNumber(index) || isArray(index)) {
    this.eq(index).on(type, listeners);
  } else {
    this.forEach(function (dNode, dIndex, dObj) {
      listeners.forEach(function (listener) {
        listener = listener.bind({
          node: dNode,
          index: dIndex,
          obj: dObj
        });
        dNode.addEventListener(type, listener, {
          capture: false,
          once: true
        });
      });
    });
  }
  return this;
};

/* exports */
return MaryDom;

});

//+++---Models---+++//
MaryManage.define("model/vars", [
  "utils"
], function modelVars(utils, require) {

/* constants */
const newObj = utils.newObj;
const vars = newObj();
const doc = document;

/* props */
const defineProps = function () {
  Object.defineProperty(vars, "save", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "clear", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "clearAll", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "safeMode", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "firstTime", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "result", {
    writable: true,
    enumerable: false
  });
};

/* tests */
const storageCheck = (function tryStorage() {
  try {
    localStorage.setItem("MaryCalendar_Storage", "Works?");
    localStorage.removeItem("MaryCalendar_Storage");
    return true;
  } catch (error) {
    return false;
  }
}());

const cookieCheck = (function tryCookie() {
  let result;
  try {
    doc.cookie = "MaryCalendar_Cookie=non-GMO?; path=/;";
    result = /MaryCalendar_Cookie=non-GMO/.test(doc.cookie);
    doc.cookie = "MaryCalendar_Cookie=; expires=Thu 01 Jan 1970; path=/;";
    return result;
  } catch (error) {
    return false;
  }
}());

/* deserializing */
const deserialize = function () {
  if (storageCheck && localStorage.getItem("MaryCalendar_equinox")) {
    getStorage();
    vars.firstTime = false;
  } else if (cookieCheck && /MaryCalendar_equinox/.test(doc.cookie)) {
    getCookies();
    vars.firstTime = false;
  } else {
    getDefault();
    vars.firstTime = true;
  }
};

const getStorage = function () {
  for (let key in localStorage) {
    if (/MaryCalendar_/.test(key)) {
      vars[key.replace("MaryCalendar_", "")] = localStorage[key];
    }
  }
};

const getCookies = function () {
  const cookies = doc.cookie.match(/MaryCalendar_[^=]*=[^;]*/g);
  for (let cookie of cookies) {
    const key = cookie.match(/[^=]+/)[0]
      .replace("MaryCalendar_", "")
      .trim();
    const value = cookie.match(/=[^=]+/)[0]
      .replace("=", "")
      .trim();
    vars[key] = value;
  }
};

const getDefault = function () {
  setEquinox();
  vars.sunDown = "7:00";
  vars.selectedMonth = "Abib";
  vars.firstFruits = "26";
  vars.size = "336px";
  vars.theme = getTheme();
  vars.noSeconds = getNoSeconds();
};

const setEquinox = function () {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  const defaultEquinoxes = config.defaultEquinoxes;
  if (
    (currentMonth === 2 && currentDate <= 20 || currentMonth < 2) &&
    defaultEquinoxes[currentYear - 1]
  ) {
    vars.equinox = defaultEquinoxes[currentYear - 1];
  } else if (defaultEquinoxes[currentYear]) {
    vars.equinox = defaultEquinoxes[currentYear];
  } else {
    vars.safeMode = "on";
  }
};

const getTheme = function () {
  if (/^(Glory|Sky|Deep|Vital|Pure|Adam)$/.test(config.defaultTheme)) {
    return config.defaultTheme;
  } else {
    return "Sky";
  }
};

const getNoSeconds = function () {
  if (/^(false|true)$/.test(config.defaultNoSeconds)) {
    return String(config.defaultNoSeconds);
  } else {
    return "false";
  }
};

/* serializing */
const getSerializers = function () {
  if (config.disableSaving === true) {
    vars.save = disabled;
    vars.clear = disabled;
    vars.clearAll = clearAll;
    vars.result = "disabled";
    return;
  } else if (storageCheck) {
    vars.save = setStorage;
    vars.clear = clearStorage;
    vars.clearAll = clearAll;
    vars.result = "storage";
  } else if (cookieCheck) {
    vars.save = setCookies;
    vars.clear = clearCookies;
    vars.clearAll = clearAll;
    vars.result = "cookies";
  } else {
    vars.save = disabled;
    vars.clear = disabled;
    vars.clearAll = disabled;
    vars.result = null;
    return;
  }
};

const disabled = () => false;

const setStorage = function () {
  for (let key in this) {
    localStorage.setItem("MaryCalendar_" + key, this[key]);
  }
};

const setCookies = function () {
  const cookies = [];
  for (let key in this) {
    cookies.push("MaryCalendar_" + key + "=" + this[key]);
  }
  for (let cookie of cookies) {
    doc.cookie = cookie + "; path=/;";
  }
};

const clearStorage = function (key) {
  if (localStorage.length === 0) {
    return;
  }
  if (key) {
    localStorage.removeItem("MaryCalendar_" + key);
  } else {
    for (let key in localStorage) {
      if (/MaryCalendar_/.test(key)) {
        localStorage.removeItem(key);
      }
    }
  }
};

const clearCookies = function (key) {
  let cookies;
  if (!/MaryCalendar_/.test(doc.cookie)) {
    return;
  }
  if (key) {
    doc.cookie = "MaryCalendar_" + key.trim() + "=" +
      "; expires=Thu 01 Jan 1970; path=/;";
  } else {
    cookies = doc.cookie.match(/MaryCalendar_[^=]*=/g);
    for (let cookie of cookies) {
      doc.cookie = cookie.trim() +
        "; expires=Thu 01 Jan 1970; path=/;";
    }
  }
};

const clearAll = function () {
  if (storageCheck) {
    clearStorage.call(this);
  }
  if (cookieCheck) {
    clearCookies.call(this);
  }
};

/* initialize */
defineProps();
deserialize();
getSerializers();

/* exports */
return vars;

}, true);

MaryManage.define("model/calendar", [
  "utils"
], function modelCalendar(utils, require) {

/* constants */
const newObj = utils.newObj;
const padOneNumber = utils.padOneNumber;
const parseEquinox = utils.parseEquinox;
const parseSunDown = utils.parseSunDown;
const parseHours24 = utils.parseHours24;

/* constructor */
const Calendar = function (equinox, sunDown) {
  const calendar = newObj(Calendar.prototype);
  const data = newObj();
  data.equinox = parseEquinox(equinox);
  data.sunDown = parseSunDown(sunDown);
  getFirstDay(data);
  getTotalDays(data);
  generateHebrewMonths(data);
  generatePaganMonths(data);
  addSabbaths(data);
  addSpecials(data);
  ifLeapYear(data);
  generateHebrewYear(data);
  generatePaganYear(data);
  addDates(data);
  addDayNames(data);
  getCurrentDay(data);
  calendar.months = data.hebrewMonths;
  calendar.currentDay = data.currentDay;
  return calendar;
};

/* functions */
const getFirstDay = function ({equinox}) {
  // get the Gregorian day that equates to the start of Abib 1
  const data = arguments[0];
  const hours = equinox.hours;
  const minutes = padOneNumber(equinox.minutes);
  const cycle = equinox.cycle;
  const theTime = Number(hours + minutes);
  let day = Number(equinox.day);
  if (cycle === "PM" && theTime >= 730 && theTime < 1200) {
    // That is, if it's too late to see the sun equinox
    day += 1;
  }
  data.firstDay = day;
};

const getTotalDays = function ({equinox}) {
  // Hebrew year includes next February, which can be a leap year
  const data = arguments[0];
  const nextYear = Number(equinox.year) + 1;
  if (nextYear % 4 === 0) {
    data.totalDays = 366;
  } else {
    data.totalDays = 365;
  }
};

const generateLinks = function (monthArray) {
  monthArray.forEach(function (month, index, array) {
    array[month.name] = month;
  });
};

const generateHebrewMonths = function (data) {
  const Month = function (name, totalDays) {
    const month = newObj();
    month.name = name;
    month.totalDays = totalDays;
    for (let d = 1; d <= totalDays; d += 1) {
      month["day" + d] = newObj();
      month["day" + d].month = name;
      month["day" + d].day = String(d);
      month["day" + d].sabbath = "no"; // default
      month["day" + d].special = "none"; // default
      month["day" + d].date = "";
      month["day" + d].dayName = "";
    }
    return month;
  };
  const months = [
    Month("Abib", 30),
    Month("Zif", 30),
    Month("Sivan", 31),
    Month("Thammuz", 30),
    Month("Ab", 30),
    Month("Elul", 31),
    Month("Ethanim", 30),
    Month("Bul", 30),
    Month("Chisleu", 31),
    Month("Tebeth", 30),
    Month("Sebat", 30),
    Month("Adar", 32)
  ];
  generateLinks(months);
  data.hebrewMonths = months;
};

const generatePaganMonths = function (data) {
  const Month = function (name, totalDays) {
    const month = newObj();
    month.name = name;
    month.totalDays = totalDays;
    return month;
  };
  const months = [
    Month("January", 31),
    Month("February", 28),
    Month("March", 31),
    Month("April", 30),
    Month("May", 31),
    Month("June", 30),
    Month("July", 31),
    Month("August", 31),
    Month("September", 30),
    Month("October", 31),
    Month("November", 30),
    Month("December", 31)
  ];
  generateLinks(months);
  data.paganMonths = months;
};

const addSabbaths = function ({hebrewMonths}) {
  const hM = hebrewMonths;
  // m = month, d = day, m0 = Abib
  for (let m = 0; m < hM.length; m += 1) {
    if (m === 0 || m === 3 || m === 6 || m === 9) {
      for (let d = 1; d <= hM[m].totalDays; d += 1) {
        if (d === 4 || d === 11 || d === 18 || d === 25) {
          hM[m]["day" + d].sabbath = "yes";
        }
      }
    }
    if (m === 1 || m === 4 || m === 7 || m === 10) {
      for (let d = 1; d <= hM[m].totalDays; d += 1) {
        if (d === 2 || d === 9 || d === 16 || d === 23 || d === 30) {
          hM[m]["day" + d].sabbath = "yes";
        }
      }
    }
    if (m === 2 || m === 5 || m === 8 || m === 11) {
      for (let d = 1; d <= hM[m].totalDays; d += 1) {
        if (d === 7 || d === 14 || d === 21 || d === 28) {
          hM[m]["day" + d].sabbath = "yes";
        }
      }
    }
  }
};

const addSpecials = function ({hebrewMonths}) {
  const hM = hebrewMonths;
  // Adds Passover, and Feast of Unleavened Bread
  hM.Abib.day14.special = "Passover";
  hM.Abib.day15.special = "Feast of Unleavened Bread 1";
  hM.Abib.day15.sabbath = "yes";
  hM.Abib.day16.special = "Feast of Unleavened Bread 2";
  hM.Abib.day17.special = "Feast of Unleavened Bread 3";
  hM.Abib.day18.special = "Feast of Unleavened Bread 4";
  hM.Abib.day19.special = "Feast of Unleavened Bread 5";
  hM.Abib.day20.special = "Feast of Unleavened Bread 6";
  hM.Abib.day21.special = "Feast of Unleavened Bread 7";
  hM.Abib.day21.sabbath = "yes";
  hM.Abib.day26.special = "Feast of First Fruits";
  // Adds Make-Up Passover
  hM.Zif.day14.special = "Make-Up Passover";
  // Adds Feast of Weeks
  hM.Sivan.day15.special = "Feast of Weeks";
  hM.Sivan.day15.sabbath = "yes";
  // Adds Feast of Trumpets, Day of Atonement, and Feast of Tabernacles
  hM.Ethanim.day1.special = "Feast of Trumpets";
  hM.Ethanim.day1.sabbath = "yes";
  hM.Ethanim.day10.special = "Day of Atonement";
  hM.Ethanim.day10.sabbath = "yes";
  hM.Ethanim.day15.special = "Feast of Tabernacles 1";
  hM.Ethanim.day15.sabbath = "yes";
  hM.Ethanim.day16.special = "Feast of Tabernacles 2";
  hM.Ethanim.day17.special = "Feast of Tabernacles 3";
  hM.Ethanim.day18.special = "Feast of Tabernacles 4";
  hM.Ethanim.day19.special = "Feast of Tabernacles 5";
  hM.Ethanim.day20.special = "Feast of Tabernacles 6";
  hM.Ethanim.day21.special = "Feast of Tabernacles 7";
  hM.Ethanim.day22.special = "Feast of Tabernacles 8";
  hM.Ethanim.day22.sabbath = "yes";
  // Adds seasonal days
  hM.Sivan.day31.special = "Summer Season Day";
  hM.Elul.day31.special = "Fall Season Day";
  hM.Chisleu.day31.special = "Winter Season Day";
  hM.Adar.day31.special = "Spring Season Day";
  hM.Adar.day32.special = "Vernal Equinox / Free Day";
};

const ifLeapYear = function ({hebrewMonths, paganMonths, totalDays}) {
  const hM = hebrewMonths;
  const pM = paganMonths;
  if (totalDays === 366) {
    hM.Adar.totalDays = 33;
    pM.February.totalDays = 29;
    hM.Adar.day33 = newObj();
    hM.Adar.day33.month = "Adar";
    hM.Adar.day33.day = "33";
    hM.Adar.day33.sabbath = "no";
    hM.Adar.day33.special = "Vernal Equinox / Free Day";
    hM.Adar.day33.date = "";
    hM.Adar.day33.dayName = "";
  }
};

const generateHebrewYear = function ({hebrewMonths}) {
  // makes an array where each item is a day instead of a month
  const data = arguments[0];
  const year = [];
  for (let month of hebrewMonths) {
    for (let d = 1; d <= month.totalDays; d += 1) {
      year.push(month["day" + d]);
    }
  }
  data.hebrewYear = year;
};

const generatePaganYear = function ({paganMonths, equinox, firstDay}) {
  // makes an re-orders an array of dates from paganMonths
  const data = arguments[0];
  const equinoxYear = Number(equinox.year);
  let year = [];
  let nextYear;
  for (let month of paganMonths) {
    for (let d = 1; d <= month.totalDays; d += 1) {
      year.push(month.name + " " + d);
    }
  }
  firstDay = year.indexOf("March " + firstDay);
  nextYear = year.slice(0, firstDay);
  year = year.slice(firstDay);
  for (let [i, day] of year.entries()) {
    year[i] = day + " " + equinoxYear;
  }
  for (let [i, day] of nextYear.entries()) {
    nextYear[i] = day + " " + (equinoxYear + 1);
  }
  data.paganYear = [...year, ...nextYear];
};

const addDates = function ({equinox, hebrewYear, paganYear}) {
  let equinoxYear = Number(equinox.year);
  // Having matched arrays, we add each date to the Hebrew days
  for (let i = 0; i < hebrewYear.length; i += 1) {
    if (i === hebrewYear.length - 1) {
      // if the last day of the year
      hebrewYear[i].date =
        paganYear[i] + " - " + "Equinox " + (equinoxYear + 1);
    } else {
      hebrewYear[i].date =
        paganYear[i] + " - " + paganYear[i + 1];
    }
  }
};

const addDayNames = function ({equinox, firstDay, hebrewYear}) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const year = Number(equinox.year);
  let nightTime = new Date(year, 2, firstDay).getDay(); // March = 2
  let dayTime = nightTime + 1;
  hebrewYear.forEach(function (day) {
    nightTime = (nightTime === 7) ?
      0 : nightTime;
    dayTime = (dayTime === 7) ?
      0 : dayTime;
    day.dayName = dayNames[nightTime] + " - " + dayNames[dayTime];
    nightTime += 1;
    dayTime += 1;
  });
};

const getCurrentDay = function ({paganMonths, sunDown, hebrewYear}) {
  const data = arguments[0];
  const now = new Date();
  const month = paganMonths[now.getMonth()].name;
  const day = now.getDate();
  const hours12 = parseHours24(now.getHours());
  const hours = String(hours12.hours);
  const cycle = hours12.cycle;
  const minutes = padOneNumber(now.getMinutes());
  const year = now.getFullYear();
  const theTime = Number(hours + minutes);
  const sunDownHours = sunDown.hours;
  const sunDownMinutes = padOneNumber(sunDown.minutes);
  const sunDownTime = Number(sunDownHours + sunDownMinutes);
  let regexCurrentDate;
  if (cycle === "PM" && theTime >= sunDownTime && theTime < 1200) {
    regexCurrentDate = new RegExp("^" + month + " " + day + " " + year);
  } else {
    regexCurrentDate = new RegExp(month + " " + day + " " + year + "$");
  }
  for (let i = 0; i < hebrewYear.length; i += 1) {
    if (regexCurrentDate.test(hebrewYear[i].date)) {
      data.currentDay = hebrewYear[i];
      return;
    }
  }
};

/* prototype */
Calendar.prototype = newObj();
Calendar.prototype.constructor = Calendar;

Calendar.prototype.changeFirstFruits = function (day) {
  // defaults to Abib 26
  if (day === "19") {
    this.months.Abib.day19.special =
      "Feast of Unleavened Bread 5<br>" +
      "Feast of First Fruits";
    this.months.Abib.day26.special = "none";
    this.months.Sivan.day8.special = "Feast of Weeks";
    this.months.Sivan.day8.sabbath = "yes";
    this.months.Sivan.day15.special = "none";
    this.months.Sivan.day15.sabbath = "no";
  }
};

/* exports */
return Calendar;

});

//+++---Views---+++//
MaryManage.define("view/modals", [
  "utils",
  "MaryDom"
], function viewModals(utils, MaryDom, require) {

/* constants */
const newObj = utils.newObj;
const modals = newObj();

/* constructors */
modals.Error = function (message) {
  const error = MaryDom("<div></div>")
    .setHTML("<button>X</button>" + message)
    .style([
      "z-index: 10000",
      "position: fixed",
      "top: 3px",
      "right: 3px",
      "width: 336px",
      "padding: 12px",
      "background-color: whitesmoke",
      "border: 2px solid lightgrey"
    ])
    .find("button")
      .eq(0)
        .style([
          "position: absolute",
          "top: 3px",
          "right: 3px",
          "width: 24px",
          "background-color: transparent",
          "border: 0 none black"
        ])
        .on("click", function (event) {
          this.node.parentNode.remove();
        })
        .restore()
      .restore()
    .appendTo(document.body);
  return error;
};

modals.Alert = function (message) {
  const alert = MaryDom("<div></div>")
    .class("MaryCalendar_Modal")
    .addHTML("<div>" + message.replace(/\n/g, "<br>") + "</div>")
    .addHTML("<br><button>")
    .find("div")
      .class("MaryCalendar_ModalDiv")
      .restore()
    .find("button")
      .class("MaryCalendar_ModalButton")
      .setText("Ok")
      .on("click", function (event) {
        alert.remove();
      })
      .restore()
    .appendTo(getCurrentMain());
  return alert;
};

modals.Confirm = function (message, okay, cancel) {
  const confirm = MaryDom("<div></div>")
    .class("MaryCalendar_Modal")
    .addHTML("<div>" + message.replace(/\n/g, "<br>") + "</div>")
    .addHTML("<br><button><button>")
    .find("div")
      .class("MaryCalendar_ModalDiv")
      .restore()
    .find("button")
      .class("MaryCalendar_ModalButton")
      .setText(["Ok", "Cancel"], "spread")
      .on("click", function (event) {
        if (this.node.textContent === "Ok") {
          confirm.result = true;
          if (typeof okay === "function") {
            okay.call(confirm);
          }
        } else {
          confirm.result = false;
          if (typeof cancel === "function") {
            cancel.call(confirm);
          }
        }
        confirm.remove();
      })
      .restore()
    .appendTo(getCurrentMain());
  return confirm;
};

/* functions */
const getCurrentMain = function () {
  return MaryDom(".MaryCalendar_Main")
    .filter(function (node) {
      return node.style.display !== "none";
    });
};

/* exports */
return modals;

});

MaryManage.define("view/css", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "view/modals"
], function viewCSS(utils, MaryMessage, MaryDom, modals, require) {

/* constants */
const newObj = utils.newObj;
const isStandAlone = utils.isStandAlone();
const themes = newObj();
const sheet = (document.querySelector("#MaryCalendarCSS")) ?
  MaryDom("#MaryCalendarCSS") :
  MaryDom("<style id='MaryCalendarCSS'>").appendTo(document.head);

/* functions */
const tagSize = (function readyWrap() {
  const wrap = MaryDom("#MaryCalendar")
    .setHTML("")
    .style(["box-sizing: border-box;"]);
  const regex = function (possibleNumber) {
    if (/\d+/.test(possibleNumber)) {
      return possibleNumber.match(/\d+/)[0];
    } else {
      return 0;
    }
  };
  const getSize = function () {
    let size = Math.max(
      regex(wrap.getStyle("width")),
      regex(wrap.getStyle("height")),
      regex(wrap.getAttr("size")),
      regex(wrap.getAttr("length")),
      regex(wrap.getAttr("width")),
      regex(wrap.getAttr("height"))
    );
    if (size === 0) {
      size = "336px";
    } else {
      size += "px";
    }
    return size;
  };
  const error = "Sorry! MaryCalendar, she just couldn't find her home " +
    "tag! Can you make sure her tag is in the web page? It should look " +
    "like this: <pre>&lt;div id=\"MaryCalendar\"&gt;&lt;/div&gt;</pre> " +
    "If you have any more trouble, please take a look at the readme!";
  let size;
  if (!wrap.first) {
    modals.Error(error);
    throw new Error(
      error.replace(/<pre>|<\/pre>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
    );
  }
  size = getSize();
  if (isStandAlone === false) {
    MaryMessage.publish("override-initial-size", {
      size: size
    });
    wrap.style([
      "width: " + size,
      "height: " + size
    ]);
  }
  return size;
}());

const define = function (selector, classRules) {
  let style = selector + " {\n";
  for (let declaration of classRules) {
    declaration = (/;$/.test(declaration)) ?
      declaration : declaration + ";";
    style += "  " + declaration + "\n";
  }
  style += "}\n";
  sheet.addText(style);
};

const metaDefine = function (statement, selector, classRules) {
  let style = statement + " {\n" + "  " + selector + " {\n";
  for (let declaration of classRules) {
    declaration = (/;$/.test(declaration)) ?
      declaration : declaration + ";";
    style += "    " + declaration + "\n";
  }
  style += "  }\n}\n";
  sheet.addText(style);
};

const comment = function (comment) {
  if (!/^\/\*/.test(comment)) {
    comment = "/* " + comment;
  }
  if (!/\*\/$/.test(comment)) {
    comment = comment + " */";
  }
  sheet.addText("\n\n" + comment);
};

const curryRatio = function (base) {
  base = Number(base.match(/\d+/)[0]);
  return function ratio(px) {
    // px : 336 === x : base
    let x = px * base / 336;
    x = String(x).split(".");
    if (x[1]) {
      if (Number("." + x[1]) >= 0.75) {
        x = Number(x[0]) + 1;
      } else if (Number("." + x[1]) <= 0.25) {
        x = Number(x[0]);
      } else {
        x = Number(x[0] + ".5");
      }
    } else {
      x = Number(x[0]);
    }
    return String(x) + "px";
  };
};

const curryRatio$ = function (base) {
  base = Number(base.match(/\d+/)[0]);
  return function ratio$(px) {
    // px : 336 === x : base
    const x = px * base / 336;
    return String(x);
  };
};

/* palettes */
const g = {
  // glory
  _1: "#463505",
  _1T: "rgba(70, 53, 5, 0.84)",
  _2: "#ffe69c",
  _3: "#f5c63a",
  _4: "#806515",
  _5: "#a67c00"
};

const s = {
  // sky
  _1: "#b0cee6",
  _1T: "rgba(176, 206, 230, 0.84)",
  _2: "#7baace",
  _3: "#2a4d69",
  _4: "#eae6ef",
  _5: "#284f6f",
  _6: "#cbdfef"
};

const d = {
  // deep
  _1: "#011f4b",
  _1T: "rgba(1, 31, 75, 0.84)",
  _2: "#b3cde0",
  _3: "#6497b1",
  _4: "#03396c",
  _5: "#005b96"
};

const v = {
  // vital
  _1: "#1b332d",
  _1T: "rgba(27, 51, 45, 0.84)",
  _2: "#b7d6c2",
  _3: "#b7d4c0",
  _4: "#21504d",
  _5: "#255d4d",
  _6: "#6d3c21"
};

const p = {
  // pure
  _1: "#f0f0f5", //f5f5f9
  _1T: "rgba(247, 247, 247, 0.84)",
  _2: "#f7f7f7",
  _3: "#363a3a",
  _4: "#536878",
  _5: "#fdfeff",
  _6: "#fdfdff",
  _7: "#3295a5",
  _8: "#5168bb"
};

const a = {
  // adam
  _1: "#ffe0bd",
  _2: "#f7e0d6",
  _3: "#e35d6a",
  _3T: "rgba(227, 93, 106, 0.84)",
  _4: "#5f050e",
  _4T: "rgba(95, 5, 14, 0.84)",
  _5: "#fdd4c2",
  _6: "#f1bea8"
};

/* themes */
themes.Glory = {
  defBack: g._1,
  defText: g._2,
  h1Text: g._2,
  inputBack: g._3,
  inputBorder: g._4,
  placeholder: g._5,
  bodyBack: g._5,
  bodyBorder: g._4,
  navBack: g._3,
  navText: g._1,
  highBack: g._1,
  highText: g._2,
  popBack: g._1T,
  popBorder: g._1,
  popText: g._2,
  textareaBack: g._2,
  textareaBorder: g._1,
  textareaText: g._1T,
  timeBack: g._4,
  timeBorder: g._1,
  timeText: g._2,
  tabsBack: g._4,
  qAColor: g._2,
  regular: g._2,
  regularBack: g._1,
  regularBorder: g._3,
  regularText: g._2,
  special: "#FFFFF0",
  specialBack: g._1,
  specialBorder: "#f3f3da",
  specialText: "#FFFFF0",
  sabbath: "#e5e1e6",
  sabbathBack: g._1,
  sabbathBorder: "#c9c5cc",
  sabbathText: "#e5e1e6"
};

themes.Sky = {
  defBack: s._2,
  defText: s._3,
  h1Text: s._4,
  inputBack: s._4,
  inputBorder: s._1,
  placeholder: s._5,
  bodyBack: s._6,
  bodyBorder: s._1,
  navBack: s._4,
  navText: s._3,
  highBack: s._1,
  highText: s._5,
  popBack: s._1T,
  popBorder: s._2,
  popText: s._3,
  textareaBack: s._6,
  textareaBorder: s._2,
  textareaText: s._3,
  timeBack: s._1,
  timeBorder: s._2,
  timeText: s._5,
  tabsBack: s._1,
  qAColor: s._3,
  regular: s._3,
  regularBack: s._4,
  regularBorder: s._2,
  regularText: "#0071c7",
  special: "#881098",
  specialBack: "#ebe0ec",
  specialBorder: "#98669e",
  specialText: "#881098",
  sabbath: "#197d18",
  sabbathBack: "#d6e4d6",
  sabbathBorder: "#4d964c",
  sabbathText: "#197d18"
};

themes.Deep = {
  defBack: d._1,
  defText: d._2,
  h1Text: d._2,
  inputBack: d._3,
  inputBorder: d._4,
  placeholder: d._5,
  bodyBack: d._5,
  bodyBorder: d._4,
  navBack: d._3,
  navText: d._1,
  highBack: d._1,
  highText: d._2,
  popBack: d._1T,
  popBorder: d._1,
  popText: d._2,
  textareaBack: d._2,
  textareaBorder: d._1,
  textareaText: d._1T,
  timeBack: d._4,
  timeBorder: d._1,
  timeText: d._2,
  tabsBack: d._4,
  qAColor: d._2,
  regular: d._2,
  regularBack: "#335f64",
  regularBorder: d._3,
  regularText: "#ddebed",
  special: "#c7a1cc",
  specialBack: "#455475",
  specialBorder: "#738dc4",
  specialText: "#e3e8f3",
  sabbath: "#c7ca6e",
  sabbathBack: "#676333",
  sabbathBorder: "#ada656",
  sabbathText: "#eeeddd"
};

themes.Vital = {
  defBack: v._1,
  defText: v._2,
  h1Text: v._3,
  inputBack: v._2,
  inputBorder: v._4,
  placeholder: v._5,
  bodyBack: v._5,
  bodyBorder: v._4,
  navBack: v._6,
  navText: v._3,
  highBack: v._1,
  highText: v._2,
  popBack: v._1T,
  popBorder: v._6,
  popText: v._3,
  textareaBack: v._3,
  textareaBorder: v._6,
  textareaText: v._1T,
  timeBack: v._4,
  timeBorder: v._1,
  timeText: v._2,
  tabsBack: v._4,
  qAColor: v._2,
  regular: v._2,
  regularBack: "#27582d",
  regularBorder: "#75af7f",
  regularText: v._2,
  special: "#75cc6a",
  specialBack: "#27582d",
  specialBorder: "#5ec16b",
  specialText: "#75cc6a",
  sabbath: "#d8cc43",
  sabbathBack: "#27582d",
  sabbathBorder: "#c5b819",
  sabbathText: "#d8cc43"
};

themes.Pure = {
  defBack: p._6,
  defText: p._4,
  h1Text: p._3,
  inputBack: p._2,
  inputBorder: p._1,
  placeholder: p._4,
  bodyBack: p._5,
  bodyBorder: p._2,
  navBack: p._1,
  navText: p._3,
  highBack: p._3,
  highText: p._1,
  popBack: p._1T,
  popBorder: p._1,
  popText: p._4,
  textareaBack: p._1,
  textareaBorder: p._2,
  textareaText: p._3,
  timeBack: p._2,
  timeBorder: p._3,
  timeText: p._4,
  tabsBack: p._2,
  qAColor: p._4,
  regular: p._4,
  regularBack: p._1,
  regularBorder: p._2,
  regularText: p._4,
  special: p._7,
  specialBack: p._1,
  specialBorder: p._7,
  specialText: p._7,
  sabbath: p._8,
  sabbathBack: p._1,
  sabbathBorder: p._8,
  sabbathText: p._8
};

themes.Adam = {
  defBack: a._2,
  defText: a._4,
  h1Text: a._3,
  inputBack: a._1,
  inputBorder: a._6,
  placeholder: a._3,
  bodyBack: a._5,
  bodyBorder: a._6,
  navBack: a._1,
  navText: a._3,
  highBack: a._3,
  highText: a._1,
  popBack: a._4T,
  popBorder: a._2,
  popText: a._2,
  textareaBack: a._2,
  textareaBorder: a._2,
  textareaText: a._4,
  timeBack: a._6,
  timeBorder: a._3,
  timeText: a._4,
  tabsBack: a._6,
  qAColor: a._1,
  regular: a._4,
  regularBack: a._1,
  regularBorder: "#e29f82",
  regularText: a._4,
  special: "#6c61ce",
  specialBack: a._1,
  specialBorder: "#5449b7",
  specialText: "#6c61ce",
  sabbath: "#f12d40",
  sabbathBack: a._1,
  sabbathBorder: "#e04453",
  sabbathText: "#f12d40"
};

/* classes */
MaryMessage.subscribe("generate-css", function generateCSS({theme, size}) {

const t = themes[theme];
const s = (isStandAlone) ? 
  size : tagSize;
const r = curryRatio(s);
const r$ = curryRatio$(s);
sheet.setText("\n");

comment("/*+++---Stand-Alone Version Only---+++*/");
define(".MaryCalendarHTML", [
  "display: flex;",
  "flex-direction: column;",
  "justify-content: center;",
  "height: 76%;"
]);

metaDefine("@media screen and (max-height: 480px)", ".MaryCalendarHTML", [
  "display: block;",
  "height: 100%;"
]);

define(".MaryCalendarBODY", [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
  "width: 100%;",
  "margin: auto;",
  "background-color: " + t.defBack + ";",
  "text-align: center;",
  "font-family: 'Tahoma', 'Helvetica', sans-serif;",
  "font-size: " + r(16) + ";",
  "color: " + t.defText + ";"
]);

metaDefine("@media screen and (max-height: 480px)", ".MaryCalendarBODY", [
  "padding-top: 1px;"
]);

define(".MaryCalendarH1", [
  "padding: 0 " + r(12) + " 0 " + r(12) + ";",
  "font-family: serif;",
  "color: " + t.h1Text + ";"
]);

metaDefine("@media screen and (max-height: 480px)", ".MaryCalendarH1", [
  "display: none;"
]);

comment("/*+++---Calendar Wrap---+++*/");
define("#MaryCalendar", [
  "box-sizing: border-box;",
  "background-color: transparent;"
]);

comment("/*+++---Resets---+++*/");
define("#MaryCalendar input", [
  "background-color: " + t.inputBack + ";",
  "border: " + r(2) + " solid " + t.inputBorder + ";",
  "padding-left: " + r(3) + ";",
  "padding-right: " + r(3) + ";",
  "font-size: .84em;",
  "text-align: center;"
]);

define("#MaryCalendar textarea", [
  "font-size: .84em;"
]);

define("#MaryCalendar select", [
  "background-color: " + t.inputBack + ";",
  "border: " + r(2) + " solid " + t.inputBorder + ";",
  "font-size: .84em;"
]);

define("#MaryCalendar button", [
  "background: none;",
  "padding: 0;",
  "border: 0 solid transparent;",
  "color: " + t.defText + ";",
  "font-size: .84em;"
]);

define("#MaryCalendar input[type=checkbox]", [
  "transform: scale(" + r$(1) + ");"
]);

comment("/* box-sizing */");
define("#MaryCalendar *, #MaryCalendar *:before, #MaryCalendar *:after", [
  "box-sizing: inherit;"
]);

comment("/* focus highlights */");
define("#MaryCalendar *:focus", [
  "outline: 0;"
]);

define("#MaryCalendar button::-moz-focus-inner", [
  "border: 0;"
]);

comment("/* placeholder color */");
/* WebKit, Blink, Edge */
define("#MaryCalendar ::-webkit-input-placeholder", [
  "color: " + t.placeholder + ";"
]);

/* Mozilla Firefox 4 to 18 */
define("#MaryCalendar :-moz-placeholder", [
  "color: " + t.placeholder + ";",
  "opacity: 1;"
]);

/* Mozilla Firefox 19+ */
define("#MaryCalendar ::-moz-placeholder", [
  "color: " + t.placeholder + ";",
  "opacity: 1;"
]);

/* Internet Explorer 10-11 */
define("#MaryCalendar :-ms-input-placeholder", [
  "color: " + t.placeholder + ";"
]);

/* Microsoft Edge */
define("#MaryCalendar ::-ms-input-placeholder", [
  "color: " + t.placeholder + ";"
]);

comment("/*+++---Skeleton---+++*/");
define("#MaryCalendar .MaryCalendar_Main", [
  "display: flex;",
  "flex-direction: column;",
  "justify-content: center;",
  "align-items: center;",
  "position: relative;",
  "width: " + s + ";",
  "height: " + s + ";",
  "margin: auto;",
  "background-color: " + t.bodyBack + ";",
  "border: " + r(3) + " solid " + t.navBack + ";",
  "border-radius: " + r(12) + ";",
  "box-shadow: 0 0 " + r(30) + " " + t.bodyBack + ";",
  "text-align: center;",
  "letter-spacing: 0.03125em;", // .5px from 16
  "font-size: " + r(16) + ";",
  "font-family: 'Tahoma', 'Helvetica', sans-serif;",
  "color: " + t.defText + ";",
  // so annoying how firefox randomly selects stuff on a single click!
  "-moz-user-select: none;"
]);

metaDefine(
"@media screen and (max-width: 640px)",
"#MaryCalendar .MaryCalendar_Main", [
  "box-shadow: none;"
]);

define("#MaryCalendar .MaryCalendar_Header", [
  "display: flex;",
  "justify-content: center;",
  "width: 100%;",
  "height: 8%;",
  "background-color: " + t.navBack + ";",
  "border-radius: " + r(5) + " " + r(5) + " 0 0;"
]);

define("#MaryCalendar .MaryCalendar_Body", [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
  "position: relative;",
  "width: 100%;",
  "height: 75%;",
  "border-style: solid;",
  "border-width: " +
    r(2) + " " +
    r(1) + " " +
    r(2) + " " +
    r(1) + ";",
  "border-color: " + t.bodyBorder + ";"
]);

define("#MaryCalendar .MaryCalendar_Footer", [
  "display: flex;",
  "justify-content: center;",
  "align-items: center;",
  "position: relative;",
  "width: 100%;",
  "height: 17%;",
  "background-color: " + t.navBack + ";",
  "border-radius: 0 0 " + r(5) + " " + r(5) + ";"
]);

define("#MaryCalendar .MaryCalendar_Modal", [
  "z-index: 7;",
  "position: absolute;",
  "right: 12%;",
  "width: 76%;",
  "max-height: 76%;",
  "background-color: " + t.popBack + ";",
  "padding: " + r(12) + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(36) + ";",
  "color: "+ t.popText + ";",
  "font-size: .96em;"
]);

define("#MaryCalendar .MaryCalendar_ModalDiv", [
  "max-height: 11.5em",
  "overflow-y: auto",
  "padding: 3%"
]);

define("#MaryCalendar .MaryCalendar_ModalButton", [
  "width: " + r(72) + ";",
  "height: auto;",
  "margin: 0 " + r(6) + " 0 " + r(6) + ";",
  "padding: " + r(6) + ";",
  "background-color: " + t.popText + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(12) + ";",
  "color: " + t.popBack + ";"
]);

comment("/*+++---Header---+++*/");
define("#MaryCalendar .MaryCalendar_HeaderPrevious", [
  "width: 37%;",
  "height: 100%;",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_HeaderTitle", [
  "width: 26%;",
  "height: 100%;",
  "color: " + t.navText + ";",
  "font-size: 1em;"
]);

define("#MaryCalendar .MaryCalendar_HeaderNext", [
  "width: 37%;",
  "height: 100%;",
  "color: " + t.navText + ";"
]);

comment("/*+++---Calendar Body---+++*/");
define("#MaryCalendar .MaryCalendar_MonthJump", [
  "display: flex;",
  "justify-content: space-around;",
  "flex-wrap: wrap;",
  "position: absolute;",
  "top: " + r(-2) + ";",
  "z-index: 2;",
  "width: 66.67%;",
  "background-color: " + t.popBack + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(10) + ";"
]);

define(
"#MaryCalendar .MaryCalendar_MonthJump .MaryCalendar_GeneralButton", [
  "width: 50%;",
  "margin: 0;",
  "padding: " + r(7) + " 0 " + r(7) + " 0;",
  "color: " + t.popText + ";"
]);

define("#MaryCalendar .MaryCalendar_Row", [
  "display: flex;",
  "justify-content: center;",
  "align-items: center;",
  "position: relative;",
  "width: 89.635%", // 294px
  "height: 17.25%;" // 42px
]);

define("#MaryCalendar .MaryCalendar_RowButton", [
  "position: relative;",
  "width: 12.25%;", // 36px
  "height: 85.72%", // 36px
  "margin: auto;",
  "border: " + r(2) + " solid transparent;",
  "border-radius: " + r(10) + ";"
]);

define("#MaryCalendar .MaryCalendar_NoteIndicator", [
  "position: absolute;",
  "top: 8.33%;",
  "right: 8.33%;",
  "font-size: .6em;"
]);

define("#MaryCalendar .MaryCalendar_AlarmIndicator", [
  "position: absolute;",
  "top: 8.33%;",
  "left: 8.33%;",
  "font-size: .6em;"
]);

define(
"#MaryCalendar .MaryCalendar_RowPopup," +
"#MaryCalendar .MaryCalendar_RowNote", [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
  "position: absolute;",
  "top: 100%;", // 42px
  "z-index: 2;",
  "width: 100%;",
  "padding: " + r(5) + ";",
  "background-color: " + t.popBack + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(10) + ";",
  "color: " + t.popText + ";",
  "font-weight: normal;",
  "font-size: .84em;"
]);

define("#MaryCalendar .MaryCalendar_RowNote", [
  "height: 224%;", // of 42px
  "-moz-user-select: text;"
]);

define(
"#MaryCalendar .MaryCalendar_NoteText," +
"#MaryCalendar .MaryCalendar_NoteInput", [
  "width: 84%;", // of 294px
  "height: 100%;", // take up the rest of the div
  "font-size: .9em;"
]);

define("#MaryCalendar .MaryCalendar_NoteText", [
  "overflow-y: auto;",
  "padding: 0 " + r(3) + " 0 " + r(3) + ";",
  "background-color: transparent;",
  "color: " + t.popText + ";"
]);

define("#MaryCalendar .MaryCalendar_NoteInput", [
  "background-color: " + t.textareaBack + ";",
  "border: " + r(1) + " solid " + t.textareaBorder + ";",
  "resize: vertical;",
  "color: " + t.textareaText + ";"
]);

define(
"#MaryCalendar .MaryCalendar_NoteButtonLeft," +
"#MaryCalendar .MaryCalendar_NoteButtonRight", [
  "position: absolute;",
  "top: 3%;",
  "border-radius: " + r(10) + ";",
  "color: " + t.popText + ";",
  "font-size: .9em;",
  "font-variant: small-caps;",
  "letter-spacing: 0.0125em;" // .2px from 16
]);

define("#MaryCalendar .MaryCalendar_NoteButtonLeft", [
  "left: 3%;"
]);

define("#MaryCalendar .MaryCalendar_NoteButtonRight", [
  "right: 3%;"
]);

define("#MaryCalendar .MaryCalendar_Time", [
  "display: flex;",
  "flex-direction: column;",
  "justify-content: center;",
  "align-items: center;",
  "z-index: 1;",
  "min-width: 7.2em;",
  "height: 8.5%;",
  "padding: " + r(1) + " " + r(5) + " " + r(1) + " " + r(5) + ";",
  "background-color: " + t.timeBack + ";",
  "border: " + r(1) + " solid " + t.timeBorder + ";",
  "border-radius: " + r(12) + ";",
  "font-size: .84em;",
  "color: " + t.timeText + ";"
]);

define("#MaryCalendar .MaryCalendar_DayRegular", [
  "color: " + t.regular + ";"
]);

define("#MaryCalendar .MaryCalendar_DaySpecial", [
  "color: " + t.special + ";",
  "font-weight: bold;"
]);

define("#MaryCalendar .MaryCalendar_DaySabbath", [
  "color: " + t.sabbath + ";",
  "font-weight: bold;"
]);

define("#MaryCalendar .MaryCalendar_CurrentDayRegular", [
  "background-color: " + t.regularBack + ";",
  "border: " + r(2) + " solid " + t.regularBorder + ";",
  "color: " + t.regularText + ";"
]);

define("#MaryCalendar .MaryCalendar_CurrentDaySpecial", [
  "background-color: " + t.specialBack + ";",
  "border: " + r(2) + " solid " + t.specialBorder + ";",
  "color: " + t.specialText + ";"
]);

define("#MaryCalendar .MaryCalendar_CurrentDaySabbath", [
  "background-color: " + t.sabbathBack + ";",
  "border: " + r(2) + " solid " + t.sabbathBorder + ";",
  "color: " + t.sabbathText + ";"
]);

define("#MaryCalendar .MaryCalendar_RowButtonSelected", [
  "background-color: " + t.popBack + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  // this makes all three have the same color on highlight...
  "color: " + t.popText + ";"
]);

define("#MaryCalendar .MaryCalendar_SpecialPopUp", [
  "color: " + t.special + ";",
  "font-weight: bold;"
]);

define("#MaryCalendar .MaryCalendar_SabbathPopUp", [
  "color: " + t.sabbath + ";",
  "font-weight: bold;"
]);

comment("/*+++---Settings and License Body---+++*/");
define("#MaryCalendar .MaryCalendar_Tabs", [
  "display: flex;",
  "justify-content: space-around;",
  "position: absolute;",
  "top: 0%;",
  "right: 0%;",
  "width: 100%;",
  "height: 11.5%;",
  "background-color: " + t.tabsBack + ";",
  "border-bottom: " + r(2) + " solid " + t.navBack + ";"
]);

define("#MaryCalendar .MaryCalendar_TabButton", [
  "position: relative;",
  "top: " + r(2) + ";",
  "padding: 0 " + r(3) + " 0 " + r(3) + ";"
]);

define("#MaryCalendar .MaryCalendar_TabButtonSelected", [
  "background-color: " + t.bodyBack + ";",
  "border: " + r(2) + " solid " + t.navBack + ";",
  "border-bottom: 0;",
  "border-radius: " + r(6) + " " + r(6) + " 0 0;"
]);

define("#MaryCalendar .MaryCalendar_TabSection", [
  "margin: auto;",
  "background-color: " + t.bodyBack + ";",
  "font-size: .9em;",
  "letter-spacing: 0.04375em;", // .7px from 16
  "-moz-user-select: text;"
]);

define("#MaryCalendar .MaryCalendar_MoreDiv", [
  "margin: " + r(14) + ";"
]);

define("#MaryCalendar .MaryCalendar_BackupButton", [
  "margin: 0 " + r(12) + " 0 " + r(12) + ";",
  "font-size: 1.08em;",
  "font-variant: small-caps;"
]);

define("#MaryCalendar .MaryCalendar_BackupLink", [
  "display: block;",
  "margin-top: .6em;",
  "font-size: 1.08em;",
  "color: " + t.defText + ";"
]);

define("#MaryCalendar .MaryCalendar_Restore", [
  "width: 100%",
  "background-color: " + t.popText + ";",
  "color: " + t.popBack + ";"
]);

define("#MaryCalendar .MaryCalendar_Question", [
  "position: absolute;",
  "bottom: 3%;",
  "right: 2%;",
  "width: 7.4%;",
  "padding: " + r(3) + ";",
  "background-color: " + t.popBack + ";",
  "border: " + r(1) + " solid " + t.popBorder + ";",
  "border-radius: " + r(30) + ";",
  "color: " + t.qAColor + ";"
]);

define("#MaryCalendar .MaryCalendar_Answer", [
  "position: absolute;",
  "z-index: 2;",
  "top: 0%;",
  "right: 150%;",
  "width: 1212%;",
  "padding: " + r(3) + ";",
  "background-color: " + t.popBack + ";",
  "border: " + r(1) + " solid " + t.popBorder + ";",
  "border-radius: " + r(30) + ";",
  "font-size: .9em;",
  "color: " + t.qAColor + ";"
]);

define("#MaryCalendar .MaryCalendar_License", [
  "padding: " + r(10) + ";",
  "overflow-y: auto;",
  "font-size: .84em;",
  "text-align: left;",
  "letter-spacing: 0.0625em;", // 1px from 16
  "-moz-user-select: text;"
]);

comment("/*+++---Footer---+++*/");
define("#MaryCalendar .MaryCalendar_Now", [
  "width: 72.72%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_SettingsButton", [
  "position: absolute;",
  "bottom: 12%;",
  "right: 1%;",
  "width: 10.91%;",
  "height: 50%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_LicenseButton", [
  "position: absolute;",
  "bottom: 12%;",
  "left: 1%;",
  "width: 10.91%;",
  "height: 50%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_GeneralButton", [
  "width: 17%;",
  "height: 50%;",
  "margin: 0 3.03% 0 3.03%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_GeneralButtonHover", [
  "background-color: " + t.highBack + ";",
  "color: " + t.highText + ";"
]);

define("#MaryCalendar .MaryCalendar_Version", [
  "position: absolute;",
  "bottom: 0%;",
  "right: 0%;",
  "padding: " + r(7) + ";",
  "font-size: .72em;",
  "color: " + t.navText + ";"
]);

});

/* exports */
return true;

}, true);

MaryManage.define("view/main", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "view/modals"
], function viewMain(utils, MaryMessage, MaryDom, modals, require) {

/* constants */
const newObj = utils.newObj;
const freezeEvent = utils.freezeEvent;
const bubbleCheck = utils.bubbleCheck;
const isStandAlone = utils.isStandAlone();
const wrap = MaryDom("#MaryCalendar");
const main = newObj();
const doc = document;

/* generation */
const revealTitle = function () {
  if (isStandAlone) {
    MaryDom(".MaryCalendarH1")
      .style("display");
  }
};

const generateSkeleton = function () {
  main.all = MaryDom("<div></div>")
    .class("MaryCalendar_Main")
    .appendTo(wrap);
  main.header = MaryDom("<div></div>")
    .class("MaryCalendar_Header")
    .appendTo(main.all);
  main.body = MaryDom("<div></div>")
    .class("MaryCalendar_Body")
    .appendTo(main.all);
  main.footer = MaryDom("<div></div>")
    .class("MaryCalendar_Footer")
    .appendTo(main.all);
};

const generateHeader = function () {
  main.previousMonth = MaryDom("<button>")
    .class("MaryCalendar_HeaderPrevious")
    .addText("<<")
    .appendTo(main.header);
  main.monthTitle = MaryDom("<button>")
    .class("MaryCalendar_HeaderTitle")
    .addText("...")
    .appendTo(main.header);
  main.nextMonth = MaryDom("<button>")
    .class("MaryCalendar_HeaderNext")
    .addText(">>")
    .appendTo(main.header);
};

const generateMonthJump = function () {
  main.monthJump = MaryDom("<div></div>")
    .class("MaryCalendar_MonthJump")
    .style("display: none;")
    .appendTo(main.body);
  main.monthJumpButtons = MaryDom("<button>", main.body, 12)
    .class("MaryCalendar_GeneralButton")
    .addHTML("<span>")
    .appendTo(main.monthJump);
};

const generateRows = function () {
  main.rows = MaryDom("<div></div>", main.body, 5)
    .class("MaryCalendar_Row")
    .appendTo(main.body)
    .forEach(function (row) {
      MaryDom("<button>", row, 7)
        .class("MaryCalendar_RowButton")
        .appendTo(row);
      MaryDom("<div></div>", row, 7)
        .class("MaryCalendar_RowPopup")
        .style("display: none;")
        .appendTo(row);
      MaryDom("<div></div>", row, 7)
        .class("MaryCalendar_RowNote")
        .style("display: none;")
        .setText("Notes:")
        .appendTo(row);
    });
  main.days = MaryDom(".MaryCalendar_RowButton", main.body);
  main.popups = MaryDom(".MaryCalendar_RowPopup", main.body);
  main.notes = MaryDom(".MaryCalendar_RowNote", main.body);
};

const generateDays = function () {
  main.days.addHTML("<span></span><div>†</div><div>●</div>")
    .find("div")
      .class([
        "MaryCalendar_NoteIndicator",
        "MaryCalendar_AlarmIndicator"
      ], "checker")
      .style("display: none");
};

const generatePopups = function () {
  main.popups.forEach(function (popup) {
    MaryDom("<div></div>", popup, 5)
      .class("MaryCalendar_SpecialPopUp", 3)
      .class("MaryCalendar_SabbathPopUp", 4)
      .appendTo(popup);
    MaryDom("<button>note</button>")
      .class("MaryCalendar_NoteButtonRight")
      .appendTo(popup);
    MaryDom("<button>alarm</button>")
      .class("MaryCalendar_NoteButtonLeft")
      .appendTo(popup);
  });
  main.noteButtons = MaryDom(".MaryCalendar_NoteButtonRight", main.body);
  main.alarmButtons = MaryDom(".MaryCalendar_NoteButtonLeft", main.body);
};

const generateNotes = function () {
  main.notes.edit = MaryDom();
  main.notes.clear = MaryDom();
  main.notes.cancel = MaryDom();
  main.notes.save = MaryDom();
  main.notes.addHTML(
    "<div class='MaryCalendar_NoteText'></div>" +
    "<textarea class='MaryCalendar_NoteInput'></textarea>" +
    "<button class='MaryCalendar_NoteButtonLeft'>edit</button>" +
    "<button class='MaryCalendar_NoteButtonRight'>clear</button>" +
    "<button class='MaryCalendar_NoteButtonLeft'>cancel</button>" +
    "<button class='MaryCalendar_NoteButtonRight'>save</button>"
  )
    .children()
    .filter("button", function posCall(button) {
      if (/edit/.test(button.textContent)) {
        main.notes.edit = main.notes.edit.add(button);
      } else if (/clear/.test(button.textContent)) {
        main.notes.clear = main.notes.clear.add(button);
      } else if (/cancel/.test(button.textContent)) {
        main.notes.cancel = main.notes.cancel.add(button);
      } else {
        main.notes.save = main.notes.save.add(button);
      }
    });
  main.notes.text = MaryDom(".MaryCalendar_NoteText", main.body);
  main.notes.input = MaryDom(".MaryCalendar_NoteInput", main.body)
    .placeholder("type a note")
    .style("display: none");
  main.notes.cancel.style("display: none");
  main.notes.save.style("display: none");
};

const generateTime = function () {
  main.time = MaryDom("<div><div></div></div>")
    .class("MaryCalendar_Time")
    .appendTo(main.body)
    .firstChildren(0);
};

const generateFooter = function () {
  main.licenseButton = MaryDom("<button>")
    .class("MaryCalendar_LicenseButton")
    .addText("L")
    .appendTo(main.footer);
  main.now = MaryDom("<button>")
    .class("MaryCalendar_Now")
    .appendTo(main.footer);
  main.settingsButton = MaryDom("<button>")
    .class("MaryCalendar_SettingsButton")
    .addText("S")
    .appendTo(main.footer);
};

const hideDisabled = function () {
  if (config.disableSettings === true) {
    main.settingsButton.remove();
  }
  if (config.disableNotes === true) {
    main.notes.remove();
    main.noteButtons.remove();
  }
  if (config.disableAlarm === true) {
    main.alarmButtons.remove();
  }
};

/* checks */
const isCurrentYear = function () {
  if (/\d/.test(main.now.getText())) {
    return true;
  } else {
    return false;
  }
};

const isCurrentDay = function (index) {
  const day = main.days.eq(index).first;
  if (/Current/.test(day.classList.value)) {
    return true;
  } else {
    return false;
  }
};

const checkTarget = function (target) {
  return bubbleCheck(target, [
    "MaryCalendar_Modal",
    "MaryCalendar_RowPopup",
    "MaryCalendar_RowNote"
  ]);
};

/* toggles */
const closeMonthJump = function () {
  main.monthJump.style("display: none");
};

const closeAllPopups = function () {
  main.days.removeClass("MaryCalendar_RowButtonSelected");
  main.popups.style("display: none");
};

const closeAllNotes = function () {
  main.notes.style("display: none");
  noteCancel();
};

const closeAll = function (exception) {
  closeMonthJump();
  closeAllPopups();
  closeAllNotes();
};

const toggleMonthJump = function () {
  if (main.monthJump.getStyle("display") === "none") {
    main.monthJump.style("display");
  } else {
    main.monthJump.style("display: none");
  }
};

const togglePopup = function (index) {
  toggle(index, "popups");
};

const toggleNote = function (index) {
  toggle(index, "notes");
};

const toggle = function (index, type) {
  if (main[type].getStyle("display", index) === "none") {
    main.days.removeClass("MaryCalendar_RowButtonSelected");
    main[type].style("display: none");
    main.days.class("MaryCalendar_RowButtonSelected", index);
    main[type].style("display", index);
  } else {
    main.days.removeClass("MaryCalendar_RowButtonSelected");
    main[type].style("display: none");
  }
};

const toggleAlarm = function (index) {
  const alarm = main.days.eq(index)
    .find(".MaryCalendar_AlarmIndicator");
  let day;
  if (!isCurrentYear()) {
    return modals.Alert(
      "I'm sorry, it doesn't make sense to set the alarm for this year. " +
      "That's because the alarm only goes off during the current year. " +
      "Try setting it for another year! :)"
    );
  }
  if (isCurrentDay(index)) {
    return modals.Alert(
      "I'm sorry, it doesn't make sense to set the alarm for today. " +
      "That's because the alarm only goes off for the current day. " +
      "Try setting it for another day! :)"
    );
  }
  if (alarm.getStyle("display") === "") {
    alarm.style("display: none");
    day = null;
  } else {
    main.days.find(".MaryCalendar_AlarmIndicator")
      .style("display: none");
    alarm.style("display");
    day = index + 1;
  }
  MaryMessage.publish("save-alarm", {
    day: day
  });
};

const clearAlarm = function () {
  main.days.find(".MaryCalendar_AlarmIndicator")
    .style("display: none");
  MaryMessage.publish("save-alarm", {
    day: null
  });
};

/* notes */
const noteFromPopup = function (index) {
  setTimeout(function () {
    closeAllPopups();
    toggleNote(index);
  }, 200);
};

let noteEditFromPopup = function (index) {
  noteFromPopup(index);
  noteEdit(index);
};

const noteEdit = function (index) {
  main.notes.text.style("display: none", index);
  main.notes.input.eq(index).style("display");
  main.notes.edit.style("display: none", index);
  main.notes.clear.style("display: none", index);
  main.notes.cancel.style("display", index);
  main.notes.save.style("display", index);
  setTimeout(function () {
    main.notes.input.eq(index).first.focus();
  }, 100);
};

const noteClear = function (index) {
  main.notes.text.eq(index)
    .style("display")
    .setText("");
  main.notes.input.eq(index)
    .style("display: none")
    .value("");
  main.notes.edit.style("display", index);
  main.notes.clear.style("display", index);
  main.notes.cancel.style("display: none", index);
  main.notes.save.style("display: none", index);
  main.days.eq(index).find(".MaryCalendar_NoteIndicator")
    .style("display: none");
  MaryMessage.publish(
    "save-note",
    main.monthTitle.getText() + (index + 1) + ":" + ""
  );
};

const noteCancel = function (index) {
  main.notes.text.style("display", index);
  main.notes.input.style("display: none", index);
  main.notes.edit.style("display", index);
  main.notes.clear.style("display", index);
  main.notes.cancel.style("display: none", index);
  main.notes.save.style("display: none", index);
};

let noteSave = function (index) {
  const note = main.notes.input.eq(index)
    .value();
  main.notes.text.eq(index)
    .style("display")
    .setText(note); // make sure to keep as text, not HTML
  main.notes.input.style("display: none", index);
  main.notes.edit.style("display", index);
  main.notes.clear.style("display", index);
  main.notes.cancel.style("display: none", index);
  main.notes.save.style("display: none", index);
  if (note === "") {
    main.days.eq(index).find(".MaryCalendar_NoteIndicator")
      .style("display: none");
  } else {
    main.days.eq(index).find(".MaryCalendar_NoteIndicator")
      .style("display");
  }
  MaryMessage.publish(
    "save-note",
    main.monthTitle.getText() + (index + 1) + ":" + note
  );
};

const noteSaveOnEnter = function (event, index) {
  if (event.keyCode === 13) { // enter, return
    noteSave(index);
    event.preventDefault();
  }
};

const noteConfirmClear = function (index) {
  modals.Confirm(
    "Sure?",
    function okayThen() {
      noteClear(index);
    }
  );
};

/* initialize */
revealTitle();
generateSkeleton();
generateHeader();
generateMonthJump();
generateRows();
generateDays();
generatePopups();
generateNotes();
generateTime();
generateFooter();
hideDisabled();

/* handlers */
main.previousMonth.on("click", function (event) {
  closeAll();
  MaryMessage.publish("previous-month");
  freezeEvent(event);
});

main.nextMonth.on("click", function (event) {
  closeAll();
  MaryMessage.publish("next-month");
  freezeEvent(event);
});

main.monthTitle.on("click", function (event) {
  closeAllPopups();
  closeAllNotes();
  toggleMonthJump();
  freezeEvent(event);
});

main.monthJumpButtons.on("click", function (event) {
  closeAll();
  MaryMessage.publish("jump-month", {
    month: this.node.textContent
  });
  freezeEvent(event);
});

main.now.on("click", function (event) {
  closeAll();
  MaryMessage.publish("current-month");
  freezeEvent(event);
});

main.days.on("click", function (event) {
  closeMonthJump();
  closeAllNotes();
  togglePopup(this.index);
  freezeEvent(event);
});

main.days.on("dblclick", function (event) {
  closeMonthJump();
  closeAllPopups();
  toggleNote(this.index);
  freezeEvent(event);
});

main.alarmButtons.on("click", function (event) {
  toggleAlarm(this.index);
  freezeEvent(event);
});

main.noteButtons.on("click", function (event) {
  noteFromPopup(this.index);
  freezeEvent(event);
});

main.noteButtons.on("dblclick", function (event) {
  noteEditFromPopup(this.index);
  freezeEvent(event);
});

main.notes.text.on("dblclick", function (event) {
  noteEdit(this.index);
  freezeEvent(event);
});

main.notes.input.on("keypress", function (event) {
  noteSaveOnEnter(event, this.index);
  event.stopPropagation();
});

main.notes.edit.on("click", function (event) {
  noteEdit(this.index);
  freezeEvent(event);
});

main.notes.clear.on("click", function (event) {
  noteConfirmClear(this.index);
  freezeEvent(event);
});

main.notes.cancel.on("click", function (event) {
  noteCancel(this.index);
  freezeEvent(event);
});

main.notes.save.on("click", function (event) {
  noteSave(this.index);
  freezeEvent(event);
});

main.settingsButton.on("click", function (event) {
  MaryMessage.publish("switch-view", "settings");
  freezeEvent(event);
});

main.licenseButton.on("click", function (event) {
  MaryMessage.publish("switch-view", "license");
  freezeEvent(event);
});

MaryDom(doc).on("click", function closePopups(event) {
  if (checkTarget(event.target)) {
    return;
  }
  closeAll();
});

/* subscriptions */
MaryMessage.subscribe("set-month-jump", function setMonthJump({months}) {
  main.monthJumpButtons.setText(months, "spread");
});

MaryMessage.subscribe("change-title", function changeTitle({month}) {
  main.monthTitle.setText(month.name);
});

MaryMessage.subscribe("hide-extra-days", function hideExtra({month}) {
  const totalDays = month.totalDays - 1;
  main.days.filter(function limit(day, index) {
    return index > totalDays;
  }, function hide(day) {
    MaryDom(day).style(["z-index: -1", "font-size: 0"]);
  }, function show(day) {
    MaryDom(day).style(["z-index", "font-size"]);
  });
});

MaryMessage.subscribe("change-days", function changeDays({month}) {
  const totalDays = month.totalDays - 1;
  main.days.filter(function limit(day, index) {
    return index <= totalDays;
  }).wrapEach(function changeDay(day, index) {
    const dayNumber = index + 1;
    const dataDay = month["day" + dayNumber];
    day.defaultClass().find("span").setText(dayNumber);
    if (dataDay.special !== "none") {
      day.class("MaryCalendar_DaySpecial");
    } else if (dataDay.sabbath === "yes") {
      day.class("MaryCalendar_DaySabbath");
    } else {
      day.class("MaryCalendar_DayRegular");
    }
  });
});

MaryMessage.subscribe("set-current-day", function setToday({vars, today}) {
  let day;
  if (!today || (vars.selectedMonth !== today.month)) {
    return;
  }
  day = main.days.eq(today.day - 1);
  if (today.special !== "none") {
    day.class("MaryCalendar_CurrentDaySpecial");
  } else if (today.sabbath === "yes") {
    day.class("MaryCalendar_CurrentDaySabbath");
   } else {
    day.class("MaryCalendar_CurrentDayRegular");
  }
});

MaryMessage.subscribe("change-popups", function changePopups({month}) {
  const totalDays = month.totalDays - 1;
  main.popups.filter(function limit(day, index) {
    return index <= totalDays;
  }).wrapEach(function changePopup(popup, index) {
    const dayNumber = index + 1;
    const dataDay = month["day" + dayNumber];
    const children = popup.children();
    const special = (dataDay.special !== "none") ? dataDay.special : "";
    const sabbath = (dataDay.sabbath !== "no") ? "Sabbath" : "";
    children.eq(0).setText(dataDay.month + " " + dataDay.day);
    children.eq(1).setText(dataDay.dayName);
    children.eq(2).setText(dataDay.date);
    children.eq(3).setHTML(special);
    children.eq(4).setText(sabbath);
  });
});

MaryMessage.subscribe("change-now", function changeNow({today}) {
  if (today) {
    main.now.setHTML(
      today.month + " " + today.day + "<br>" +
      today.dayName + "<br>" +
      today.date
    );
  } else {
    main.now.setText("The current day is not in this year.");
  }
});

MaryMessage.subscribe("load-notes", function loadNotes({month, vars}) {
  const notes = [];
  for (let i = 1; i <= 35; i += 1) {
    notes.push(vars[month.name + i]);
  }
  notes.forEach(function (note, index, array) {
    if (note == null) {
      array[index] = "";
    }
  });
  main.notes.text.setText(notes, "spread"); // keep as text, not HTML
  main.notes.input.value(notes, "spread");
  main.days.forEach(function (button, index) {
    if (notes[index] !== "") {
      main.days.eq(index)
        .find(".MaryCalendar_NoteIndicator")
          .style("display");
    } else {
      main.days.eq(index)
        .find(".MaryCalendar_NoteIndicator")
          .style("display: none");
    }
  });
});

MaryMessage.subscribe("load-alarm", function loadAlarm({alarm}) {
  let month, index, indicator;
  if (alarm) {
    month = alarm.match(/\D+/)[0];
    index = Number(alarm.match(/\d+/)[0]) - 1;
  } else {
    return;
  }
  indicator = main.days
    .eq(index)
    .find(".MaryCalendar_AlarmIndicator");
  if (isCurrentYear() && main.monthTitle.getText() === month) {
    indicator.style("display");
  } else {
    indicator.style("display: none");
  }
});

MaryMessage.subscribe("change-time", function changeTime({time}) {
  main.time.setText(time);
});

MaryMessage.subscribe("remove-alarm", function removeAlarm() {
  clearAlarm();
});

MaryMessage.subscribe("switch-view", function switchView() {
  closeAllPopups();
});

MaryMessage.subscribe("disable-notes", function disableNotes() {
  noteEditFromPopup = function () {
    modals.Alert(
      "Sorry, note taking is disabled when there is no HTML5 local " +
      "storage facility. Browsers tend not to allow the amount of " +
      "space required to save a note within a cookie. :("
    );
  };
  noteSave = () => {};
  main.notes.remove();
});

/* exports */
return main;
  
}, true);

MaryManage.define("view/settings", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "view/modals"
], function viewSettings(utils, MaryMessage, MaryDom, modals, require) {

/* constants */
const newObj = utils.newObj;
const parseEquinox = utils.parseEquinox;
const parseSunDown = utils.parseSunDown;
const numberize = utils.numberize;
const freezeEvent = utils.freezeEvent;
const wrap = MaryDom("#MaryCalendar");
const settings = newObj();

/* generation */
const generateSkeleton = function () {
  settings.all = MaryDom("<div></div>")
    .class("MaryCalendar_Main")
    .style("display: none")
    .appendTo(wrap);
  settings.header = MaryDom("<div></div>")
    .class("MaryCalendar_Header")
    .appendTo(settings.all);
  settings.body = MaryDom("<div></div>")
    .class("MaryCalendar_Body")
    .appendTo(settings.all);
  settings.footer = MaryDom("<div></div>")
    .class("MaryCalendar_Footer")
    .appendTo(settings.all);
};

const generateHeader = function () {
  settings.title = MaryDom("<div></div>")
    .class("MaryCalendar_HeaderTitle")
    .addText("Settings")
    .appendTo(settings.header);
};

const generateBodyTabs = function () {
  settings.tabs = MaryDom("<div></div>")
    .class("MaryCalendar_Tabs")
    .appendTo(settings.body)
    .appendChildren(MaryDom("<button>", null, 4))
    .children(0)
    .class("MaryCalendar_TabButton")
    .setText(["Equinox", "Sundown", "First-Fruits", "More"], "spread");
};

const generateBodySections = function () {
  settings.sections = MaryDom("<div></div>", null, 4)
    .class("MaryCalendar_TabSection")
    .style("display: none")
    .appendTo(settings.body);
  generateEquinox(settings.sections.eq(0));
  generateSunDown(settings.sections.eq(1));
  generateFirstFruits(settings.sections.eq(2));
  generateMore(settings.sections.eq(3));
  generateQuestions();
};

const generateEquinox = function (section) {
  let selects, inputs;
  section.setHTML(
    "Active Equinox: <span>...</span><br><br>" +
    "<em>Change to:</em><br><br>" +
    "March <select></select> at <input> : <input> <select></select> <input>"
  );
  selects = MaryDom("select", section)
    .style("width: 4.4em")
    .option(["19", "20", "21"], 0)
    .option(["AM", "PM"], 1);
  inputs = MaryDom("input", section)
    .style(["width: 2.5em", "width: 2.5em", "width: 4em"], "spread")
    .placeholder(["hh", "mm", "yyyy"], "spread");
  settings.equinox = newObj();
  settings.equinox.text = MaryDom("span", section);
  settings.equinox.day = selects.eq(0);
  settings.equinox.hours = inputs.eq(0);
  settings.equinox.minutes = inputs.eq(1);
  settings.equinox.cycle = selects.eq(1);
  settings.equinox.year = inputs.eq(2);
};

const generateSunDown = function (section) {
  let inputs;
  section.setHTML(
    "Active Sundown: <span>...</span><br><br>" +
    "<em>Change to:</em><br><br>" +
    "<input> : <input> PM"
  );
  inputs = MaryDom("input", section)
    .style(["width: 2.5em", "width: 2.5em"], "spread")
    .placeholder(["hh", "mm"], "spread");
  settings.sunDown = newObj();
  settings.sunDown.text = MaryDom("span", section);
  settings.sunDown.hours = inputs.eq(0);
  settings.sunDown.minutes = inputs.eq(1);
};

const generateFirstFruits = function (section) {
  let selects;
  section.setHTML(
    "Active First-Fruits: <span>...</span><br><br>" +
    "<em>Change to:</em><br><br>" +
    "Abib <select></select>"
  );
  selects = MaryDom("select", section)
    .style("width: 4.4em")
    .option(["19", "26"])
    .selectOption("26");
  settings.firstFruits = newObj();
  settings.firstFruits.text = MaryDom("span", section);
  settings.firstFruits.day = selects.eq(0);
};

const generateMore = function (section) {
  let inputs, selects, buttons;
  section.setHTML(
    "<br><div>Create Dedicated Window? <input type='checkbox'></div>" +
    "<div>Hide Seconds on Clock? <input type='checkbox'></div>" +
    "<div>Reset Calendar? <input type='checkbox'></div>" +
    "<div>Change Theme: <select></select></div>" +
    "<div>Change Size: <select></select></div>" +
    "<button>backup</button><button>restore</button>"
  );
  section.find("div")
    .class("MaryCalendar_MoreDiv");
  inputs = MaryDom("input", section);
  selects = MaryDom("select", section)
    .style("width: 6em")
    .option(["Glory", "Sky", "Deep", "Vital", "Pure", "Adam"], 0)
    .option(["276px", "336px", "396px", "456px", "516px"], 1)
    .selectOption(["Sky", "336px"]);
  buttons = MaryDom("button", section)
    .class("MaryCalendar_BackupButton");
  settings.more = newObj();
  settings.more.newWindow = inputs.eq(0);
  settings.more.noSeconds = inputs.eq(1);
  settings.more.reset = inputs.eq(2);
  settings.more.theme = selects.eq(0);
  settings.more.size = selects.eq(1);
  settings.more.backup = buttons.eq(0);
  settings.more.restore = buttons.eq(1);
  settings.more.standAlone = section.find("div").eq([0, 4]);
};

const generateQuestions = function () {
  settings.questions = MaryDom("<button>", null, 3)
    .class("MaryCalendar_Question")
    .setText("?")
    .appendTo(settings.sections, "spread");
  settings.answers = MaryDom("<div></div>", null, 3)
    .class("MaryCalendar_Answer")
    .style("display: none")
    .setText([
      "Sets first day after equinox is observable.",
      "Sets when each day ends and begins.",
      "Sets First Fruits and the Feast of Weeks."
    ], "spread")
    .appendTo(settings.questions, "spread");
};

const generateFooter = function () {
  settings.save = MaryDom("<button>")
    .class("MaryCalendar_GeneralButton")
    .setText("Save")
    .appendTo(settings.footer);
  settings.cancel = MaryDom("<button>")
    .class("MaryCalendar_GeneralButton")
    .setText("Cancel")
    .appendTo(settings.footer);
};

/* functions */
const openTabSection = function (index) {
  settings.tabs.removeClass("MaryCalendar_TabButtonSelected");
  settings.tabs.class("MaryCalendar_TabButtonSelected", index);
  settings.sections.style("display: none");
  settings.sections.style("display", index);
};

const getCurrentTabSection = function () {
  const index = settings.sections.findIndex(function (node) {
    return node.style.display !== "none";
  });
  if (index != null) {
    return index;
  } else {
    return 0; // default
  }
};

const closeAnswers = function () {
  settings.answers.style("display: none");
};

const toggleAnswers = function () {
  if (settings.answers.first.style.display === "") {
    settings.answers.style("display: none");
  } else {
    settings.answers.style("display");
  }
};

const handleRestoreFile = function () {
  const hasFile = 
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob;
  const okay = function () {
    const input = MaryDom("input", this).first;
    if (input.files[0]) {
      const file = input.files[0];
      const reader = new window.FileReader();
      reader.onload = function restoring(event) {
        MaryMessage.publish("restore-backup", reader.result);
      };
      reader.readAsText(file);
    } else {
      return modals.Alert("No file was selected. Canceling.");
    }
  };
  if (hasFile) {
    return modals.Confirm(
      "Please select your backup file:<br><br>" +
      "<input type='file' class='MaryCalendar_Restore'></input><br><br>" +
      "and hit ok to proceed. Be aware that any previous notes will be " +
      "written over, so push cancel if you wish to make a backup first.",
      okay
    );
  } else {
    return modals.Alert(
      "I'm sorry, but your browser is not capable of handling " +
      "your backup file directly. I'm afraid your options are " +
      "to input your data manually, or to get a newer browser.<br>:("
    );
  }
};

const getDataForSave = function () {
  return {
    eDay: settings.equinox.day.value(),
    eHours: numberize(settings.equinox.hours.value()),
    eMinutes: numberize(settings.equinox.minutes.value()),
    eCycle: settings.equinox.cycle.value(),
    eYear: numberize(settings.equinox.year.value()),
    sHours: numberize(settings.sunDown.hours.value()),
    sMinutes: numberize(settings.sunDown.minutes.value()),
    firstFruits: settings.firstFruits.day.value(),
    newWindow: settings.more.newWindow.checked(),
    noSeconds: settings.more.noSeconds.checked(),
    reset: settings.more.reset.checked(),
    theme: settings.more.theme.value(),
    size: settings.more.size.value()
  };
};

const getDataForTheme = function () {
  return {
    theme: settings.more.theme.value(),
    size: settings.more.size.value()
  };
};

/* initialize */
generateSkeleton();
generateHeader();
generateBodyTabs();
generateBodySections();
generateFooter();

/* handlers */
settings.tabs.on("click", function (event) {
  openTabSection(this.index);
  freezeEvent(event);
});

settings.more.theme.on("change", function (event) {
  MaryMessage.publish("change-theme", getDataForTheme());
});

settings.more.size.on("change", function (event) {
  MaryMessage.publish("change-theme", getDataForTheme());
});

settings.more.backup.on("click", function (event) {
  MaryMessage.publish("get-backup");
});

settings.more.restore.on("click", function (event) {
  handleRestoreFile();
});

settings.questions.on("click", function (event) {
  toggleAnswers();
  freezeEvent(event);
});

settings.save.on("click", function (event) {
  MaryMessage.publish("save", getDataForSave());
  freezeEvent(event);
});

settings.cancel.on("click", function (event) {
  MaryMessage.publish("switch-view", "main");
  MaryMessage.publish("cancel");
  freezeEvent(event);
});

/* subscriptions */
MaryMessage.subscribe("refresh-equinox", function refreshEquinox({vars}) {
  const equinox = parseEquinox(vars.equinox);
  for (let key in settings.equinox) {
    if (key !== "text") {
      settings.equinox[key].value(equinox[key]);
    }
  }
  settings.equinox.text.setText(vars.equinox);
});

MaryMessage.subscribe("refresh-sundown", function refreshSunDown({vars}) {
  const sunDown = parseSunDown(vars.sunDown);
  for (let key in sunDown) {
    if (key !== "text") {
      settings.sunDown[key].value(sunDown[key]);
    }
  }
  settings.sunDown.text.setText(vars.sunDown + " PM");
});

MaryMessage.subscribe("refresh-fruits", function refreshFruits({vars}) {
  settings.firstFruits.day.value(vars.firstFruits);
  settings.firstFruits.text.setText("Abib " + vars.firstFruits);
});

MaryMessage.subscribe("refresh-more", function refreshMore({vars}) {
  if (vars.noSeconds === "true") {
    settings.more.noSeconds.checked(true);
  } else {
    settings.more.noSeconds.checked(false);
  }
  settings.more.theme.value(vars.theme);
  settings.more.size.value(vars.size);
  MaryMessage.publish("change-theme");
  openTabSection(getCurrentTabSection());
});

MaryMessage.subscribe("download-backup", function backup({filename, text}) {
  const message =
    "MaryCalendar just created a text file with all your notes!!! " +
    "You can use this file to <em>restore</em> them too, but you " +
    "must keep the JSON format and the same day names, okay?<br>";
  const addendum =
    "<br>(Use 'save link as...' in the context menu to download.)";
  const link = MaryDom("<a></a>")
    .class("MaryCalendar_BackupLink")
    .setText("Download")
    .attr([
      "target=_blank",
      "download=" + filename,
      "href=data:text/plain," + encodeURIComponent(text)
    ]);
  if ("download" in link.first) {
    modals.Alert(message + link.getAsHTML());
  } else {
    modals.Alert(message + link.getAsHTML() + addendum);
  }
});

MaryMessage.subscribe("enter-safeMode", function enterSafeMode() {
  MaryMessage.publish("switch-view", "settings");
  MaryMessage.publish("change-theme");
  openTabSection(getCurrentTabSection());
  settings.cancel.style("display: none");
  settings.tabs.filter(function getExtraTabs(node, index) {
    return index >= 2;
  }, function hideExtraTabs(node, index) {
    settings.tabs.style("display: none", index);
  });
  modals.Alert(
    "Please input an equinox and sundown time, then save.<br><br>" +
    "If cookies are enabled I can remember your settings."
  );
});

MaryMessage.subscribe("exit-safeMode", function exitSafeMode() {
  settings.cancel.style("display");
  settings.tabs.style("display");
  MaryMessage.publish("initialize");
});

MaryMessage.subscribe("auto-save", function autoSave() {
  settings.save.first.click();
});

MaryMessage.subscribe("disable-stand-alone", function disableStandAlone() {
  settings.more.standAlone.remove();
});

/* exports */
return settings;
  
}, true);

MaryManage.define("view/license", [
  "utils",
  "MaryMessage",
  "MaryDom"
], function viewLicense(utils, MaryMessage, MaryDom, require) {

/* constants */
const newObj = utils.newObj;
const freezeEvent = utils.freezeEvent;
const wrap = MaryDom("#MaryCalendar");
const license = newObj();

/* generation */
const generateSkeleton = function () {
  license.all = MaryDom("<div></div>")
    .class("MaryCalendar_Main")
    .style("display: none")
    .appendTo(wrap);
  license.header = MaryDom("<div></div>")
    .class("MaryCalendar_Header")
    .appendTo(license.all);
  license.body = MaryDom("<div></div>")
    .class("MaryCalendar_Body")
    .appendTo(license.all);
  license.footer = MaryDom("<div></div>")
    .class("MaryCalendar_Footer")
    .appendTo(license.all);
};

const generateHeader = function () {
  license.title = MaryDom("<div></div>")
    .class("MaryCalendar_HeaderTitle")
    .addText("License")
    .appendTo(license.header);
};

const generateBody = function () {
  license.text = MaryDom("<div></div>")
    .class("MaryCalendar_License")
    .appendTo(license.body);
};

const generateFooter = function () {
  license.amen = MaryDom("<button>")
    .class("MaryCalendar_GeneralButton")
    .setText("Amen!")
    .appendTo(license.footer);
  license.version = MaryDom("<div></div>")
    .class("MaryCalendar_Version")
    .setText(MaryCalendarVersion)
    .appendTo(license.footer);
};

/* initialize */
generateSkeleton();
generateHeader();
generateBody();
generateFooter();

/* handlers */
license.amen.on("click", function (event) {
  MaryMessage.publish("switch-view", "main");
  freezeEvent(event);
});

/* html */
license.text.addHTML(String.raw`
Copyright © 2022 r-neal-kelly<br>
Copyright © 2017 נהאל<br>
https://github.com/r-neal-kelly/mary_calendar
<br><br>
Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)<br>
https://creativecommons.org/licenses/by-nc-sa/4.0/
<br><br>
Any user-input found in the program is entirely left under the domain of 
the brother or sister who entered it in.
<br><br>

<div style="text-align: center">~~~~~~~~~~</div><br>

FEATURES:
<br><br>
<div style="font-size: .96em">
  <ul style="margin: auto; padding-left: 2em">
    <li>Sabbaths and Feast Days</li>
    <li>offline use</li>
    <li>note-taking</li>
    <li>a day-change alarm</li>
    <li>themes</li>
  </ul>
</div><br>

OPTIONS:
<br><br>
<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>set equinox from 1 A.D onwards</li>
    <li>set when sundown occurs</li>
    <li>set the Feast of First Fruits</li>
    <li>back up and restore notes</li>
    <li>embed MaryCalendar in your site (1)</li>
    <li>and more (2)</li>
  </ul>
</div><br>

REQUIRES:
<br><br>
<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>an up-to-date browser</li>
    <li>JavaScript</li>
    <li>cookies if you want to save (3)</li>
  </ul>
</div><br>

<div style="text-align: center">~~~~~~~~~~</div><br>

<div style="text-align: center">(1) How to Embed:</div><br>

This is the minimum html required to embed MaryCalendar in your site:
<br><br>

<div style="font-size: .9em; padding-left: 2em">
  &lt;meta charset="utf-8"&gt;<br>
  &lt;script src="MaryCalendar.js"&gt;&lt;/script&gt;<br>
  &lt;div id="MaryCalendar"&gt;&lt;/div&gt;
</div><br>

<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>A &lt;meta&gt; tag with UTF-8 or higher.</li>
    <li>A script tag containing where to find MaryCalendar. This example 
    assumes she's in the same directory as the html file loading her.</li>
    <li>A div with the id "MaryCalendar". This is her home, so take care 
    of her, alright?</li>
  </ul>
</div><br>

She defaults to a size of 336px squared, but you can change this in 
her tag, like so:
<br><br>

<div style="font-size: .9em; padding-left: 2em">
  &lt;div id="MaryCalendar" size="420px"&gt;&lt;/div&gt;
</div><br>

<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>The suggested minimum size is 216px.</li>
    <li>Along with the size, you may style her tag however you like. But 
    she will override three properties: border-box, width, and height. 
    Width and height are set to your chosen size, and border-box ensures 
    an accurate rendering.</li>
    <li>And although it's not required that you use a &lt;div&gt; tag, 
    some other tags may not behave as expected.</li>
    <li>She should not interfere with any of your CSS and hopefully none 
    of your JavaScript. She does use local storage (or document.cookie) 
    to save (3). So don't completely clear them, and everything should 
    be okay.</li>
  </ul>
</div><br>

<div style="text-align: center">(2) How to Config</div><br>

Besides the options that are in her settings, you can also configure 
the JavaScript manually by changing the values in the "config" object 
near the top of MaryCalendar.js
<br><br>

<div style="text-align: center">(3) A Note on Saving</div><br>

Enabled cookies allows for the preferred saving method: HTML5 Local 
Storage. But if the browser doesn't have local storage, MaryCalendar 
will still try to save settings with cookies, however not any notes. 
This is due to cookie-size constraints on some browsers. Saving can be 
completely disabled in the config, or by turning off cookies altogether.
<br><br>

If you want to see what MaryCalendar is storing, open the browser's 
console and type in "localStorage" and/or "document.cookie". She uses 
the prefix "MaryCalendar_" for all her variables.
<br><br>

<div style="text-align: center">Don't Panic</div><br>

During testing, I encountered a rare bug that ended up with me not being 
able to access any of my notes. The bug is fixed now, but should there 
ever be any difficulty getting to your notes in MaryCalendar, 
you can copy and paste the following code into your browser's console 
while the current web page containing her is open. (To access the 
console try hitting 'F12' on your keyboard or looking in the options 
menu. Mobile generally doesn't allow access to the console, so try 
this on desktop/laptop.)<br>

<div style="font-size: .84em; white-space: pre; padding-left: 2em">
(function getNotes() {
  const notes = Object.create(null);
  for (let key in localStorage) {
    if (/MaryCalendar_.*\d$/.test(key)) {
      let prop = key.replace(/[^_]+_/, "");
      notes[prop] = localStorage[key];
    }
  }
  return JSON.stringify(notes, null, "  ")
    .replace(/\n/g, "\n\n");
}());
</div><br>

Now you can copy her text and save it in any text editor. Make sure to 
leave out any quotes next to the '{' and '}' symbols. After resetting the 
calendar, you can try restoring your notes normally.
<br><br>

<div style="text-align: center">~~~~~~~~~~</div><br>

<div style="text-align: center">
(א) Inspiration from the Scripture (ת)
</div><br>

<div style="text-align: center">
~~~Matthew 5:17-20~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">17</span>
Think not that I am come to destroy the law, or the prophets: I am not 
come to destroy, but to fulfil. 
<span style="font-size: .76em">18</span>
For verily I say unto you, Till heaven and earth pass one jot or one 
tittle shall in no wise pass from the law, till all be fulfilled. 
<span style="font-size: .76em">19</span>
Whosoever therefore shall break one of these least commandments, and 
shall teach men so, he shall be called the least in the kingdom of 
heaven: but whosoever shall do and teach them, the same shall be called 
great in the kingdom of heaven. 
<span style="font-size: .76em">20</span>
For I say unto you, that except your righteousness shall exceed the 
righteousness of the scribes and Pharisees, ye shall in no case enter 
into the kingdom of heaven.
</div>
<br>

<div style="text-align: center">
~~~Matthew 22:34-40~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">34</span>
But when the Pharisees had heard that he had put the Sadducees to silence, 
they were gathered together.
<span style="font-size: .76em">35</span>
Then one of them, which was a lawyer, asked him a question, tempting him, 
and saying,
<span style="font-size: .76em">36</span>
Master, which is the great commandment in the law?
<span style="font-size: .76em">37</span>
Yahshua said unto him, Thou shalt love Yahweh thy God with all thy heart, 
and with all thy soul, and with all thy mind.
<span style="font-size: .76em">38</span>
This is the first and great commandment.
<span style="font-size: .76em">39</span>
And the second is like unto it, Thou shalt love thy fellow kin as thyself.
<span style="font-size: .76em">40</span>
On these two commandments hang all the law and the prophets.
</div>
<br>

<div style="text-align: center">
~~~John 14:15~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">15</span> 
If ye love me, keep my commandments.
</div><br>

<div style="text-align: center">
~~~John 15:10~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">10</span> 
If ye keep my commandments, ye shall abide in my love; even as I have 
kept my Father's commandments, and abide in his love.
</div><br>

<div style="text-align: center">
~~~Leviticus 23~~~
</div><br>

<div style="font-size: .96em">

<div style="text-align: center; font-variant: small-caps">
Feasts of Yahweh
</div><br>

<span style="font-size: .76em">1</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">2</span>
Speak unto the children of Israel, and say unto them, Concerning the 
feasts of Yahweh, which ye shall proclaim to be holy convocations, even 
these are my feasts.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Sabbath
</div><br>

<span style="font-size: .76em">3</span>
Six days shall work be done: but the seventh day is the sabbath of rest, 
an holy convocation; ye shall do no work therein: it is the sabbath of 
Yahweh in all your dwellings.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Passover
</div><br>

<span style="font-size: .76em">4</span>
These are the feasts of Yahweh, even holy convocations, which ye shall 
proclaim in their seasons.
<span style="font-size: .76em">5</span>
In the fourteenth day of the first month at even is Yahweh's passover.
<span style="font-size: .76em">6</span>
And on the fifteenth day of the same month is the feast of unleavened 
bread unto Yahweh: seven days ye must eat unleavened bread.
<span style="font-size: .76em">7</span>
In the first day ye shall have an holy convocation: ye shall do no 
servile work therein.
<span style="font-size: .76em">8</span>
But ye shall offer an offering made by fire unto Yahweh seven days: in 
the seventh day is an holy convocation: ye shall do no servile work 
therein.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Firstfruits
</div><br>

<span style="font-size: .76em">9</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">10</span>
Speak unto the children of Israel, and say unto them, When ye be come 
into the land which I give unto you, and shall reap the harvest thereof, 
then ye shall bring a sheaf of the firstfruits of your harvest unto 
the priest:
<span style="font-size: .76em">11</span>
And he shall wave the sheaf before Yahweh, to be accepted for you: on 
the morrow after the sabbath the priest shall wave it.
<span style="font-size: .76em">12</span>
And ye shall offer that day when ye wave the sheaf an he lamb without 
blemish of the first year for a burnt offering unto Yahweh.
<span style="font-size: .76em">13</span>
And the meat offering thereof shall be two tenth deals of fine flour 
mingled with oil, an offering made by fire unto Yahweh for a sweet 
savour: and the drink offering thereof shall be of wine, the fourth 
part of an hin.
<span style="font-size: .76em">14</span>
And ye shall eat neither bread, nor parched corn, nor green ears, until 
the selfsame day that ye have brought an offering unto your God: it 
shall be a statute for ever throughout your generations in all your 
dwellings.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Weeks
</div><br>

<span style="font-size: .76em">15</span>
And ye shall count unto you from the morrow after the sabbath, from the 
day that ye brought the sheaf of the wave offering; seven sabbaths 
shall be complete:
<span style="font-size: .76em">16</span>
Even unto the morrow after the seventh sabbath shall ye number fifty 
days; and ye shall offer a new meat offering unto Yahweh.
<span style="font-size: .76em">17</span>
Ye shall bring out of your habitations two wave loaves of two tenth 
deals: they shall be of fine flour; they shall be baken with leaven; 
they are the firstfruits unto Yahweh.
<span style="font-size: .76em">18</span>
And ye shall offer with the bread seven lambs without blemish of the 
first year, and one young bullock, and two rams: they shall be for a 
burnt offering unto Yahweh, with their meat offering, and their drink 
offerings, even an offering made by fire, of sweet savour unto Yahweh.
<span style="font-size: .76em">19</span>
Then ye shall sacrifice one kid of the goats for a sin offering, and 
two lambs of the first year for a sacrifice of peace offerings.
<span style="font-size: .76em">20</span>
And the priest shall wave them with the bread of the firstfruits for 
a wave offering before Yahweh, with the two lambs: they shall be holy 
to Yahweh for the priest.
<span style="font-size: .76em">21</span>
And ye shall proclaim on the selfsame day, that it may be an holy 
convocation unto you: ye shall do no servile work therein: it shall be 
a statute for ever in all your dwellings throughout your generations.
<span style="font-size: .76em">22</span>
And when ye reap the harvest of your land, thou shalt not make clean 
riddance of the corners of thy field when thou reapest, neither shalt 
thou gather any gleaning of thy harvest: thou shalt leave them unto the 
poor, and to the stranger: I am Yahweh your God.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Trumpets
</div><br>

<span style="font-size: .76em">23</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">24</span>
Speak unto the children of Israel, saying, In the seventh month, in the 
first day of the month, shall ye have a sabbath, a memorial of blowing 
of trumpets, an holy convocation.
<span style="font-size: .76em">25</span>
Ye shall do no servile work therein: but ye shall offer an offering made 
by fire unto Yahweh.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Day of Atonement
</div><br>

<span style="font-size: .76em">26</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">27</span>
Also on the tenth day of this seventh month there shall be a day of 
atonement: it shall be an holy convocation unto you; and ye shall 
afflict your souls, and offer an offering made by fire unto Yahweh.
<span style="font-size: .76em">28</span>
And ye shall do no work in that same day: for it is a day of atonement, 
to make an atonement for you before Yahweh your God.
<span style="font-size: .76em">29</span>
For whatsoever soul it be that shall not be afflicted in that same day, 
he shall be cut off from among his people.
<span style="font-size: .76em">30</span>
And whatsoever soul it be that doeth any work in that same day, the same 
soul will I destroy from among his people.
<span style="font-size: .76em">31</span>
Ye shall do no manner of work: it shall be a statute for ever throughout 
your generations in all your dwellings.
<span style="font-size: .76em">32</span>
It shall be unto you a sabbath of rest, and ye shall afflict your souls: 
in the ninth day of the month at even, from even unto even, shall ye 
celebrate your sabbath.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Tabernacles
</div><br>

<span style="font-size: .76em">33</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">34</span>
Speak unto the children of Israel, saying, The fifteenth day of this 
seventh month shall be the feast of tabernacles for seven days unto Yahweh.
<span style="font-size: .76em">35</span>
On the first day shall be an holy convocation: ye shall do no servile 
work therein.
<span style="font-size: .76em">36</span>
Seven days ye shall offer an offering made by fire unto Yahweh: on the 
eighth day shall be an holy convocation unto you; and ye shall offer an 
offering made by fire unto Yahweh: it is a solemn assembly; and ye shall 
do no servile work therein.
<span style="font-size: .76em">37</span>
These are the feasts of Yahweh, which ye shall proclaim to be holy 
convocations, to offer an offering made by fire unto Yahweh, a burnt 
offering, and a meat offering, a sacrifice, and drink offerings, every 
thing upon his day:
<span style="font-size: .76em">38</span>
Beside the sabbaths of Yahweh, and beside your gifts, and beside all 
your vows, and beside all your freewill offerings, which ye give unto 
Yahweh.
<span style="font-size: .76em">39</span>
Also in the fifteenth day of the seventh month, when ye have gathered 
in the fruit of the land, ye shall keep a feast unto Yahweh seven days: 
on the first day shall be a sabbath, and on the eighth day shall be a 
sabbath.
<span style="font-size: .76em">40</span>
And ye shall take you on the first day the boughs of goodly trees, 
branches of palm trees, and the boughs of thick trees, and willows of 
the brook; and ye shall rejoice before Yahweh your God seven days.
<span style="font-size: .76em">41</span>
And ye shall keep it a feast unto Yahweh seven days in the year. It 
shall be a statute for ever in your generations: ye shall celebrate it 
in the seventh month.
<span style="font-size: .76em">42</span>
Ye shall dwell in booths seven days; all that are Israelites born shall 
dwell in booths:
<span style="font-size: .76em">43</span>
That your generations may know that I made the children of Israel to 
dwell in booths, when I brought them out of the land of Egypt: I am 
Yahweh your God.
<span style="font-size: .76em">44</span>
And Moses declared unto the children of Israel the feasts of Yahweh.
</div><br>

<div style="text-align: center">
~~~I Corinthians 5:7-8~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">7</span>
Purge out therefore the old leaven, that ye may be a new lump, as ye 
are unleavened. For even Christ our passover is sacrificed for us:
<span style="font-size: .76em">8</span>
Therefore let us keep the feast, not with old leaven, neither with the 
leaven of malice and wickedness; but with the unleavened bread of 
sincerity and truth.
</div>
`);

/* exports */
return license;

}, true);

MaryManage.define("view/commons", [
  "utils",
  "MaryMessage",
  "MaryDom"
], function viewCommons(utils, MaryMessage, MaryDom, require) {

/* constants */
const newObj = utils.newObj;
const freezeEvent = utils.freezeEvent;
const bubbleCheck = utils.bubbleCheck;
const isStandAlone = utils.isStandAlone();
const visHandlers = newObj();
const doc = document;
const win = MaryDom(window);
const body = MaryDom(doc.body);
const wrap = MaryDom("#MaryCalendar");
const views = {
  main: require("view/main"),
  settings: require("view/settings"),
  license: require("view/license")
};

/* functions */
const detectVisAPI = function () {
  const visAPI = newObj();
  if (typeof doc.hidden !== "undefined") {
    visAPI.hidden = "hidden";
    visAPI.eventName = "visibilitychange";
  } else if (typeof doc.webkitHidden !== "undefined") {
    visAPI.hidden = "webkitHidden";
    visAPI.eventName = "webkitvisibilitychange";
  } else if (typeof doc.msHidden !== "undefined") {
    visAPI.hidden = "msHidden";
    visAPI.eventName = "msvisibilitychange";
  }
  if (visAPI.hidden !== undefined) {
    return visAPI;
  }
};

const selectVisHandlers = function () {
  const visAPI = detectVisAPI();
  if (visAPI !== undefined) {
    visHandlers.changeVis = function toggleClock(event) {
      if (document[visAPI.hidden] === false) {
        MaryMessage.publish("refresh");
        MaryMessage.publish("start-time");
        MaryMessage.publish("alarm");
      } else {
        MaryMessage.publish("stop-time");
      }
    };
    visHandlers.eventName = visAPI.eventName;
  } else {
    visHandlers.onFocus = function startClock(event) {
      MaryMessage.publish("refresh");
      MaryMessage.publish("start-time");
      MaryMessage.publish("alarm");
    };
    visHandlers.onBlur = function stopClock(event) {
      MaryMessage.publish("stop-time");
    };
  }
};

const addHighlightHandlers = function () {
  MaryDom([
    views.main.now,
    views.main.settingsButton,
    views.main.licenseButton,
    views.settings.save,
    views.settings.cancel,
    views.license.amen
  ])
    .on("mouseover", function highlight(event) {
      this.obj.class(
        "MaryCalendar_GeneralButtonHover",
        this.index
      );
      freezeEvent(event);
    })
    .on("mouseout", function unHighlight(event) {
      this.obj.removeClass(
        "MaryCalendar_GeneralButtonHover",
        this.index
      );
      freezeEvent(event);
    })
    .on("touchstart", function touchHover(event) {
      setTimeout(function unHighlight() {
        this.obj.removeClass(
          "MaryCalendar_GeneralButtonHover",
          this.index
        );
        freezeEvent(event);
      }.bind(this), 500);
    });
};

const fixMobileScroll = function (target) {
  // firefox needs more height to hide address bar :(
  const calendar = bubbleCheck(target, [
    "MaryCalendar_Main"
  ]);
  if (calendar) {
    return;
  }
  wrap.style([
    "padding-top: 3px;",
    "padding-bottom: 3px;"
  ]);
};

const disableMobileScrollFix = function () {
  if (wrap.first.style.paddingTop === "3px") {
    wrap.style(["padding-top", "padding-bottom"]);
  }
};

/* handlers */
selectVisHandlers();
addHighlightHandlers();

if (isStandAlone) {
  body.on("touchmove", function fixScroll(event) {
    fixMobileScroll(event.target);
  }).on("touchend", function unfixScroll(event) {
    disableMobileScrollFix();
  });
}

if (visHandlers.changeVis) {
  win.on(visHandlers.eventName, visHandlers.changeVis);
} else {
  win.on("focus", visHandlers.onFocus).on("blur", visHandlers.onBlur);
}

/* subscriptions */
MaryMessage.subscribe("switch-view", function switchView(whereTo) {
  MaryDom([views.main.all, views.settings.all, views.license.all])
    .style("display: none");
  views[whereTo].all.style("display");
});

MaryMessage.subscribe("new-window", function newWindow({size}) {
  const newSize = Number(size.match(/\d+/)[0]) + 3 + "px";
  const newWin = window.open(
    window.location.href,
    "Hebrew_Calendar",
    "width=" + newSize + ", height=" + newSize
  );
  MaryDom(newWin).on("load", function (event) {
    setTimeout(function () {
      // right after MaryCalendar stops executing in newWin
      MaryDom(newWin.document.documentElement)
        .style([
          "display: block",
          "height: 100%"
        ])
        .find("h1")
          .style("display: none")
          .restore()
        .find("body")
          .style("padding: 0");
    }, 1);
  });
});

/* exports */
return true;

}, true);

//+++---Control---+++//
MaryManage.define("control/main", [
  "utils",
  "MaryMessage",
  "model/vars",
  "view/modals"
], function controlMain(utils, MaryMessage, vars, modals, require) {

/* constants */
const newObj = utils.newObj;
const padOneNumber = utils.padOneNumber;
const parseEquinox = utils.parseEquinox;
const parseSunDown = utils.parseSunDown;
const parseHours24 = utils.parseHours24;

/* variables */
let model, today, clock, didSaveMessage;

/* functions */
const getCalendar = function () {
  model = require("model/calendar")(vars.equinox, vars.sunDown);
  model.changeFirstFruits(vars.firstFruits);
  today = model.currentDay;
};

const selectedMonthIndex = function () {
  let result;
  model.months.forEach(function (month, index) {
    if (month.name === vars.selectedMonth) {
      result = index;
    }
  });
  return result;
};

const varsCheck = function () {
  if (vars.result === null) {
    return modals.Alert(
      "Unblessedly, your browser is currently unable to save any " +
      "settings data or any of your daily notes data. This can be " +
      "resolved by enabling cookies and by using an HTML5 Local " +
      "Storage compliant browser. Otherwise, all data will be " +
      "lost on each refresh of the page. :("
    );
  } else if (vars.result === "cookies") {
    MaryMessage.publish("disable-notes");
    return modals.Alert(
      "Unblessedly, your browser is not HTML5 Local Storage compliant. " +
      "However, don't worry, you can still save your settings data. " +
      "But daily note taking has been disabled due to size constraints. " +
      "You can try to update your browser or switch to any of the " +
      "more modern ones if you want to add notes to the calendar.<br><br>" +
      "If you notice that the calendar is still not saving, go into your " +
      "browser settings and make sure '3rd Party Cookies' are allowed, " +
      "else all data will be lost on each refresh of the page. :("
    );
  } else {
    return true;
  }
};

const ifSunDown = function (hours, minutes, seconds, cycle) {
  const sunDown = parseSunDown(vars.sunDown);
  const sunDownTime = sunDown.hours + sunDown.minutes;
  const theTime = String(hours) + padOneNumber(minutes);
  if (cycle === "PM" && theTime === sunDownTime && seconds <= 1) {
    MaryMessage.publish("refresh");
    MaryMessage.publish("current-month");
    MaryMessage.publish("alarm");
  }
};

/* save functions */
const saveReset = ({reset}) => {
  if (reset) {
    vars.clearAll();
    modals.Alert(
      "If you refresh now, you will get the default settings.<br>" +
      "Else if you close the window, all data will be deleted.<br>" +
      "You can also un-check reset and re-save to keep your settings."
    );
    return true;
  }
};

const saveError = ({eHours, eMinutes, eYear, sHours, sMinutes}) => {
  const ehoursError = "Hours needs to be a number from 1 to 12.";
  const sHoursError = "Hours needs to be a number from 4 to 9.";
  const minutesError = "Minutes needs to be a number from 0 to 59.";
  const yearError = "Year must be any number above 0.";
  let errorMessage = "";
  if ((eHours >= 1 && eHours <= 12) === false) {
    errorMessage += "Equinox " + ehoursError + "<br><br>";
  }
  if ((eMinutes >= 0 && eMinutes <= 59) === false) {
    errorMessage += "Equinox " + minutesError + "<br><br>";
  }
  if ((eYear >= 1) === false) {
    errorMessage += "Equinox " + yearError + "<br><br>";
  }
  if ((sHours >= 4 && sHours <= 9) === false) {
    errorMessage += "Sundown " + sHoursError + "<br><br>";
  }
  if ((sMinutes >= 0 && sMinutes <= 59) === false) {
    errorMessage += "Sundown " + minutesError + "<br><br>";
  }
  if (errorMessage === "") {
    return false;
  } else {
    modals.Alert(errorMessage);
    return true;
  }
};

const saveVars = (data) => {
  vars.equinox = "March " +
    data.eDay + " " +
    data.eHours + ":" +
    padOneNumber(data.eMinutes) + " " +
    data.eCycle + " " +
    data.eYear;
  vars.sunDown = data.sHours + ":" +
    padOneNumber(data.sMinutes);
  vars.firstFruits = data.firstFruits;
  vars.theme = data.theme;
  vars.size = data.size || vars.size; // || for size-override
  vars.noSeconds = String(data.noSeconds);
};

const saveSafeMode = () => {
  if (vars.safeMode === "on") {
    vars.safeMode = null;
    vars.save();
    MaryMessage.publish("exit-safeMode");
  } else {
    vars.save();
    MaryMessage.publish("refresh");
  }
};

const saveNewWindow = ({newWindow, size}) => {
  if (newWindow) {
    MaryMessage.publish("new-window", {size});
  }
};

const saveIsDisabled = function () {
  if (!didSaveMessage && vars.result === "disabled") {
    modals.Alert(
      "Saving has been disabled in MaryCalendar. This means that your " +
      "settings will only be remembered as long as the page isn't " +
      "refreshed. To enable saving, go into MaryCalendar.js and set the " +
      "'config' property called 'disableSaving' to 'false'. Thanks! :)"
    );
    didSaveMessage = true;
  }
};

/* subscriptions */
MaryMessage.subscribe("override-initial-size", function ({size}) {
  // this happens before initialize
  vars.size = size;
});

MaryMessage.subscribe("initialize", function init() {
  getCalendar();
  MaryMessage.publish("initialize-view");
  MaryMessage.publish("start-time");
  if (vars.firstTime === true) {
    MaryMessage.publish("current-month");
  } else {
    MaryMessage.publish("change-month");
  }
  MaryMessage.publish("alarm");
  setTimeout(varsCheck, 500);
});

MaryMessage.subscribe("initialize-view", function initView () {
  MaryMessage.publish("set-month-jump", {
    months: model.months.map(function (month) {
      return month.name;
    })
  });
  MaryMessage.publish("refresh-settings");
});

MaryMessage.subscribe("change-month", function changeMonth() {
  const data = newObj();
  data.month = model.months[vars.selectedMonth];
  data.today = today;
  data.vars = vars;
  data.alarm = vars.alarm;
  MaryMessage.publish("change-title", data);
  MaryMessage.publish("hide-extra-days", data);
  MaryMessage.publish("change-days", data);
  MaryMessage.publish("set-current-day", data);
  MaryMessage.publish("change-popups", data);
  MaryMessage.publish("change-now", data);
  MaryMessage.publish("load-notes", data);
  MaryMessage.publish("load-alarm", data);
});

MaryMessage.subscribe("refresh-settings", function refreshSettings() {
  const data = newObj();
  data.vars = vars;
  MaryMessage.publish("refresh-equinox", data);
  MaryMessage.publish("refresh-sundown", data);
  MaryMessage.publish("refresh-fruits", data);
  MaryMessage.publish("refresh-more", data);
});

MaryMessage.subscribe("change-theme", function ({theme, size} = {}) {
  MaryMessage.publish("generate-css", {
    theme: theme || vars.theme,
    size: size || vars.size
  });
});

MaryMessage.subscribe("previous-month", function goToPreviousMonth() {
  let index = selectedMonthIndex();
  index = (index - 1 >= 0) ?
    index - 1 : 0;
  vars.selectedMonth = model.months[index].name;
  vars.save();
  MaryMessage.publish("change-month");
});

MaryMessage.subscribe("next-month", function goToNextMonth() {
  let index = selectedMonthIndex();
  index = (index + 1 < model.months.length) ?
    index + 1 : model.months.length - 1;
  vars.selectedMonth = model.months[index].name;
  vars.save();
  MaryMessage.publish("change-month");
});

MaryMessage.subscribe("current-month", function goToCurrentMonth() {
  if (today) {
    vars.selectedMonth = today.month;
    vars.save();
    MaryMessage.publish("change-month");
  } else {
    MaryMessage.publish("change-month");
  }
});

MaryMessage.subscribe("jump-month", function jumpMonth({month}) {
  vars.selectedMonth = month;
  vars.save();
  MaryMessage.publish("change-month");
});

MaryMessage.subscribe("get-backup", function downloadBackup() {
  const notes = newObj();
  for (let key in vars) {
    if (/\d$/.test(key)) {
      notes[key] = vars[key];
    }
  }
  MaryMessage.publish("download-backup", {
    filename: "MaryCalendar - Backup Notes " +
      vars.equinox.match(/\d+$/)[0] + ".txt",
    text: JSON.stringify(notes, null, "  ")
      .replace(/\n/g, "\n\n")
  });
});

MaryMessage.subscribe("restore-backup", function restoreBackup(data) {
  const months = model.months.map(function (month) {
    return month.name;
  }).join("|");
  const regexMonths = new RegExp("(" + months + ")\\d+");
  let notes;
  try {
    notes = JSON.parse(data);
  } catch (error) {
    return modals.Alert(
      "Couldn't parse the backup file into JSON. Canceling. " +
      "You can edit the backup file in a text editor to make " +
      "it JSON compatible."
    );
  }
  for (let key in notes) {
    if (!regexMonths.test(key)) {
      return modals.Alert(
        "At least one day name in the backup doesn't have the " +
        "right syntax. Day names must follow this pattern: " +
        "'Abib1', 'Abib2'...'Adar32', etc. Please modify the file " +
        "and try again. No notes have been added or changed yet. :)"
      );
    }
    if (notes[key].length > 3000) {
      return modals.Alert(
        "The length of the note for " + key + " is too long. :(<br>" +
        "Current: " + notes[key].length + " characters.<br>" +
        "Expected: 3000 characters or less.<br>" +
        "Please correct this in any text editor and try again.<br>" +
        "No notes have been added or changed yet. Thank you! :)"
      );
    }
  }
  for (let key in notes) {
    vars[key] = notes[key];
  }
  vars.save();
  MaryMessage.publish("auto-save");
  setTimeout(function () {
    modals.Alert(
      "Notes have been successfully restored from the backup! <br><br>" +
      "Praise be to Yahweh through Yahshua Messiah! Amen. :)"
    );
  }, 100);
});

MaryMessage.subscribe("save", function save(data) {
  if (saveReset(data) === true) {
    return;
  }
  if (saveError(data) !== false) {
    return;
  }
  saveVars(data);
  saveSafeMode(data);
  saveNewWindow(data);
  MaryMessage.publish("stop-time");
  MaryMessage.publish("start-time");
  MaryMessage.publish("switch-view", "main");
  saveIsDisabled();
});

MaryMessage.subscribe("refresh", function refresh() {
  getCalendar();
  MaryMessage.publish("change-month");
  MaryMessage.publish("refresh-settings");
});

MaryMessage.subscribe("cancel", function onCancel() {
  MaryMessage.publish("refresh");
});

MaryMessage.subscribe("start-time", function refresh() {
  const seconds = () => now.getSeconds();
  const minutes = () => now.getMinutes();
  const hours = function () {
    var hours24 = now.getHours();
    var hours12 = parseHours24(hours24);
    cycle = hours12.cycle;
    return hours12.hours;
  };
  let now, cycle;
  clock = setInterval(function () {
    now = new Date();
    if (vars.noSeconds === "true") {
      MaryMessage.publish("change-time", {
        time: hours() + ":" +
          padOneNumber(minutes()) + " " +
          cycle
      });
    } else {
      MaryMessage.publish("change-time", {
        time: hours() + ":" +
          padOneNumber(minutes()) + ":" +
          padOneNumber(seconds()) + " " +
          cycle
      });
    }
    if (vars.safeMode !== "on") {
      ifSunDown(hours(), minutes(), seconds(), cycle);
    }
  }, 1000);
});

MaryMessage.subscribe("stop-time", function refresh() {
  clearInterval(clock);
});

MaryMessage.subscribe("save-note", function saveNote(data) {
  let key, note;
  data = data.split(":");
  key = data[0];
  note = data[1];
  if (note.length > 3000) {
    return modals.Alert(
      "The length of the note is too long. :(<br>" +
      "Current: " + note.length + " characters.<br>" +
      "Expected: 3000 characters or less.<br>" +
      "Your note has not been saved and will not appear on a refresh. " +
      "But you may keep it in memory, edit it, and " +
      "try to save it again if you like! Thank you!"
    );
  }
  if (note === "") {
    delete vars[key];
    vars.clear(key);
  } else {
    vars[key] = note;
    vars.save();
  }
});

MaryMessage.subscribe("save-alarm", function saveAlarm(data) {
  if (data.day == null) {
    delete vars.alarm;
    vars.clear("alarm");
  } else {
    vars.alarm = vars.selectedMonth + data.day;
  }
  vars.save();
});

MaryMessage.subscribe("alarm", function alarm() {
  let month, day, note;
  if (today && vars.alarm) { // if in the current year and an alarm is set
    month = vars.alarm.match(/\D+/)[0];
    day = vars.alarm.match(/\d+/)[0];
    note = vars[vars.alarm];
  } else {
    return;
  }
  if (month !== today.month || day !== today.day) {
    return;
  }
  if (note == null) {
    note = "";
  }
  MaryMessage.publish("current-month");
  MaryMessage.publish("remove-alarm", {
    index: Number(day) - 1
  });
  setTimeout(function () {
    modals.Alert(
      // perhaps make this part a function in model?
      today.month + " " + today.day + "<br>" +
      today.dayName + "<br>" +
      today.date + "<br><br>" +
      note
    );
  }, 100);
});

/* exports */
return true;
  
}, true);

//+++---Initialize---+++//
MaryManage.define("control/initialize", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "model/vars"
], function controlInitialize(utils, MaryMessage, MaryDom, vars, require) {

/* constants */
const win = MaryDom(window);

/* initialize */
const initialize = function () {
  const isStandAlone = utils.isStandAlone();
  require("view/css");
  require("view/commons");
  require("control/main");
  if (isStandAlone === false) {
    MaryMessage.publish("disable-stand-alone");
  }
  if (vars.safeMode === "on") {
    MaryMessage.publish("enter-safeMode");
  } else {
    MaryMessage.publish("initialize");
  }
};

/* handlers */
win.once("load", function init(event) {
  initialize();
});

/* exports */
return true;

});

}());
