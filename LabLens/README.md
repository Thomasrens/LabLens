# LabLens

LabLens is a no-build, mobile-first laboratory equipment field guide. It combines an optional Teachable Machine image classifier, QR-code identification and a manual equipment library with verified JSON-based instructions, safety acknowledgements, quizzes and a local feedback survey.

## Requirements

- A modern browser (Chrome or Safari recommended).
- HTTPS for camera access, except `localhost` during local development.
- Internet access for Google Fonts and the optional pinned CDN libraries on the first load. The manual guide itself does not require the classifier.
- No Node.js, npm, bundler or framework.

## Run locally

Do not open `index.html` using a `file://` URL: browsers restrict ES modules, fetch and camera access there. Serve the folder over localhost.

**Python (if installed):**

```bash
cd LabLens
python -m http.server 8000
```

Open `http://localhost:8000`. On a phone, use a deployed HTTPS URL or a trusted HTTPS development tunnel; `localhost` on your computer does not make the phone's origin secure.

## Deploy with GitHub Pages

1. Create a GitHub repository, for example `lablens`.
2. Upload the complete contents of this folder, keeping the folder paths unchanged. `index.html` must be at the published root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for the Pages URL to appear. Open it using HTTPS and allow camera access.
6. After changing the service worker or shell files, update `CACHE` in `sw.js` (for example `lablens-shell-v2`) so returning users receive the new shell.

## Deploy with Netlify

1. Sign in to Netlify and choose **Add new site → Deploy manually** (or connect the GitHub repository).
2. Drag the `LabLens` folder into the deploy area, or connect the repository and set the publish directory to the folder containing `index.html`.
3. No build command is required. Publish the site and use the generated HTTPS URL.
4. Test camera permission and offline reload after the first successful online visit.

## Configure the optional image classifier

1. Open [Teachable Machine](https://teachablemachine.withgoogle.com/) and create an **Image Project**.
2. Create one class per equipment item. Use clear class names matching `name` or `id` in `data/equipment.json` (for example `Digital multimeter`, `Compound microscope`, `Bunsen burner`).
3. Collect varied photos per class: aim for at least 100–200 images per class for a student prototype, ideally 200–500, from multiple angles, distances, backgrounds and lighting conditions. Include realistic clutter and different examples. Avoid near-duplicate frames. Keep a separate test set that is not used for training.
4. Train and evaluate the model in Teachable Machine. Export **TensorFlow.js** and upload/host the exported model directory so `model.json`, its weight file(s) and `metadata.json` are reachable over HTTPS.
5. Copy the public model directory URL and set `modelURL` in `js/config.js` to that directory URL, ending with `/`. Example shape: `https://your-host.example/model/`. Do not paste a local file path.
6. Refresh the deployed app. If the model URL is empty, the app silently uses QR and manual selection. If the CDN or model cannot load, manual and QR remain available.
7. The app deliberately requires a human confirmation for every classifier suggestion. A confidence below 0.80 is never automatically accepted. The AI only proposes a label; it does not author instructions or safety information.

## Generate and print QR labels

Each QR code must contain exactly one equipment `id` from the JSON file:

- `digital-multimeter`
- `compound-microscope`
- `bunsen-burner`

Use a reputable QR generator that supports plain text. Enter the ID exactly, export as SVG or a high-resolution PNG, print at a size that scans comfortably (for example 30–40 mm square), and attach the label where it will not cover controls, vents, optics or safety markings. Test each printed label in the deployed scanner. An unknown ID produces an explicit message and does not select an item. Do not place labels on hot, moving, electrical or sterile surfaces where they could create a hazard.

## Add equipment without changing JavaScript

Edit only `data/equipment.json` and add another object to the array. Keep the schema:

```json
{
  "id": "unique-lowercase-id",
  "name": "Equipment name",
  "category": "Category",
  "purpose": "Verified purpose and scope.",
  "difficulty": "Beginner",
  "parts": [
    {"id":"part-a","label":"Part label","x":50,"y":25,"info":"Verified description."}
  ],
  "steps": [
    {"title":"Step title","text":"Verified instruction.","partId":"part-a","warning":null,"durationHint":"30 seconds"}
  ],
  "quiz": [
    {"q":"Question?","options":["Option A","Option B","Option C"],"answer":0,"why":"Verified explanation."}
  ]
}
```

Use unique IDs. Part `x` and `y` coordinates are percentages from 0 to 100 in the silhouette alignment frame. Every step's `partId` must match an existing part. `warning` must be a string or `null`. Each question must have exactly three options and `answer` must be 0, 1 or 2. The validator skips malformed items and logs a readable console error. The content must be reviewed by a qualified instructor or lab technician before use. The sample material is educational and does not replace local SOPs, equipment manuals, risk assessments or supervision.

## Feedback export

The five-item experience survey is saved to the browser's `localStorage` on that device. Choose **Download feedback CSV** on the feedback screen to export saved responses. The survey is SUS-style but is not the standard ten-item SUS instrument and should not be reported as a validated SUS score.

## Offline behaviour

After the first successful online visit, the service worker caches the application shell and equipment JSON. The manual library, guide, quiz and feedback form can then work offline. CDN-hosted classifier/QR/font resources may not be available offline if they were not cached by the browser. Camera access is subject to browser and device policy even when the app shell is cached.

## Safety and recognition limitations

- The camera view and hotspots are not true 3D AR or markerless tracking. Hotspots are fixed percentage positions on a generic alignment silhouette; the user aligns the instrument manually.
- The classifier is an aid, not a safety-critical detector. Similar equipment, poor lighting, occlusion and model bias can cause errors.
- QR identifiers can be copied or misplaced. Confirm the physical instrument and its local procedures.
- The Bunsen burner instructions intentionally require local supervision and institutional ignition/shutdown procedures.
- Never use this application as a substitute for training, an equipment manual, a risk assessment, a supervisor or emergency procedures.
