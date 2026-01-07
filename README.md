# Moviepack Generator

A web-based tool for creating custom visual packs (moviepacks) for [Armagetron Advanced](https://www.armagetronad.org/).

## Features

- **Configure Settings**: Adjust floor color tint, grid size, wall stretch, and rim wall stretch values
- **Upload Textures**: Add required and optional texture files (PNG format)
- **Export**: Download a ready-to-use `moviepack.zip` containing `settings.cfg` and all textures

## Required Textures

| Texture | Description |
|---------|-------------|
| `floor.png` | Main floor texture |
| `floor_a.png` | Alternate floor texture A (checkerboard) |
| `floor_b.png` | Alternate floor texture B (checkerboard) |
| `dir_wall.png` | Directional wall texture (cycle walls) |
| `rim_wall_a.png` | Rim wall variant A |
| `rim_wall_b.png` | Rim wall variant B |
| `rim_wall_c.png` | Rim wall variant C |
| `rim_wall_d.png` | Rim wall variant D |

## Optional Textures

- `sky.png` - Lower sky texture
- `upper_sky.png` - Upper sky texture
- `bike.png` - Cycle texture
- `cycle_body.png` - Cycle body texture
- `cycle_wheel.png` - Cycle wheel texture

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the generator.

## Installation

Extract the generated `moviepack.zip` contents into your Armagetron Advanced data directory:

```
data/
└── moviepack/
    ├── settings.cfg
    ├── floor.png
    ├── floor_a.png
    ├── floor_b.png
    ├── dir_wall.png
    ├── rim_wall_a.png
    ├── rim_wall_b.png
    ├── rim_wall_c.png
    └── rim_wall_d.png
```

## Built With

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JSZip](https://stuk.github.io/jszip/)
