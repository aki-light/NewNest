(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[511],{3367:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/diaries/dia_2022_6",function(){return n(4706)}])},5242:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(5893);function i(e){var t=e.title,n=e.date,i=e.paragraph;return(0,r.jsxs)("div",{className:"shadow-md rounded pl-5 bg-skin",style:{borderTop:"solid 10px #ffeec4",marginBottom:"1%"},children:[(0,r.jsxs)("header",{children:[(0,r.jsx)("h2",{className:"text-xl font-bold mb-2",children:t}),(0,r.jsx)("h3",{className:"text-sm font-bold mb-1",children:n})]}),(0,r.jsx)("p",{className:"text-justify text-base pr-5 pb-5",children:i})]})}},7e3:function(e,t,n){"use strict";n.d(t,{Z:function(){return x}});var r=n(5893),i=n(7294),s=n(1664),a=n.n(s);function c(e){var t=e.href,n=e.month;return(0,r.jsx)("li",{children:(0,r.jsx)(a(),{href:t,children:(0,r.jsx)("a",{className:"hover:bg-brown hover:text-white",children:n})})})}function l(e){var t=e.year,n=e.children,i=e.yearListStates,s=e.handleYearButtonClick;return(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("div",{className:"font-bold text-lg block bg-white text-center py-5 cursor-pointer hover:bg-skin",onClick:function(e){s(t),e.stopPropagation()},children:(0,r.jsx)("h3",{children:t})}),i[t]?(0,r.jsx)("ul",{className:"absolute grid bg-white px-2 py-2 shadow-md rounded text-2xl font-bold text-brown",style:{top:"0",left:"105%",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"10px"},children:n}):(0,r.jsx)(r.Fragment,{})]})}function o(e){var t=e.yearListStates,n=e.handleYearButtonClick;return(0,r.jsxs)("aside",{className:"w-1/5 order-1",style:{margin:"1% 0 0 1%"},children:[(0,r.jsx)("h2",{className:"text-lg text-white font-bold text-center bg-brown",children:"\u8a18\u4e8b\u4e00\u89a7"}),(0,r.jsx)(l,{year:"2022",yearListStates:t,handleYearButtonClick:n,children:(0,r.jsx)(c,{month:"06",href:"/diaries/dia_2022_6"})}),(0,r.jsxs)(l,{year:"2021",yearListStates:t,handleYearButtonClick:n,children:[(0,r.jsx)(c,{month:"08",href:"/diaries/dia_2021_8"}),(0,r.jsx)(c,{month:"09",href:"/diaries/dia_2021_9"}),(0,r.jsx)(c,{month:"10",href:"/diaries/dia_2021_10"})]})]})}function d(e){var t=e.children,n=e.yearListStates,i=e.handleYearButtonClick;return(0,r.jsxs)("div",{className:"flex",children:[(0,r.jsx)("article",{className:"w-4/5 order-2",style:{margin:"1% 1% 0 1%"},children:t}),(0,r.jsx)(o,{yearListStates:n,handleYearButtonClick:i})]})}var u=n(3203);function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function x(e){var t=e.title,n=e.children,s=(0,i.useState)({2021:!1,2022:!1}),a=s[0],c=s[1],l=function(){c((function(e){return{2021:!1,2022:!1}}))};return(0,r.jsx)("div",{onClick:l,children:(0,r.jsx)(u.Z,{title:t,children:(0,r.jsx)(d,{yearListStates:a,handleYearButtonClick:function(e){l(),a[e]||c((function(t){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){h(e,t,n[t])}))}return e}({},t,h({},e,!0))}))},children:n})})})}},5094:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(5893);function i(e){var t=e.history;return(0,r.jsx)("footer",{className:"mt-14 text-center absolute bottom-0 w-full text-white text-xl py-6 bg-brown",children:(0,r.jsx)("p",{children:(0,r.jsxs)("small",{children:["\xa9 ",t," NewNest"]})})})}},4098:function(e,t,n){"use strict";n.d(t,{Z:function(){return d}});var r=n(5893),i=(0,n(1752).default)(),s=(i.serverRuntimeConfig,i.publicRuntimeConfig);function a(){return(0,r.jsx)("div",{className:"pl-5 pt-2 pb-2",children:(0,r.jsx)("img",{src:"".concat(s.staticFolder,"/images/home-title.png"),width:191,height:35,alt:"title"})})}var c=n(1664),l=n.n(c);function o(e){var t=e.diaPath;return(0,r.jsxs)("ul",{className:"flex justify-around text-lg list-none text-white",children:[(0,r.jsx)("li",{children:(0,r.jsx)(l(),{href:"/",children:(0,r.jsx)("a",{children:"\u30c8\u30c3\u30d7\u30da\u30fc\u30b8"})})}),(0,r.jsx)("li",{children:(0,r.jsx)(l(),{href:t,children:(0,r.jsx)("a",{children:"\u958b\u767a\u65e5\u8a18"})})}),(0,r.jsx)("li",{children:(0,r.jsx)(l(),{href:"mailto:myagpisapoopster@new-nest.net",children:(0,r.jsx)("a",{children:"\u30e1\u30fc\u30eb"})})})]})}function d(){return(0,r.jsxs)("div",{className:"shadow-md bg-cover text-center sm:text-left",style:{backgroundImage:"url(/images/top-img2.jpg)"},children:[(0,r.jsx)(a,{}),(0,r.jsx)(o,{diaPath:"/diaries/dia_2022_6"})]})}},3390:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var r=n(5893),i=n(9008),s=n.n(i);function a(e){var t=e.title;return(0,r.jsxs)(s(),{children:[(0,r.jsx)("title",{children:t}),(0,r.jsx)("meta",{charSet:"utf-8"}),(0,r.jsx)("meta",{name:"viewport",content:"width=device-width,initial-scale=1"}),(0,r.jsx)("meta",{name:"description",content:"\u30d6\u30e9\u30a6\u30b6\u30b2\u30fc\u30e0(HTML5\u30b2\u30fc\u30e0)\u3092\u5236\u4f5c\u3057\u3066\u3044\u307e\u3059\u3002I am making browser game (HTML5 game)."}),(0,r.jsx)("link",{rel:"shortcut icon",type:"image/x-icon",href:"/images/favicon.ico"})]})}},3203:function(e,t,n){"use strict";n.d(t,{Z:function(){return c}});var r=n(5893),i=n(5094),s=n(4098),a=n(3390);function c(e){var t=e.title,n=e.children;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.Z,{title:t}),(0,r.jsxs)("div",{className:"min-h-screen relative pb-28 box-border",children:[(0,r.jsx)(s.Z,{}),n,(0,r.jsx)(i.Z,{history:"2021-2022"})]})]})}},4706:function(e,t,n){"use strict";n.r(t);var r=n(5893),i=n(5242),s=n(7e3);t.default=function(){return(0,r.jsx)(s.Z,{title:"dia_2022_6",children:(0,r.jsx)(i.Z,{title:"\u8272\u5f53\u3066\u30b2\u30fc\u30e0\u516c\u958b",date:"2022/6/6",paragraph:"\u304b\u306a\u308a\u9577\u3044\u9593\u65e5\u8a18\u3092\u66f8\u3044\u3066\u3044\u307e\u305b\u3093\u3067\u3057\u305f\u304c\u3001\u305d\u306e\u9593\u306b\u3001\u30e9\u30b9\u30dc\u30b9\u6226\u3060\u3051\u306eRPG\u3068\u30df\u30cb\u30b2\u30fc\u30e0\u3068\u3057\u3066\u3001\u8272\u5f53\u3066\u30b2\u30fc\u30e0\u3092\u516c\u958b\u3057\u307e\u3057\u305f\u3002"})})}}},function(e){e.O(0,[574,774,888,179],(function(){return t=3367,e(e.s=t);var t}));var t=e.O();_N_E=t}]);