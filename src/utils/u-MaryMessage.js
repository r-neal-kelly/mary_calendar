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
