import{D as o,C as t}from"./index-BQ4MH4yd.js";import{U as B}from"./index-C7HkXaKf.js";import{d as V,g as O,k as I,y as M,c as F,f as a,b as l,w as r,u as d,a as u,o as R,e as w}from"./index-CbYwyux_.js";const G={class:"mb-4"},S={class:"flex-wrap f-c-b"},h={class:"f-c-c flex-basis-33.33% max-w-33.33%"},A={class:"f-c-c flex-basis-33.33% max-w-33.33%"},k=V({__name:"Settings",async setup(T){let c,b;const s=([c,b]=O(()=>o.create()),c=await c,b(),c),N=([c,b]=O(()=>o.get(s,t.DB_CONFIG,t.DB_KEY_CONFIG)),c=await c,b(),c);async function g(){const m=await o.get(s,t.DB_RECORD),e=await o.get(s,t.DB_COMMENTS,t.DB_KEY_COMMENTS),i=await o.get(s,t.DB_CONFIG,t.DB_KEY_CONFIG),_=new Blob([JSON.stringify([{records:m,comments:e,config:i}])],{type:"text/json"}),p=document.createElement("a"),D=B.Dates.formatDate("YY-MM-DD-hh-mm-ss");p.download=`${D}.json`,p.href=URL.createObjectURL(_),p.click()}const v=async m=>{if(m.raw){const e=new FileReader;e.readAsText(m.raw),e.onload=()=>{const i=JSON.parse(e.result.toString());o.clear(s,t.DB_RECORD).then(()=>{i[0].records.forEach(_=>{o.leadIn(s,_,t.DB_RECORD)})}),o.clear(s,t.DB_COMMENTS).then(()=>{o.leadIn(s,i[0].comments,t.DB_COMMENTS)}),o.clear(s,t.DB_CONFIG).then(()=>{o.leadIn(s,i[0].config,t.DB_CONFIG)})}}};async function y(){await o.del(t.DB_TALLYPAD)}const n=I({...N});return M(n,m=>{o.put(s,t.DB_CONFIG,B.Objects.raw(m),t.DB_KEY_CONFIG)}),(m,e)=>{const i=u("el-button"),_=u("el-upload"),p=u("el-popconfirm"),D=u("el-input"),C=u("el-form-item"),x=u("el-switch"),E=u("el-form");return R(),F("div",null,[a("div",G,[e[6]||(e[6]=a("div",{class:"mb-4"},[a("div",null,"设置"),a("div",{class:"text-0.8rem text-text-secondary"},"一些设置和管理")],-1)),a("div",S,[a("div",h,[l(i,{plain:"",round:"",type:"primary",onClick:g},{default:r(()=>e[3]||(e[3]=[w("导出数据")])),_:1})]),l(_,{"auto-upload":!1,limit:1,"on-change":v,"show-file-list":!1,accept:"application/json",class:"f-c-c flex-basis-33.33% max-w-33.33%"},{default:r(()=>[l(i,{plain:"",round:"",type:"success"},{default:r(()=>e[4]||(e[4]=[w("导入数据")])),_:1})]),_:1}),a("div",A,[l(p,{title:"确定清除数据？",onConfirm:y},{reference:r(()=>[l(i,{plain:"",round:"",type:"danger"},{default:r(()=>e[5]||(e[5]=[w("清除数据")])),_:1})]),_:1})])])]),a("div",null,[e[7]||(e[7]=a("div",{class:"mb-4"},[a("div",null,"选项"),a("div",{class:"text-0.8rem text-text-secondary"},"配置预算、图表")],-1)),a("div",null,[l(E,{model:d(n),class:"p-4","label-position":"left","label-width":"auto"},{default:r(()=>[l(C,{label:"预算"},{default:r(()=>[l(D,{modelValue:d(n).budget,"onUpdate:modelValue":e[0]||(e[0]=f=>d(n).budget=f),modelModifiers:{number:!0},size:"small",type:"number"},null,8,["modelValue"])]),_:1}),l(C,{label:d(n).isChart?"开启图表":"关闭图表"},{default:r(()=>[l(x,{modelValue:d(n).isChart,"onUpdate:modelValue":e[1]||(e[1]=f=>d(n).isChart=f)},null,8,["modelValue"])]),_:1},8,["label"]),l(C,{label:d(n).itemAsc?"计划项升序":"计划项降序"},{default:r(()=>[l(x,{modelValue:d(n).itemAsc,"onUpdate:modelValue":e[2]||(e[2]=f=>d(n).itemAsc=f)},null,8,["modelValue"])]),_:1},8,["label"])]),_:1},8,["model"])])])])}}});export{k as default};
