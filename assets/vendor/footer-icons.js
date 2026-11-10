var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var u=([e,a,r])=>{let l=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(a).forEach(o=>{l.setAttribute(o,String(a[o]))}),r?.length&&r.forEach(o=>{let M=u(o);l.appendChild(M)}),l},c=(e,a={})=>{let l={...i,...a};return u(["svg",l,e])};var s=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}]];var m=[["polygon",{points:"12 2 19 21 12 17 5 21 12 2"}]];var p={prefix:"fab",iconName:"linkedin-in",icon:[448,512,[],"f0e1","M100.3 448l-92.9 0 0-299.1 92.9 0 0 299.1zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 39.5 5.7 25.9 15.8 15.8s23.8-15.8 38-15.8 27.9 5.7 38 15.8 15.8 23.8 15.8 38c0 29.7-24.1 54.3-53.8 54.3zM447.9 448l-92.7 0 0-145.6c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7l0 148.1-92.8 0 0-299.1 89.1 0 0 40.8 1.3 0c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3l0 164.3-.1 0z"]};var f=document.querySelector(".footer-plane"),n=document.querySelector("footer"),x=matchMedia("(prefers-reduced-motion: reduce)"),z=matchMedia("(hover: hover) and (pointer: fine)");f.append(c(m,{width:21,height:21,"stroke-width":1.5}));document.querySelector("#footer-email").append(c(s,{width:19,height:19,"stroke-width":1.5,"aria-hidden":"true"}));var[b,C,,,L]=p.icon;document.querySelector("#footer-linkedin").append(c([["path",{d:L}]],{width:17,height:17,viewBox:`0 0 ${b} ${C}`,fill:"currentColor",stroke:"none","aria-hidden":"true"}));var t=()=>{f.style.transform=""},d=e=>Math.max(-1,Math.min(1,e));n.addEventListener("pointermove",e=>{if(x.matches||!z.matches)return;let a=f.getBoundingClientRect(),r=d((e.clientX-a.left-a.width/2)/100),l=d((e.clientY-a.top-a.height/2)/80);f.style.transform=`translate(${r*3}px, ${l*2}px) rotate(${r*7}deg)`});n.addEventListener("pointerleave",t);window.addEventListener("blur",t);x.addEventListener("change",t);z.addEventListener("change",t);
/*! Bundled license information:

lucide/dist/esm/defaultAttributes.mjs:
lucide/dist/esm/createElement.mjs:
lucide/dist/esm/icons/mail.mjs:
lucide/dist/esm/icons/navigation-2.mjs:
lucide/dist/esm/lucide.mjs:
  (**
   * @license lucide v1.65.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

@fortawesome/free-brands-svg-icons/index.mjs:
  (*!
   * Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   * Copyright 2026 Fonticons, Inc.
   *)
*/
