/**
 * Dialog
 * @author liuhui
 */
function Dialog() {

  function Fn({type = "", title = '', content = '', close_show = 0, cancelCb = null, confirm_show = 0, cancel_value = "取消", confirm_value = "确认", confirmCb = null, time = 1600} = {}) {
    var _dialog = this;
    let el = document.createElement("div");
    el.className = "dialog dialog-" + type;
    el.innerHTML = `<div class="dialog-main">
          <div class="dialog-main-close" style="${close_show ? '' : 'display:none'}"></div>
          <h2 class="dialog-main-title" style="${title ? '' : 'display:none'}">${title}</h2>
          <div class="dialog-main-cnt" style="${content ? '' : 'display:none'}">${content}</div>
          <a class="dialog-main-btn btn-cancel" style="${confirm_show && type === "confirm" ? '' : 'display:none'}">${cancel_value}</a>
          <a class="dialog-main-btn btn-confirm" style="${confirm_show ? '' : 'display:none'}">${confirm_value}</a>
      </div>`;
    document.body.appendChild(el);

    el.querySelector(".dialog-main-close").addEventListener("click", function () {
      cancelCb && cancelCb.apply(_dialog);
      _dialog.hide();
    });

    el.querySelector(".dialog-main-btn.btn-cancel").addEventListener("click", function () {
      cancelCb && cancelCb.apply(_dialog);
      _dialog.hide();
    });

    el.querySelector(".dialog-main-btn.btn-confirm").addEventListener("click", function () {
      confirmCb && confirmCb.apply(_dialog);
      _dialog.hide();
    });

    if (type === "tip") {
      setTimeout(function () {
        _dialog.hide();
      }, time);
    }
    if (type === "loading") {
      setTimeout(function () {
        _dialog.hide();
      }, time);
    }
    this.el = el;
    //promise操作
    this.then = function(resolve, reject) {
      confirmCb = resolve;
      cancelCb = reject;
    }
  }

  Fn.prototype.hide = function () {
    this.el.style.display = "none";
  };
  Fn.prototype.show = function () {
    this.el.style.display = "block";
  };

  return {
    alert: function (title) {
      let args = {};
      if (Object.prototype.toString.call(title) === "[object String]") {
        args = {
          title: title
        }
      } else {
        args = title;
      }

      args = Object.assign({
        type: "alert",
        close_show: 1,
        confirm_show: 1,
        confirm_value: "我知道了"
      }, args);
      return new Fn(args);
    },
    confirm: function (title, content, confirmCb) {
      let args = {};
      if (Object.prototype.toString.call(title) === "[object String]") {
        args = {
          title: title,
          content: content,
          confirmCb: confirmCb
        }
      } else {
        args = title;
      }

      args = Object.assign({
        type: "confirm",
        close_show: 0,
        confirm_show: 1
      }, args);
      return new Fn(args);
    },
    tip: function (title, time) {
      let args = {};
      if (Object.prototype.toString.call(title) === "[object String]") {
        args = {
          title: title,
          time: time
        }
      } else {
        args = title;
      }

      args = Object.assign({
        type: "tip",
        close_show: 0,
        confirm_show: 0
      }, args);
      return new Fn(args);
    },
    loading: function (title) {
      let args = {};
      if (Object.prototype.toString.call(title) === "[object String]") {
        args = {
          title: title
        }
      } else {
        args = title;
      }

      args = Object.assign({
        type: "loading",
        close_show: 0,
        confirm_show: 0,
        time: 5000
      }, args);
      return new Fn(args);
    },
    fn: function (args) {
      if (typeof args !== "object") return;

      return new Fn(args);
    }
  };
}
var dialog = {
  install: function (Vue) {
    if (dialog.installed) {
      return;
    }
    let _dialog = new Dialog();

    Object.defineProperty(Vue.prototype, '$dialog', {
      get: function () {
        return _dialog;
      }
    });
  }
};
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(dialog);
// }
export default dialog;
