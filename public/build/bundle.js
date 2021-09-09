var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function l(e){e.forEach(t)}function i(e){return"function"==typeof e}function o(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function s(e,t){e.appendChild(t)}function a(e,t,n){e.insertBefore(t,n||null)}function c(e){e.parentNode.removeChild(e)}function r(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function d(e){return document.createElement(e)}function u(e){return document.createTextNode(e)}function f(){return u(" ")}function h(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function m(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function p(e,t){e.value=null==t?"":t}function v(e,t){for(let n=0;n<e.options.length;n+=1){const l=e.options[n];if(l.__value===t)return void(l.selected=!0)}e.selectedIndex=-1}function g(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}let k;function b(e){k=e}const $=[],_=[],x=[],y=[],j=Promise.resolve();let z=!1;function T(e){x.push(e)}let S=!1;const A=new Set;function E(){if(!S){S=!0;do{for(let e=0;e<$.length;e+=1){const t=$[e];b(t),O(t.$$)}for(b(null),$.length=0;_.length;)_.pop()();for(let e=0;e<x.length;e+=1){const t=x[e];A.has(t)||(A.add(t),t())}x.length=0}while($.length);for(;y.length;)y.pop()();z=!1,S=!1,A.clear()}}function O(e){if(null!==e.fragment){e.update(),l(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(T)}}const w=new Set;function C(e,t){e&&e.i&&(w.delete(e),e.i(t))}function q(e,n,o,s){const{fragment:a,on_mount:c,on_destroy:r,after_update:d}=e.$$;a&&a.m(n,o),s||T((()=>{const n=c.map(t).filter(i);r?r.push(...n):l(n),e.$$.on_mount=[]})),d.forEach(T)}function L(e,t){const n=e.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function M(e,t){-1===e.$$.dirty[0]&&($.push(e),z||(z=!0,j.then(E)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function H(t,i,o,s,a,r,d,u=[-1]){const f=k;b(t);const h=t.$$={fragment:null,ctx:null,props:r,update:e,not_equal:a,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:i.context||[]),callbacks:n(),dirty:u,skip_bound:!1,root:i.target||f.$$.root};d&&d(h.root);let m=!1;if(h.ctx=o?o(t,i.props||{},((e,n,...l)=>{const i=l.length?l[0]:n;return h.ctx&&a(h.ctx[e],h.ctx[e]=i)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](i),m&&M(t,e)),n})):[],h.update(),m=!0,l(h.before_update),h.fragment=!!s&&s(h.ctx),i.target){if(i.hydrate){const e=function(e){return Array.from(e.childNodes)}(i.target);h.fragment&&h.fragment.l(e),e.forEach(c)}else h.fragment&&h.fragment.c();i.intro&&C(t.$$.fragment),q(t,i.target,i.anchor,i.customElement),E()}b(f)}class I{$destroy(){L(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function K(e,t,n){const l=e.slice();return l[27]=t[n],l}function N(e,t,n){const l=e.slice();return l[30]=t[n],l}function V(e,t,n){const l=e.slice();return l[33]=t[n],l}function B(e,t,n){const l=e.slice();return l[36]=t[n],l}function P(e){let t,n,l,i,o,r,u;return{c(){t=d("div"),n=d("label"),n.textContent="Zatražio nove podatke:",l=f(),i=d("div"),o=d("input"),m(n,"class","label is-small"),m(o,"class","input is-small"),m(o,"type","text"),m(o,"placeholder",""),m(i,"class","control"),m(t,"class","field")},m(c,d){a(c,t,d),s(t,n),s(t,l),s(t,i),s(i,o),p(o,e[0]),r||(u=h(o,"input",e[17]),r=!0)},p(e,t){1&t[0]&&o.value!==e[0]&&p(o,e[0])},d(e){e&&c(t),r=!1,u()}}}function Z(e){let t,n,l,i,o,r,p,v,g=e[36].name+"";return{c(){t=d("label"),n=d("input"),i=f(),o=u(g),r=f(),m(n,"class","is-small"),m(n,"type","radio"),n.__value=l=e[36],n.value=n.__value,e[19][0].push(n),m(t,"class","radio")},m(l,c){a(l,t,c),s(t,n),n.checked=n.__value===e[1],s(t,i),s(t,o),s(t,r),p||(v=h(n,"change",e[18]),p=!0)},p(e,t){2&t[0]&&(n.checked=n.__value===e[1])},d(l){l&&c(t),e[19][0].splice(e[19][0].indexOf(n),1),p=!1,v()}}}function D(t){let n,l,i,o,r=t[33].text+"";return{c(){n=d("option"),l=u(r),i=f(),n.__value=o=t[33],n.value=n.__value},m(e,t){a(e,n,t),s(n,l),s(n,i)},p:e,d(e){e&&c(n)}}}function G(t){let n,l,i,o,r=t[30].os+"";return{c(){n=d("option"),l=u(r),i=f(),n.__value=o=t[30],n.value=n.__value},m(e,t){a(e,n,t),s(n,l),s(n,i)},p:e,d(e){e&&c(n)}}}function U(e){let t,n,l,i,o,r,p,v,g=e[27].name+"";return{c(){t=d("label"),n=d("input"),i=f(),o=u(g),r=f(),m(n,"class","is-small"),m(n,"type","radio"),n.__value=l=e[27],n.value=n.__value,e[19][1].push(n),m(t,"class","radio")},m(l,c){a(l,t,c),s(t,n),n.checked=n.__value===e[4],s(t,i),s(t,o),s(t,r),p||(v=h(n,"change",e[22]),p=!0)},p(e,t){16&t[0]&&(n.checked=n.__value===e[4])},d(l){l&&c(t),e[19][1].splice(e[19][1].indexOf(n),1),p=!1,v()}}}function R(t){let n,i,o,u,p,g,k,b,$,_,x,y,j,z,S,A,E,O,w,C,q,L,M,H,I,R,F,J,Q,X,Y,ee,te,ne,le,ie,oe,se,ae,ce,re,de,ue,fe,he,me,pe,ve,ge,ke,be,$e,_e,xe,ye,je,ze,Te,Se,Ae,Ee,Oe,we,Ce,qe,Le,Me="za sebe"!==t[2].text&&P(t),He=t[10],Ie=[];for(let e=0;e<He.length;e+=1)Ie[e]=Z(B(t,He,e));let Ke=t[11],Ne=[];for(let e=0;e<Ke.length;e+=1)Ne[e]=D(V(t,Ke,e));let Ve=t[12],Be=[];for(let e=0;e<Ve.length;e+=1)Be[e]=G(N(t,Ve,e));let Pe=t[13],Ze=[];for(let e=0;e<Pe.length;e+=1)Ze[e]=U(K(t,Pe,e));return{c(){n=d("div"),i=d("div"),o=d("div"),u=d("form"),p=d("div"),g=d("label"),g.textContent="Vlasnik mTokena",k=f(),b=d("div"),$=d("input"),_=f(),x=d("div"),y=d("label"),y.textContent="Serijski broj mTokena",j=f(),z=d("div"),S=d("input"),A=f(),E=d("div"),O=d("label"),O.textContent="Korisnički identifikator",w=f(),C=d("div"),q=d("input"),L=f(),M=d("div"),H=d("label"),H.textContent="Aktivacijski kod",I=f(),R=d("div"),F=d("input"),J=f(),Me&&Me.c(),Q=f(),X=d("div"),Y=d("button"),Y.textContent="Kopiraj",ee=f(),te=d("div"),ne=d("div"),le=d("div"),ie=d("div"),ie.innerHTML='<label class="label">Od:</label>',oe=f(),se=d("div"),ae=d("div"),ce=d("div");for(let e=0;e<Ie.length;e+=1)Ie[e].c();re=f(),de=d("div"),de.innerHTML='<label class="label">Za:</label>',ue=f(),fe=d("div"),he=d("div"),me=d("div"),pe=d("div"),ve=d("select");for(let e=0;e<Ne.length;e+=1)Ne[e].c();ge=f(),ke=d("div"),be=d("div"),be.innerHTML='<label class="label">OS:</label>',$e=f(),_e=d("div"),xe=d("div"),ye=d("div"),je=d("div"),ze=d("select");for(let e=0;e<Be.length;e+=1)Be[e].c();Te=f(),Se=d("div"),Se.innerHTML='<label class="label">Vrsta akcije:</label>',Ae=f(),Ee=d("div");for(let e=0;e<Ze.length;e+=1)Ze[e].c();Oe=f(),we=d("div"),Ce=d("textarea"),m(g,"class","label is-small"),$.value=t[7],m($,"class","input is-small"),m($,"type","text"),m($,"placeholder",""),$.disabled=!0,m(b,"class","control"),m(p,"class","field"),m(y,"class","label is-small"),S.value=t[6],m(S,"class","input is-small"),m(S,"type","text"),m(S,"placeholder",""),S.disabled=!0,m(z,"class","control"),m(x,"class","field"),m(O,"class","label is-small"),q.value=t[8],m(q,"class","input is-small"),m(q,"type","text"),m(q,"placeholder",""),q.disabled=!0,m(C,"class","control"),m(E,"class","field"),m(H,"class","label is-small"),F.value=t[9],m(F,"class","input is-small"),m(F,"type","text"),m(F,"placeholder",""),F.disabled=!0,m(R,"class","control"),m(M,"class","field"),m(u,"class","box"),m(o,"class","tile is-child "),m(Y,"class","button is-primary"),m(X,"class","tile is-child "),m(i,"class","tile is-4 is-vertical is-parent"),m(ie,"class","field "),m(ce,"class","control"),m(ae,"class","field"),m(se,"class","field-body"),m(de,"class","field is-small"),m(ve,"id","za"),void 0===t[2]&&T((()=>t[20].call(ve))),m(pe,"class","select "),m(me,"class","control"),m(he,"class","field"),m(fe,"class","field-body"),m(le,"class","field is-horizontal "),m(be,"class","field "),void 0===t[3]&&T((()=>t[21].call(ze))),m(je,"class","select "),m(ye,"class","control"),m(xe,"class","field"),m(Se,"class","field is-small"),m(Ee,"class","control "),m(_e,"class","field-body"),m(ke,"class","field is-horizontal"),m(Ce,"id","mail"),Ce.value=t[5],m(Ce,"class","textarea is-primary"),m(Ce,"placeholder","Write something ..."),m(Ce,"cols","60"),m(Ce,"rows","15"),m(we,"class","tile is-child "),m(ne,"class","tile is-child box"),m(te,"class","tile is-vertical is-parent"),m(n,"class","tile is-ancestor")},m(e,l){a(e,n,l),s(n,i),s(i,o),s(o,u),s(u,p),s(p,g),s(p,k),s(p,b),s(b,$),s(u,_),s(u,x),s(x,y),s(x,j),s(x,z),s(z,S),s(u,A),s(u,E),s(E,O),s(E,w),s(E,C),s(C,q),s(u,L),s(u,M),s(M,H),s(M,I),s(M,R),s(R,F),s(u,J),Me&&Me.m(u,null),s(i,Q),s(i,X),s(X,Y),s(n,ee),s(n,te),s(te,ne),s(ne,le),s(le,ie),s(le,oe),s(le,se),s(se,ae),s(ae,ce);for(let e=0;e<Ie.length;e+=1)Ie[e].m(ce,null);s(le,re),s(le,de),s(le,ue),s(le,fe),s(fe,he),s(he,me),s(me,pe),s(pe,ve);for(let e=0;e<Ne.length;e+=1)Ne[e].m(ve,null);v(ve,t[2]),s(ne,ge),s(ne,ke),s(ke,be),s(ke,$e),s(ke,_e),s(_e,xe),s(xe,ye),s(ye,je),s(je,ze);for(let e=0;e<Be.length;e+=1)Be[e].m(ze,null);v(ze,t[3]),s(_e,Te),s(_e,Se),s(_e,Ae),s(_e,Ee);for(let e=0;e<Ze.length;e+=1)Ze[e].m(Ee,null);s(ne,Oe),s(ne,we),s(we,Ce),qe||(Le=[h(Y,"click",W),h(ve,"change",t[14]),h(ve,"change",t[20]),h(ze,"change",t[21])],qe=!0)},p(e,t){if("za sebe"!==e[2].text?Me?Me.p(e,t):(Me=P(e),Me.c(),Me.m(u,null)):Me&&(Me.d(1),Me=null),1026&t[0]){let n;for(He=e[10],n=0;n<He.length;n+=1){const l=B(e,He,n);Ie[n]?Ie[n].p(l,t):(Ie[n]=Z(l),Ie[n].c(),Ie[n].m(ce,null))}for(;n<Ie.length;n+=1)Ie[n].d(1);Ie.length=He.length}if(2048&t[0]){let n;for(Ke=e[11],n=0;n<Ke.length;n+=1){const l=V(e,Ke,n);Ne[n]?Ne[n].p(l,t):(Ne[n]=D(l),Ne[n].c(),Ne[n].m(ve,null))}for(;n<Ne.length;n+=1)Ne[n].d(1);Ne.length=Ke.length}if(2052&t[0]&&v(ve,e[2]),4096&t[0]){let n;for(Ve=e[12],n=0;n<Ve.length;n+=1){const l=N(e,Ve,n);Be[n]?Be[n].p(l,t):(Be[n]=G(l),Be[n].c(),Be[n].m(ze,null))}for(;n<Be.length;n+=1)Be[n].d(1);Be.length=Ve.length}if(4104&t[0]&&v(ze,e[3]),8208&t[0]){let n;for(Pe=e[13],n=0;n<Pe.length;n+=1){const l=K(e,Pe,n);Ze[n]?Ze[n].p(l,t):(Ze[n]=U(l),Ze[n].c(),Ze[n].m(Ee,null))}for(;n<Ze.length;n+=1)Ze[n].d(1);Ze.length=Pe.length}32&t[0]&&(Ce.value=e[5])},i:e,o:e,d(e){e&&c(n),Me&&Me.d(),r(Ie,e),r(Ne,e),r(Be,e),r(Ze,e),qe=!1,l(Le)}}}function W(){let e=document.querySelector("#mail");e.select(),document.execCommand("copy"),console.log(e.value);let t=e.value.split("\n\n");console.log(t);let n=t.join("\n");console.log(n)}function F(e,t,n){let l,i,o,s=document.querySelector("#content > div > div.w-half.left > div:nth-child(1)").nextElementSibling.innerText,a=document.querySelector("#content > div > div.w-half.left > div:nth-child(3)").nextElementSibling.innerText.split(" "),c=a[a.length-1],r=s.slice(2),d=document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.search("activation_number");document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.search("phone");let u=document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.slice(d+22,d+27),f="",h=[{id:1,msg:"Poštovana gospođo",name:"Gđa."},{id:2,msg:"Poštovani gospodine",name:"Gdin."}],m=h[0],p=[{msg:`,\n      \nmToken djelatnice ${c} je`,text:"za gospođu"},{msg:`,\n\nmToken djelatnika ${c} je`,text:"za gospodina"},{msg:",\n    \nmToken je uspješno",text:"za sebe"}],v=p[0],k=[{id:1,msg:`Budući da se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod (${u}).`,os:"Android"},{id:2,msg:`U slučaju da se radi o sustavu iOS, za aktivaciju se koriste inicijalna lozinka i korisnički identifikator.\n\nInicijalna lozinka: ${u}\nKorisnički identifikator: ${r} `,os:"iOS"},{id:3,msg:` Ako se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod. U slučaju da se radi o sustavu iOS, za aktivaciju se koriste inicijalna lozinka i korisnički identifikator.\n\nAktivacijski kod/inicijalna lozinka: ${u}\nKorisnički identifikator: ${r}`,os:"Nepoznat"}],b=k[0],$=[{id:1,status:"aktiviran.",name:"Aktivacija",msg:`Ako ćete mToken koristiti za prijavu u e-Dnevnik, prije prve prijave potrebno je da e-Dnevnik administrator Vaše škole unese serijski broj mTokena ${s} u sustav.`},{id:2,status:"reaktiviran",name:"Reaktivacija",msg:`Serijski broj mTokena ostaje isti, odnosno ${s}`}],_=$[0];return e.$$.update=()=>{7&e.$$.dirty[0]&&n(16,l=`${m.msg} ${f}${v.msg}`),24&e.$$.dirty[0]&&n(15,i=`${_.status} ${b.msg}`),98320&e.$$.dirty[0]&&n(5,o=` ${l} ${i} \n\n${_.msg}\n\nZa sve ostale upite stojimo Vam na raspolaganju.`)},[f,m,v,b,_,o,s,c,r,u,h,p,k,$,function(){let e=document.getElementById("za"),t=e.options[e.selectedIndex].innerText;"za sebe "===t&&(console.log(t),n(0,f=c))},i,l,function(){f=this.value,n(0,f)},function(){m=this.__value,n(1,m)},[[],[]],function(){v=g(this),n(2,v),n(11,p)},function(){b=g(this),n(3,b),n(12,k)},function(){_=this.__value,n(4,_)}]}class J extends I{constructor(e){super(),H(this,e,F,R,o,{},null,[-1,-1])}}function Q(t){let n,l,i;return l=new J({}),{c(){var e;n=d("main"),(e=l.$$.fragment)&&e.c(),m(n,"class","container is-max-desktop")},m(e,t){a(e,n,t),q(l,n,null),i=!0},p:e,i(e){i||(C(l.$$.fragment,e),i=!0)},o(e){!function(e,t,n,l){if(e&&e.o){if(w.has(e))return;w.add(e),(void 0).c.push((()=>{w.delete(e),l&&(n&&e.d(1),l())})),e.o(t)}}(l.$$.fragment,e),i=!1},d(e){e&&c(n),L(l)}}}function X(e){return[]}return new class extends I{constructor(e){super(),H(this,e,X,Q,o,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
