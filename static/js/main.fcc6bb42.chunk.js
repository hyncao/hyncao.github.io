(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{19:function(e,t,n){e.exports={content:"Home_content__3EhuK",title:"Home_title__3shsh",info:"Home_info__1JZLS"}},22:function(e,t,n){e.exports={item:"EdInputItem_item__38pCK",input:"EdInputItem_input__2_2-I"}},29:function(e,t,n){e.exports={vision:"Vision_vision__2kdVN"}},30:function(e,t,n){e.exports={item:"ToolItem_item__iZMaw"}},31:function(e,t,n){e.exports=n.p+"static/media/bg.9761dbd8.png"},33:function(e,t,n){e.exports={done:"Test_done__1c9TP"}},37:function(e,t,n){e.exports=n(54)},44:function(e,t,n){},45:function(e,t,n){},54:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(17),c=n.n(r),o=n(34),i=n(15),u=n(4),s=n(5),p=n(11),m=n(10),h=n(14),d=n(12),b=n(29),f=n.n(b),y=function(){return l.a.createElement("p",{className:f.a.vision},"V 3.10.0")},v=n(30),E=n.n(v),O=function(e){var t=e.url,n=e.name,a=e.jump;return l.a.createElement("div",null,l.a.createElement("span",{className:E.a.item,onClick:function(){return a(t)}},n))},j=n(22),g=n.n(j),w=function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={value:n.props.defaultValue||""},n.handleChange=n.handleChange.bind(Object(h.a)(n)),n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){this.loadLS()}},{key:"loadLS",value:function(){var e,t=this.props,n=t.id,a=t.handleChange,l=t.defaultValue,r=localStorage.getItem("ed:".concat(n));r?e=r:l&&(e=l),e&&(this.setState({value:e}),a(n,e))}},{key:"handleChange",value:function(e){var t=this.state.value,n=e.currentTarget.value,a=this.props,l=a.id,r=a.handleChange;t="platinum"===l?n.replace(/[^0-9.]/g,""):n.replace(/[^0-9]/g,""),this.setState({value:t}),localStorage.setItem("ed:"+l,t),r(l,t)}},{key:"render",value:function(){var e=this.props,t=e.title,n=e.type,a=e.placeholder,r=e.maxlength,c=this.state.value;return l.a.createElement("div",{className:g.a.item},l.a.createElement("p",null,t),l.a.createElement("input",{className:g.a.input,type:n,placeholder:a,maxLength:r,onChange:this.handleChange,value:c}))}}]),t}(a.Component),_=[{name:"\u5168\u65b0\u7248\u672c\u4f18\u5316\u5668, \u5185\u542b\u6280\u80fd\u6811\u6a21\u62df\u5668",url:"http://www.hyncao.com/new-optimizer/"},{name:"\u4f18\u5316\u5668",url:"http://www.hyncao.com/optimizer/"},{name:"ED\u7b49\u7ea7\u8ba1\u7b97\u5668",url:"/ed"}];function k(e){return function(t){function n(){var e,t;Object(u.a)(this,n);for(var a=arguments.length,l=new Array(a),r=0;r<a;r++)l[r]=arguments[r];return(t=Object(p.a)(this,(e=Object(m.a)(n)).call.apply(e,[this].concat(l)))).start=0,t}return Object(d.a)(n,t),Object(s.a)(n,[{key:"componentWillMount",value:function(){this.start=Date.now()}},{key:"componentDidMount",value:function(){var t=Date.now();console.log("\u7ec4\u4ef6\u540d\uff1a ".concat(e.displayName||e.name,"  \u6e32\u67d3\u65f6\u95f4\uff1a ").concat(t-this.start," ms"))}},{key:"render",value:function(){return l.a.createElement(e,this.props)}}]),n}(a.Component)}var N,x,D,T,C,I,S,P,z,J,L,K,H,M,V,q,F,R,W,$=n(19),Z=n.n($),A=n(31),B=n.n(A),U=k(function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={list:_},n.handleJump=n.handleJump.bind(Object(h.a)(n)),n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"handleJump",value:function(e){e.indexOf("http")>-1?window.location.href=e:this.props.history.push(e)}},{key:"render",value:function(){var e=this,t=this.state.list;return l.a.createElement("div",{className:Z.a.content,style:{background:"#ccc url(".concat(B.a,") 20% 0% / cover no-repeat"),height:window.innerHeight}},l.a.createElement("div",{className:Z.a.title},"TT2\u5de5\u5177\u96c6\u5408"),l.a.createElement(y,null),l.a.createElement("div",{className:Z.a.info},"\u4f18\u5316\u5668\u5df2\u589e\u52a0\u795e\u5668\u9644\u9b54\uff0c\u5982\u679c\u6709\u7591\u95ee\u8bf7\u8054\u7cfb\u6211",l.a.createElement("br",null),"qq 277148066\uff0c\u6572\u95e8\u7816\uff1att2"),l.a.createElement("div",null,t.map(function(t){return l.a.createElement(O,Object.assign({jump:e.handleJump,key:t.name},t))})))}}]),t}(a.Component)),X=n(18),Y=n(13),G=n(2),Q=(n(27),n(1)),ee=(N=Q.b.bound,x=Q.b.bound,D=Q.b.bound,T=Q.b.bound,C=Q.b.bound,I=Q.b.bound,S=function(){function e(){Object(u.a)(this,e),Object(Y.a)(this,"list",P,this),Object(Y.a)(this,"edData",z,this),Object(Y.a)(this,"totalNum",J,this),Object(Y.a)(this,"slashNum",L,this),Object(Y.a)(this,"halfText",K,this),Object(Y.a)(this,"fullText",H,this)}return Object(s.a)(e,[{key:"handleChange",value:function(e,t){var n=this.list.map(function(n){return n.id===e&&(n.value=t),n});this.list=n}},{key:"validate",value:function(){var e=this.list,t=!0;for(var n in e){var a=e[n],l=a.id,r=a.title,c=a.value;if(!c){alert("".concat(r,"\u4e0d\u80fd\u4e3a\u7a7a")),t=!1;break}var o=/^[1-9]\d*$/;if("platinum"===l&&(o=/(^1\.\d*$)||(^1$)/),!o.test(c)){alert("".concat(r,"\u683c\u5f0f\u6709\u8bef")),t=!1;break}}t?this.calcResult():this.handleErrorInput()}},{key:"handleErrorInput",value:function(){this.totalNum=0,this.slashNum=0,this.halfText="0",this.fullText="0"}},{key:"calcResult",value:function(){var e=this.list,t=this.edData,n={};e.forEach(function(e){return n[e.id]=e.value});var a,l,r=this.calcTotalNum(n.max,n.arcane,n.presence),c=this.calcSlashNum(n.arcane,n.mystic);if(r>0){var o=[],i=[];t.forEach(function(e){var t=(e[1]+c)*n.platinum;t>Math.floor(r/2)&&o.push(e),t>r&&i.push(e)}),a=o.length?"".concat(o[0][0],"\u7ea7 \u6e85\u5c04\u6570\uff1a").concat(o[0][1]," \u603b\u6280\u80fd\u70b9\uff1a").concat(o[0][3]):"\u6e85\u5c04\u6570\u8fdc\u8fdc\u4e0d\u591f\uff0c\u6ee1\u7ea7ED\u4e5f\u65e0\u6cd5\u63d0\u4f9b\u8db3\u591f\u7684\u6e85\u5c04\u6570\uff0c\u8bf7\u63d0\u9ad8\u88ab\u52a8\u6280\u80fd\u7b49\u7ea7",l=i.length?"".concat(i[0][0],"\u7ea7 \u6e85\u5c04\u6570\uff1a").concat(i[0][1]," \u603b\u6280\u80fd\u70b9\uff1a").concat(i[0][3]):"\u6e85\u5c04\u6570\u8fdc\u8fdc\u4e0d\u591f\uff0c\u6ee1\u7ea7ED\u4e5f\u65e0\u6cd5\u63d0\u4f9b\u8db3\u591f\u7684\u6e85\u5c04\u6570\uff0c\u8bf7\u63d0\u9ad8\u88ab\u52a8\u6280\u80fd\u7b49\u7ea7"}else r=0,c=0,a=0,l=0;this.totalNum=r,this.slashNum=c,this.halfText=a,this.fullText=l}},{key:"calcTotalNum",value:function(e,t,n){return 2*Math.floor(parseInt(e)/500)+8-parseInt(t)-parseInt(n)}},{key:"calcSlashNum",value:function(e,t){return parseInt(e)+parseInt(t)}}]),e}(),P=Object(G.a)(S.prototype,"list",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[{id:"max",title:"\u6781\u9650\u5c42\u6570",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u6781\u9650\u5c42\u6570",maxlength:5,value:""},{id:"arcane",title:"\u8ba8\u4ef7\u8fd8\u4ef7\u7b49\u7ea7",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u8ba8\u4ef7\u8fd8\u4ef7\u7b49\u7ea7",maxlength:4,value:""},{id:"mystic",title:"\u795e\u79d8\u51b2\u51fb\u7b49\u7ea7",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u795e\u79d8\u51b2\u51fb\u7b49\u7ea7",maxlength:4,value:""},{id:"presence",title:"\u5a01\u540d\u8d6b\u8d6b\u7b49\u7ea7",type:"tel",placeholder:"\u8bf7\u8f93\u5165\u5a01\u540d\u8d6b\u8d6b\u7b49\u7ea7",maxlength:4,value:""},{id:"platinum",title:"\u5468\u5e74\u767d\u91d1\u5957\u88c5\u4e58\u6570",type:"number",placeholder:"\u8bf7\u8f93\u5165\u5468\u5e74\u767d\u91d1\u5957\u88c5\u4e58\u6570",maxlength:4,defaultValue:"1",value:""}]}}),z=Object(G.a)(S.prototype,"edData",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[[1,0,2,2],[2,1,2,4],[3,2,3,7],[4,3,3,10],[5,4,3,13],[6,6,4,17],[7,8,5,22],[8,10,5,27],[9,12,6,33],[10,14,7,40],[11,16,8,48],[12,18,9,57],[13,20,11,68],[14,23,12,80],[15,26,14,94],[16,29,16,110],[17,33,19,129],[18,38,22,151],[19,44,25,176],[20,51,28,204],[21,59,33,237],[22,68,38,275],[23,78,43,318],[24,89,50,368],[25,101,57,425]]}}),J=Object(G.a)(S.prototype,"totalNum",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),L=Object(G.a)(S.prototype,"slashNum",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),K=Object(G.a)(S.prototype,"halfText",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return"0"}}),H=Object(G.a)(S.prototype,"fullText",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return"0"}}),Object(G.a)(S.prototype,"handleChange",[N],Object.getOwnPropertyDescriptor(S.prototype,"handleChange"),S.prototype),Object(G.a)(S.prototype,"validate",[x],Object.getOwnPropertyDescriptor(S.prototype,"validate"),S.prototype),Object(G.a)(S.prototype,"handleErrorInput",[D],Object.getOwnPropertyDescriptor(S.prototype,"handleErrorInput"),S.prototype),Object(G.a)(S.prototype,"calcResult",[T],Object.getOwnPropertyDescriptor(S.prototype,"calcResult"),S.prototype),Object(G.a)(S.prototype,"calcTotalNum",[C],Object.getOwnPropertyDescriptor(S.prototype,"calcTotalNum"),S.prototype),Object(G.a)(S.prototype,"calcSlashNum",[I],Object.getOwnPropertyDescriptor(S.prototype,"calcSlashNum"),S.prototype),S),te=n(6),ne=n.n(te),ae=new ee,le=k(M=Object(X.a)(M=function(e){function t(){return Object(u.a)(this,t),Object(p.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=ae.list,t=ae.edData,n=ae.totalNum,a=ae.slashNum,r=ae.halfText,c=ae.fullText,o=ae.handleChange,i=ae.validate;return l.a.createElement("div",{className:ne.a.content},l.a.createElement("div",{className:ne.a.title},"\u6211\u662f\u5206\u8eab\u6d41\u6d3e\uff0cED\u5230\u5e95\u8981\u52a0\u591a\u5c11\u7ea7\u5462\uff1f"),l.a.createElement(y,null),l.a.createElement("div",{className:ne.a.form},e.length>0&&e.map(function(e){return l.a.createElement(w,Object.assign({},e,{handleChange:o,key:e.id}))}),l.a.createElement("button",{className:ne.a.btn,onClick:i},"\u770b\u770b\u7ed3\u679c")),l.a.createElement("div",{className:ne.a.result},l.a.createElement("p",null,"\u603b\u5c0f\u602a\u6570\u91cf\uff1a",l.a.createElement("span",null,n)),l.a.createElement("p",null,"\u88ab\u52a8\u6280\u80fd\u6e85\u5c04\u6570\uff1a",l.a.createElement("span",null,a)),l.a.createElement("p",null,"\u6ee1ED\uff1a ",l.a.createElement("span",null,c)),l.a.createElement("p",null,"\u534aED\uff1a ",l.a.createElement("span",null,r))),l.a.createElement("div",{className:ne.a.text},l.a.createElement("h3",null,"\u4e00\u4e9b\u8bf4\u660e"),l.a.createElement("p",null,"\u9488\u5bf9\u5206\u8eab\u5957\u6765\u8bf4\uff0cED\u52a0\u591a\u5c11\u7ea7\u56f0\u6270\u4e86\u597d\u591a\u4eba\uff0c\u56e0\u4e3a\u9700\u8981\u7684\u6280\u80fd\u70b9\u504f\u591a\uff0c\u52a0\u591a\u4e86\u6ca1\u7528\uff0c\u52a0\u5c11\u4e86\u53c8\u4e0d\u80fd\u8df3\u5173\uff0c\u7279\u610f\u51fa\u4e86\u8fd9\u4e2a\u5de5\u5177\u3002"),l.a.createElement("p",null,"\u4f7f\u7528\u6b64\u5de5\u5177\u7684\u524d\u63d0\u662f\u4f60\u6709",l.a.createElement("span",{className:ne.a.bold},"\u5206\u8eab\u5957"),"\uff0c\u6709\u5206\u8eab\u5957\u624d\u80fd\u8df3\u5173\uff0c\u8df3\u5173\u57fa\u7840\u89e6\u53d1\u7387\u4e3a:",l.a.createElement("span",{className:ne.a.bold},"25%")),l.a.createElement("p",null,"\u6709\u65e0\u5929\u5802\u5957\u51b3\u5b9a\u4e86\u4f60\u8df3\u5173\u7684\u6700\u5927\u5173\u6570\uff0c\u6ca1\u6709\u7684\u8bdd\u6700\u591a\u8df34\u5c42\uff0c\u6709\u5219\u662f12\u5c42"),l.a.createElement("p",null,"\u6709\u95ee\u9898\u53ef\u4ee5\u8054\u7cfb",l.a.createElement("span",{className:ne.a.bold},"qq 277148066"),"\uff0c\u6572\u95e8\u7816\uff1att2"),l.a.createElement("h3",null,"\u4e00\u4e9b\u5907\u6ce8"),l.a.createElement("p",{className:ne.a.bold},"*\u5468\u5e74\u767d\u91d1\u4e58\u6570: \u6ca1\u6709\u586b1\uff0c\u6709\u5219\u586b\u5199\u4e58\u6570"),l.a.createElement("p",null,"*ED\uff1a\u6c38\u6052\u9ed1\u6697\u6280\u80fd \u5373\u84dd3-3"),l.a.createElement("p",null,"*\u70b8\u5f39\u602a\uff1a\u5e26\u6709\u70b8\u5f39\u602abuff\uff0c\u5219\u5c0f\u602a\u6570\u91cf\u51cf\u534a"),l.a.createElement("p",null,"*\u6ee1ED\uff1a\u6781\u9650\u5c42\uff0c\u65e0\u9700\u70b8\u5f39\u602abuff\uff0c\u90fd\u53ef\u4ee5\u8df3\u5173\uff08\u6280\u80fd\u70b9\u6d88\u8017\u5f88\u5927\uff09"),l.a.createElement("p",null,"*\u534aED\uff1a\u6781\u9650\u5c42\uff0c\u53ea\u5728\u6709\u70b8\u5f39\u602abuff\u65f6\uff0c\u624d\u53ef\u4ee5\u8df3\u5173\uff08\u6280\u80fd\u70b9\u6d88\u8017\u4e00\u822c\uff09"),l.a.createElement("h3",null,"ED\u7b49\u7ea7\u53c2\u7167\u8868"),l.a.createElement("table",{className:ne.a.table},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"\u7b49\u7ea7"),l.a.createElement("th",null,"\u6e85\u5c04\u6570"),l.a.createElement("th",null,"\u6bcf\u7ea7\u6d88\u8017"),l.a.createElement("th",null,"\u603b\u6d88\u8017"))),l.a.createElement("tbody",null,t.map(function(e,t){return l.a.createElement("tr",{key:t},e.map(function(e,t){return l.a.createElement("td",{key:t},e)}))})))))}}]),t}(a.Component))||M)||M,re=n(23),ce=n.n(re),oe=n(32),ie=function(e){return new Promise(function(t){return setTimeout(t,e)})},ue=n(33),se=n.n(ue);Object(Q.d)({enforceActions:"observed"});var pe=new(V=Q.b.bound,q=Q.b.bound,F=function(){function e(){var t=this;Object(u.a)(this,e),Object(Y.a)(this,"list",R,this),this.reaction1=Object(Q.k)(function(){return t.list.length},function(e){return t.list.forEach(function(e){return console.log(JSON.stringify(e))})})}return Object(s.a)(e,[{key:"add",value:function(){var e=Object(oe.a)(ce.a.mark(function e(t){var n,a,l=this;return ce.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=this.list.length,a={id:n,done:!1,text:t},e.next=4,ie(1e3);case 4:Object(Q.l)(function(){l.list.push(a)});case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"doneFn",value:function(e){var t=this.list.map(function(t){var n=t;return n.id===e&&(n.done=!n.done),n});this.list=t}},{key:"getLength",get:function(){return this.list.length}}]),e}(),R=Object(G.a)(F.prototype,"list",[Q.j],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),Object(G.a)(F.prototype,"getLength",[Q.c],Object.getOwnPropertyDescriptor(F.prototype,"getLength"),F.prototype),Object(G.a)(F.prototype,"add",[V],Object.getOwnPropertyDescriptor(F.prototype,"add"),F.prototype),Object(G.a)(F.prototype,"doneFn",[q],Object.getOwnPropertyDescriptor(F.prototype,"doneFn"),F.prototype),F);function me(e){var t=e.item,n=e.store,a=t.id,r=t.done,c=t.text,o=n.doneFn;return l.a.createElement("div",{className:r?se.a.done:"",onClick:function(){return o(a)}},c)}var he=k(Object(X.a)(W=function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).handleKeyDown=n.handleKeyDown.bind(Object(h.a)(n)),n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"handleKeyDown",value:function(e){var t=e.keyCode,n=e.currentTarget.value,a=pe.add;13===t&&(a(n),e.currentTarget.value="")}},{key:"render",value:function(){var e=pe.list,t=pe.getLength;return l.a.createElement("div",null,l.a.createElement("input",{onKeyDown:this.handleKeyDown,placeholder:"Enter Todo"}),l.a.createElement("div",null,t),e&&e.map(function(e){return l.a.createElement(me,{key:e.id,item:e,store:pe})}))}}]),t}(a.Component))||W);n(44),n(45),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(function(){return l.a.createElement(o.a,null,l.a.createElement(i.d,null,l.a.createElement(i.b,{path:"/",exact:!0,component:U}),l.a.createElement(i.b,{path:"/ed",exact:!0,component:le}),l.a.createElement(i.b,{path:"/test",exact:!0,component:he}),l.a.createElement(i.a,{path:"*",to:"/"})))},null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},6:function(e,t,n){e.exports={content:"Ed_content__1o-ys",btn:"Ed_btn__q8ZUY",bold:"Ed_bold__1Xnp1",title:"Ed_title__3kfUy",form:"Ed_form__yarku",result:"Ed_result__20pXH",text:"Ed_text__2nzds",table:"Ed_table__cHh8J"}}},[[37,1,2]]]);
//# sourceMappingURL=main.fcc6bb42.chunk.js.map