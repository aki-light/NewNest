(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[628],{7915:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/diaries/dia_2021_9",function(){return r(8707)}])},5242:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(5893);function i(e){var t=e.title,r=e.date,i=e.paragraph;return(0,n.jsxs)("div",{className:"shadow-md rounded pl-5 bg-skin",style:{borderTop:"solid 10px #ffeec4",marginBottom:"1%"},children:[(0,n.jsxs)("header",{children:[(0,n.jsx)("h2",{className:"text-xl font-bold mb-2",children:t}),(0,n.jsx)("h3",{className:"text-sm font-bold mb-1",children:r})]}),(0,n.jsx)("p",{className:"text-justify text-base pr-5 pb-5",children:i})]})}},7e3:function(e,t,r){"use strict";r.d(t,{Z:function(){return x}});var n=r(5893),i=r(7294),s=r(1664),a=r.n(s);function c(e){var t=e.href,r=e.month;return(0,n.jsx)("li",{children:(0,n.jsx)(a(),{href:t,children:(0,n.jsx)("a",{className:"hover:bg-brown hover:text-white",children:r})})})}function l(e){var t=e.year,r=e.children,i=e.yearListStates,s=e.handleYearButtonClick;return(0,n.jsxs)("div",{className:"relative",children:[(0,n.jsx)("div",{className:"font-bold text-lg block bg-white text-center py-5 cursor-pointer hover:bg-skin",onClick:function(e){s(t),e.stopPropagation()},children:(0,n.jsx)("h3",{children:t})}),i[t]?(0,n.jsx)("ul",{className:"absolute grid bg-white px-2 py-2 shadow-md rounded text-2xl font-bold text-brown",style:{top:"0",left:"105%",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"10px"},children:r}):(0,n.jsx)(n.Fragment,{})]})}function o(e){var t=e.yearListStates,r=e.handleYearButtonClick;return(0,n.jsxs)("aside",{className:"w-1/5 order-1",style:{margin:"1% 0 0 1%"},children:[(0,n.jsx)("h2",{className:"text-lg text-white font-bold text-center bg-brown",children:"\u8a18\u4e8b\u4e00\u89a7"}),(0,n.jsx)(l,{year:"2022",yearListStates:t,handleYearButtonClick:r,children:(0,n.jsx)(c,{month:"06",href:"/diaries/dia_2022_6"})}),(0,n.jsxs)(l,{year:"2021",yearListStates:t,handleYearButtonClick:r,children:[(0,n.jsx)(c,{month:"08",href:"/diaries/dia_2021_8"}),(0,n.jsx)(c,{month:"09",href:"/diaries/dia_2021_9"}),(0,n.jsx)(c,{month:"10",href:"/diaries/dia_2021_10"})]})]})}function d(e){var t=e.children,r=e.yearListStates,i=e.handleYearButtonClick;return(0,n.jsxs)("div",{className:"flex",children:[(0,n.jsx)("article",{className:"w-4/5 order-2",style:{margin:"1% 1% 0 1%"},children:t}),(0,n.jsx)(o,{yearListStates:r,handleYearButtonClick:i})]})}var u=r(3203);function h(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function x(e){var t=e.title,r=e.children,s=(0,i.useState)({2021:!1,2022:!1}),a=s[0],c=s[1],l=function(){c((function(e){return{2021:!1,2022:!1}}))};return(0,n.jsx)("div",{onClick:l,children:(0,n.jsx)(u.Z,{title:t,children:(0,n.jsx)(d,{yearListStates:a,handleYearButtonClick:function(e){l(),a[e]||c((function(t){return function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){h(e,t,r[t])}))}return e}({},t,h({},e,!0))}))},children:r})})})}},5094:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(5893);function i(e){var t=e.history;return(0,n.jsx)("footer",{className:"mt-14 text-center absolute bottom-0 w-full text-white text-xl py-6 bg-brown",children:(0,n.jsx)("p",{children:(0,n.jsxs)("small",{children:["\xa9 ",t," NewNest"]})})})}},4098:function(e,t,r){"use strict";r.d(t,{Z:function(){return d}});var n=r(5893),i=(0,r(1752).default)(),s=(i.serverRuntimeConfig,i.publicRuntimeConfig);function a(){return(0,n.jsx)("div",{className:"pl-5 pt-2 pb-2",children:(0,n.jsx)("img",{src:"".concat(s.staticFolder,"/images/home-title.png"),width:191,height:35,alt:"title"})})}var c=r(1664),l=r.n(c);function o(e){var t=e.diaPath;return(0,n.jsxs)("ul",{className:"flex justify-around text-lg list-none text-white",children:[(0,n.jsx)("li",{children:(0,n.jsx)(l(),{href:"/",children:(0,n.jsx)("a",{children:"\u30c8\u30c3\u30d7\u30da\u30fc\u30b8"})})}),(0,n.jsx)("li",{children:(0,n.jsx)(l(),{href:t,children:(0,n.jsx)("a",{children:"\u958b\u767a\u65e5\u8a18"})})}),(0,n.jsx)("li",{children:(0,n.jsx)(l(),{href:"mailto:myagpisapoopster@new-nest.net",children:(0,n.jsx)("a",{children:"\u30e1\u30fc\u30eb"})})})]})}function d(){return(0,n.jsxs)("div",{className:"shadow-md bg-cover text-center sm:text-left",style:{backgroundImage:"url(/images/top-img2.jpg)"},children:[(0,n.jsx)(a,{}),(0,n.jsx)(o,{diaPath:"/diaries/dia_2022_6"})]})}},3390:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});var n=r(5893),i=r(9008),s=r.n(i);function a(e){var t=e.title;return(0,n.jsxs)(s(),{children:[(0,n.jsx)("title",{children:t}),(0,n.jsx)("meta",{charSet:"utf-8"}),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width,initial-scale=1"}),(0,n.jsx)("meta",{name:"description",content:"\u30d6\u30e9\u30a6\u30b6\u30b2\u30fc\u30e0(HTML5\u30b2\u30fc\u30e0)\u3092\u5236\u4f5c\u3057\u3066\u3044\u307e\u3059\u3002I am making browser game (HTML5 game)."}),(0,n.jsx)("link",{rel:"shortcut icon",type:"image/x-icon",href:"/images/favicon.ico"})]})}},3203:function(e,t,r){"use strict";r.d(t,{Z:function(){return c}});var n=r(5893),i=r(5094),s=r(4098),a=r(3390);function c(e){var t=e.title,r=e.children;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.Z,{title:t}),(0,n.jsxs)("div",{className:"min-h-screen relative pb-28 box-border",children:[(0,n.jsx)(s.Z,{}),r,(0,n.jsx)(i.Z,{history:"2021-2022"})]})]})}},8707:function(e,t,r){"use strict";r.r(t);var n=r(5893),i=r(5242),s=r(7e3);t.default=function(){return(0,n.jsxs)(s.Z,{title:"dia_2021_9",children:[(0,n.jsx)(i.Z,{title:"\u30e2\u30c1\u30d9\u30fc\u30b7\u30e7\u30f3\u304c\uff0e\uff0e\uff0e",date:"2021/9/26",paragraph:"\u524d\u56de\u306e\u65e5\u8a18\u306e\u66f4\u65b0\u304b\u3089\u3060\u3044\u3076\u7d4c\u3063\u3066\u3057\u307e\u3044\u307e\u3057\u305f\u304c\u3001\u3068\u308a\u3042\u3048\u305a\u4eca\u4f5c\u3063\u3066\u3044\u308bRPG\u306e\u88fd\u4f5c\u306f\u9806\u8abf\u306b\u9032\u3093\u3067\u3044\u307e\u3059\u3002\u65e5\u8a18\u306e\u66f4\u65b0\u306f\u4eca\u307e\u3067\u306f\u4e0d\u5b9a\u671f\u3067\u3057\u305f\u304c\u3001\u3053\u308c\u304b\u3089\u306f\u90311\u306e\u30da\u30fc\u30b9\u3067\u66f8\u3053\u3046\u3068\u601d\u3044\u307e\u3059\u3002\u4eca\u4f5c\u3063\u3066\u3044\u308bRPG\u306f\u6226\u95d8\u30d1\u30fc\u30c8\u306e\u5927\u67a0\u304c\u51fa\u6765\u4e0a\u304c\u3063\u305f\u3068\u3053\u308d\u3067\u3059\u3002\u601d\u3063\u305f\u901a\u308aRPG\u306e\u6226\u95d8\u306b\u3064\u3044\u3066\u306e\u30d7\u30ed\u30b0\u30e9\u30df\u30f3\u30b0\u306f\u6bd4\u8f03\u7684\u7c21\u5358\u3067\u81ea\u5206\u306e\u8003\u3048\u305f\u901a\u308a\u306e\u5b9f\u88c5\u304c\u3044\u307e\u306e\u3068\u3053\u308d\u51fa\u6765\u3066\u3044\u307e\u3059\u3002\u3067\u3059\u304c\u3001\u524d\u306b\u3082\u66f8\u3044\u305f\u3088\u3046\u306b\u96e3\u6613\u5ea6\u8abf\u6574\u306b\u4e00\u4f53\u3069\u308c\u304f\u3089\u3044\u304b\u304b\u308b\u306e\u304b\u898b\u5f53\u3082\u3064\u304d\u307e\u305b\u3093\u3002\u3053\u306e\u30b2\u30fc\u30e0\u306f\u30a8\u30f3\u30c7\u30a3\u30f3\u30b0\u5206\u5c90\u3092\u8003\u3048\u3066\u3044\u308b\u306e\u3067\u3001\u3067\u304d\u308c\u3070\u8a66\u884c\u932f\u8aa4\u3057\u3066\u306a\u3093\u3068\u304b\u30c8\u30a5\u30eb\u30fc\u30a8\u30f3\u30c9\u3092\u9054\u6210\u3067\u304d\u308b\u3088\u3046\u306a\u96e3\u6613\u5ea6\u306b\u3057\u305f\u3044\u306e\u3067\u3059\u304c\u30011\u4eba\u3067\u8abf\u6574\u3092\u3084\u308b\u3068\u306a\u3063\u305f\u30891\u4eba\u3067\u30b2\u30fc\u30e0\u3092\u4f55\u767e\u56de\u3082\u30d7\u30ec\u30a4\u3057\u306a\u3044\u3068\u3044\u3051\u306a\u3044\u308f\u3051\u306a\u306e\u3067\u30c6\u30b9\u30c8\u30d7\u30ec\u30a4\u30e4\u30fc\u3092\u52df\u96c6\u3059\u308b\u3057\u304b\u306a\u3044\u306e\u304b\u306a\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u6700\u8fd1\u306f\u30b2\u30fc\u30e0\u88fd\u4f5c\u306e\u30e2\u30c1\u30d9\u30fc\u30b7\u30e7\u30f3\u304c\u4e0b\u304c\u308a\u6c17\u5473\u3067\u3059\u3002\u5f53\u521d\u306f\u30b2\u30fc\u30e0\u30b5\u30a4\u30c8\u3092\u4f5c\u3063\u3066\u30a2\u30d5\u30a3\u30ea\u30a8\u30a4\u30c8\u3067\u7a3c\u3054\u3046\u3068\u601d\u3063\u3066\u3044\u305f\u306e\u3067\u3059\u304c\u3001\u6700\u8fd1\u306f\u305d\u3093\u306a\u3053\u3068\u306f\u7121\u7406\u306a\u306e\u3067\u306f\u306a\u3044\u304b\u3068\u81ea\u4fe1\u304c\u7121\u304f\u306a\u3063\u3066\u304d\u3066\u3044\u307e\u3059\u3002\u3068\u308a\u3042\u3048\u305a\u3042\u30681\u5e74\u304b2\u5e74\u3084\u3063\u3066\u307f\u3066\u624b\u3054\u305f\u3048\u304c\u306a\u3051\u308c\u3070\u4eba\u751f\u306e\u65b9\u5411\u8ee2\u63db\u3092\u3057\u3088\u3046\u3068\u601d\u3044\u307e\u3059\u3002\u98fc\u3063\u3066\u3044\u308b\u9ce5\u306e\u8a71\u3067\u3059\u304c\u3001\u5148\u65e5\u4f53\u8abf\u304c\u60aa\u304f\u306a\u3063\u3066\u3057\u307e\u3063\u3066\u75c5\u9662\u306b\u884c\u3063\u305f\u7d50\u679c\u3001\u8178\u708e\u3068\u3044\u3046\u8a3a\u65ad\u3067\u85ac\u3092\u3042\u3052\u308c\u3070\u6570\u65e5\u3067\u826f\u304f\u306a\u308b\u3068\u306e\u3053\u3068\u3067\u3001\u5b9f\u969b\u306b\u3044\u307e\u306f\u30d4\u30f3\u30d4\u30f3\u3057\u3066\u3044\u307e\u3059\u3002\u85ac\u306f\u82e6\u3044\u304b\u3089\u98f2\u3093\u3067\u304f\u308c\u306a\u3044\u306e\u3067\u306f\u3068\u601d\u3063\u3066\u3044\u305f\u3068\u3053\u308d\u3001\u304a\u3044\u3057\u305d\u3046\u306b\u98f2\u3093\u3067\u304f\u308c\u305f\u306e\u3067\u52a9\u304b\u308a\u307e\u3057\u305f\u3002\u9ce5\u306e\u75c5\u9662\u3068\u306a\u308b\u3068\u3057\u3063\u304b\u308a\u3068\u3057\u305f\u3068\u3053\u308d\u306f\u5c11\u306a\u304f\u3001\u5f53\u65e5\u4e88\u7d04\u304c\u3068\u308c\u305f\u3068\u3053\u308d\u304c\u8eca\u3067\u7247\u90532\u6642\u9593\u534a\u304b\u304b\u308a\u4e45\u3057\u3076\u308a\u306e\u9577\u8ddd\u96e2\u30c9\u30e9\u30a4\u30d6\u3067\u304b\u306a\u308a\u75b2\u308c\u307e\u3057\u305f\u3002"}),(0,n.jsx)(i.Z,{title:"\u8ca1\u5e03\u306b\u30ab\u30d3",date:"2021/9/10",paragraph:"\u88c5\u5099\u30fb\u30a2\u30a4\u30c6\u30e0\u9078\u629e\u753b\u9762\u3068\u4f1a\u8a71\u30d1\u30fc\u30c8\u3092\u3042\u3089\u304b\u305f\u4f5c\u308a\u7d42\u3048\u307e\u3057\u305f\u3002\u88c5\u5099\u30fb\u30a2\u30a4\u30c6\u30e0\u9078\u629e\u753b\u9762\u306f\u6b66\u5668\u3084\u9632\u5177\u306e\u7a2e\u985e\u3084\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u306a\u3069\u306e\u7d30\u304b\u3044\u3068\u3053\u308d\u304c\u305f\u304f\u3055\u3093\u6b8b\u3063\u3066\u3044\u307e\u3059\u304c\u3068\u308a\u3042\u3048\u305a\u6226\u95d8\u30d1\u30fc\u30c8\u3092\u4f5c\u308a\u7d42\u3048\u3066\u304b\u3089\u305d\u306e\u8abf\u6574\u3092\u3057\u305f\u3044\u3068\u601d\u3044\u307e\u3059\u3002\u4eca\u65e5\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u6c7a\u6e08\u306e\u305f\u3081\u306b\u8ca1\u5e03\u3092\u3044\u3064\u3082\u5165\u308c\u3066\u3044\u308b\u30d0\u30c3\u30b0\u304b\u3089\u53d6\u308a\u51fa\u3057\u305f\u3068\u3053\u308d\u8ca1\u5e03\u306b\u30ab\u30d3\u304c\u751f\u3048\u3066\u3044\u307e\u3057\u305f\uff0e\uff0e\uff0e\u5039\u7d04\u5bb6\u306e\u8a3c\u3067\u3059\u306d\u3002"}),(0,n.jsx)(i.Z,{title:"\u88c5\u5099\u9078\u629e\u753b\u9762",date:"2021/9/6",paragraph:"1\u9031\u9593\u307b\u3069\u65e5\u8a18\u3092\u66f4\u65b0\u3057\u307e\u305b\u3093\u3067\u3057\u305f\u304c\u88fd\u4f5c\u3092\u30b5\u30dc\u3063\u3066\u3044\u305f\u308f\u3051\u3067\u306f\u306a\u3044\u306e\u3067\u5b89\u5fc3\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u3068\u3044\u3063\u3066\u3082\u3053\u308c\u3092\u307f\u3066\u304f\u308c\u3066\u308b\u4eba\u306f\u3044\u306a\u3044\u3068\u601d\u3044\u307e\u3059\u304c\uff0e\uff0e\uff0e\u4eca\u306f\u4e3b\u4eba\u516c\u306e\u88c5\u5099\u3068\u30a2\u30a4\u30c6\u30e0\u3092\u9078\u629e\u3059\u308b\u753b\u9762\u3092\u4f5c\u3063\u3066\u3044\u307e\u3059\u3002\u4f5c\u3063\u3066\u308b\u9014\u4e2d\u3067\u601d\u3063\u305f\u306e\u3067\u3059\u304c\u3001\u4e3b\u4eba\u516c\u306e\u4f53\u529b\u3084\u653b\u6483\u529b\u306a\u3069\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u306e\u7a2e\u985e\u3092\u4f5c\u308a\u904e\u304e\u305f\u305b\u3044\u3067\u30b2\u30fc\u30e0\u30d0\u30e9\u30f3\u30b9\u306e\u8abf\u6574\u304c\u3048\u3089\u304f\u5927\u5909\u306b\u306a\u308a\u3001\u30b2\u30fc\u30e0\u88fd\u4f5c\u6642\u9593\u306e\u5927\u534a\u3092\u305d\u306e\u8abf\u6574\u306b\u8cbb\u3084\u3059\u3053\u3068\u306b\u306a\u308a\u305d\u3046\u3067\u3059\u3002\u4f5c\u3063\u3066\u3066\u5927\u5909\u306a\u306e\u306f\u3001\u30b2\u30fc\u30e0\u753b\u9762\u306e\u5927\u304d\u3055\u306b\u9650\u308a\u304c\u3042\u308b\u4ee5\u4e0a\u306f\u8868\u793a\u3067\u304d\u308b\u6587\u5b57\u6570\u3082\u9650\u3089\u308c\u3066\u3044\u308b\u306e\u3067\u6b66\u5668\u306e\u540d\u524d\u3068\u304b\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u3068\u304b\u306e\u30ec\u30a4\u30a2\u30a6\u30c8\u3092\u3088\u304f\u8003\u3048\u306a\u3044\u3068\u3044\u3051\u306a\u3044\u3053\u3068\u3067\u3059\u3002\u6587\u5b57\u306e\u5927\u304d\u3055\u3084\u4f4d\u7f6e\u8abf\u6574\u306b\u306f\u304b\u306a\u308a\u6642\u9593\u3092\u3064\u304b\u3044\u307e\u3057\u305f\u3002\u88c5\u5099\u9078\u629e\u753b\u9762\u306f\u307b\u3068\u3093\u3069\u5b8c\u6210\u3057\u3066\u3044\u308b\u306e\u3067\u3001\u6b21\u306f\u4f1a\u8a71\u30d1\u30fc\u30c8\u306b\u306a\u308a\u307e\u3059\u3002\u6700\u8fd1\u3042\u308b\uff2d\uff2d\uff2f\u306b\u3068\u3066\u3082\u306f\u307e\u3063\u3066\u3057\u307e\u3063\u3066\u9762\u767d\u3059\u304e\u3066\u9006\u306b\u8f9b\u3044\u3067\u3059\u3002\u306a\u304b\u306a\u304b\u30b2\u30fc\u30e0\u88fd\u4f5c\u3084\u4ed6\u306e\u3084\u3089\u306a\u3051\u308c\u3070\u3044\u3051\u306a\u3044\u3053\u3068\u304c\u306f\u304b\u3069\u3089\u306a\u3044\u3068\u3044\u3046\u306e\u3082\u3042\u308a\u307e\u3059\u3057\u3001\u3044\u3064\u304b\u306f\u3053\u306e\u697d\u3057\u3055\u3082\u7d42\u308f\u3063\u3066\u3057\u307e\u3046\u306e\u304b\u3068\u601d\u3046\u3068\u60b2\u3057\u304f\u306a\u308a\u307e\u3059\u3002\u672c\u5f53\u306b\u305d\u306e\uff2d\uff2d\uff2f\u306b\u51fa\u4f1a\u3063\u305f\u304a\u304b\u3052\u3067\u3001\u3053\u305310\u5e74\u3067\u4eca\u304c\u4e00\u756a\u697d\u3057\u3044\u3067\u3059\u3002\u6b63\u78ba\u306b\u306f\uff2d\uff2d\uff2f\u3067\u306e\u4ed6\u306e\u30d7\u30ec\u30a4\u30e4\u30fc\u3068\u306e\u4ea4\u6d41\u304c\u3001\u3042\u307e\u308a\u4eba\u3068\u95a2\u308f\u3063\u3066\u3053\u306a\u304b\u3063\u305f\u81ea\u5206\u306b\u3068\u3063\u3066\u3068\u3066\u3082\u65b0\u9bae\u3067\u697d\u3057\u3044\u3067\u3059\u3002\u30b2\u30fc\u30e0\u5185\u306e\u8ddd\u96e2\u611f\u3068\u3044\u3046\u306e\u304c\u81ea\u5206\u3092\u5909\u3048\u3066\u3044\u308b\u3088\u3046\u306a\u6c17\u304c\u3057\u307e\u3059\u3002\u30b2\u30fc\u30e0\u3068\u30b2\u30fc\u30e0\u88fd\u4f5c\u306e\u4e21\u7acb\u3092\u9811\u5f35\u308a\u305f\u3044\u3068\u601d\u3044\u307e\u3059\u3002"})]})}}},function(e){e.O(0,[574,774,888,179],(function(){return t=7915,e(e.s=t);var t}));var t=e.O();_N_E=t}]);