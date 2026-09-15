# Line-art spike report: tracing Instagram stills to single-weight SVG strokes

**Short answer:** feasible as an underlay, not as a finished drawing. No pipeline gets near the brand mark's geometric, closed, even line. The best automatic output reads as a confident fine-line sketch of the hand, jar, laptop, sign and barrel, and would still need 10 to 30 minutes of vector cleanup per image to feel authored. One of the eight (the folk-night crowd) cannot be traced at all, because the source photo is itself blurred.

**Studio lead's decision after reviewing the comparison sheets:** the traces read as edge detection, not as drawing. The drawn-house site constructs its drawings in code, in the logo's geometric grammar, and uses these traces only as placement guides (see `D:\barnyard-drawn\docs\spec.md`, section 3).

Everything is in `D:\barnyard-source\spikes\lineart\`.

## Environment and exact versions
- Node 25.9.0: sharp 0.35.4, potrace 2.1.8, simplify-js 1.2.4, svgo 4.1.0, onnxruntime-node 1.30.0, @resvg/resvg-js 2.6.2.
- Python 3.14.4 with packages installed locally into `./pydeps` (`python -m pip install --target ./pydeps opencv-contrib-python-headless scikit-image scipy`): opencv-contrib-python-headless 5.0.0.93 (with ximgproc), scikit-image 0.26.0, scipy 1.18.1, numpy 2.5.3.
- Models in `models/` (CPU):
  - `id-lineart-rocca.onnx`: rocca/informative-drawings-line-art-onnx, 17 MB, any input size
  - `id-opensketch.onnx`: backnotprop/informative-drawings-image-to-opensketch-onnx, any input size
  - `id-contour-768.onnx`, `id-anime-768.onnx`, `id-contour-512.onnx`: x-Liola-x/informative-drawings-onnx, fixed square inputs
  - `sed-model.yml.gz`: OpenCV structured-edge forest
  - `rmbg14-q.onnx`: briaai/RMBG-1.4, quantised, 44 MB
- autotrace not tried (Windows release is an installer only); a custom centreline tracer was written instead.
- Disk: models 344 MB, pydeps 393 MB, node_modules 358 MB.

## Scripts (`scripts/`)
All produce a black-on-white line map at 1080 px wide in `work/`; one shared vectoriser turns every map into strokes.
- `a-xdog.mjs` (A): greyscale, median, optional CLAHE, XDoG in JS, hard threshold.
- `b-onnx.mjs` (B): Informative Drawings via onnxruntime-node; styles `lineart`, `opensketch`, `contour`, `contour512`, `anime`; options `--size`, `--thr`.
- `c-sed.py` (C): `--mode=sed` structured edges with non-maximum suppression and hysteresis; `--mode=seg` mean-shift plus Felzenszwalb boundaries.
- `combine.mjs`: consensus, keeping map A's pixels only where map B has an edge within N px.
- `mask-rmbg.mjs`: RMBG-1.4 subject mask.
- `vectorize.mjs`: centreline tracer (small-component removal, Zhang-Suen thinning, skeleton walk into polylines, tangent-aligned joins, smoothing, Douglas-Peucker, short-fragment drop, optional keep-longest share, Catmull-Rom output, one path per stroke, longest first).
- `run.mjs`: vectorise, svgo (mergePaths off), resvg preview, stats in `out/stats.json`; options `--mask --maskThr --maskOutline --keep --minLen --join --tol --stroke`.
- Also `potrace-outline.mjs`, `sheet.mjs`, `stats-table.mjs`, `debug-b.mjs`.

Outputs: 150 SVGs in `out/<name>.<variant>.svg`; 181 PNGs in `shots/` including `sheet-*.png`. SVGs are stroke only, 1.5 px, round caps and joins, 1080-wide viewBox, separate paths.

## Commands for the finalist variants (run in Git Bash from the spike folder)
```
node scripts/a-xdog.mjs --tag=A2 --sigma=2.5 --eps=-0.012 --clahe=0 --median=5 && node scripts/run.mjs A2
node scripts/b-onnx.mjs --style=lineart --size=1024 --thr=0.8 --tag=B-lineart-t80
node scripts/b-onnx.mjs --style=opensketch --size=1024 --thr=0.6 --tag=B-opensketch-t60 && node scripts/run.mjs B-opensketch-t60
python scripts/c-sed.py                                    # C-sed: scale 0.5, hi 0.25, lo 0.08
python scripts/c-sed.py --tag=C-sed2 --scale=0.35 --hi=0.3 --lo=0.05 && node scripts/run.mjs C-sed2 --join=14 --close=1 --minLen=50
node scripts/combine.mjs --a=B-lineart-t80 --b=C-sed --radius=4 --tag=BxC && node scripts/run.mjs BxC --join=8 --minLen=40
node scripts/run.mjs B-lineart-t80 --out=B-lineart-t80-keep70 --keep=0.7 --minLen=40 --join=8
node scripts/mask-rmbg.mjs --names=late-laptop-plants && node scripts/run.mjs B-contour --mask --maskThr=60 --maskOutline=false --names=late-laptop-plants
node scripts/stats-table.mjs A2,B-lineart-t80-keep70,B-opensketch-t60,BxC,C-sed2
```
CPU per image: B 1.2 to 1.7 s at 1024 px; C-sed 0.15 to 0.35 s; C-seg 3 to 10 s; A about 0.3 s; vectorise, svgo and render 0.2 to 0.5 s.

## What each pipeline looks like
- **A (XDoG):** clean only on high-contrast graphics (BOWL letters, the pin); nothing on the blurred crowd; brick and JPEG blocks become dashes; strokes stutter into fragments.
- **B (Informative Drawings):** `lineart` at 1024 px, threshold 0.8 is the most authored on people and objects (hand, knuckles, watch, jar with brush); too faint at the default 0.5; over-draws foliage, brick and ceiling strips as scribble. `contour` is complete but noisy (up to 4,600 paths); `opensketch` is the sparsest learned style and reads as architecture.
- **C (structured edges):** sparsest, most architectural, fewest paths (mean 49); loses small objects. Segmentation mode rejected.
- **BxC (consensus):** best balance on busy scenes; keeps 17 to 53% of B's pixels, removes most brick and plant noise, loses some fine detail.
- **potrace:** double outlines when stroked; unsuitable.
- **RMBG mask:** unreliable as a subject selector here; a hand-painted mask, a crop or keep-longest works better.

## Per-image verdicts (after svgo)
| image | winner | paths | length px | svgo KB | gzip KB | notes |
|---|---|---:|---:|---:|---:|---|
| host-garba-crowd | none | (C-sed2: 45) | 6064 | 5.1 | 2.2 | Blurred source with white bars; no dancers recoverable. |
| host-hoodie-painting | B-lineart-t80-keep70 | 44 | 11039 | 7.2 | 3.2 | Jar, brush, glove silhouette, brush stack read; glove has no fingers; date caption blanked. |
| late-laptop-plants | B-lineart-t80-keep70 | 113 | 15951 | 14.0 | 5.9 | Best result: hand, watch, laptop, bottle; palm becomes hatching. |
| courtyard-vines | C-sed2 (underlay) | 69 | 10365 | 6.6 | 2.9 | Beams, rail, table clean; the vines are scribble or missing and must be drawn. |
| entry-ceiling | BxC | 191 | 20633 | 18.4 | 7.5 | Stair, barrel, chairs read; the strip ceiling becomes jagged polygons. |
| bowl-sign | B-lineart-t80-keep70 | 34 | 10788 | 4.9 | 2.2 | Letters, pin, posts, board; caption blanked. |
| lamp-table | B-opensketch-t60 | 253 | 18319 | 21.8 | 8.7 | This file is the logo sign with vines (same bytes as sign-corten.jpg); use the real logo vector. |
| green-sofa | BxC | 114 | 14502 | 11.5 | 4.8 | Frame, ballerina, sofa outline; tufting lost. |

Mean per variant: C-sed2 49 paths, 5.7 KB; BxC 98 paths, 9.9 KB; B-contour-keep60 72 paths, 15.3 KB; A2 208 paths, 17.7 KB; B-opensketch-t60 304 paths, 26.2 KB; B-lineart-t80-keep70 206 paths, 31.4 KB.

## Recommended use as a guide layer
1. Blank Instagram captions and bars (ignore rectangles in `common.mjs` and `c-sed.py`); crop to the part that tells the story.
2. B `lineart` at long side 1024, threshold 0.8; C-sed at scale 0.5, bilateral on, hi 0.25, lo 0.08.
3. Close-ups: B-lineart keep 0.7. Rooms: BxC radius 4.
4. Vectorise: minArea 24, join 8, smooth 2, tol 1.4, minLen 40, stroke 1.5.

## Honest limits
- Output is open, slightly wobbly, fragmented polylines (50 to 300 per image), not the logo's closed geometric construction.
- No usable faces; crowds fail; hands only in close-up; dark areas vanish; foliage becomes scribble in every pipeline.
- A 1.5 px stroke in a 1080-wide viewBox is about 0.5 px on a 390 px phone; scale strokes or use `vector-effect="non-scaling-stroke"`.
- sharp gotcha: resizing a 1-channel raw buffer returns 3 channels; add `.extractChannel(0)`.
