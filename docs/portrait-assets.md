# Portrait assets

9144 and 9204 were processed using the built-in Imagegen tool. At the user’s correction, 9207 and 9210 now use native Vision foreground masks applied to the original photo pixels only: no generative retouching, sharpening, relighting or face changes. Reproduce with `scripts/remove-background.swift`. Original photographs remain unchanged in `/Users/a1/Film/รูป/`.

| Input | Website asset |
| --- | --- |
| IMG_9210.JPG | public/images/portraits/portrait-9210-original.png |
| IMG_9207.JPG | public/images/portraits/portrait-9207-original.png |
| IMG_9204.JPG | public/images/portraits/portrait-9204.png |
| IMG_9144.JPG | public/images/portraits/portrait-9144.png |

## Prompt used for each input

Use case: background-extraction. Edit target: the provided photograph. Produce ONE transparent-background photographic cutout of the main young man only, for his personal portfolio hero. Remove all wall, furniture, ground, background people and scenery. Preserve his exact identity, face, expression, hairstyle, glasses, pose, clothing, headphones, watch, camera if present, and accessories. Do not beautify or redesign his face. Gently improve clarity and neutralize the yellow cast while preserving natural skin texture and the actual source details; no invented features. Crop close around the subject with a small transparent margin, keep all visible body parts, no extra body extension. Fine clean hair and glasses edges. Actual alpha transparency, no checkerboard, no shadow, no text.

## Cleanup prompt for 9207

Use case: background-extraction. Remove ONLY the remaining smoky gray/brown halo/background surrounding the man. Every pixel outside his actual physical silhouette must be fully transparent alpha=0, including between arms and body. No shadow, no glow, no feathered opaque background, no black rectangle. Preserve the man pixel-faithfully, his exact face, body, pose, glasses, hair, clothing, headphones, hands, and watch. Output a clean transparent PNG cutout. Do not change the face or retouch the subject further.

## Website configuration

`src/data.js` exports `portraits` in picker order. The first entry is the default; the browser remembers the user's selection with `portfolio-3-portrait`. Each entry can override `height` and `mobileHeight`. The original formal portrait remains an additional option. Thumbnails are resized copies for fast loading; full images retain alpha transparency.
