const contactStylesheet=document.createElement('link');contactStylesheet.rel='stylesheet';contactStylesheet.href='contact.css?v=2';document.head.appendChild(contactStylesheet);

const gallery=document.getElementById('gallery');
const allShots=[...document.querySelectorAll('.shot')];
const categories=[...document.querySelectorAll('.category')];
let activeIndex=0;
let timer=null;
let dragging=false;
let startX=0;
let startTranslate=0;

function visibleShots(){return [...gallery.querySelectorAll('.shot:not(.hidden)')]}
function setActive(index,animate=true){
  const shots=visibleShots();
  if(!shots.length)return;
  activeIndex=(index+shots.length)%shots.length;
  shots.forEach((shot,i)=>shot.classList.toggle('active',i===activeIndex));
  const active=shots[activeIndex];
  if(active){
    const target=active.offsetLeft-(window.innerWidth-active.offsetWidth)/2;
    gallery.style.transition=animate?'transform .7s cubic-bezier(.2,.75,.2,1)':'none';
    gallery.style.transform=`translateX(${-Math.max(0,target)}px)`;
  }
  const counter=document.querySelector('.gallery-note span:last-child');
  if(counter)counter.textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(shots.length).padStart(2,'0')}`;
}
function startAuto(){clearInterval(timer);timer=setInterval(()=>{if(!document.hidden&&!dragging)setActive(activeIndex+1)},3800)}
function pauseAuto(){clearInterval(timer)}

categories.forEach(button=>button.addEventListener('click',()=>{
  categories.forEach(b=>b.classList.remove('active'));button.classList.add('active');
  const filter=button.dataset.filter;
  allShots.forEach(shot=>shot.classList.toggle('hidden',filter!=='all'&&shot.dataset.category!==filter));
  activeIndex=0;setActive(0);startAuto();
}));

gallery.addEventListener('pointerdown',e=>{dragging=true;pauseAuto();startX=e.clientX;startTranslate=parseFloat((gallery.style.transform.match(/-?([\d.]+)px/)||[])[1])||0;gallery.classList.add('dragging');gallery.setPointerCapture(e.pointerId)});
gallery.addEventListener('pointermove',e=>{if(!dragging)return;const delta=e.clientX-startX;gallery.style.transition='none';gallery.style.transform=`translateX(${Math.min(0,startTranslate+delta)}px)`});
function endDrag(){if(!dragging)return;dragging=false;gallery.classList.remove('dragging');const shots=visibleShots();const centers=shots.map(s=>Math.abs((s.getBoundingClientRect().left+s.getBoundingClientRect().width/2)-window.innerWidth/2));activeIndex=Math.max(0,centers.indexOf(Math.min(...centers)));setActive(activeIndex);startAuto()}
gallery.addEventListener('pointerup',endDrag);gallery.addEventListener('pointercancel',endDrag);
allShots.forEach(shot=>shot.addEventListener('mouseenter',()=>{if(shot.classList.contains('active'))pauseAuto()}));gallery.addEventListener('mouseleave',startAuto);

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'})}}));
window.addEventListener('resize',()=>setActive(activeIndex,false));

const contact=document.querySelector('.contact');
if(contact){
  contact.innerHTML=`
    <div class="contact-inner">
      <div class="contact-head">
        <div class="eyebrow">LET'S TALK</div>
        <h2>Have content to <em>take off your<br>plate?</em></h2>
        <p>Tell me about your business, platforms, and goals. We'll start by understanding the support you need and the best next step.</p>
      </div>
      <div class="contact-steps">
        <div class="contact-step active"><span>01</span>Tell me about your business</div>
        <div class="contact-step"><span>02</span>Discuss your support needs</div>
        <div class="contact-step"><span>03</span>Choose the best next step</div>
      </div>
      <form class="contact-form" id="contactForm">
        <label class="contact-field"><input name="name" required placeholder="Full Name" autocomplete="name"></label>
        <label class="contact-field"><input name="email" type="email" required placeholder="Email Address" autocomplete="email"></label>
        <label class="contact-field"><input name="phone" placeholder="Mobile Number" autocomplete="tel"></label>
        <label class="contact-field"><select name="service"><option value="">What do you need help with?</option><option>Social Media</option><option>Branding</option><option>Content</option><option>Digital</option><option>Campaign</option></select></label>
        <label class="contact-field message"><textarea name="message" required placeholder="Tell me about your business, platforms, and goals..."></textarea></label>
        <button class="contact-submit" type="submit">Send Message&nbsp; ↗</button>
      </form>
      <p class="contact-note">Prefer email? hello@dillosocials.com</p>
      <div class="contact-success" id="contactSuccess">Your email draft is ready — just press send.</div>
    </div>`;
  document.getElementById('contactForm').addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const subject=encodeURIComponent(`Dillo Socials inquiry from ${data.get('name')}`);
    const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nMobile: ${data.get('phone')||'—'}\nService: ${data.get('service')||'—'}\n\n${data.get('message')}`);
    window.location.href=`mailto:hello@dillosocials.com?subject=${subject}&body=${body}`;
    document.getElementById('contactSuccess').classList.add('show');
  });
}

setActive(0,false);startAuto();
