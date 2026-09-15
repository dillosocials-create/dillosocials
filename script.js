const gallery=document.getElementById('gallery');
const allShots=[...document.querySelectorAll('.shot')];
const categories=[...document.querySelectorAll('.category')];
let activeIndex=0,timer=null,dragging=false,startX=0,startTranslate=0;

function visibleShots(){return [...gallery.querySelectorAll('.shot:not(.hidden)')]}
function setActive(index,animate=true){const shots=visibleShots();if(!shots.length)return;activeIndex=(index+shots.length)%shots.length;shots.forEach((s,i)=>s.classList.toggle('active',i===activeIndex));const a=shots[activeIndex];if(a){const target=a.offsetLeft-(window.innerWidth-a.offsetWidth)/2;gallery.style.transition=animate?'transform .7s cubic-bezier(.2,.75,.2,1)':'none';gallery.style.transform=`translateX(${-Math.max(0,target)}px)`}const c=document.getElementById('currentProject');if(c)c.textContent=String(activeIndex+1).padStart(2,'0')}
function startAuto(){clearInterval(timer);timer=setInterval(()=>{if(!document.hidden&&!dragging)setActive(activeIndex+1)},3800)}
function pauseAuto(){clearInterval(timer)}

categories.forEach(b=>b.addEventListener('click',()=>{categories.forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;allShots.forEach(s=>s.classList.toggle('hidden',f!=='all'&&s.dataset.category!==f));activeIndex=0;setActive(0);startAuto()}));
document.getElementById('prevProject')?.addEventListener('click',()=>{setActive(activeIndex-1);startAuto()});
document.getElementById('nextProject')?.addEventListener('click',()=>{setActive(activeIndex+1);startAuto()});

gallery.addEventListener('pointerdown',e=>{dragging=true;pauseAuto();startX=e.clientX;startTranslate=parseFloat((gallery.style.transform.match(/-?[\d.]+px/)||[])[0])||0;gallery.classList.add('dragging');gallery.setPointerCapture(e.pointerId)});
gallery.addEventListener('pointermove',e=>{if(!dragging)return;gallery.style.transition='none';gallery.style.transform=`translateX(${Math.min(0,startTranslate+e.clientX-startX)}px)`});
function endDrag(){if(!dragging)return;dragging=false;gallery.classList.remove('dragging');const shots=visibleShots();const centers=shots.map(s=>Math.abs((s.getBoundingClientRect().left+s.getBoundingClientRect().width/2)-innerWidth/2));activeIndex=Math.max(0,centers.indexOf(Math.min(...centers)));setActive(activeIndex);startAuto()}
gallery.addEventListener('pointerup',endDrag);gallery.addEventListener('pointercancel',endDrag);gallery.addEventListener('mouseleave',()=>{if(!dragging)startAuto()});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
window.addEventListener('resize',()=>setActive(activeIndex,false));

const form=document.getElementById('contactForm');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`Dillo Socials inquiry from ${d.get('name')}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nMobile: ${d.get('phone')||'—'}\nService: ${d.get('service')||'—'}\n\n${d.get('message')}`);window.location.href=`mailto:dillosocials@gmail.com?subject=${subject}&body=${body}`;const success=document.getElementById('contactSuccess');if(success)success.classList.add('show')})}

setActive(0,false);startAuto();