export const DOMAIN_REGISTRY = Object.freeze([
  {id:'health',title:'Здоровье',category:'health',routes:['labs','timeline'],stores:['measurements','labReports','labResults','symptoms','medications']},
  {id:'body',title:'Тело',category:'health',routes:['dashboard'],stores:['measurements']},
  {id:'sleep',title:'Сон',category:'lifestyle',routes:['dashboard'],stores:['sleep']},
  {id:'training',title:'Тренировки',category:'lifestyle',routes:['dashboard'],stores:['training','activity']},
  {id:'nutrition',title:'Питание',category:'lifestyle',routes:['dashboard'],stores:['nutrition']},
  {id:'psychology',title:'Психика и настроение',category:'mind',routes:['dashboard'],stores:['mood','stress','journals']},
  {id:'habits',title:'Привычки',category:'behavior',routes:['dashboard'],stores:['habits','habitLogs']},
  {id:'productivity',title:'Продуктивность',category:'work',routes:['dashboard'],stores:['tasks','projects']},
  {id:'goals',title:'Цели',category:'planning',routes:['dashboard'],stores:['goals']},
  {id:'finance',title:'Финансы',category:'life',routes:['dashboard'],stores:['finance']},
  {id:'personality',title:'Личность',category:'mind',routes:['dashboard'],stores:['personalityAssessments']},
  {id:'journal',title:'Дневник',category:'life',routes:['timeline'],stores:['journals']},
  {id:'settings',title:'Настройки',category:'system',routes:['settings'],stores:['settings']}
]);

export function getDomain(id){ return DOMAIN_REGISTRY.find(domain=>domain.id===id)||null; }
