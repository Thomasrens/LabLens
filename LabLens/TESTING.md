# LabLens test checklist

The following is a pre-deployment test plan. Items marked **Not run** require a real browser/device, permission prompt, printed QR label or hosted HTTPS deployment. They are not claimed as passed merely because the source files were generated.

| Test | Expected result | Status |
|---|---|---|
| Camera allowed | Rear camera starts; preview visible; scan loop runs | Not run — requires HTTPS device test |
| Camera denied | Clear permission message; manual route remains available | Logic implemented; browser test required |
| Model URL empty | Classifier skipped; QR and manual remain available | Configured by default; browser test required |
| Model/CDN missing | Model failure does not block manual selection | Fallback implemented; test with network blocking |
| QR scanning | Known ID opens confirmation; unknown ID shows explicit error | Implemented; requires printed/test QR |
| Manual mode | All valid JSON items appear and can open | Data and rendering implemented; browser test required |
| Multimeter guide | Six steps; safety acknowledgement gates warning steps; quiz and result | Content/schema reviewed; end-to-end browser test required |
| Microscope guide | Six steps; safety acknowledgement gates warning steps; quiz and result | Content/schema reviewed; end-to-end browser test required |
| Bunsen burner guide | Six steps; safety acknowledgement gates warning steps; quiz and result | Content/schema reviewed; end-to-end browser test required |
| Quiz scoring | Correct count and percentage match selected answers | Logic implemented; automated browser test required |
| Dark/light/system theme | Theme changes persist in localStorage | Logic implemented; visual browser test required |
| Reduced motion | CSS animations and transitions are suppressed | CSS and setting implemented; browser test required |
| Offline reload | Cached app shell and JSON load after first visit | Service worker implemented; hosted offline test required |
| 360px phone | Single-column layout; no horizontal overflow; thumb-friendly controls | Responsive CSS supplied; device/emulator test required |
| Tablet/desktop | Centered max-width 520px layout | Responsive CSS supplied; device/emulator test required |
| Feedback CSV | Five answers saved and CSV download created | Logic implemented; browser test required |

## Static checks performed during packaging

- JSON parse and schema checks for all three sample equipment records.
- JavaScript syntax checks for every ES module.
- File-tree and required-file existence checks.
- CSS syntax review and targeted correction of reduced-motion media query.

Run the static checks yourself from the project folder with:

```bash
python -m json.tool data/equipment.json > /dev/null
```

If Node.js is available, syntax-check each JavaScript module with:

```bash
for f in js/*.js; do node --check "$f" || exit 1; done
```

Then run the browser checklist above on Chrome Android, Safari iOS and desktop Chrome/Safari. The source code cannot grant camera permission or emulate a real physical QR label.
