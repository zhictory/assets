(function(t){function s(s){for(var e,o,c=s[0],n=s[1],l=s[2],u=0,p=[];u<c.length;u++)o=c[u],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&p.push(a[o][0]),a[o]=0;for(e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e]);h&&h(s);while(p.length)p.shift()();return i.push.apply(i,l||[]),r()}function r(){for(var t,s=0;s<i.length;s++){for(var r=i[s],e=!0,c=1;c<r.length;c++){var n=r[c];0!==a[n]&&(e=!1)}e&&(i.splice(s--,1),t=o(o.s=r[0]))}return t}var e={},a={app:0},i=[];function o(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=e,o.d=function(t,s,r){o.o(t,s)||Object.defineProperty(t,s,{enumerable:!0,get:r})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,s){if(1&s&&(t=o(t)),8&s)return t;if(4&s&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&s&&"string"!=typeof t)for(var e in t)o.d(r,e,function(s){return t[s]}.bind(null,e));return r},o.n=function(t){var s=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(s,"a",s),s},o.o=function(t,s){return Object.prototype.hasOwnProperty.call(t,s)},o.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],n=c.push.bind(c);c.push=s,c=c.slice();for(var l=0;l<c.length;l++)s(c[l]);var h=n;i.push([0,"chunk-vendors"]),r()})({0:function(t,s,r){t.exports=r("28cb")},"0a6e":function(t,s,r){},bcd5:function(t,s,r){"use strict";var e=function(){var t=this,s=t.$createElement,r=t._self._c||s;return r("div",{ref:"outerBox",staticClass:"progress-outerBox",class:{showShadow:t.progressNum>60},style:t.widthHeight},[r("svg",{staticClass:"pro-svg"},[r("defs",[r("filter",{attrs:{id:"f1"}},[r("feGaussianBlur",{attrs:{result:"Gau1",in:"SourceGraphic",stdDeviation:"4"}}),r("feOffset",{attrs:{dx:"-4",dy:"5"}}),r("feGaussianBlur",{attrs:{out:"Gau2",result:"Gau2",stdDeviation:"2"}}),r("fecomposite",{attrs:{in:"Gau1",in2:"SourceAlpha",operator:"in"}})],1),r("linearGradient",{attrs:{id:"circleColor",x1:"0%",y1:"0%",x2:"100%",y2:"100%"}},[r("stop",{staticStyle:{"stop-color":"#86c1ff"},attrs:{offset:"0%"}}),r("stop",{staticStyle:{"stop-color":"#2b5bf9"},attrs:{offset:"100%"}})],1),r("linearGradient",{attrs:{id:"circleColorI",x1:"0%",y1:"0%",x2:"100%",y2:"100%"}},[r("stop",{staticStyle:{"stop-color":"#3460f8"},attrs:{offset:"0%"}}),r("stop",{staticStyle:{"stop-color":"#2b5bf9"},attrs:{offset:"100%"}})],1),r("linearGradient",{attrs:{id:"circleColorII",x1:"0%",y1:"0%",x2:"100%",y2:"100%"}},[r("stop",{style:{stopColor:t.isDark?"#1A1A1A":"#E6EAED"},attrs:{offset:"0%"}}),r("stop",{staticStyle:{"stop-color":"#2b5bf9"},attrs:{offset:"100%"}})],1)],1),2==t.state?[r("circle",{staticClass:"circle circle-filter",attrs:{cx:t.boxR,cy:t.boxR,r:t.circleR,fill:"none","stroke-dasharray":t.progressNum*(6.28*t.circleR/100)+" 10000","stroke-width":"10%",filter:"url(#f1)"}})]:t._e(),r("circle",{staticClass:"circle",attrs:{cx:t.boxR,cy:t.boxR,r:t.circleR,fill:"none","stroke-dasharray":6.28*t.circleR+" 10000","stroke-width":"10%",stroke:t.isDark?"#1A1A1A":"#E9EBED"}}),2==t.state?[r("path",{directives:[{name:"show",rawName:"v-show",value:t.progressNum>33,expression:"progressNum > 33"}],staticClass:"path-II",attrs:{d:t.pathII,"stroke-width":"10%"}}),r("path",{directives:[{name:"show",rawName:"v-show",value:t.progressNum>0,expression:"progressNum > 0"}],staticClass:"path-I",attrs:{d:t.pathI,"stroke-width":"10%",stroke:t.progressNum>5?"url(#circleColor)":"#2B5BF9"}}),r("path",{directives:[{name:"show",rawName:"v-show",value:t.progressNum>66,expression:"progressNum > 66"}],staticClass:"path-III",attrs:{d:t.pathIII,"stroke-width":"10%"}})]:t._e(),1==t.state?[r("path",{staticClass:"path-IIII",attrs:{d:t.pathIIII,"stroke-width":"10%"}})]:t._e(),2==t.state?[r("text",{staticClass:"text-box",attrs:{x:t.boxR,y:t.boxR+.1*t.boxR}},[r("tspan",{staticClass:"text-number"},[t._v(t._s(t.progressNum>100?100:parseInt(t.progressNum)))]),r("tspan",{staticClass:"text-symbol"},[t._v("%")])])]:t._e(),r("text",{staticClass:"text-edition",attrs:{x:t.boxR,y:t.boxR+.4*t.boxR}},[t._v(" "+t._s(t.version)+" ")])],2),t.state<2?r("img",{staticClass:"icon-box",attrs:{src:t.iconPath,alt:""}}):t._e()])},a=[],i=(r("6dd5"),r("81ba"),r("d148"),r("c083"),{name:"progress-bar",props:{progressNum:{type:Number,default:1},version:{type:String,default:"V0.0.0"},state:{type:Number,default:0},iconPath:{type:String,default:"./img/light/ic_arrow_top.png"},multiple:{type:Number,default:1}},data:function(){return{updataIcon:"",isUpdate:!1,boxR:0,circleR:0,startX:0,startY:0,pathI:"",pathII:"",pathIII:"",pathIIII:"",fill:0}},computed:{isDark:function(){return window.isDark},widthHeight:function(){return{width:25.2*this.multiple+"rem",height:25.2*this.multiple+"rem"}}},watch:{progressNum:function(t){this.getPath(t)},state:{handler:function(t){console.log("11111111111111111111111111",t);var s=0;1==t?s=90:2==t&&this.getPath(this.progressNum);var r=this.startX+this.circleR*Math.sin(2*Math.PI/360*s),e=this.startY+this.circleR-this.circleR*Math.cos(2*Math.PI/360*s);this.pathIIII="\n            M ".concat(this.startX," ").concat(this.startY,"\n            A ").concat(this.circleR," ").concat(this.circleR," 0 0 1 ").concat(r," ").concat(e)},immediate:!0}},mounted:function(){var t=this;this.$nextTick((function(){var s=t.$refs.outerBox.clientHeight;t.boxR=s/2,t.startX=t.boxR,t.startY=.2*t.boxR,t.circleR=t.boxR-.2*t.boxR,t.progressNum>0&&t.getPath(t.progressNum)})),setTimeout((function(){t.state=2;var s=0,r=setInterval((function(){s+=.1,t.progressNum=s,t.progressNum>100&&setInterval(r)}),10)}),1e3)},methods:{getPath:function(t){t>33&&t<=66?t-=33:t>66&&(t-=66);var s=t*(120/33);s=s>120?120:s,this.progressNum<33?(this.fill=0,this.fillPathI(s)):this.progressNum>33&&this.progressNum<=66?(this.fill=1,this.fillPathII(s)):this.progressNum>66&&(this.fill=2,this.fillPathIII(s))},fillPathI:function(t){var s=this.startX+this.circleR*Math.sin(2*Math.PI/360*t),r=this.startY+this.circleR-this.circleR*Math.cos(2*Math.PI/360*t);this.pathI="\n          M ".concat(this.startX," ").concat(this.startY,"\n          A ").concat(this.circleR," ").concat(this.circleR," 0 0 1 ").concat(s," ").concat(r)},fillPathII:function(t){this.fill>=1&&this.fillPathI(120);var s=this.startX+this.circleR*Math.sin(2*Math.PI/360*t),r=this.startY+this.circleR-this.circleR*Math.cos(2*Math.PI/360*t);this.pathII="\n          M ".concat(this.startX," ").concat(this.startY,"\n          A ").concat(this.circleR," ").concat(this.circleR," 0 0 1 ").concat(s," ").concat(r)},fillPathIII:function(t){this.fill>=2&&this.fillPathII(120);var s=this.startX+this.circleR*Math.sin(2*Math.PI/360*t),r=this.startY+this.circleR-this.circleR*Math.cos(2*Math.PI/360*t);this.pathIII="\n          M ".concat(this.startX," ").concat(this.startY,"\n          A ").concat(this.circleR," ").concat(this.circleR," 0 0 1 ").concat(s," ").concat(r)}}}),o=i,c=(r("c46e"),r("cf58")),n=Object(c["a"])(o,e,a,!1,null,"56a9e6c3",null);s["a"]=n.exports},c46e:function(t,s,r){"use strict";r("0a6e")}});
//# sourceMappingURL=app.fc273be2.js.map