import {getTopRecommendations} from '../engine/recommendation-engine.js';

function node(tag,attrs={},...children){ const el=document.createElement(tag); for(const [key,value] of Object.entries(attrs)){ if(value==null)continue; if(key==='text')el.textContent=value; else if(key==='class')el.className=value; else el.setAttribute(key,String(value)); } for(const child of children.flat()){ if(child)el.append(child.nodeType?child:document.createTextNode(String(child))); } return el; }
function button(label,run,kind='secondary'){ const b=node('button',{type:'button',class:`btn ${kind}`,text:label}); b.addEventListener('click',run); return b; }
function scoreBar(value,label){ return node('div',{class:'recommendation-score'},node('div',{class:'score-line'},node('span',{text:label}),node('strong',{text:`${value}/100`}),),node('div',{class:'score-track'},node('span',{style:`width:${value}%`}))); }
function explainCard(item){
  return node('details',{class:'recommendation-explain'},node('summary',{text:'Почему я это вижу?'}),node('div',{class:'explain-grid'},
    node('div',{},node('h4',{text:'Использованные данные'}),node('ul',{},...(item.facts||[]).map(f=>node('li',{text:f})))),
    node('div',{},node('h4',{text:'Сработавшее правило'}),node('p',{text:item.ruleId}),node('p',{class:'muted',text:item.priorityReason})),
    node('div',{},node('h4',{text:'Доказательность и уверенность'}),node('p',{text:`Evidence: ${item.evidenceStrength}. Применимость к вам: ${item.confidence}/100.`}),node('p',{class:'muted',text:item.source?.title||''})),
    node('div',{},node('h4',{text:'Что изменит рекомендацию'}),node('p',{text:item.nextCheck}))
  ));
}
function recommendationCard(item,{onDismiss,onComplete,featured=false}={}){
  const card=node('article',{class:`recommendation-card${featured?' featured':''}`},
    node('div',{class:'recommendation-card-head'},node('div',{},node('span',{class:'pill',text:item.domain}),node('h3',{text:item.title})),node('strong',{class:'priority-number',text:String(item.priority)})),
    node('p',{class:'recommendation-observation',text:item.observation}),node('p',{text:item.explanation}),
    node('div',{class:'recommendation-action'},node('span',{class:'action-label',text:'Следующее действие'}),node('strong',{text:item.recommendation}),node('small',{text:`Ожидаемый эффект: ${item.expectedBenefit} · Усилие: ${item.effort}/100 · Стоимость: ${item.cost?'есть':'нет'}`})),
    scoreBar(item.priority,'Приоритет'),explainCard(item),
    node('div',{class:'recommendation-actions'},button('Сделано',()=>onComplete?.(item),'primary'),button('Не сейчас',()=>onDismiss?.(item))));
  return card;
}
export function renderRecommendations({data,profileId,onDismiss,onComplete}){
  const result=getTopRecommendations(data,profileId); const root=node('div',{class:'recommendation-page'});
  if(!result.all.length){
    root.append(node('section',{class:'panel empty'},node('div',{class:'empty-mark',text:'✓'}),node('h3',{text:'Пока нет активных рекомендаций'}),node('p',{text:'Добавьте несколько записей сна, тела, целей или настроения — engine начнёт строить персональную картину после появления baseline.'})));
    return root;
  }
  const heroHead=node('div',{class:'section-head'},node('div',{},node('span',{class:'eyebrow',text:'DETERMINISTIC ENGINE · LOCAL ONLY'}),node('h2',{text:'Главный рычаг на сегодня'}),node('p',{text:'Система ранжирует действия по эффекту, доказательности, применимости и усилию. Это не диагноз и не медицинское назначение.'})),node('span',{class:'pill ok',text:'Воспроизводимо'}));
  root.append(node('section',{class:'panel recommendation-hero'},heroHead,recommendationCard(result.main,{onDismiss,onComplete,featured:true})));
  const topHead=node('div',{class:'section-head'},node('div',{},node('h2',{text:'3 ключевых приоритета'}),node('p',{text:'Остальное можно отложить без потери фокуса.'})));
  const topCards=result.top.map(item=>recommendationCard(item,{onDismiss,onComplete}));
  root.append(node('section',{class:'panel'},topHead,node('div',{class:'recommendation-grid'},...topCards)));
  const dots=result.all.slice(0,8).map(item=>node('div',{class:'impact-effort-item'},node('span',{class:'impact-dot',style:`left:${item.effort}%;bottom:${item.priority}%`,'aria-label':`${item.title}: effort ${item.effort}, priority ${item.priority}`})));
  root.append(node('section',{class:'panel'},node('div',{class:'section-head'},node('div',{},node('h2',{text:'Максимум результата'}),node('p',{text:'80/20: сначала действия с высоким ожидаемым эффектом и низким усилием.'}))),node('div',{class:'impact-effort'},...dots)));
  const allHead=node('div',{class:'section-head'},node('div',{},node('h2',{text:'Все рекомендации'}),node('p',{text:`Показано ${result.all.length}. Дубликаты и отложенные правила исключены.`})));
  const allCards=result.all.slice(3).map(item=>recommendationCard(item,{onDismiss,onComplete}));
  root.append(node('section',{class:'panel'},allHead,node('div',{class:'recommendation-list'},...allCards)));
  return root;
}
