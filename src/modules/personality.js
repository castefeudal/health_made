export const BIG_FIVE=['openness','conscientiousness','extraversion','agreeableness','emotionalStability'];
export const PERSONALITY_SOURCE={id:'personality.big-five',version:'1.0.0',label:'Big Five dimensional model',limitations:'Описательная модель черт, не диагноз и не фиксированный тип.'};
export function scoreBigFive(answers){
  const values=Object.fromEntries(BIG_FIVE.map(key=>[key,[]]));
  for(const item of answers||[]){ if(values[item.trait]&&Number.isFinite(Number(item.value)))values[item.trait].push(Math.max(1,Math.min(5,Number(item.value)))); }
  return Object.fromEntries(BIG_FIVE.map(key=>[key,values[key].length?Math.round(values[key].reduce((a,b)=>a+b,0)/values[key].length*100)/100:null]));
}
export function deriveArchetype(traits){
  const entries=Object.entries(traits||{}).filter(([,v])=>Number.isFinite(v)); if(!entries.length)return {id:'unknown',label:'Пока недостаточно данных'};
  const [top]=entries.sort((a,b)=>b[1]-a[1]); return {id:top[0],label:{openness:'Исследователь',conscientiousness:'Строитель',extraversion:'Связующий',agreeableness:'Медиатор',emotionalStability:'Стабилизатор'}[top[0]]||'Свой профиль'};
}
