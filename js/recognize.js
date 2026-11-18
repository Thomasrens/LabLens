/* Recognition cascade: optional Teachable Machine classifier, QR ID, then manual choice. */
import {CONFIG} from './config.js';
let model=null, modelReady=false, lastRun=0, busy=false;
export async function loadClassifier(onStatus=()=>{}){
  if(!CONFIG.modelURL)return false;
  try{if(!window.tmImage)throw new Error('Classifier library unavailable');model=await window.tmImage.load(CONFIG.modelURL+'model.json',CONFIG.modelURL+'metadata.json');modelReady=true;onStatus('Image classifier ready');return true;}
  catch(error){model=null;modelReady=false;onStatus('Image classifier unavailable; QR and manual selection remain available.');return false;}
}
export async function recognizeFrame(video,canvas,onCandidate){
  if(document.hidden||busy)return;const now=performance.now();if(now-lastRun<CONFIG.classifierIntervalMs)return;lastRun=now;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});if(video.readyState>=2){canvas.width=video.videoWidth;canvas.height=video.videoHeight;ctx.drawImage(video,0,0,canvas.width,canvas.height);}
  if(modelReady&&model){busy=true;try{const predictions=await model.predict(video);predictions.sort((a,b)=>b.probability-a.probability);const top=predictions[0];if(top&&onCandidate({type:'ai',label:top.className,confidence:top.probability}))return;}catch{}finally{busy=false;}}
  if(window.jsQR && canvas.width){try{const image=ctx.getImageData(0,0,canvas.width,canvas.height);const qr=window.jsQR(image.data,image.width,image.height,{inversionAttempts:'dontInvert'});if(qr?.data){onCandidate({type:'qr',id:qr.data.trim()});return;}}catch{}}
}
export function classifierAvailable(){return modelReady;}
