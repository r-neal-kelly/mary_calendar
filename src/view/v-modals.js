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
