# Moviepack Generator

A simple tool for making your own moviepacks for [Armagetron Advanced](https://www.armagetronad.org/).

If you've ever wanted to customize how the game looks—change the floor, walls, or sky—this is how you do it. Moviepacks have been around since the original Armagetron, and there's a whole community of packs you can check out on the [Armagetron Wiki](https://wiki.armagetronad.org/index.php/Moviepacks_list).

This generator lets you tweak settings and bundle your textures into a ready-to-install zip file.

## What You Can Customize

**Settings:**
- Floor color tint (RGB values that get multiplied with your floor texture)
- Grid line spacing
- Wall texture stretch
- Rim wall stretch (both horizontal and vertical)

**Textures:**
- Floor textures (the game uses a checkerboard pattern with `floor_a.png` and `floor_b.png`)
- Cycle wall texture (`dir_wall.png`)
- Arena boundary walls (`rim_wall_a.png` through `rim_wall_d.png` — these cycle around the rim)
- Optional: sky textures, cycle/bike textures

## Required Textures

You'll need to provide these 8 textures (PNG format):

| File | What it does |
|------|--------------|
| `floor.png` | Main floor texture, also used in menus |
| `floor_a.png` | Checkerboard tile A |
| `floor_b.png` | Checkerboard tile B |
| `dir_wall.png` | The walls your cycle leaves behind |
| `rim_wall_a.png` | Arena boundary (cycles through a→b→c→d) |
| `rim_wall_b.png` | |
| `rim_wall_c.png` | |
| `rim_wall_d.png` | |

## Optional Textures

These will fall back to defaults if you don't include them:

- `sky.png` / `upper_sky.png` — Sky textures
- `bike.png` / `cycle_body.png` / `cycle_wheel.png` — Cycle appearance

## Running the Generator

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Installing Your Moviepack

1. Download the generated `moviepack.zip`
2. Find your Armagetron data directory:
   - **Windows:** `Documents\Armagetron Advanced\` or the game install folder
   - **Linux:** `~/.armagetronad/` or `/usr/share/games/armagetronad/`
   - **macOS:** `~/Library/Application Support/Armagetron Advanced/`
3. Extract so you have a `moviepack` folder containing `settings.cfg` and your textures
4. Launch the game — it should detect the moviepack automatically

If things aren't working, make sure `MOVIEPACK` is set to `1` in your user settings (it's on by default).

## More Info

- [Moviepacks List](https://wiki.armagetronad.org/index.php/Moviepacks_list) — Browse existing moviepacks for inspiration
- [Moviepack Creation Guide](https://wiki.armagetronad.org/index.php/Moviepacks) — Official wiki docs on how moviepacks work
- [Customizing the Game](https://wiki.armagetronad.org/index.php/Customizing_the_game) — General customization guide

## Built With

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JSZip](https://stuk.github.io/jszip/)
