var ye=Object.defineProperty,xe=Object.defineProperties;var Fe=Object.getOwnPropertyDescriptors;var X=Object.getOwnPropertySymbols;var ge=Object.prototype.hasOwnProperty,Ce=Object.prototype.propertyIsEnumerable;var Q=(e,t,c)=>t in e?ye(e,t,{enumerable:!0,configurable:!0,writable:!0,value:c}):e[t]=c,W=(e,t)=>{for(var c in t||(t={}))ge.call(t,c)&&Q(e,c,t[c]);if(X)for(var c of X(t))Ce.call(t,c)&&Q(e,c,t[c]);return e},ee=(e,t)=>xe(e,Fe(t));import{f as we,r as y,c as te,E as ce,d as E,a as be,o as f,b as v,e as p,u as n,i as J,s as Se,g as r,h as ie,j as U,k as Be,l as Ee,m as Ae,n as De,p as $e,q as ke,t as Me,v as ze,w as se,x as _,F as M,y as oe,z as Te,A as He,B as Ve,C as Ne,D as Re,G as le,H as V,I as F,J as g,K as h,L as O,M as Ie,N as Oe,O as Le,P as je,Q as Je,R as Ue,S as Ye,T as Ke,U as qe}from"./vendor.a46ad29e.js";const Ge=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))u(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const m of i.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&u(m)}).observe(document,{childList:!0,subtree:!0});function c(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function u(o){if(o.ep)return;o.ep=!0;const i=c(o);fetch(o.href,i)}};Ge();function re(e,t){return we(e,t||{timeout:1e3*5,jsonpCallback:"cb"}).then(c=>c.json())}function Ze(e,t=1,c=10){const u=`https://searchapi.eastmoney.com/api/Info/Search?appid=el1902262&type=14&token=CCSDCZSDCXYMYZYYSYYXSMDDSMDHHDJT&and14=MultiMatch/Name,Code,PinYin/${e}/true&returnfields14=Name,Code,PinYin,MarketType,JYS,MktNum,JYS4App,MktNum4App,ID,Classify,IsExactMatch,SecurityType,SecurityTypeName&pageIndex14=${t}&pageSize14=${c}&isAssociation14=false1642753371132`;return re(u)}function Xe(e){return e&&e.data&&e.data.klines&&(e.data.klineDatas=e.data.klines.map(t=>{const c=t.split(","),u=c[0];let o=u,i="";return u.includes(" ")&&([o,i]=u.split(" ")),{dateStr:o,timeStr:i,openPrice:parseFloat(c[1]),closePrice:parseFloat(c[2]),highPrice:parseFloat(c[3]),lowPrice:parseFloat(c[4])}})),e}async function Qe(e,t){const c=`https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${e}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=0&end=20500101&lmt=${t}&_=${Date.now()}`,u=await re(c);return Xe(u)}const Y="history_search_results";let z=y();const We=window.screen.width<=768,e1=te(()=>{if(!z.value||z.value.length===0)return 0;const e=z.value.length,t=window.screen.width,{nextPriceStyle:c}=T();return c.value==="MiniCard"?t>=1536?8-e%8:t>=1280?7-e%7:t>=1024?6-e%6:t>=768?4-e%4:2-e%2:t>=1536?5-e%5:t>=1280?4-e%4:t>=1024?3-e%3:t>=768?2-e%2:0});function N(){const e=()=>{const u=localStorage.getItem(Y);return u?JSON.parse(u):[]};return{isMobileScreen:We,historyRows:z,historyFillRowCount:e1,getHistory:e,updateHistory:(u,o=!1)=>{let i=e();const m=a=>u.market===a.market&&u.code===a.code&&u.name===a.name;if(o)i=i.filter(a=>!m(a)),i=[u,...i];else{const a=i.findIndex(m);a>-1?i[a]=u:i=[u,...i]}z.value=i,localStorage.setItem(Y,JSON.stringify(i))},delHistory:u=>{let o=e();o=o.filter(i=>!(u.market===i.market&&u.code===i.code&&u.name===i.name)),z.value=o,localStorage.setItem(Y,JSON.stringify(o))}}}function t1(e,t){const c={"y+":e.getFullYear(),"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours()%12==0?12:e.getHours()%12,"H+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),"f+":e.getMilliseconds()};for(const u in c)new RegExp("("+u+")").test(t)&&(t=t.replace(RegExp.$1,c[u].toString().padStart(RegExp.$1.length,"0")));return t}function ne(e){return t1(new Date,e)}function b(e=1,t=3){const c=Math.pow(10,t);return Math.round(e*c)/c}function c1(e,t,c){const u=t-c,o=(t+c+e*2)/4,i=b(o+u),m=b(o*2-c),a=b(o*2-t),l=b(o-u);return{highSalePrice:i,firstSalePrice:m,firstBuyPrice:a,lowBuyPrice:l}}const ae=Number(ne("Hmm")),ue=ae>=920&&ae<1457,i1=!ue,de=y(!0),me=["Card","MiniCard","Table"],s1=y(me[0]),he=(e,t)=>b(t/e-1,4),o1=(e,t)=>(he(e,t)*100).toFixed(2)+"%";function T(){const{updateHistory:e}=N();return{isTradeTime:ue,isShowNextSwitchChange:i1,nextSwitch:de,nextPriceStyleList:me,nextPriceStyle:s1,calcNext:async(c,u=!1)=>{const o=await Qe(c,2);if(o&&o.data&&o.data.klineDatas&&o.data.klineDatas.length===2){const i=o.data.klineDatas,m=ne("yyyy-MM-dd"),a=!de.value||i[1].dateStr===m&&new Date().getHours()<15?i[0]:i[1],l=c1(a.closePrice,a.highPrice,a.lowPrice);e({market:o.data.market,code:o.data.code,name:o.data.name,prevPrice:a,nowPrice:i[1],nextPrice:l},u)}else ce.error("\u83B7\u53D6K\u7EBF\u6570\u636E\u5F02\u5E38")},calcRate:he,calcPercentRate:o1}}const fe=y(""),L=y(),K=y(!1),q=y("");function l1(){return{searchKeyword:fe,searchResultRows:L,secid:q,loading:K,query:async(c,u)=>{if(c){K.value=!0;const o=await Ze(c);L.value=o.Data||[],K.value=!1}else L.value=[];u(L.value.map(o=>ee(W({},o),{Text:`${o.Code} ${o.Name} ${o.SecurityTypeName}`})))},selectChange:async c=>{if(!c)return;fe.value="",q.value=`${c.MktNum}.${c.Code}`;const{calcNext:u}=T();return u(q.value,!0)}}}const r1=E({setup(e){const{searchKeyword:t,query:c,selectChange:u}=l1();return(o,i)=>{const m=be;return f(),v("div",null,[p(m,{modelValue:n(t),"onUpdate:modelValue":i[0]||(i[0]=a=>J(t)?t.value=a:null),"fetch-suggestions":n(c),"value-key":"Text","highlight-first-item":"",placeholder:"\u8BF7\u8F93\u5165\u80A1\u7968/\u57FA\u91D1\u4EE3\u7801",maxlength:"10","prefix-icon":n(Se),clearable:"",onSelect:n(u)},null,8,["modelValue","fetch-suggestions","prefix-icon","onSelect"])])}}}),n1={class:"w-full h-full","aria-hidden":"true"},a1=["xlink:href","fill"],A=E({props:{prefix:{default:"icon"},name:null,color:{default:"#333"}},setup(e){const t=e,c=te(()=>`#${t.prefix}-${t.name}`);return(u,o)=>(f(),v("svg",n1,[r("use",{"xlink:href":n(c),fill:e.color},null,8,a1)]))}}),u1={class:"flex justify-center items-center flex-wrap"},d1=r("span",{class:"text-3xl font-bold p-4"},"\u4EF7\u683C\u9884\u6D4B",-1),m1={class:"cursor-pointer",href:"https://github.com/adams549659584/grid-quant",target:"_blank"},h1=E({setup(e){return(t,c)=>(f(),v("header",null,[r("h1",u1,[d1,r("a",m1,[p(A,{class:"w-[2rem] h-[2rem] cursor-pointer",name:"github"})])])]))}});var G=(e,t)=>{const c=e.__vccOpts||e;for(const[u,o]of t)c[u]=o;return c};const f1={},p1=r("div",{class:"p-4 text-gray-400"},[r("p",{class:"flex justify-center items-center flex-wrap space-x-2"},[r("span",null,"MIT Licensed | Copyright \xA9 2022"),r("a",{href:"https://github.com/adams549659584",target:"_blank"},"adams549659584")])],-1),P1=[p1];function _1(e,t){return f(),v("footer",null,P1)}var v1=G(f1,[["render",_1]]);const y1=y(.008),x1=y(5),F1=y(1e3),g1=y(400),R=y(),S=ie({title:{show:!1},tooltip:{trigger:"item"},toolbox:{bottom:"2",showTitle:!1,feature:{saveAsImage:{title:"\u4FDD\u5B58\u4E3A\u56FE\u7247"}}},series:[{name:"\u5012\u91D1\u5B57\u5854\u51FA\u8D27",type:"funnel",z:3,width:"70%",height:"42%",left:"center",top:"0",label:{position:"left"},data:[{value:10,name:"1.000"}]},{name:"\u5BF9\u6572\u6536\u76CA",type:"funnel",width:"28%",height:"100%",left:"center",top:"25%",label:{position:"left"},tooltip:{formatter:"\u5EFA\u7ACB\u5E95\u4ED3\uFF0C\u8BBE\u7F6E\u9002\u5408\u7684\u6BD4\u4F8B\uFF0C\u4EA4\u7ED9\u7F51\u683C\u673A\u5668\u4EBA\u81EA\u52A8\u4EA4\u6613"},data:[{value:1,name:"\u7F51\u683C\u4EA4\u6613\u5BF9\u6572\u6536\u76CA",itemStyle:{color:"#ffb84d"}},{value:1,name:"0.100",itemStyle:{opacity:0,height:0},labelLine:{show:!1}}]},{name:"\u91D1\u5B57\u5854\u5EFA\u4ED3",type:"funnel",z:3,width:"70%",height:"42%",left:"center",top:"58%",sort:"ascending",label:{position:"left"},data:[{value:10,name:"1.000"}]}]}),Z=y(!1),P=ie({market:1,code:"000001",name:"\u4E0A\u8BC1\u6307\u6570",firstBuyPrice:0,firstBuyAmt:2e3,firstSalePrice:0,firstSaleAmt:2e3,percentRate:2,layerCount:10,initTradeCount:100}),C1=e=>{R.value=Be(e,void 0,{renderer:"svg"}),R.value.setOption(S)},pe=e=>{Object.assign(P,e),!e.firstSalePrice&&e.firstBuyPrice&&(P.firstSalePrice=b(e.firstBuyPrice*(1+P.percentRate/100),3)),P.initTradeCount=Math.round(P.firstBuyAmt/P.firstBuyPrice/100)*100,P.initTradeCount===0&&(ce.warning(`\u5355\u624B\u91D1\u989D\u8D85\u51FA\u6700\u4F4E\u5EFA\u4ED3\u91D1\u989D\uFFE5${P.firstBuyAmt.toFixed()}\uFF0C\u9ED8\u8BA4\u8BBE\u4E3A1\u624B`),P.initTradeCount=100);let t=0,c=0,u=0,o=0;if(Array.isArray(S.series)){S.series[0].data=[];for(let i=1;i<=P.layerCount;i++){const m=b(P.firstSalePrice*(1+P.percentRate/100*(i-1)),3),a=P.initTradeCount*i,l=b(m*a,2),x=u+=l,d=o+=a,s={value:i,name:`${m.toFixed(3)} \xD7 ${a}`,label:{color:"red"},tooltip:{formatter:()=>`
            <p class="text-left">${i}\u5C42\u51FA\u8D27\uFF1A\uFFE5${l.toFixed(2)}</p>
            <p class="text-left">\u603B\u6DA8\u5E45\uFF1A${(P.percentRate*i).toFixed(2)}%</p>
            <p class="text-left">\u603B\u5356\u51FA\u4EFD\u989D\uFF1A${d}</p>
            <p class="text-left">\u603B\u4EA7\u51FA\uFF1A\uFFE5${x.toFixed(2)}</p>
            `}};S.series[0].data.push(s)}S.series[1].data[0].name=`${P.code} ${P.name} \u7F51\u683C\u4EA4\u6613`,S.series[2].data=[];for(let i=1;i<=P.layerCount;i++){const m=b(P.firstBuyPrice*(1-P.percentRate/100*(i-1)),3),a=P.initTradeCount*i,l=b(m*a,2),x=t+=l,d=c+=a,s={value:i,name:`${m.toFixed(3)} \xD7 ${a}`,label:{color:"green"},tooltip:{formatter:()=>`
            <p class="text-left">${i}\u5C42\u5EFA\u4ED3\uFF1A\uFFE5${l.toFixed(2)}</p>
            <p class="text-left">\u6301\u4ED3\u6210\u672C\uFF1A\uFFE5${b(x/d,3).toFixed(3)}</p>
            <p class="text-left">\u603B\u8DCC\u5E45\uFF1A${(P.percentRate*(i-1)).toFixed(2)}%</p>
            <p class="text-left">\u603B\u6295\u5165\uFF1A\uFFE5${x.toFixed(2)}</p>
            `}};S.series[2].data.push(s)}}S.toolbox.feature.saveAsImage.name=`\u91D1\u5B57\u5854\u5EFA\u4ED3\u6A21\u578B_${P.code}_${P.name}`,R.value&&R.value.setOption(S),console.log("echart option : ",JSON.stringify(S)),Z.value=!0},w1=()=>Z.value=!1,b1=()=>{P.firstBuyAmt=b(P.firstBuyPrice*P.initTradeCount,2),P.firstSaleAmt=b(P.firstSaleAmt*P.initTradeCount,2),P&&pe(P)},Pe="PyramidConfigCache",S1=()=>{localStorage.setItem(Pe,JSON.stringify(P))},B1=()=>{const e=localStorage.getItem(Pe);if(e){const t=JSON.parse(e);Object.assign(P,t)}};U(()=>{B1()});function _e(){return{minGridRate:y1,minGridOptCount:x1,minHoldCount:F1,gridCount:g1,pyramidEchart:R,isShowPyramidCalc:Z,initPyramidCalc:C1,showPyramidCalc:pe,hidePyramidCalc:w1,refreshPyramidCalc:b1,savePyramidConfig:S1,pyramidConfig:P}}const E1={class:"w-full p-[0.5rem] md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative"},A1=r("span",{class:"ml-1"},"%",-1),D1=oe("\u91CD\u65B0\u8BA1\u7B97"),$1=E({setup(e){Ee([Te,He,Ve,Ne,Re]);const t=y(),{initPyramidCalc:c,hidePyramidCalc:u,refreshPyramidCalc:o,pyramidConfig:i,savePyramidConfig:m}=_e(),a=y(!1),l=()=>a.value=!0,x=()=>{a.value=!1,o(),m()};return U(()=>{t.value&&c(t.value)}),(d,s)=>{const B=Ae,C=De,I=$e,D=ke,k=Me,j=ze;return f(),v(M,null,[r("div",{class:"fixed -top-[999rem] -left-[999rem] md:top-0 md:left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden",onTouchmove:s[0]||(s[0]=se(()=>{},["prevent"])),onMousewheel:s[1]||(s[1]=se(()=>{},["prevent"]))},[r("div",E1,[p(A,{class:"w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-30",name:"close",color:"#999",onClick:n(u)},null,8,["onClick"]),p(A,{class:"w-[2rem] h-[2rem] absolute top-[2.4rem] right-[0.4rem] cursor-pointer z-30",name:"setting",color:"#999",onClick:l}),r("div",{class:"w-full h-[80vh]",ref_key:"chartsRef",ref:t},null,512)])],32),p(j,{modelValue:a.value,"onUpdate:modelValue":s[7]||(s[7]=w=>a.value=w),title:"\u91D1\u5B57\u5854\u914D\u7F6E",width:"19rem"},{footer:_(()=>[r("span",null,[p(k,{type:"primary",onClick:x},{default:_(()=>[D1]),_:1})])]),default:_(()=>[p(D,{"label-width":"6rem","label-position":"right"},{default:_(()=>[p(C,{label:"\u91D1\u5B57\u5854\u5C42\u6570"},{default:_(()=>[p(B,{modelValue:n(i).layerCount,"onUpdate:modelValue":s[2]||(s[2]=w=>n(i).layerCount=w),precision:0,min:2,max:Math.round(100/n(i).percentRate),step:1},null,8,["modelValue","max"])]),_:1}),p(C,{label:"\u91D1\u5B57\u5854\u5E45\u5EA6"},{default:_(()=>[p(B,{modelValue:n(i).percentRate,"onUpdate:modelValue":s[3]||(s[3]=w=>n(i).percentRate=w),precision:2,min:.1,max:Math.round(1/n(i).layerCount*100),step:1},null,8,["modelValue","min","max"]),A1]),_:1}),p(C,{label:"\u5355\u7B14\u4EFD\u989D"},{default:_(()=>[p(B,{modelValue:n(i).initTradeCount,"onUpdate:modelValue":s[4]||(s[4]=w=>n(i).initTradeCount=w),precision:0,min:100,step:100},null,8,["modelValue"])]),_:1}),p(C,{label:"\u5EFA\u4ED3\u4EF7\u683C"},{default:_(()=>[p(B,{modelValue:n(i).firstBuyPrice,"onUpdate:modelValue":s[5]||(s[5]=w=>n(i).firstBuyPrice=w),precision:3,min:.001,step:.001},null,8,["modelValue","min","step"])]),_:1}),p(C,{label:"\u5EFA\u4ED3\u91D1\u989D"},{default:_(()=>[p(I,{class:"w-[90%]",disabled:"","model-value":(n(i).firstBuyPrice*n(i).initTradeCount).toFixed(2)},null,8,["model-value"])]),_:1}),p(C,{label:"\u51FA\u8D27\u4EF7\u683C"},{default:_(()=>[p(B,{modelValue:n(i).firstSalePrice,"onUpdate:modelValue":s[6]||(s[6]=w=>n(i).firstSalePrice=w),precision:3,min:.001,step:.001},null,8,["modelValue","min","step"])]),_:1}),p(C,{label:"\u51FA\u8D27\u91D1\u989D"},{default:_(()=>[p(I,{class:"w-[90%]",disabled:"","model-value":(n(i).firstSalePrice*n(i).initTradeCount).toFixed(2)},null,8,["model-value"])]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}}});const H=e=>(Ie("data-v-18dc543e"),e=e(),Oe(),e),k1={key:0,class:"flex justify-around items-center flex-wrap text-gray-800"},M1={class:"absolute top-3 left-3 opacity-50 w-[4rem] h-[4rem]"},z1={class:"row p-2 space-x-1"},T1={class:"flex-1 text-center truncate"},H1={class:"row"},V1=H(()=>r("div",{class:"column"},"\u64CD\u4F5C",-1)),N1={class:"p-1"},R1={class:"p-1"},I1={class:"p-1"},O1={class:"row bg-red-400"},L1=H(()=>r("div",{class:"column"},"\u6781\u9650\u83B7\u5229\u4F4D",-1)),j1={class:"column"},J1={class:"row bg-red-300"},U1=H(()=>r("div",{class:"column"},"\u7B2C\u4E00\u538B\u529B\u4F4D",-1)),Y1={class:"column"},K1={class:"row bg-green-300"},q1=H(()=>r("div",{class:"column"},"\u7B2C\u4E00\u652F\u6491\u4F4D",-1)),G1={class:"column"},Z1={class:"row bg-green-400"},X1=H(()=>r("div",{class:"column"},"\u6781\u9650\u6284\u5E95\u4F4D",-1)),Q1={class:"column"},W1={class:"row"},et=H(()=>r("div",{class:"column"},"\u632F\u5E45",-1)),tt={class:"column"},ct=E({setup(e){const{historyRows:t,historyFillRowCount:c,delHistory:u}=N(),{isShowPyramidCalc:o,showPyramidCalc:i}=_e(),{calcRate:m,calcPercentRate:a}=T();return(l,x)=>{const d=le;return n(t)&&n(t).length>0?(f(),v("div",k1,[(f(!0),v(M,null,V(n(t),(s,B)=>(f(),v("div",{class:"next-price-box relative rounded-md shadow-md shadow-gray-300",key:B},[r("div",M1,[s.nowPrice.closePrice<=s.nextPrice.firstBuyPrice?(f(),F(A,{key:0,name:"buy",color:"#1afa29"})):g("",!0),s.nowPrice.closePrice>=s.nextPrice.firstSalePrice?(f(),F(A,{key:1,name:"sale",color:"#d81e06"})):g("",!0)]),r("div",z1,[r("span",T1,h(`${s.code} ${s.name}`),1),p(A,{class:"w-[2rem] h-[2rem] cursor-pointer hidden md:block",name:"pyramid",onClick:C=>n(i)({market:s.market,code:s.code,name:s.name,firstBuyPrice:s.nowPrice.closePrice})},null,8,["onClick"]),p(A,{class:"w-[2rem] h-[2rem] cursor-pointer",name:"delete",onClick:C=>n(u)(s)},null,8,["onClick"])]),r("div",H1,[V1,r("div",{class:O(["column cursor-pointer",{"text-red-500":s.nowPrice.closePrice>s.prevPrice.closePrice,"text-green-500":s.nowPrice.closePrice<s.prevPrice.closePrice}])},[p(d,{placement:"top-start",trigger:"hover"},{reference:_(()=>[oe(h(s.nowPrice.closePrice.toFixed(3))+"("+h(((s.nowPrice.closePrice/s.prevPrice.closePrice-1)*100).toFixed(2))+"%)",1)]),default:_(()=>[r("div",null,[r("p",N1,"\u9AD8\uFF1A"+h(s.nowPrice.highPrice.toFixed(3)),1),r("p",R1,"\u4F4E\uFF1A"+h(s.nowPrice.lowPrice.toFixed(3)),1),r("p",I1,"\u5F00\uFF1A"+h(s.nowPrice.openPrice.toFixed(3)),1)])]),_:2},1024)],2)]),r("div",O1,[L1,r("div",j1,h(s.nextPrice.highSalePrice.toFixed(3))+"("+h(n(a)(s.prevPrice.closePrice,s.nextPrice.highSalePrice))+")",1)]),r("div",J1,[U1,r("div",Y1,h(s.nextPrice.firstSalePrice.toFixed(3))+"("+h(n(a)(s.prevPrice.closePrice,s.nextPrice.firstSalePrice))+")",1)]),r("div",K1,[q1,r("div",G1,h(s.nextPrice.firstBuyPrice.toFixed(3))+"("+h(n(a)(s.prevPrice.closePrice,s.nextPrice.firstBuyPrice))+")",1)]),r("div",Z1,[X1,r("div",Q1,h(s.nextPrice.lowBuyPrice.toFixed(3))+"("+h(n(a)(s.prevPrice.closePrice,s.nextPrice.lowBuyPrice))+")",1)]),r("div",W1,[et,r("div",tt,h(((n(m)(s.prevPrice.closePrice,s.nextPrice.firstSalePrice)-n(m)(s.prevPrice.closePrice,s.nextPrice.firstBuyPrice))*100).toFixed(2))+"% - "+h(((n(m)(s.prevPrice.closePrice,s.nextPrice.highSalePrice)-n(m)(s.prevPrice.closePrice,s.nextPrice.lowBuyPrice))*100).toFixed(2))+"%",1)])]))),128)),(f(!0),v(M,null,V(n(c),s=>(f(),v("div",{class:"next-price-box invisible",key:s}))),128)),n(o)?(f(),F($1,{key:0})):g("",!0)])):g("",!0)}}});var it=G(ct,[["__scopeId","data-v-18dc543e"]]);const st={key:0,class:"flex justify-around items-center flex-wrap text-gray-800"},ot={class:"absolute top-3 left-3 opacity-50 w-[4rem] h-[4rem]"},lt={class:"row p-2 text-center truncate"},rt={class:"row cursor-pointer"},nt={class:"p-1"},at={class:"p-1"},ut={class:"p-1"},dt={class:"row bg-red-400"},mt={class:"row bg-red-300"},ht={class:"row bg-green-300"},ft={class:"row bg-green-400"},pt=E({setup(e){const{historyRows:t,historyFillRowCount:c}=N(),{calcPercentRate:u}=T();return(o,i)=>{const m=A,a=le;return n(t)&&n(t).length>0?(f(),v("div",st,[(f(!0),v(M,null,V(n(t),(l,x)=>(f(),v("div",{class:"next-price-box relative rounded-md shadow-md shadow-gray-300",key:x},[r("div",ot,[l.nowPrice.closePrice<=l.nextPrice.firstBuyPrice?(f(),F(m,{key:0,name:"buy",color:"#d81e06"})):g("",!0),l.nowPrice.closePrice>=l.nextPrice.firstSalePrice?(f(),F(m,{key:1,name:"sale",color:"#1afa29"})):g("",!0)]),r("div",lt,h(`${l.code} ${l.name}`),1),r("div",rt,[p(a,{placement:"top-start",trigger:"hover"},{reference:_(()=>[r("span",{class:O({"text-red-500":l.nowPrice.closePrice>l.prevPrice.closePrice,"text-green-500":l.nowPrice.closePrice<l.prevPrice.closePrice})},h(l.nowPrice.closePrice.toFixed(3))+"("+h(((l.nowPrice.closePrice/l.prevPrice.closePrice-1)*100).toFixed(2))+"%)",3)]),default:_(()=>[r("div",null,[r("p",nt,"\u9AD8\uFF1A"+h(l.nowPrice.highPrice.toFixed(3)),1),r("p",at,"\u4F4E\uFF1A"+h(l.nowPrice.lowPrice.toFixed(3)),1),r("p",ut,"\u5F00\uFF1A"+h(l.nowPrice.openPrice.toFixed(3)),1)])]),_:2},1024)]),r("div",dt,h(l.nextPrice.highSalePrice.toFixed(3))+"("+h(n(u)(l.prevPrice.closePrice,l.nextPrice.highSalePrice))+")",1),r("div",mt,h(l.nextPrice.firstSalePrice.toFixed(3))+"("+h(n(u)(l.prevPrice.closePrice,l.nextPrice.firstSalePrice))+")",1),r("div",ht,h(l.nextPrice.firstBuyPrice.toFixed(3))+"("+h(n(u)(l.prevPrice.closePrice,l.nextPrice.firstBuyPrice))+")",1),r("div",ft,h(l.nextPrice.lowBuyPrice.toFixed(3))+"("+h(n(u)(l.prevPrice.closePrice,l.nextPrice.lowBuyPrice))+")",1)]))),128)),(f(!0),v(M,null,V(n(c),l=>(f(),v("div",{class:"next-price-box invisible",key:l}))),128))])):g("",!0)}}});var Pt=G(pt,[["__scopeId","data-v-fe59687c"]]);const _t={key:0,class:"w-[98%] xl:w-4/5 mx-auto mt-4"},vt={class:"text-red-500"},yt={class:"text-red-400"},xt={class:"text-green-400"},Ft={class:"text-green-500"},gt={key:0,class:"text-green-500"},Ct={key:1,class:"text-green-400"},wt={key:2,class:"text-red-400"},bt={key:3,class:"text-red-500"},St={key:4},Bt=E({setup(e){const{isMobileScreen:t,historyRows:c}=N();T();const u=(m,a)=>m.nowPrice.closePrice-a.nowPrice.closePrice,o=(m,a)=>{const l=m.nowPrice.closePrice/m.prevPrice.closePrice-1,x=a.nowPrice.closePrice/a.prevPrice.closePrice-1;return l-x},i=(m,a)=>{switch(m){case"\u9002\u91CF\u4E70\u5165":return a.nowPrice.closePrice<=a.nextPrice.lowBuyPrice;case"\u5C11\u91CF\u4E70\u5165":return a.nowPrice.closePrice<=a.nextPrice.firstBuyPrice&&a.nowPrice.closePrice>a.nextPrice.lowBuyPrice;case"\u5C11\u91CF\u5356\u51FA":return a.nowPrice.closePrice>=a.nextPrice.firstSalePrice&&a.nowPrice.closePrice<a.nextPrice.highSalePrice;case"\u9002\u91CF\u5356\u51FA":return a.nowPrice.closePrice>=a.nextPrice.highSalePrice}return!0};return(m,a)=>{const l=Le,x=je;return n(c)&&n(c).length>0?(f(),v("div",_t,[p(x,{data:n(c),stripe:"",border:!0},{default:_(()=>[p(l,{prop:"code",label:"\u80A1\u7968\u57FA\u91D1",sortable:""},{default:_(d=>[r("h1",null,h(d.row.code)+" "+h(d.row.name),1)]),_:1}),p(l,{label:"\u73B0\u4EF7",sortable:"","sort-method":u},{default:_(d=>[r("div",{class:O({"text-stocks-red":d.row.nowPrice.closePrice>d.row.prevPrice.closePrice,"text-stocks-green":d.row.nowPrice.closePrice<d.row.prevPrice.closePrice})},h(d.row.nowPrice.closePrice.toFixed(3)),3)]),_:1}),p(l,{label:"\u6DA8\u8DCC\u5E45",sortable:"","sort-method":o},{default:_(d=>[r("div",{class:O({"text-stocks-red":d.row.nowPrice.closePrice>d.row.prevPrice.closePrice,"text-stocks-green":d.row.nowPrice.closePrice<d.row.prevPrice.closePrice})},h(((d.row.nowPrice.closePrice/d.row.prevPrice.closePrice-1)*100).toFixed(2))+"%",3)]),_:1}),n(t)?g("",!0):(f(),F(l,{key:0,label:"\u6781\u9650\u83B7\u5229\u4F4D"},{default:_(d=>[r("div",vt,h(d.row.nextPrice.highSalePrice.toFixed(3)),1)]),_:1})),n(t)?g("",!0):(f(),F(l,{key:1,label:"\u7B2C\u4E00\u538B\u529B\u4F4D"},{default:_(d=>[r("div",yt,h(d.row.nextPrice.firstSalePrice.toFixed(3)),1)]),_:1})),n(t)?g("",!0):(f(),F(l,{key:2,label:"\u7B2C\u4E00\u652F\u6491\u4F4D"},{default:_(d=>[r("div",xt,h(d.row.nextPrice.firstBuyPrice.toFixed(3)),1)]),_:1})),n(t)?g("",!0):(f(),F(l,{key:3,label:"\u6781\u9650\u6284\u5E95\u4F4D"},{default:_(d=>[r("div",Ft,h(d.row.nextPrice.lowBuyPrice.toFixed(3)),1)]),_:1})),p(l,{label:"\u64CD\u4F5C\u5EFA\u8BAE",filters:[{text:"\u9002\u91CF\u4E70\u5165",value:"\u9002\u91CF\u4E70\u5165"},{text:"\u5C11\u91CF\u4E70\u5165",value:"\u5C11\u91CF\u4E70\u5165"},{text:"\u5C11\u91CF\u5356\u51FA",value:"\u5C11\u91CF\u5356\u51FA"},{text:"\u9002\u91CF\u5356\u51FA",value:"\u9002\u91CF\u5356\u51FA"},{text:"\u65E0",value:"\u65E0"}],"filter-method":i},{default:_(d=>[r("div",null,[d.row.nowPrice.closePrice<=d.row.nextPrice.lowBuyPrice?(f(),v("span",gt,"\u9002\u91CF\u4E70\u5165")):d.row.nowPrice.closePrice<=d.row.nextPrice.firstBuyPrice&&d.row.nowPrice.closePrice>d.row.nextPrice.lowBuyPrice?(f(),v("span",Ct,"\u5C11\u91CF\u4E70\u5165")):d.row.nowPrice.closePrice>=d.row.nextPrice.firstSalePrice&&d.row.nowPrice.closePrice<d.row.nextPrice.highSalePrice?(f(),v("span",wt,"\u5C11\u91CF\u5356\u51FA")):d.row.nowPrice.closePrice>=d.row.nextPrice.highSalePrice?(f(),v("span",bt,"\u9002\u91CF\u5356\u51FA")):(f(),v("span",St,"\u65E0"))])]),_:1})]),_:1},8,["data"])])):g("",!0)}}}),Et={class:"min-h-[80vh]"},At={class:"flex justify-center items-center space-x-1 md:space-x-4 overflow-hidden"},Dt=E({setup(e){const t=y(0),c=y(1e3*10),u=["1.510050","0.159602","1.561990","1.510500","1.512100","1.516970","0.159928","1.512670","1.512660","1.516110","1.512000","1.512480","1.516160","1.515030","1.515790","0.159867","0.159790","1.512760","1.516100","0.159997","0.159755","1.512980","0.159828","1.512170","0.159883","1.513050","1.513330","0.159967","0.159745","1.512200","0.159825","0.159996","0.159992","1.515250","1.516780","1.516150","1.511220","1.511260","0.159905","1.511380","1.513500","0.161834","1.501022","0.159981","1.512890","1.512690","1.513100","1.513300","1.510650"],{isTradeTime:o,isShowNextSwitchChange:i,nextSwitch:m,nextPriceStyleList:a,nextPriceStyle:l,calcNext:x}=T();let{historyRows:d,getHistory:s}=N();const B=async()=>{C()},C=async()=>{d.value&&d.value.length>0?d.value.forEach(D=>x(`${D.market}.${D.code}`)):u.forEach(D=>x(D)),o&&(t.value=window.setTimeout(()=>{C()},c.value))},I=()=>{d.value=s(),C()};return U(()=>{I()}),Je(()=>{t.value&&clearTimeout(t.value)}),(D,k)=>{const j=Ue,w=Ye,ve=Ke;return f(),v("div",null,[p(h1),r("main",Et,[r("header",At,[n(i)?(f(),F(j,{key:0,modelValue:n(m),"onUpdate:modelValue":k[0]||(k[0]=$=>J(m)?m.value=$:null),"inline-prompt":"","active-text":"\u9884","inactive-text":"\u56DE",onChange:B},null,8,["modelValue"])):g("",!0),p(r1),p(ve,{class:"w-[6.5rem]",modelValue:n(l),"onUpdate:modelValue":k[1]||(k[1]=$=>J(l)?l.value=$:null)},{default:_(()=>[(f(!0),v(M,null,V(n(a),$=>(f(),F(w,{key:$,label:$,value:$},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),r("main",null,[n(l)==="Card"?(f(),F(it,{key:0})):n(l)==="MiniCard"?(f(),F(Pt,{key:1})):n(l)==="Table"?(f(),F(Bt,{key:2})):g("",!0)])]),p(v1)])}}});if(typeof window!="undefined"){let e=function(){var t=document.body,c=document.getElementById("__svg__icons__dom__");c||(c=document.createElementNS("http://www.w3.org/2000/svg","svg"),c.style.position="absolute",c.style.width="0",c.style.height="0",c.id="__svg__icons__dom__",c.setAttribute("xmlns","http://www.w3.org/2000/svg"),c.setAttribute("xmlns:link","http://www.w3.org/1999/xlink")),c.innerHTML='<symbol class="icon" viewBox="0 0 1024 1024"  id="icon-backtesting"><path d="M518.4 300.8c-55.1 0-100-44.8-100-99.9 0-55.1 44.8-100 100-100 55.1 0 99.9 44.8 99.9 100 0 55-44.8 99.9-99.9 99.9zm0-165.7c-36.2 0-65.7 29.5-65.7 65.7s29.5 65.7 65.7 65.7 65.7-29.5 65.7-65.7-29.5-65.7-65.7-65.7zm359.4 419.4c14.4-150.7-63.3-292.6-198.2-361.4-8.5-4.4-18.7-1-23 7.5-4.3 8.4-1 18.7 7.5 23 122.2 62.4 192.8 191 179.7 327.6-.9 9.4 6 17.8 15.4 18.7.6.1 1.1.1 1.7.1 8.6 0 16-6.6 16.9-15.5zm-712.5 15.4c9.4-.9 16.3-9.3 15.4-18.7-13.1-136.6 57.5-265.2 179.7-327.6 8.4-4.3 11.8-14.6 7.5-23-4.3-8.4-14.6-11.8-23-7.5C210 261.9 132.2 403.8 146.7 554.5c.8 8.8 8.3 15.5 17 15.5.5 0 1.1 0 1.6-.1zm589.8 252.7c7.2-6.1 8.1-16.9 2-24.1-6.1-7.2-16.9-8.1-24.1-2-59.8 50.7-136.1 78.7-214.6 78.7-80 0-157.4-28.9-217.7-81.3-7.1-6.2-18-5.5-24.1 1.7-6.2 7.1-5.4 17.9 1.7 24.1 66.6 57.8 151.9 89.7 240.2 89.7 86.5 0 170.6-30.8 236.6-86.8zm71.7-44.6c-55.1 0-99.9-44.8-99.9-99.9s44.8-99.9 99.9-99.9 99.9 44.8 99.9 99.9-44.8 99.9-99.9 99.9zm0-165.7c-36.2 0-65.7 29.5-65.7 65.7s29.5 65.7 65.7 65.7 65.7-29.5 65.7-65.7c.1-36.2-29.4-65.7-65.7-65.7zm-631 170.9c-55.1 0-99.9-44.8-99.9-100 0-55.1 44.8-99.9 99.9-99.9s99.9 44.8 99.9 99.9c.1 55.2-44.8 100-99.9 100zm0-165.7c-36.2 0-65.7 29.5-65.7 65.7s29.5 65.7 65.7 65.7 65.7-29.5 65.7-65.7c.1-36.2-29.4-65.7-65.7-65.7z" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-buy"><path d="M511.66.625C229.2.625.227 229.598.227 512.057S229.2 1023.488 511.66 1023.488c282.459 0 511.432-228.973 511.432-511.432S794.119.625 511.66.625zm0 953.123c-243.912 0-441.692-197.758-441.692-441.691 0-243.934 197.78-441.692 441.692-441.692 243.956 0 441.692 197.758 441.692 441.692 0 243.933-197.737 441.691-441.692 441.691z" /><path d="M510.57 344.391h57.436v117.721c-1.09 24.189-4.268 47.618-9.49 70.297h199.188v56.913H539.582l-8.943 17.855c76.596 31.988 148.971 67.505 217.031 106.564l-40.727 44.632c-65.475-40.172-134.26-76.245-206.454-108.243-.727.749-1.089 1.316-1.089 1.68-41.273 43.895-107.518 77.551-198.644 100.979l-32.918-51.33c92.987-23.429 155.872-53.18 188.609-89.265a384.943 384.943 0 0 0 16.163-22.873H265.615v-56.913h232.65c6.311-20.818 10.443-44.258 12.305-70.297v-117.72zm-225.432-78.663h433.518v36.267c-8.58 33.474-19.16 66.018-31.781 97.63l-54.123-15.619c10.762-20.092 19.342-41.659 25.654-64.724H285.138v-53.554zm33.508 145.61c43.861 17.118 82.363 37.016 115.463 59.707l-30.103 45.744c-36.46-27.9-74.055-49.648-112.738-65.279l27.378-40.172zm50.172-75.87c43.906 16.368 83.726 35.518 119.413 57.459l-30.104 45.756c-37.958-26.788-76.823-47.606-116.643-62.487l27.334-40.728z" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-close"><path d="M872.803 755.994h.061v-.37ZM927.847 511.998c0-229.316-186.568-415.84-415.84-415.84-229.328 0-415.853 186.524-415.853 415.84 0 229.3 186.525 415.84 415.854 415.84 229.27 0 415.839-186.54 415.839-415.84m-415.84 356.174c-196.375 0-356.172-159.827-356.172-356.174 0-196.375 159.797-356.158 356.173-356.158 196.345 0 356.144 159.783 356.144 356.158 0 196.347-159.8 356.174-356.144 356.174" /><path d="M682.379 642.228 553.797 513.265 682.261 386.23c11.662-11.515 11.75-30.333.235-41.996-11.515-11.677-30.363-11.766-42.027-.222L511.89 471.196 385.223 344.13c-11.602-11.604-30.393-11.662-42.025-.06-11.603 11.619-11.603 30.408-.06 42.012l126.52 126.888-127.52 126.134c-11.663 11.544-11.78 30.305-.236 41.97 5.831 5.89 13.43 8.833 21.087 8.833a29.81 29.81 0 0 0 20.91-8.57l127.695-126.311 128.7 129.169c5.802 5.8 13.428 8.717 21.056 8.717 7.6 0 15.165-2.917 20.969-8.659 11.604-11.572 11.631-30.364.06-42.026" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-delete"><path d="M106.667 213.333h810.666V256H106.667zM640 128v42.667h42.667V128c0-23.573-19.094-42.667-42.539-42.667H383.872A42.496 42.496 0 0 0 341.333 128v42.667H384V128h256zM213.333 896V256h-42.666v639.957c0 23.595 18.986 42.71 42.709 42.71h597.248c23.595 0 42.71-18.987 42.71-42.71V256h-42.667v640H213.333z" fill="#d81e06" /><path d="M320 341.333h42.667v384H320zm170.667 0h42.666v384h-42.666zm170.666 0H704v384h-42.667z" fill="#d81e06" /></symbol><symbol class="icon" viewBox="0 0 1049 1024"  id="icon-github"><path d="M524.98 0C234.675 0 0 234.676 0 524.98c0 232.068 150.367 428.5 358.968 498.034 26.075 5.215 35.636-11.299 35.636-25.206 0-12.168-.87-53.888-.87-97.347-146.02 31.29-176.441-62.58-176.441-62.58-23.468-60.842-58.235-76.487-58.235-76.487-47.804-32.16 3.477-32.16 3.477-32.16 53.02 3.477 80.833 53.89 80.833 53.89 46.935 79.963 122.553 57.364 152.974 43.458 4.346-33.898 18.253-57.366 33.029-70.403-116.47-12.169-239.023-57.365-239.023-259.013 0-57.365 20.86-104.3 53.89-140.806-5.216-13.037-23.469-66.926 5.214-139.067 0 0 44.328-13.907 144.282 53.888 41.72-11.299 86.918-17.383 131.245-17.383s89.525 6.084 131.245 17.383c99.955-67.795 144.283-53.888 144.283-53.888 28.682 72.141 10.43 126.03 5.215 139.067 33.897 36.505 53.888 83.44 53.888 140.806 0 201.648-122.553 245.975-239.891 259.013 19.122 16.514 35.636 47.804 35.636 97.347 0 70.403-.87 126.899-.87 144.282 0 13.907 9.562 30.421 35.637 25.206 208.6-69.533 358.967-265.966 358.967-498.035C1049.96 234.676 814.413 0 524.98 0z" fill="#191717" /><path d="M199.04 753.571c-.869 2.608-5.215 3.477-8.692 1.739s-6.084-5.215-4.345-7.823c.869-2.607 5.215-3.477 8.691-1.738s5.215 5.215 4.346 7.822zm20.86 23.468c-2.607 2.607-7.822.87-10.43-2.608-3.476-3.476-4.346-8.691-1.738-11.299 2.607-2.607 6.953-.869 10.43 2.608 3.477 4.346 4.346 9.56 1.738 11.299zM240.76 807.46c-3.476 2.607-8.691 0-11.299-4.346-3.477-4.346-3.477-10.43 0-12.168 3.477-2.608 8.692 0 11.3 4.346 3.476 4.345 3.476 9.56 0 12.168zm28.683 29.552c-2.607 3.476-8.692 2.607-13.907-1.739-4.346-4.345-6.084-10.43-2.607-13.037 2.607-3.477 8.691-2.608 13.907 1.738 4.345 3.477 5.215 9.561 2.607 13.038zm39.113 16.514c-.87 4.346-6.954 6.084-13.038 4.346-6.084-1.738-9.56-6.954-8.692-10.43.87-4.346 6.954-6.084 13.038-4.346 6.084 1.738 9.56 6.084 8.692 10.43zm42.59 3.477c0 4.346-5.216 7.822-11.3 7.822-6.084 0-11.3-3.476-11.3-7.822s5.216-7.823 11.3-7.823c6.084 0 11.3 3.477 11.3 7.823zm39.981-6.954c.87 4.346-3.477 8.692-9.56 9.561-6.085.87-11.3-1.738-12.17-6.084-.868-4.346 3.477-8.692 9.562-9.56 6.084-.87 11.299 1.737 12.168 6.083zm0 0" fill="#191717" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-kline"><path d="M59.699 508.006a450.816 450.816 0 1 0 901.632 0 450.816 450.816 0 1 0-901.632 0Z" fill="#8486F8" /><path d="M723.456 244.48h-425.83c-47.616 0-86.221 38.605-86.221 86.22v354.612c0 47.616 38.605 86.22 86.22 86.22h425.831c47.616 0 86.22-38.604 86.22-86.22V330.701c0-47.616-38.604-86.221-86.22-86.221zM396.493 662.118c0 14.03-11.367 25.396-25.395 25.396s-25.396-11.367-25.396-25.396v-78.13c0-14.03 11.367-25.396 25.396-25.396s25.395 11.366 25.395 25.395v78.131zm94.054 0c0 14.03-11.366 25.396-25.395 25.396s-25.395-11.367-25.395-25.396v-151.09c0-14.03 11.366-25.396 25.395-25.396s25.395 11.366 25.395 25.395v151.091zm94.003 0a25.395 25.395 0 0 1-25.395 25.396 25.395 25.395 0 0 1-25.395-25.396v-116.48a25.395 25.395 0 0 1 25.395-25.395 25.395 25.395 0 0 1 25.395 25.395v116.48zm94.055 0a25.395 25.395 0 0 1-25.395 25.396 25.395 25.395 0 0 1-25.396-25.396V480.614a25.395 25.395 0 0 1 25.396-25.395 25.395 25.395 0 0 1 25.395 25.395v181.504zm-3.175-277.81-92.62 80.025a25.508 25.508 0 0 1-31.95 1.075l-82.482-62.31-85.965 76.8c-4.864 4.352-10.906 6.502-16.947 6.502a25.318 25.318 0 0 1-18.944-8.5c-9.37-10.444-8.448-26.52 1.996-35.89l101.53-90.727a25.416 25.416 0 0 1 32.256-1.331l82.79 62.464 77.108-66.56a25.436 25.436 0 0 1 35.84 2.611 25.436 25.436 0 0 1-2.612 35.84z" fill="#FFF" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-pyramid"><path d="M669.936 120h-64a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16z" fill="#263238" /><path d="M637.936 152a8 8 0 0 1-8-8V80a8 8 0 0 1 16 0v64a8 8 0 0 1-8 8zm104 64h-64a8 8 0 0 1 0-16h64a8 8 0 0 1 0 16z" fill="#263238" /><path d="M709.936 248a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v64a8 8 0 0 1-8 8zM901.92 824h-768a7.984 7.984 0 0 1-6.768-12.272l80.848-128a8 8 0 0 1 6.768-3.728h606.336a8 8 0 0 1 6.768 3.728l80.832 128A8.016 8.016 0 0 1 901.92 824zm-753.488-16h738.976l-70.72-112h-597.52l-70.736 112z" fill="#263238" /><path d="M234.976 656H800.88l-80.848-128H315.824z" fill="#4DB6AC" /><path d="M800.88 664H234.992a7.984 7.984 0 0 1-6.768-12.272l80.848-128A8 8 0 0 1 315.84 520h404.208a8 8 0 0 1 6.768 3.728l80.848 128a7.968 7.968 0 0 1 .24 8.128A8.064 8.064 0 0 1 800.88 664zm-551.376-16h536.864l-70.736-112H320.24l-70.736 112z" fill="#263238" /><path d="M336.032 496h363.792l-80.848-128H416.88z" fill="#FFD740" /><path d="M699.824 504H336.032a7.984 7.984 0 0 1-6.768-12.272l80.848-128A8 8 0 0 1 416.88 360h202.112a8 8 0 0 1 6.768 3.728l80.848 128A8.016 8.016 0 0 1 699.824 504zm-349.28-16h334.768l-70.736-112H421.28l-70.736 112z" fill="#263238" /><path d="m517.92 208-80.832 128h161.68z" fill="#FF5252" /><path d="M598.768 344h-161.68a7.984 7.984 0 0 1-6.768-12.272l80.832-128c2.944-4.64 10.592-4.64 13.536 0l80.848 128A8.016 8.016 0 0 1 598.768 344zm-147.152-16h132.64L517.92 222.992 451.616 328zM40 520H8a8 8 0 0 1 0-16h32a8 8 0 0 1 0 16zM232 520H72a8 8 0 0 1 0-16h160a8 8 0 0 1 0 16zM1016 520h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 0 16zM952 520H792a8 8 0 0 1 0-16h160a8 8 0 0 1 0 16z" fill="#263238" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-sale"><path d="M511.5.681C229.003.681 0 229.684 0 512.182c0 282.496 229.004 511.5 511.5 511.5 282.498 0 511.5-229.004 511.5-511.5C1023 229.684 793.998.681 511.5.681zm0 953.251c-243.943 0-441.75-197.807-441.75-441.75 0-243.989 197.807-441.751 441.75-441.751 243.99 0 441.75 197.762 441.75 441.751 0 243.943-197.76 441.75-441.75 441.75z" /><path d="M330.154 498.218c39.802 13.01 77.743 29.403 113.821 49.111l-24.521 37.372H511.5c4.836-15.984 7.992-31.424 9.49-46.318v-90.957h56.355v90.957c-1.113 16.394-3.338 31.833-6.676 46.318h176.328v55.265H548.895l-5.584 8.9c69.182 20.116 133.164 43.911 191.971 71.43l-32.922 50.769c-62.508-34.216-126.877-61.734-193.084-82.556-40.188 34.58-106.033 61.372-197.534 80.331L280.5 719.184c92.251-18.232 154.576-40.732 186.931-67.502l11.716-11.716h-203.12v-55.265h127.217c-32.354-18.981-65.845-34.217-100.425-45.751l27.335-40.732zm-47.975-117.182H483.05v-37.372H323.457v-52.449H483.05v-37.963h56.922v37.963h156.234v52.449H539.973v37.372h195.309v36.283c-8.219 37.917-19.367 75.336-33.512 112.163l-54.674-15.644c10.807-21.57 20.457-48.157 29.016-79.786H282.179v-53.016zm94.862 59.148c40.166 10.784 78.65 24.93 115.479 42.413l-28.995 44.07c-37.576-20.071-75.54-35.511-113.82-46.318l27.336-40.165z" /></symbol><symbol class="icon" viewBox="0 0 1024 1024"  id="icon-setting"><path d="M545.784 962.54h-65.943c-29.342 0-54.625-25.283-54.625-54.617v-39.46c0-9.624-7.826-20.912-16.69-23.68l-1.566-.613-55.725-23.104-.88-.494c-8.154-4.41-22.018-2.376-28.553 4.187l-28.175 28.124c-9.93 9.977-23.239 15.495-37.432 15.495-14.195 0-27.508-5.518-37.488-15.542l-46.682-46.63c-20.604-20.604-20.632-54.234-.07-74.975l28.15-28.106c6.638-6.575 8.677-20.6 4.254-28.91l-.832-1.768-23.164-56.128-.27-.683c-2.803-9.034-14.279-17.394-23.611-17.394H116.85c-29.391 0-52.862-24.065-52.862-53.193v-65.944c0-28.77 23-51.755 52.92-51.755h39.575c9.082 0 20.804-8.83 23.666-18.057l.568-1.477 23.163-57.088.506-.914c4.404-8.22 2.32-22.224-4.29-28.83l-28.041-28.088c-9.965-9.922-15.487-23.217-15.502-37.397-.016-14.201 5.492-27.537 15.507-37.552l46.655-46.615c9.942-9.985 23.249-15.503 37.433-15.503 14.185 0 27.491 5.519 37.47 15.541l28.04 28.05c6.557 6.527 20.5 8.598 28.656 4.232l.893-.479 57.376-23.65c8.836-2.73 16.634-14.037 16.634-23.718v-39.633c0-28.968 24.778-52.096 54.625-52.096h65.942c29.162 0 52.371 22.637 52.371 52.096v39.633c0 9.127 8.71 20.854 17.768 23.674l1.516.577 56.64 23.113.923.51c8.203 4.425 22.185 2.353 28.79-4.255l28.163-27.913c9.895-9.941 23.18-15.34 37.352-15.34h.06c14.189 0 27.51 5.376 37.517 15.385l46.71 46.555c10.005 9.96 15.525 23.254 15.525 37.475 0 14.188-5.499 27.507-15.48 37.533L825.47 321.27c-6.58 6.61-8.64 20.771-4.204 29.108l.479.896 23.654 57.957c2.902 9.256 14.636 18.115 23.687 18.115h39.132v-.573c27.63 0 52.189 22.984 52.189 52.328V545.1c0 29.59-22.986 53.138-51.747 53.138h-39.63c-9.338 0-20.85 8.373-23.687 17.424l-.58 1.516-23.087 56.241-.469.861c-4.42 8.304-2.393 22.32 4.17 28.855l28.136 28.02c10.032 10.03 15.54 23.351 15.538 37.541-.004 14.186-5.515 27.506-15.518 37.506l-46.748 46.682c-9.921 9.965-23.22 15.506-37.407 15.506h-.06c-14.193 0-27.515-5.515-37.519-15.517l-28.04-28.096c-6.49-6.491-20.808-8.576-28.888-4.207l-.951.515-57.938 23.68c-9.088 2.859-17.824 14.594-17.824 23.691v39.461c-.003 29.847-23.698 54.622-52.374 54.622zM421.867 806.891c25.193 8.37 44.283 34.65 44.283 61.57v39.461c0 7.114 6.57 13.684 13.692 13.684h65.942c6.497 0 12.462-6.044 12.462-13.684v-39.46c0-26.274 19.517-53.132 44.902-61.58l53.86-22.063c23.628-12.117 56.342-7.1 75.118 11.674l28.01 28.154c2.433 2.43 5.679 3.837 9.18 3.837h.015c3.482 0 6.726-1.399 9.135-3.82l46.78-46.738c2.437-2.437 3.783-5.725 3.786-9.225 0-3.495-1.345-6.774-3.788-9.216l-28.106-28c-18.694-18.609-23.762-51.349-11.773-75.036l22.084-53.604c8.375-25.167 35.224-44.514 61.578-44.514h39.631c7.745 0 10.814-7.086 10.814-13.23v-65.997c0-6.862-5.116-12.074-11.256-12.302v1.48h-39.132c-26.237 0-53.1-20.15-61.586-45.736l-22.084-54.262c-11.96-23.655-6.913-56.503 11.728-75.229l28.169-28.192c2.43-2.441 3.788-5.764 3.788-9.295 0-3.499-1.334-6.762-3.76-9.174l-46.741-46.578c-2.462-2.462-5.737-3.734-9.234-3.734h-.014c-3.466 0-6.7 1.255-9.105 3.671l-28.198 28.038c-18.704 18.71-51.417 23.735-75 11.69L603.18 217.41c-25.404-8.388-44.935-35.256-44.935-61.605v-39.633c0-7.253-5.517-12.187-12.462-12.187h-65.943c-7.518 0-13.692 5.519-13.692 12.187v39.633c0 27.027-19.107 53.336-44.326 61.643l-53.501 21.997c-23.835 12.169-55.857 7.235-74.879-11.696l-28.13-28.115c-2.442-2.452-5.691-3.788-9.153-3.788-3.463 0-6.705 1.335-9.118 3.76l-46.69 46.645c-2.438 2.439-3.784 5.71-3.781 9.208.004 3.474 1.34 6.717 3.763 9.13l28.068 28.12c18.699 18.691 23.783 51.39 11.809 74.974l-22.125 54.814c-8.414 25.616-35.282 45.783-61.603 45.783h-39.575c-6.63 0-13.01 3.412-13.01 10.823v65.944c0 6.942 5.752 13.284 12.952 13.284h39.632c26.38 0 53.195 19.35 61.524 44.538l22.182 53.629c12.028 23.731 6.919 56.45-11.863 75.056l-28.022 27.95c-5.021 5.066-5.049 13.348.01 18.41l46.714 46.653c2.453 2.464 5.696 3.794 9.169 3.794 3.472 0 6.712-1.336 9.125-3.76l28.182-28.122c18.641-18.73 51.44-23.753 75.011-11.642l53.353 22.055z" /><path d="M513.735 731.88c-120.64 0-218.787-98.146-218.787-218.786s98.147-218.787 218.787-218.787S732.52 392.454 732.52 513.094 634.375 731.88 513.735 731.88zm0-397.556c-98.574 0-178.77 80.196-178.77 178.77s80.195 178.77 178.77 178.77 178.769-80.196 178.769-178.77-80.195-178.77-178.77-178.77z" /></symbol>',t.insertBefore(c,t.lastChild)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}qe(Dt).mount("#app");
