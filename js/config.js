/* Central configuration for optional recognition and application behaviour. */
export const CONFIG = {
  modelURL: '', // Paste the Teachable Machine model.json URL here, ending in /
  classifierIntervalMs: 250,
  confidenceThreshold: 0.8,
  camera: { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
  storageKeys: { settings: 'lablens-settings-v1', feedback: 'lablens-feedback-v1' }
};
