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
