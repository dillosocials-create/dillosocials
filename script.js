const gallery=document.getElementById('gallery');
const allShots=[...document.querySelectorAll('.shot')];
const categories=[...document.querySelectorAll('.category')];
let activeIndex=0,timer=null,dragging=false,startX=0,startTranslate=0;
function visibleShots(){return [...gallery.querySelectorAll('.shot:not(.hidden)')]}
function setActive(index,animate=true){const shots=visibleShots();if(!shots.length)return;activeIndex=(index+shots.length)%shots.length;shots.forEach((s,i)=>s.classList.toggle('active',i===activeIndex));const a=shots[activeIndex];if(a){const target=a.offsetLeft-(window.innerWidth-a.offsetWidth)/2;gallery.style.transition=animate?'transform .7s cubic-bezier(.2,.75,.2,1)':'none';gallery.style.transform=`translateX(${-Math.max(0,target)}px)`}const c=document.getElementById('currentProject');if(c)c.textContent=String(activeIndex+1).padStart(2,'0')}
function startAuto(){clearInterval(timer);timer=setInterval(()=>{if(!document.hidden&&!dragging)setActive(activeIndex+1)},3800)}function pauseAuto(){clearInterval(timer)}
categories.forEach(b=>b.addEventListener('click',()=>{categories.forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;allShots.forEach(s=>s.classList.toggle('hidden',f!=='all'&&s.dataset.category!==f));activeIndex=0;setActive(0);startAuto()}));
document.getElementById('prevProject')?.addEventListener('click',()=>{setActive(activeIndex-1);startAuto()});document.getElementById('nextProject')?.addEventListener('click',()=>{setActive(activeIndex+1);startAuto()});
gallery.addEventListener('pointerdown',e=>{dragging=true;pauseAuto();startX=e.clientX;startTranslate=parseFloat((gallery.style.transform.match(/-?[\d.]+px/)||[])[0])||0;gallery.classList.add('dragging');gallery.setPointerCapture(e.pointerId)});gallery.addEventListener('pointermove',e=>{if(!dragging)return;gallery.style.transition='none';gallery.style.transform=`translateX(${Math.min(0,startTranslate+e.clientX-startX)}px)`});function endDrag(){if(!dragging)return;dragging=false;gallery.classList.remove('dragging');const shots=visibleShots();const centers=shots.map(s=>Math.abs((s.getBoundingClientRect().left+s.getBoundingClientRect().width/2)-innerWidth/2));activeIndex=Math.max(0,centers.indexOf(Math.min(...centers)));setActive(activeIndex);startAuto()}gallery.addEventListener('pointerup',endDrag);gallery.addEventListener('pointercancel',endDrag);gallery.addEventListener('mouseleave',()=>{if(!dragging)startAuto()});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
document.querySelectorAll('a.portfolio-link[href]').forEach(a=>a.addEventListener('click',e=>{if(e.defaultPrevented)return;const href=a.href;if(!href||href.startsWith(window.location.href+'#'))return;e.preventDefault();const overlay=document.getElementById('portfolioTransition');if(!overlay){window.location.href=href;return}overlay.classList.add('is-leaving');window.setTimeout(()=>{window.location.href=href},520)}));
const sections=[...document.querySelectorAll('main > section')];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced){sections.forEach(s=>s.classList.add('reveal-in'))}else{const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('reveal-in');else entry.target.classList.remove('reveal-in')})},{threshold:0.08,rootMargin:'0px 0px -5% 0px'});sections.forEach(s=>observer.observe(s))}
(function(){if(location.hash){history.replaceState(null,'',location.pathname+location.search)}if('scrollRestoration' in history)history.scrollRestoration='manual';const goTop=()=>window.scrollTo(0,0);goTop();document.addEventListener('DOMContentLoaded',goTop,{once:true});window.addEventListener('load',()=>{goTop();requestAnimationFrame(goTop);setTimeout(goTop,50);setTimeout(goTop,250)},{once:true});window.addEventListener('pageshow',goTop)})();
window.addEventListener('resize',()=>setActive(activeIndex,false));
const form=document.getElementById('contactForm');if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`Dillo Socials inquiry from ${d.get('name')}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nMobile: ${d.get('phone')||'—'}\nService: ${d.get('service')||'—'}\n\n${d.get('message')}`);window.location.href=`mailto:dillosocials@gmail.com?subject=${subject}&body=${body}`;const success=document.getElementById('contactSuccess');if(success)success.classList.add('show')})}
// Expand one service at a time and keep the arrow meaningful.
document.querySelectorAll('.service-card').forEach(card=>{const toggle=()=>{const open=card.classList.contains('is-open');document.querySelectorAll('.service-card.is-open').forEach(other=>{other.classList.remove('is-open');other.setAttribute('aria-expanded','false')});if(!open){card.classList.add('is-open');card.setAttribute('aria-expanded','true')}};card.addEventListener('click',e=>{if(e.target.closest('a'))return;toggle()});card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
setActive(0,false);startAuto();
/* Interactive five-slide showcase */
const toolSlides=[...document.querySelectorAll('.tool-slide')],toolBars=[...document.querySelectorAll('.tool-progress-segment')],toolDots=[...document.querySelectorAll('.tool-dots button')];
let toolIndex=0,toolTimer=null,toolTouchX=0;
function showTool(n){if(!toolSlides.length)return;toolIndex=(n+toolSlides.length)%toolSlides.length;toolSlides.forEach((s,i)=>s.classList.toggle('active',i===toolIndex));toolBars.forEach((b,i)=>b.classList.toggle('active',i===toolIndex));toolDots.forEach((b,i)=>b.classList.toggle('active',i===toolIndex))}
function startToolAuto(){clearInterval(toolTimer);toolTimer=setInterval(()=>showTool(toolIndex+1),5200)}
document.getElementById('toolPrev')?.addEventListener('click',()=>{showTool(toolIndex-1);startToolAuto()});
document.getElementById('toolNext')?.addEventListener('click',()=>{showTool(toolIndex+1);startToolAuto()});
toolDots.forEach((b,i)=>b.addEventListener('click',()=>{showTool(i);startToolAuto()}));
const toolStage=document.querySelector('.tool-stage');
toolStage?.addEventListener('touchstart',e=>{toolTouchX=e.changedTouches[0].clientX;clearInterval(toolTimer)},{passive:true});
toolStage?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-toolTouchX;if(Math.abs(dx)>45)showTool(toolIndex+(dx<0?1:-1));startToolAuto()},{passive:true});
toolStage?.addEventListener('mouseenter',()=>clearInterval(toolTimer));toolStage?.addEventListener('mouseleave',startToolAuto);
showTool(0);startToolAuto();

