import {deriveSnapshot} from './derived.js';
import {RULES,RULE_VERSION,SOURCES} from './rules.js';

function hash(text){ let h=2166136261; for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);} return h>>>0; }
function pick(list,seed){ return list[hash(seed)%list.length]; }
function evidenceScore(level){ return ({Strong:1,Moderate:.82,Limited:.62,Exploratory:.45})[level]||.5; }
function profileGoal(p){ return String(p?.primaryGoal||'').toLowerCase(); }
function score(item,rule,snapshot,profile){
  const goal=profileGoal(profile); const relevance=rule.build?Math.min(1,0.72+(rule.build(snapshot,profile).goalDomains.some(x=>goal.includes(x))?.22:0)):0.7;
  const completeness=Math.min(1,0.45+Math.min(0.55,snapshot.sleep.sampleSize/10+snapshot.body.sampleSize/20));
  const urgency=rule.domain==='system'?.7:1; const freshness=1; const redundancy=0;
  const raw=rule.impact*.32+evidenceScore(rule.evidence)*100*.18+relevance*100*.18+urgency*100*.1+completeness*100*.1+rule.actionability*.12-rule.burden*.12-redundancy;
  return Math.max(0,Math.min(100,Math.round(raw*freshness)));
}
function stableText(item,profile,snapshot){ const variants=[item.recommendation,item.recommendation.replace('ближайшей','следующей'),item.recommendation.replace('отметьте','зафиксируйте')]; return pick(variants,`${profile?.id}|${item.ruleId}|${snapshot.sleep.sampleSize}|${snapshot.body.sampleSize}`); }
export function analyze(data,profileId,{limit=9,now=new Date()}={}){
  const profile=(data.profiles||[]).find(x=>x.id===profileId)||null; const snapshot=deriveSnapshot(data,profileId); const dismissed=new Set((data.recommendationFeedback||[]).filter(x=>x.profileId===profileId&&x.status==='dismissed').map(x=>x.ruleId));
  const items=[];
  for(const rule of RULES){ if(dismissed.has(rule.id)||!rule.when(snapshot,profile))continue; const base=rule.build(snapshot,profile); const priority=score(base,rule,snapshot,profile); items.push({...base,ruleId:rule.id,domain:rule.domain,evidenceStrength:rule.evidence,source:SOURCES[rule.source],priority,confidence:Math.round(100*(.55*evidenceScore(rule.evidence)+.45*(priority/100))),engineVersion:'1.0.0',ruleVersion:RULE_VERSION,inputSnapshotHash:hash(JSON.stringify({snapshot,profileId,rule:rule.id})).toString(16),generatedAt:now.toISOString(),recommendation:stableText(base,profile,snapshot),priorityReason:`Вклад: impact ${rule.impact}/100, evidence ${rule.evidence}, actionability ${rule.actionability}/100, burden ${rule.burden}/100.`}); }
  return items.sort((a,b)=>b.priority-a.priority||a.ruleId.localeCompare(b.ruleId)).slice(0,limit);
}
export function getTopRecommendations(data,profileId){ const all=analyze(data,profileId,{limit:20}); return {main:all[0]||null,top:all.slice(0,3),additional:all.slice(3,8),all}; }
export function explainRecommendation(data,profileId,ruleId){ return analyze(data,profileId,{limit:50}).find(x=>x.ruleId===ruleId)||null; }
export {RULES,SOURCES,RULE_VERSION};
