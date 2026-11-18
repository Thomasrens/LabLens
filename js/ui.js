/* Shared screen navigation, sheets, settings, toast messages and accessible UI helpers. */
const screens = ['splash','home','scanner','manual','overview','guide','quiz','result','feedback'];
let currentScreen = 'splash';
let toastTimer;
export function showScreen(id) {
  screens.forEach(name => { const el=document.getElementById(name); if(el) el.classList.toggle('hidden', name!==id); });
  currentScreen=id; window.scrollTo({top:0,behavior:motionReduced()?'auto':'smooth'});
}
export function getCurrentScreen(){return currentScreen;}
export function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
export function motionReduced(){return document.documentElement.classList.contains('reduce-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
export function openSheet(id){document.getElementById(id)?.classList.remove('hidden');}
export function closeSheet(id){document.getElementById(id)?.classList.add('hidden');}
export function loadSettings(){try{return {...{theme:'system',text:'normal',sound:'off',reduceMotion:false},...JSON.parse(localStorage.getItem('lablens-settings-v1')||'{}')};}catch{return {theme:'system',text:'normal',sound:'off',reduceMotion:false};}}
export function applySettings(settings){const root=document.documentElement;root.dataset.theme=settings.theme;root.classList.toggle('large-text',settings.text==='large');root.classList.toggle('reduce-motion',!!settings.reduceMotion);document.getElementById('themeSetting').value=settings.theme;document.getElementById('textSetting').value=settings.text;document.getElementById('soundSetting').value=settings.sound;document.getElementById('motionSetting').checked=!!settings.reduceMotion;}
export function saveSettings(settings){localStorage.setItem('lablens-settings-v1',JSON.stringify(settings));applySettings(settings);}
export function bindUI(handler){document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button) handler(button.dataset.action,button);});}
