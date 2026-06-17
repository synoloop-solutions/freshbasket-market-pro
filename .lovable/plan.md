## Problem

On `/cart` and in the cart drawer, product thumbnails render at full natural size instead of the intended 96px / 64px squares.

Root cause: `ProductImage` hardcodes `h-full w-full` on its wrapper div and appends the caller's `className` after it. The cart passes `h-24 w-24` (and `h-16 w-16`) as className, but since both are Tailwind utilities, the one declared later in the generated stylesheet wins — and `h-full`/`w-full` end up winning, so the wrapper stretches to its container instead of the requested square.

## Fix

Edit `src/components/shared/ProductImage.tsx`:

- Remove the default `h-full w-full` from the wrapper element in the image branch.
- Compose classes with `cn(...)` so the caller's `className` reliably overrides defaults.
- Keep the `<img>` itself at `h-full w-full object-cover` so it fills whatever box the wrapper defines.

No changes needed in callers:
- `ProductCard` already wraps `ProductImage` in a `relative aspect-square` div and passes `className="absolute inset-0"`, which sizes the wrapper correctly.
- Cart page (`h-24 w-24 rounded-md`) and Cart drawer (`h-16 w-16 rounded-md`) will now render at the intended sizes.

## Verification

Reload `/cart` and open the cart drawer; thumbnails should be 96px and 64px squares respectively, with images cropped via `object-cover`. Spot-check the shop grid to confirm `ProductCard` images still fill their square tiles.
