/* Camera lifecycle helpers. Streams are always stopped when the scanner is left. */
let stream=null, facing='environment', track=null;
export async function startCamera(video){
  stopCamera();
  if(!window.isSecureContext && location.hostname!=='localhost' && location.hostname!=='127.0.0.1') throw new Error('insecure');
  if(!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
  try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:720}},audio:false});video.srcObject=stream;await video.play();track=stream.getVideoTracks()[0];return track;}
  catch(error){if(error.name==='NotAllowedError'||error.name==='PermissionDeniedError')throw new Error('denied');if(error.name==='NotFoundError'||error.name==='DevicesNotFoundError')throw new Error('missing');throw new Error('camera');}
}
export function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;track=null;}}
export async function flipCamera(video){facing=facing==='environment'?'user':'environment';return startCamera(video);}
export async function toggleTorch(){if(!track)throw new Error('unavailable');const caps=track.getCapabilities?.();if(!caps?.torch)throw new Error('unavailable');const enabled=track.getSettings?.().torch||false;await track.applyConstraints({advanced:[{torch:!enabled}]});return !enabled;}
export function getVideoTrack(){return track;}
