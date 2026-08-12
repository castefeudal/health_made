function numbers(rows, key){ return rows.map(row=>Number(typeof key==='function'?key(row):row?.[key])).filter(Number.isFinite); }
export function mean(values){ return values.length?values.reduce((a,b)=>a+b,0)/values.length:null; }
export function standardDeviation(values){ if(values.length<2)return null; const avg=mean(values); return Math.sqrt(mean(values.map(x=>(x-avg)**2))); }
export function linearSlope(values){ if(values.length<2)return null; const xMean=(values.length-1)/2,yMean=mean(values); const den=values.reduce((s,_,i)=>s+(i-xMean)**2,0); return den?values.reduce((s,y,i)=>s+(i-xMean)*(y-yMean),0)/den:null; }
export function latest(rows, dateKey='date'){ return [...rows].sort((a,b)=>String(b?.[dateKey]||b?.measuredAt||b?.createdAt).localeCompare(String(a?.[dateKey]||a?.measuredAt||a?.createdAt)))[0]||null; }
export function deriveSleep(rows, window=14){
  const recent=[...rows].sort((a,b)=>String(a.date||a.sleepStart||'').localeCompare(String(b.date||b.sleepStart||''))).slice(-window);
  const durations=numbers(recent,x=>x.duration??(Number(x.durationMinutes)/60));
  const wakes=recent.map(x=>x.wakeTime||x.sleepEnd).filter(Boolean).map(x=>new Date(x).getHours()+new Date(x).getMinutes()/60);
  return {sampleSize:recent.length,averageDuration:mean(durations),durationVariance:standardDeviation(durations),averageWakeTime:mean(wakes),latest:recent.at(-1)||null};
}
export function deriveBody(rows){
  const weightRows=rows.filter(x=>x.type==='weight'&&Number.isFinite(Number(x.value))).sort((a,b)=>String(a.measuredAt||a.date||'').localeCompare(String(b.measuredAt||b.date||'')));
  const values=numbers(weightRows,'value'); return {sampleSize:values.length,current:values.at(-1)??null,previous:values.at(-2)??null,slope:linearSlope(values.slice(-8)),minimum:values.length?Math.min(...values):null,maximum:values.length?Math.max(...values):null};
}
export function deriveTraining(rows, window=14){
  const recent=rows.slice(-window); const loads=numbers(recent,x=>Number(x.load??x.volume??0)*(Number(x.rpe)||1));
  return {sampleSize:recent.length,load:mean(loads)||0,days:recent.length,latest:recent.at(-1)||null};
}
export function deriveMood(mood,stress){
  const m=numbers(mood,'value'),s=numbers(stress,'value'); return {mood:mean(m),stress:mean(s),moodSample:m.length,stressSample:s.length};
}
export function deriveSnapshot(data,profileId){
  const own=key=>(data[key]||[]).filter(row=>!row.profileId||row.profileId===profileId);
  return {sleep:deriveSleep(own('sleep')),body:deriveBody(own('measurements')),training:deriveTraining(own('training')),mood:deriveMood(own('mood'),own('stress')),goals:own('goals').filter(x=>x.status!=='completed'),activity:own('activity'),nutrition:own('nutrition'),tasks:own('tasks'),labs:own('labResults')};
}