/* Real interactive demo controls */
(()=>{
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
 const crmForm=$('#crmForm'), crmRows=$('#crmRows'), crmCount=$('#crmCount');
 let savedClients=Number(localStorage.getItem('dilloDemoClients')||0);
 function initials(n){return n.trim().split(/\\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}
 function renderCRM(){const stored=JSON.parse(localStorage.getItem('dilloDemoCRM')||'[]');stored.forEach(c=>{if(!document.querySelector('[data-client="'+CSS.escape(c.name)+'"]')){const row=document.createElement('div');row.className='ui-row';row.dataset.client=c.name;row.innerHTML='<i>'+initials(c.name)+'</i><span>'+c.name.replace(/[<>]/g,'')+'</span><b>'+c.status+'</b>';crmRows.appendChild(row)}});crmCount.textContent=(24+stored.length)+' active contacts'}
 crmForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(crmForm), arr=JSON.parse(localStorage.getItem('dilloDemoCRM')||'[]');arr.push({name:d.get('client'),status:d.get('status')});localStorage.setItem('dilloDemoCRM',JSON.stringify(arr));crmForm.reset();renderCRM()});
 $('#crmAdd')?.addEventListener('click',()=>{crmForm?.querySelector('input')?.focus()});renderCRM();

 const cal=$('#demoCalendar'), bookingStatus=$('#bookingStatus');
 cal?.querySelectorAll('span').forEach(day=>day.addEventListener('click',()=>{cal.querySelectorAll('.picked').forEach(x=>x.classList.remove('picked'));day.classList.add('picked');bookingStatus.textContent='Date selected: July '+day.textContent+' — ready to book.'}));
 $('#bookNow')?.addEventListener('click',()=>{const d=cal?.querySelector('.picked');bookingStatus.textContent=d?'✓ Booking confirmed for July '+d.textContent+'.':'Please select a date first.';localStorage.setItem('dilloDemoBooking',d?.textContent||'')});

 const invoiceForm=$('#invoiceForm'), invoiceItems=$('#invoiceItems'), invoiceTotal=$('#invoiceTotal'), invoiceBar=$('#invoiceBar'), invoiceMessage=$('#invoiceMessage');
 let invoiceAmount=2400;
 invoiceForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(invoiceForm), amount=Number(d.get('amount'))||0;invoiceAmount+=amount;const row=document.createElement('div');row.className='invoice-item';row.innerHTML='<span>'+String(d.get('item')).replace(/[<>]/g,'')+'</span><span>'+money(amount)+'</span>';invoiceItems.appendChild(row);invoiceTotal.textContent=money(invoiceAmount);invoiceBar.textContent=money(invoiceAmount);invoiceForm.reset();invoiceMessage.textContent='✓ Invoice recalculated. Total updated instantly.'});
 $('#invoicePaid')?.addEventListener('click',e=>{e.currentTarget.textContent='PAID ✓';e.currentTarget.classList.add('paid');invoiceMessage.textContent='✓ Invoice marked as paid.';localStorage.setItem('dilloDemoInvoicePaid','1')});

 const portalMessage=$('#portalMessage'), portalProgress=$('#portalProgress'), portalProgressText=$('#portalProgressText');
 $$('.file-approve').forEach(btn=>btn.addEventListener('click',()=>{const file=btn.closest('.portal-file');btn.textContent='Approved';btn.disabled=true;file.querySelector('span').textContent='Approved';let p=Math.min(100,Number((portalProgressText.textContent||'72').replace('%',''))+10);portalProgress.style.width=p+'%';portalProgressText.textContent=p+'%';portalMessage.textContent='✓ Approval saved. Project progress increased.'}));
 $('#portalUpload')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const row=document.createElement('div');row.className='portal-file';row.innerHTML='<i>▰</i> '+f.name.replace(/[<>]/g,'')+' <span>Uploaded</span><button type="button" class="file-approve">Approve</button>';$('#portalFiles').appendChild(row);row.querySelector('.file-approve').addEventListener('click',()=>{row.querySelector('.file-approve').textContent='Approved';row.querySelector('.file-approve').disabled=true;row.querySelector('span').textContent='Approved';portalMessage.textContent='✓ Uploaded file approved.'});portalMessage.textContent='✓ '+f.name+' added to the portal.';e.target.value=''});

 let ops={revenue:18400,jobs:12,overdue:2};const savedOps=localStorage.getItem('dilloDemoOps');if(savedOps)ops=JSON.parse(savedOps);
 function renderOps(){const r=$('#opsRevenue'),j=$('#opsJobs'),o=$('#opsOverdue');if(r)r.textContent='$'+(ops.revenue/1000).toFixed(1)+'k';if(j)j.textContent=ops.jobs;if(o)o.textContent=ops.overdue;localStorage.setItem('dilloDemoOps',JSON.stringify(ops))}
 $('#opsAdd')?.addEventListener('click',()=>{ops.jobs++;ops.revenue+=850;renderOps()});$('#opsComplete')?.addEventListener('click',()=>{if(ops.jobs>0)ops.jobs--;ops.revenue+=500;renderOps()});$('#opsOverdueBtn')?.addEventListener('click',()=>{ops.overdue++;renderOps()});renderOps();
})();
