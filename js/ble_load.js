var script = document.createElement("script");
script.type = "text/javascript";

var language = window.hilink ? window.hilink.getAppLanguageSync() : "zh";

var r = language.indexOf("zh");
if (r != -1) {
  script.src = "./js/ble_zh.js";
} else {
  script.src = "./js/ble_en.js";
}

document.getElementsByTagName("head")[0].appendChild(script);
