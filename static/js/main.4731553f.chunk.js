(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,a){e.exports={content:"Home_content__17o0m",title:"Home_title__3RMOO",info:"Home_info__3cz9d"}},16:function(e,t,a){e.exports={item:"EdInputItem_item__1SkO0",input:"EdInputItem_input__3GwRa"}},2:function(e,t,a){e.exports={content:"Ed_content__1l1NB",btn:"Ed_btn__6Y9Yn",bold:"Ed_bold__D9PBv",title:"Ed_title__3DfPb",form:"Ed_form__22Lu7",result:"Ed_result__yGL7o",text:"Ed_text__3fZTe",table:"Ed_table__3jSAC"}},23:function(e,t,a){e.exports={vision:"Vision_vision__xYpEi"}},24:function(e,t,a){e.exports={item:"ToolItem_item__28yNK"}},28:function(e,t,a){e.exports=a(43)},33:function(e,t,a){},34:function(e,t,a){},43:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),c=a(22),r=a.n(c),i=a(25),u=a(12),o=a(7),s=a(8),m=a(11),h=a(9),p=a(3),d=a(10),E=a(23),f=a.n(E),v=function(){return l.a.createElement("p",{className:f.a.vision},"V 3.1.0")},b=a(24),_=a.n(b),g=function(e){var t=e.url,a=e.name,n=e.jump;return l.a.createElement("div",null,l.a.createElement("span",{className:_.a.item,onClick:function(){return n(t)}},a))},y=a(16),N=a.n(y),O=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(m.a)(this,Object(h.a)(t).call(this,e))).state={value:a.props.defaultValue||""},a.handleChange=a.handleChange.bind(Object(p.a)(a)),a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){this.loadLS()}},{key:"loadLS",value:function(){var e,t=this.props,a=t.id,n=t.handleChange,l=t.defaultValue,c=localStorage.getItem("ed:".concat(a));c?e=c:l&&(e=l),e&&(this.setState({value:e}),n(a,e))}},{key:"handleChange",value:function(e){var t=this.state.value,a=e.currentTarget.value,n=this.props,l=n.id,c=n.handleChange;t="platinum"===l?a.replace(/[^0-9.]/g,""):a.replace(/[^0-9]/g,""),this.setState({value:t}),localStorage.setItem("ed:"+l,t),c(l,t)}},{key:"render",value:function(){var e=this.props,t=e.title,a=e.type,n=e.placeholder,c=e.maxlength,r=this.state.value;return l.a.createElement("div",{className:N.a.item},l.a.createElement("p",null,t),l.a.createElement("input",{className:N.a.input,type:a,placeholder:n,maxLength:c,onChange:this.handleChange,value:r}))}}]),t}(n.Component);function j(e){return function(t){function a(){var e,t;Object(o.a)(this,a);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(t=Object(m.a)(this,(e=Object(h.a)(a)).call.apply(e,[this].concat(l)))).start=0,t}return Object(d.a)(a,t),Object(s.a)(a,[{key:"componentWillMount",value:function(){this.start=Date.now()}},{key:"componentDidMount",value:function(){var t=Date.now();console.log("\u7ec4\u4ef6\u540d\uff1a ".concat(e.displayName||e.name,"  \u6e32\u67d3\u65f6\u95f4\uff1a ").concat(t-this.start," ms"))}},{key:"render",value:function(){return l.a.createElement(e,this.props)}}]),a}(n.Component)}var x=a(14),k=a.n(x),w=j(function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(m.a)(this,Object(h.a)(t).call(this,e))).state={list:[{name:"\u795e\u5668\u5347\u7ea7\u5de5\u5177",url:"https://fanwenkui.github.io/tt2-artifacts/"},{name:"ED\u7b49\u7ea7\u8ba1\u7b97\u5668",url:"/ed"}]},a.handleJump=a.handleJump.bind(Object(p.a)(a)),a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"handleJump",value:function(e){e.indexOf("http")>-1?window.location.href=e:this.props.history.push(e)}},{key:"render",value:function(){var e=this,t=this.state.list;return l.a.createElement("div",{className:k.a.content},l.a.createElement("div",{className:k.a.title},"TT2\u5de5\u5177\u96c6\u5408"),l.a.createElement(v,null),l.a.createElement("div",{className:k.a.info},"\u5982\u679c\u6709\u7591\u95ee\u8bf7\u8054\u7cfb\u6211",l.a.createElement("br",null),"qq 277148066\uff0c\u6572\u95e8\u7816\uff1att2"),l.a.createElement("div",null,t.map(function(t){return l.a.createElement(g,Object.assign({jump:e.handleJump,key:t.name},t))})))}}]),t}(n.Component)),C=a(2),D=a.n(C),I=j(function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(m.a)(this,Object(h.a)(t).call(this,e))).calcTotalNum=function(e,t,a){return 2*Math.floor(parseInt(e)/500)+8-parseInt(t)-parseInt(a)},a.calcSlashNum=function(e,t){return parseInt(e)+parseInt(t)},a.state={list:[{id:"max",title:"\u6781\u9650\u5c42\u6570",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u6781\u9650\u5c42\u6570",maxlength:5},{id:"arcane",title:"\u8ba8\u4ef7\u8fd8\u4ef7\u7b49\u7ea7",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u8ba8\u4ef7\u8fd8\u4ef7\u7b49\u7ea7",maxlength:4},{id:"mystic",title:"\u795e\u79d8\u51b2\u51fb\u7b49\u7ea7",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u795e\u79d8\u51b2\u51fb\u7b49\u7ea7",maxlength:4},{id:"presence",title:"\u5a01\u540d\u8d6b\u8d6b\u7b49\u7ea7",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u5a01\u540d\u8d6b\u8d6b\u7b49\u7ea7",maxlength:4},{id:"platinum",title:"\u5468\u5e74\u767d\u91d1\u5957\u88c5\u4e58\u6570",type:"number",placeholder:"\u8bf7\u8f93\u5165\u5468\u5e74\u767d\u91d1\u5957\u88c5\u4e58\u6570",maxlength:4,defaultValue:"1"}],edData:[[1,0,2,2],[2,1,2,4],[3,2,3,7],[4,3,3,10],[5,4,3,13],[6,6,4,17],[7,8,5,22],[8,10,5,27],[9,12,6,33],[10,14,7,40],[11,16,8,48],[12,18,9,57],[13,20,11,68],[14,23,12,80],[15,26,14,94],[16,29,16,110],[17,33,19,129],[18,38,22,151],[19,44,25,176],[20,51,28,204],[21,59,33,237],[22,68,38,275],[23,78,43,318],[24,89,50,368],[25,101,57,425]],totalNum:0,slashNum:0,halfText:"0",fullText:"0"},a.handleChange=a.handleChange.bind(Object(p.a)(a)),a.validate=a.validate.bind(Object(p.a)(a)),a.calcResult=a.calcResult.bind(Object(p.a)(a)),a.handleErrorInput=a.handleErrorInput.bind(Object(p.a)(a)),a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"handleChange",value:function(e,t){var a=this.state.list;a=a.map(function(a){return a.id===e&&(a.value=t),a}),this.setState({list:a})}},{key:"validate",value:function(){var e=this.state.list,t=!0;for(var a in e){var n=e[a],l=n.id,c=n.title,r=n.value;if(!r){alert("".concat(c,"\u4e0d\u80fd\u4e3a\u7a7a")),t=!1;break}var i=/^[1-9]\d*$/;if("platinum"===l&&(i=/(^1\.\d*$)||(^1$)/),!i.test(r)){alert("".concat(c,"\u683c\u5f0f\u6709\u8bef")),t=!1;break}}t?this.calcResult():this.handleErrorInput()}},{key:"calcResult",value:function(){var e=this.state,t=e.list,a=e.edData,n={};t.forEach(function(e){return n[e.id]=e.value});var l,c,r=this.calcTotalNum(n.max,n.arcane,n.presence),i=this.calcSlashNum(n.arcane,n.mystic);if(r>0){var u=[],o=[];a.forEach(function(e){var t=(e[1]+i)*n.platinum;t>Math.floor(r/2)&&u.push(e),t>r&&o.push(e)}),l=u.length?"".concat(u[0][0],"\u7ea7 \u6e85\u5c04\u6570\uff1a").concat(u[0][1]," \u603b\u6280\u80fd\u70b9\uff1a").concat(u[0][3]):"\u6e85\u5c04\u6570\u8fdc\u8fdc\u4e0d\u591f\uff0c\u6ee1\u7ea7ED\u4e5f\u65e0\u6cd5\u63d0\u4f9b\u8db3\u591f\u7684\u6e85\u5c04\u6570\uff0c\u8bf7\u63d0\u9ad8\u88ab\u52a8\u6280\u80fd\u7b49\u7ea7",c=o.length?"".concat(o[0][0],"\u7ea7 \u6e85\u5c04\u6570\uff1a").concat(o[0][1]," \u603b\u6280\u80fd\u70b9\uff1a").concat(o[0][3]):"\u6e85\u5c04\u6570\u8fdc\u8fdc\u4e0d\u591f\uff0c\u6ee1\u7ea7ED\u4e5f\u65e0\u6cd5\u63d0\u4f9b\u8db3\u591f\u7684\u6e85\u5c04\u6570\uff0c\u8bf7\u63d0\u9ad8\u88ab\u52a8\u6280\u80fd\u7b49\u7ea7"}else r=0,i=0,l=0,c=0;this.setState({totalNum:r,slashNum:i,halfText:l,fullText:c})}},{key:"handleErrorInput",value:function(){this.setState({totalNum:0,slashNum:0,halfText:"0",fullText:"0"})}},{key:"render",value:function(){var e=this,t=this.state,a=t.list,n=t.edData,c=t.totalNum,r=t.slashNum,i=t.halfText,u=t.fullText;return l.a.createElement("div",{className:D.a.content},l.a.createElement("div",{className:D.a.title},"\u6211\u662f\u5206\u8eab\u6d41\u6d3e\uff0cED\u5230\u5e95\u8981\u52a0\u591a\u5c11\u7ea7\u5462\uff1f"),l.a.createElement(v,null),l.a.createElement("div",{className:D.a.form},a.length>0&&a.map(function(t){return l.a.createElement(O,Object.assign({},t,{handleChange:e.handleChange,key:t.id}))}),l.a.createElement("button",{className:D.a.btn,onClick:this.validate},"\u770b\u770b\u7ed3\u679c")),l.a.createElement("div",{className:D.a.result},l.a.createElement("p",null,"\u603b\u5c0f\u602a\u6570\u91cf\uff1a",l.a.createElement("span",null,c)),l.a.createElement("p",null,"\u88ab\u52a8\u6280\u80fd\u6e85\u5c04\u6570\uff1a",l.a.createElement("span",null,r)),l.a.createElement("p",null,"\u6ee1ED\uff1a ",l.a.createElement("span",null,u)),l.a.createElement("p",null,"\u534aED\uff1a ",l.a.createElement("span",null,i))),l.a.createElement("div",{className:D.a.text},l.a.createElement("h3",null,"\u4e00\u4e9b\u8bf4\u660e"),l.a.createElement("p",null,"\u9488\u5bf9\u5206\u8eab\u5957\u6765\u8bf4\uff0cED\u52a0\u591a\u5c11\u7ea7\u56f0\u6270\u4e86\u597d\u591a\u4eba\uff0c\u56e0\u4e3a\u9700\u8981\u7684\u6280\u80fd\u70b9\u504f\u591a\uff0c\u52a0\u591a\u4e86\u6ca1\u7528\uff0c\u52a0\u5c11\u4e86\u53c8\u4e0d\u80fd\u8df3\u5173\uff0c\u7279\u610f\u51fa\u4e86\u8fd9\u4e2a\u5de5\u5177\u3002"),l.a.createElement("p",null,"\u4f7f\u7528\u6b64\u5de5\u5177\u7684\u524d\u63d0\u662f\u4f60\u6709",l.a.createElement("span",{className:D.a.bold},"\u5206\u8eab\u5957"),"\uff0c\u6709\u5206\u8eab\u5957\u624d\u80fd\u8df3\u5173\uff0c\u8df3\u5173\u57fa\u7840\u89e6\u53d1\u7387\u4e3a:",l.a.createElement("span",{className:D.a.bold},"25%")),l.a.createElement("p",null,"\u6709\u65e0\u5929\u5802\u5957\u51b3\u5b9a\u4e86\u4f60\u8df3\u5173\u7684\u6700\u5927\u5173\u6570\uff0c\u6ca1\u6709\u7684\u8bdd\u6700\u591a\u8df34\u5c42\uff0c\u6709\u5219\u662f12\u5c42"),l.a.createElement("p",null,"\u6709\u95ee\u9898\u53ef\u4ee5\u8054\u7cfb",l.a.createElement("span",{className:D.a.bold},"qq 277148066"),"\uff0c\u6572\u95e8\u7816\uff1att2"),l.a.createElement("h3",null,"\u4e00\u4e9b\u5907\u6ce8"),l.a.createElement("p",{className:D.a.bold},"*\u5468\u5e74\u767d\u91d1\u4e58\u6570: \u6ca1\u6709\u586b1\uff0c\u6709\u5219\u586b\u5199\u4e58\u6570"),l.a.createElement("p",null,"*ED\uff1a\u6c38\u6052\u9ed1\u6697\u6280\u80fd \u5373\u84dd3-3"),l.a.createElement("p",null,"*\u70b8\u5f39\u602a\uff1a\u5e26\u6709\u70b8\u5f39\u602abuff\uff0c\u5219\u5c0f\u602a\u6570\u91cf\u51cf\u534a"),l.a.createElement("p",null,"*\u6ee1ED\uff1a\u6781\u9650\u5c42\uff0c\u65e0\u9700\u70b8\u5f39\u602abuff\uff0c\u90fd\u53ef\u4ee5\u8df3\u5173\uff08\u6280\u80fd\u70b9\u6d88\u8017\u5f88\u5927\uff09"),l.a.createElement("p",null,"*\u534aED\uff1a\u6781\u9650\u5c42\uff0c\u53ea\u5728\u6709\u70b8\u5f39\u602abuff\u65f6\uff0c\u624d\u53ef\u4ee5\u8df3\u5173\uff08\u6280\u80fd\u70b9\u6d88\u8017\u4e00\u822c\uff09"),l.a.createElement("h3",null,"ED\u7b49\u7ea7\u53c2\u7167\u8868"),l.a.createElement("table",{className:D.a.table},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"\u7b49\u7ea7"),l.a.createElement("th",null,"\u6e85\u5c04\u6570"),l.a.createElement("th",null,"\u6bcf\u7ea7\u6d88\u8017"),l.a.createElement("th",null,"\u603b\u6d88\u8017"))),l.a.createElement("tbody",null,n.map(function(e,t){return l.a.createElement("tr",{key:t},e.map(function(e,t){return l.a.createElement("td",{key:t},e)}))})))))}}]),t}(n.Component));a(33),a(34),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(l.a.createElement(function(){return l.a.createElement(i.a,null,l.a.createElement(u.d,null,l.a.createElement(u.b,{path:"/",exact:!0,component:w}),l.a.createElement(u.b,{path:"/ed",exact:!0,component:I}),l.a.createElement(u.a,{path:"*",to:"/"})))},null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[28,1,2]]]);
//# sourceMappingURL=main.4731553f.chunk.js.map