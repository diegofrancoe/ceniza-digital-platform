// Versioned website intake contract, mirrored in the web backend and CRM receiver.
const clean = value => typeof value === 'string' ? value.trim() : '';
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value+'T12:00:00Z')) && new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
export function websiteContactDetails(input) {
  if (input.intakeVersion === undefined) return {fields:{},error:''}; // Existing receipts keep their original meaning.
  if (input.intakeVersion !== 2) return {fields:{},error:'Versión del formulario no válida.'};
  const clientType=clean(input.clientType),company=clean(input.company),serviceInterest=clean(input.serviceInterest),city=clean(input.city);
  if(city.length>120)return {fields:{},error:'La ciudad debe tener máximo 120 caracteres.'};
  const eventDateStatus=clean(input.eventDateStatus),eventStartDate=clean(input.eventStartDate),eventEndDate=clean(input.eventEndDate);
  if (!['individual','company'].includes(clientType)) return {fields:{},error:'Selecciona persona natural o empresa.'};
  if (clientType==='company' && (!company || company.length>160)) return {fields:{},error:'Indica el nombre de la empresa (máximo 160 caracteres).'};
  if (!['production','rental','advice'].includes(serviceInterest)) return {fields:{},error:'Selecciona el servicio de interés o Necesito asesoría.'};
  if (!['defined','undecided'].includes(eventDateStatus)) return {fields:{},error:'Indica la fecha del evento o selecciona Por definir.'};
  if (eventDateStatus==='defined' && (!validDate(eventStartDate) || (eventEndDate && (!validDate(eventEndDate) || eventEndDate<eventStartDate)))) return {fields:{},error:'Revisa las fechas: el final no puede ser anterior al inicio.'};
  if (eventDateStatus==='undecided' && (eventStartDate || eventEndDate)) return {fields:{},error:'Selecciona una fecha definida o deja las fechas vacías.'};
  const compact=clean(input.phone).replace(/[\s().-]/g,'');
  const national=compact.startsWith('+57')?compact.slice(3):compact.startsWith('57')&&compact.length===12?compact.slice(2):compact;
  if (!/^\+?\d+$/.test(compact) || !/^3\d{9}$/.test(national)) return {fields:{},error:'Ingresa un teléfono celular colombiano válido, por ejemplo +57 300 123 4567.'};
  return {fields:{intakeVersion:2,...(city?{city}:{}),clientType,company:clientType==='company'?company:'',serviceInterest,eventDateStatus,eventStartDate:eventDateStatus==='defined'?eventStartDate:'',eventEndDate:eventDateStatus==='defined'?eventEndDate:'',phoneIsWhatsapp:true},error:''};
}
