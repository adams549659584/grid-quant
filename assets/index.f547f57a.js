import{f as Se,d as _e,r as y,c as De,o as Be,E as $e,a as ke,b as S,e as s,g as xe,h as ie,w as q,v as we,i as W,j as ce,F as I,k as H,u as Y,l as j,m as X,n as be,p as Me,q as re,s as C,t as z,x as E,y as Re,_ as Ne,z as Ie,A as He,B as Ye}from"./vendor.4bb155ba.js";const Je=function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))h(d);new MutationObserver(d=>{for(const l of d)if(l.type==="childList")for(const p of l.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&h(p)}).observe(document,{childList:!0,subtree:!0});function r(d){const l={};return d.integrity&&(l.integrity=d.integrity),d.referrerpolicy&&(l.referrerPolicy=d.referrerpolicy),d.crossorigin==="use-credentials"?l.credentials="include":d.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function h(d){if(d.ep)return;d.ep=!0;const l=r(d);fetch(d.href,l)}};Je();var Oe="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAArlJREFUWEfFl1nITVEUx3/fE1GmF7wrGUvIECFCyVhEhpJSHlBIeEHCCzIkb5QhooyliBAZ4sWc8iZjMhXFC/2/9ql11rfPPfue6+uuOnXP2Wv47bWHtW4LTZaWJsenCkAXYCTQMzyaw8fw3Ad+1DOpVIDuwCpgNDC5JMBV4C6wH/haBpMCsAJYDfQtc+bGXwH7gEO17MoAzgGz6gzs1c8Ds4t81AJQ+ro1GDwz/wZoGdtIEcBJYP5/Cp65OQUs8D5jAJuBLUbxLHAAGAdMB4YmgMn+FrASmGP09X2rtfcAQ4A7QCejNAG4ad4F+MU8GuphHhtgPHDD2L4DhgHvs28eIJb6RcCJhFnHVBYCx91ALgsWQGQPI17WAbsrAqwFdjnbN0Af4I++W4BNwHan/BuYFJalCsMY4BrQwRkvAw57AK2V1syKZrCnSmRjsyaSQe0p7a1cBl4A/VywwcDTBgEGAU+cj5dAfw+gne0vC11E3xsE6AroIrKiS04nJ5eBn+74aby9AH4BnT2AToBOgpX2WoJHwHAPcBRY7ABUgnULNiK6DVWarRwDlniAjcAOp/gBGAu8rkig834b6OXsdeR3eoCZgEqnF5XkpRU2ozbfkYJSrBJ/wQPoXZ3MqAiEvus8P0jMxIhwf6iD8nIvdFat330tyO7u58A8YABw2nh4FshVWvXbysBQwpVJ/S6SXG2JleMroe/LICa6TXQRUJCYCHZujeDqF6fY8RiAar6CSC4D0wCVYF3Tj8NG/VQQRMdWOkUyA7hUBqBxbbrWYgFMBZSVVPlboKglPePHavWE6oT3BoPrwNvQ+68vIYkBRIPLT1lXrNSrLdefkEzKbCyAlkMlvs3MU51JrzewHNgAdEyAFoCKzzbgIKCeolDKZmMNM5BcUxnxrKwp8OeUTVMPQIq/unWaDvAPFJGAIVce/UQAAAAASUVORK5CYII=";function Z(a,f){return Se(a,f||{timeout:1e3*5,jsonpCallback:"cb"}).then(r=>r.json())}function Ve(a,f=1,r=10){const h=`https://searchapi.eastmoney.com/api/Info/Search?appid=el1902262&type=14&token=CCSDCZSDCXYMYZYYSYYXSMDDSMDHHDJT&and14=MultiMatch/Name,Code,PinYin/${a}/true&returnfields14=Name,Code,PinYin,MarketType,JYS,MktNum,JYS4App,MktNum4App,ID,Classify,IsExactMatch,SecurityType,SecurityTypeName&pageIndex14=${f}&pageSize14=${r}&isAssociation14=false1642753371132`;return Z(h)}function de(a){return a&&a.data&&a.data.klines&&(a.data.klineDatas=a.data.klines.map(f=>{const r=f.split(","),h=r[0];let d=h,l="";return h.includes(" ")&&([d,l]=h.split(" ")),{dateStr:d,timeStr:l,openPrice:parseFloat(r[1]),closePrice:parseFloat(r[2]),highPrice:parseFloat(r[3]),lowPrice:parseFloat(r[4])}})),a}async function Te(a){const f=`https://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=${a}&klt=5&fqt=1
  `,r=await Z(f);return de(r)}async function Ke(a,f){const r=`https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${a}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=0&end=20500101&lmt=${f}&_=${Date.now()}`,h=await Z(r);return de(h)}function Ue(a,f){const r={"y+":a.getFullYear(),"M+":a.getMonth()+1,"d+":a.getDate(),"h+":a.getHours()%12==0?12:a.getHours()%12,"H+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),"q+":Math.floor((a.getMonth()+3)/3),"f+":a.getMilliseconds()};for(const h in r)new RegExp("("+h+")").test(f)&&(f=f.replace(RegExp.$1,r[h].toString().padStart(RegExp.$1.length,"0")));return f}function Fe(a){return Ue(new Date,a)}function F(a=1,f=3){const r=Math.pow(10,f);return Math.round(a*r)/r}function ee(a,f,r){const h=f-r,d=(f+r+a*2)/4,l=F(d+h),p=F(d*2-r),A=F(d*2-f),b=F(d-h);return{highSalePrice:l,highSaleRate:F((l/a-1)*100,2),firstSalePrice:p,firstSaleRate:F((p/a-1)*100,2),firstBuyPrice:A,firstBuyRate:F((a/A-1)*100,2),lowBuyPrice:b,lowBuyRate:F((a/b-1)*100,2)}}const Le=s("header",null,[s("h1",{class:"flex-center"},[s("span",{class:"title"},"\u4EF7\u683C\u9884\u6D4B"),s("a",{class:"cursor-pointer",href:"https://github.com/adams549659584/grid-quant",target:"_blank"},[s("img",{src:Oe,alt:"https://github.com/adams549659584/grid-quant"})])])],-1),Ge={class:"flex-center space-x-4"},Qe=["onKeydown"],qe={class:"absolute"},We={key:0,class:"search-hotkey"},je=["onClick"],Xe={key:1,class:"search-hotkey"},ze=s("li",{class:"search-hotkey-items"},"\u6682\u65E0\u76F8\u5173\u80A1\u7968/\u57FA\u91D1",-1),Ze=[ze],et={key:2,class:"search-hotkey"},tt=s("li",{class:"search-hotkey-items"},"\u8F93\u5165\u80A1\u7968/\u57FA\u91D1 \u7F16\u7801/\u7B80\u62FC/\u5168\u62FC/\u4E2D\u6587",-1),ut=[tt],st={key:0,class:"flex-center justify-around text-xl font-bold"},at={class:"row p-2"},nt={class:"flex-1 text-center truncate"},ot={class:"row"},lt=s("div",{class:"column"},"\u64CD\u4F5C",-1),it={class:"row bg-red-400"},ct=s("div",{class:"column"},"\u6781\u9650\u83B7\u5229\u4F4D",-1),rt={class:"column"},dt={class:"row bg-red-300"},Ft=s("div",{class:"column"},"\u7B2C\u4E00\u538B\u529B\u4F4D",-1),ft={class:"column"},vt={class:"row bg-green-300"},ht=s("div",{class:"column"},"\u7B2C\u4E00\u652F\u6491\u4F4D",-1),pt={class:"column"},gt={class:"row bg-green-400"},yt=s("div",{class:"column"},"\u6781\u9650\u6284\u5E95\u4F4D",-1),Pt={class:"column"},mt={class:"row"},Ct=s("div",{class:"column"},"\u632F\u5E45",-1),Et={class:"column"},At=["onClick"],St={class:"flex-center p-4"},_t=Ie("\u770B\u5B8C\u4E86"),Dt=s("footer",null,[s("div",{class:"p-4 text-gray-400"},[s("p",{class:"flex-center space-x-2"},[s("span",null,"MIT Licensed | Copyright \xA9 2022"),s("a",{href:"https://github.com/adams549659584",target:"_blank"},"adams549659584")])])],-1),Bt=_e({setup(a){const f="history_search_results",r=y(!0),h=y(!1),d=y(""),l=y(),p=y(0),A=y(),b=y(!1),te=Number(Fe("Hmm")),ue=te>=930&&te<=1500,fe=!ue,ve=De(()=>{if(!A.value||A.value.length===0)return 0;const t=A.value.length,c=window.screen.width;return c>=1536?5-t%5:c>=1280?4-t%4:c>=1024?3-t%3:c>=768?2-t%2:0}),M=.008,J=y(5),R=y(1e3),$=y(400),o=y(0),i=y(1e5),se=y(0),he=y(""),O=y(!1),_=y([]),ae=t=>{t?h.value=t:setTimeout(()=>{h.value=t},300)},pe=async()=>{K()},ge=async()=>{if(p.value=0,d.value){b.value=!0;const t=await Ve(d.value);l.value=t.Data||[],b.value=!1}else l.value=[]},V=()=>{const t=localStorage.getItem(f);return t?JSON.parse(t):[]},ye=(t,c=!1)=>{let n=V();const g=e=>t.market===e.market&&t.code===e.code&&t.name===e.name;if(c)n=n.filter(e=>!g(e)),n=[t,...n];else{const e=n.findIndex(g);e>-1?n[e]=t:n=[t,...n]}A.value=n,localStorage.setItem(f,JSON.stringify(n))},Pe=t=>(l.value&&l.value.length>0&&(p.value=p.value>0?p.value-1:l.value.length-1),!1),me=t=>(l.value&&l.value.length>0&&(p.value=p.value<l.value.length-1?p.value+1:0),!1),Ce=()=>{if(l.value&&l.value.length>p.value){const t=l.value[p.value];ne(`${t.MktNum}.${t.Code}`)}},ne=async t=>(_.value.push("selectChange : ",t),he.value=t,T(t,!0)),T=async(t,c=!1)=>{const n=await Ke(t,2);if(n&&n.data&&n.data.klineDatas&&n.data.klineDatas.length===2){const g=n.data.klineDatas,e=Fe("yyyy-MM-dd"),D=!r.value||g[1].dateStr===e&&new Date().getHours()<15?g[0]:g[1],m=ee(D.closePrice,D.highPrice,D.lowPrice),x=F((m.highSalePrice-m.lowBuyPrice)/((m.highSalePrice+m.lowBuyPrice)/2),2);F(x/J.value),ye({market:n.data.market,code:n.data.code,name:n.data.name,nowPrice:g[1],nextPrice:m},c)}else re.error("\u83B7\u53D6K\u7EBF\u6570\u636E\u5F02\u5E38")},Ee=t=>{let c=V();c=c.filter(n=>!(t.market===n.market&&t.code===n.code&&t.name===n.name)),A.value=c,localStorage.setItem(f,JSON.stringify(c))},Ae=async t=>{const c=He.service({lock:!0}),n=await Te(t);if(c.close(),n&&n.data&&n.data.klineDatas&&n.data.klineDatas.length>0){O.value=!0,_.value=[],o.value=0,i.value=1e5,_.value.push(`\u521D\u59CB\u6301\u4ED3 ${o.value} \uFF0C  \u4F59\u989D \uFFE5${i.value}`);const g=n.data.klineDatas,e=g[0];let D=e.dateStr,m=e.highPrice,x=e.lowPrice,N=e.closePrice,P=ee(N,m,x),U=F((P.firstSalePrice-P.firstBuyPrice)/((P.firstSalePrice+P.firstBuyPrice)/2),2),w=F(U/J.value);w<M&&(w=M),$.value=Math.round(2e3/N/100)*100,$.value===0&&($.value=100),R.value=$.value*2;let L=e.openPrice,k=L;for(let G=1;G<g.length;G++){const u=g[G];if(D===u.dateStr?(u.highPrice>m&&(m=u.highPrice),u.lowPrice<x&&(x=u.lowPrice),N=u.closePrice):(D=u.dateStr,L=u.openPrice,k=L,P=ee(N,m,x),m=u.highPrice,x=u.lowPrice,U=F((P.firstSalePrice-P.firstBuyPrice)/((P.firstSalePrice+P.firstBuyPrice)/2),2),w=F(U/J.value),w<M&&(w=M)),o.value<R.value&&u.openPrice>P.firstBuyPrice&&u.openPrice<P.firstSalePrice){const v=R.value-o.value,B=F(v*u.openPrice,2);if(k=u.openPrice,i.value<B){_.value.push(`${u.dateStr} ${u.timeStr}\uFF1A\uFFE5${u.openPrice} \u4F59\u989D \uFFE5${i.value} \u4E0D\u8DB3\u4EE5\u5EFA\u4ED3${v}\uFF0C \u5E02\u503C\uFFE5 ${(u.openPrice*o.value+i.value).toFixed(2)}`);continue}o.value=F(o.value+v),i.value=F(i.value-B),_.value.push(`${u.dateStr} ${u.timeStr}\uFF1A \u4F4E\u4E8E\u6700\u5C0F\u6301\u4ED3\uFF0C\uFFE5${u.openPrice} \u4E70\u5165 ${v} \u80A1 , \u652F\u51FA \uFFE5${B} \uFF0C \u6301\u4ED3 ${o.value} \uFF0C \u4F59\u989D \uFFE5${i.value} \uFF0C \u5E02\u503C \uFFE5${(u.closePrice*o.value+i.value).toFixed(2)}`)}const Q=u.openPrice/k-1;if(Math.abs(Q)>w){if(o.value>0&&u.openPrice>P.highSalePrice){const v=o.value,B=F(v*u.openPrice,2);k=u.openPrice,o.value=F(o.value-v),i.value=F(i.value+B),_.value.push(`${u.dateStr} ${u.timeStr}\uFF1A\uFFE5${u.openPrice} \u6B62\u76C8\u5356\u51FA ${v} \u80A1 , \u6536\u5165 \uFFE5${B} \uFF0C \u6301\u4ED3 ${o.value} \uFF0C  \u4F59\u989D \uFFE5${i.value} \uFF0C \u5E02\u503C \uFFE5${(u.openPrice*o.value+i.value).toFixed(2)}`)}else if(o.value>0&&u.openPrice<P.lowBuyPrice)if(u.openPrice<P.lowBuyPrice*.98){const v=o.value,B=F(v*u.openPrice,2);k=u.openPrice,o.value=F(o.value-v),i.value=F(i.value+B),_.value.push(`${u.dateStr} ${u.timeStr}\uFF1A\uFFE5${u.openPrice} \u6B62\u635F\u5356\u51FA ${v} \u80A1 , \u6536\u5165 \uFFE5${B} \uFF0C \u6301\u4ED3 ${o.value} \uFF0C  \u4F59\u989D \uFFE5${i.value} \uFF0C \u5E02\u503C \uFFE5${(u.openPrice*o.value+i.value).toFixed(2)}`)}else{const v=oe(u,$.value*2);if(v.isSuccess)k=v.lastOptPrice;else continue}else if(Q>0&&o.value-$.value>=R.value){const v=$.value,B=F(v*u.openPrice,2);k=u.openPrice,o.value=F(o.value-v),i.value=F(i.value+B),_.value.push(`${u.dateStr} ${u.timeStr}\uFF1A\uFFE5${u.openPrice} \u7F51\u683C\u5356\u51FA ${v} \u80A1 , \u6536\u5165 \uFFE5${B} \uFF0C \u6301\u4ED3 ${o.value} \uFF0C  \u4F59\u989D \uFFE5${i.value} \uFF0C \u5E02\u503C\uFFE5 ${(u.openPrice*o.value+i.value).toFixed(2)}`)}else if(Q<0&&u.openPrice>P.lowBuyPrice){const v=oe(u,$.value);if(v.isSuccess)k=v.lastOptPrice;else continue}}}_.value.push(`\u5F53\u524D\u6301\u4ED3 ${o.value} \uFF0C  \u4F59\u989D \uFFE5${i.value}\uFF0C  \u5E02\u503C \uFFE5${(g[g.length-1].closePrice*o.value+i.value).toFixed(2)}`)}else re.error("\u83B7\u53D6K\u7EBF\u6570\u636E\u5F02\u5E38")},oe=(t,c)=>{const n=F(c*t.openPrice,2);return i.value<n?(_.value.push(`${t.dateStr} ${t.timeStr}\uFF1A\uFFE5${t.openPrice} \u4F59\u989D \uFFE5${i.value} \u4E0D\u8DB3\u4EE5\u8D2D\u4E70\u672C\u6B21\u7F51\u683C\uFF0C \u5E02\u503C\uFFE5 ${(t.openPrice*o.value+i.value).toFixed(2)}`),{isSuccess:!1,lastOptPrice:0}):(o.value=F(o.value+c),i.value=F(i.value-n),_.value.push(`${t.dateStr} ${t.timeStr}\uFF1A\uFFE5${t.openPrice} \u7F51\u683C\u4E70\u5165 ${c} \u80A1 , \u652F\u51FA \uFFE5${n} \uFF0C \u6301\u4ED3 ${o.value} \uFF0C  \u4F59\u989D \uFFE5${i.value} \uFF0C \u5E02\u503C\uFFE5 ${(t.openPrice*o.value+i.value).toFixed(2)}`),{isSuccess:!0,lastOptPrice:t.openPrice})},le=async()=>{O.value=!1},K=async()=>{A.value=V(),A.value.length>0?A.value.forEach(t=>T(`${t.market}.${t.code}`)):["1.510050","0.159602","1.561990","1.510500","1.512100","1.516970","0.159928","1.512670","1.512660","1.516110","1.512000","1.512480","1.516160","1.515030","1.515790","0.159867","0.159790","1.512760","1.516100","0.159997","0.159755","1.512980","0.159828","1.512170","0.159883","1.513050","1.513330","0.159967","0.159745","1.512200","0.159825","0.159996","0.159992","1.515250","1.516780","1.516150","1.511220","1.511260","0.159905","1.511380","1.513500","0.161834","1.501022","0.159981","1.512890","1.512690","1.513100","1.513300","1.510650"].forEach(t=>T(t)),ue&&(se.value=setTimeout(()=>{K()},1e3*30))};return(()=>{K(),document.querySelector(".input-search")})(),Be(()=>{clearTimeout(se.value)}),(t,c)=>{const n=$e,g=ke;return C(),S("div",null,[Le,s("main",null,[s("header",Ge,[fe?(C(),xe(n,{key:0,modelValue:r.value,"onUpdate:modelValue":c[0]||(c[0]=e=>r.value=e),"inline-prompt":"","active-text":"\u9884","inactive-text":"\u56DE",onChange:pe},null,8,["modelValue"])):ie("",!0),s("div",null,[q(s("input",{class:"input-search",type:"text",placeholder:"\u8BF7\u8F93\u5165\u80A1\u7968/\u57FA\u91D1\u4EE3\u7801","onUpdate:modelValue":c[1]||(c[1]=e=>d.value=e),onFocus:c[2]||(c[2]=e=>ae(!0)),onBlur:c[3]||(c[3]=e=>ae(!1)),onInput:ge,onKeydown:[W(Pe,["up"]),W(me,["down"]),W(Ce,["enter"])]},null,40,Qe),[[we,d.value]]),q(s("div",qe,[l.value&&l.value.length>0?(C(),S("ul",We,[(C(!0),S(I,null,H(l.value,(e,D)=>(C(),S("li",{class:z(["search-hotkey-items bg-",{"bg-gray-100":D===p.value}]),key:`${e.MktNum}.${e.Code}_${e.Name}`,onClick:m=>ne(`${e.MktNum}.${e.Code}`)},E(`${e.Code} ${e.Name} ${e.SecurityTypeName}`),11,je))),128))])):d.value.length>0?(C(),S("ul",Xe,Ze)):(C(),S("ul",et,ut))],512),[[ce,h.value]])])]),s("main",null,[A.value?(C(),S("div",st,[(C(!0),S(I,null,H(A.value,(e,D)=>(C(),S("div",{class:"next-price-box",key:D},[s("div",at,[s("span",nt,E(`${e.code} ${e.name}`),1),X(g,{class:"w-min",type:"primary",icon:Y(Re),circle:"",onClick:m=>Ae(`${e.market}.${e.code}`)},null,8,["icon","onClick"]),X(g,{class:"w-min",type:"danger",icon:Y(Ne),circle:"",onClick:m=>Ee(e)},null,8,["icon","onClick"])]),s("div",ot,[lt,s("div",{class:z(["column close-price-green",{"close-price-red":e.nowPrice.closePrice>=(e.nextPrice.firstSalePrice+e.nextPrice.firstBuyPrice)/2}])}," \u4EF7\u683C("+E(e.nowPrice.closePrice.toFixed(3))+") ",3)]),s("div",it,[ct,s("div",rt,E(e.nextPrice.highSalePrice.toFixed(3))+"(+"+E(e.nextPrice.highSaleRate.toFixed(2))+"%)",1)]),s("div",dt,[Ft,s("div",ft,E(e.nextPrice.firstSalePrice.toFixed(3))+"(+"+E(e.nextPrice.firstSaleRate.toFixed(2))+"%)",1)]),s("div",vt,[ht,s("div",pt,E(e.nextPrice.firstBuyPrice.toFixed(3))+"(-"+E(e.nextPrice.firstBuyRate.toFixed(2))+"%)",1)]),s("div",gt,[yt,s("div",Pt,E(e.nextPrice.lowBuyPrice.toFixed(3))+"(-"+E(e.nextPrice.lowBuyRate.toFixed(2))+"%)",1)]),s("div",mt,[Ct,s("div",Et,E((e.nextPrice.firstSaleRate+e.nextPrice.firstBuyRate).toFixed(2))+"% - "+E((e.nextPrice.highSaleRate+e.nextPrice.lowBuyRate).toFixed(2))+"% ",1)])]))),128)),(C(!0),S(I,null,H(Y(ve),e=>(C(),S("div",{class:"next-price-box invisible",key:e}))),128)),q(s("div",{class:"backtesting-log-bg",onClick:j(le,["stop"])},[s("div",{class:"backtesting-log-box",onClick:c[4]||(c[4]=j(()=>{},["stop"]))},[(C(!0),S(I,null,H(_.value,(e,D)=>(C(),S("div",{class:z(["backtesting-log-item",{"log-buy":e.includes("\u7F51\u683C\u4E70\u5165"),"log-sale":e.includes("\u7F51\u683C\u5356\u51FA"),"log-stop-profit":e.includes("\u6B62\u76C8\u5356\u51FA"),"log-stop-loss":e.includes("\u6B62\u635F\u5356\u51FA")}]),key:D},E(e),3))),128)),s("div",St,[X(g,{type:"danger",icon:Y(Me),onClick:j(le,["stop"])},{default:be(()=>[_t]),_:1},8,["icon","onClick"])])])],8,At),[[ce,O.value]])])):ie("",!0)])]),Dt])}}});Ye(Bt).mount("#app");