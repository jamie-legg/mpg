# Armagetron Advanced Moviepack Specification

## Overview

A moviepack is a visual enhancement pack for Armagetron Advanced that replaces default textures and graphics with movie-like visuals. The moviepack system is detected by the presence of a `moviepack/settings.cfg` file in the game's data directory.

## Detection

The game detects a moviepack installation by checking for the existence of:
- `data/moviepack/settings.cfg`

If this file exists, `sg_moviepackInstalled` is set to `true`. The moviepack will be used if both:
1. `sg_moviepackInstalled == true` (file exists)
2. `MOVIEPACK == true` (user setting enabled, default: `true`)

## Configuration Settings

All moviepack settings are configured in `moviepack/settings.cfg`. The following settings are available:

### Core Settings

#### `MOVIEPACK` (boolean)
- **Description**: Enable or disable moviepack usage
- **Default**: `true`
- **Type**: Boolean (`0` or `1`)
- **Note**: This setting can also be changed in-game and is stored in `user.cfg`

### Floor Settings

#### `MOVIEPACK_FLOOR_RED` (real)
- **Description**: Red component of the floor color when moviepack is active
- **Default**: `0.5`
- **Type**: Real number (0.0 to 1.0)
- **Range**: `0.0` (no red) to `1.0` (full red)

#### `MOVIEPACK_FLOOR_GREEN` (real)
- **Description**: Green component of the floor color when moviepack is active
- **Default**: `0.5`
- **Type**: Real number (0.0 to 1.0)
- **Range**: `0.0` (no green) to `1.0` (full green)

#### `MOVIEPACK_FLOOR_BLUE` (real)
- **Description**: Blue component of the floor color when moviepack is active
- **Default**: `0.5`
- **Type**: Real number (0.0 to 1.0)
- **Range**: `0.0` (no blue) to `1.0` (full blue)

**Note**: These RGB values are multiplied with the floor texture to tint it. The default values (0.5, 0.5, 0.5) create a neutral gray tint.

#### `GRID_SIZE_MOVIEPACK` (real)
- **Description**: Distance between grid lines on the floor when moviepack is active
- **Default**: `2.0`
- **Type**: Real number (positive)
- **Unit**: Game units
- **Note**: This replaces `GRID_SIZE` when moviepack is active

### Wall Settings

#### `MOVIEPACK_WALL_STRETCH` (real)
- **Description**: Distance between vertical lines on cycle walls when moviepack is active
- **Default**: `4.0`
- **Type**: Real number (positive)
- **Unit**: Game units
- **Note**: Controls the spacing of vertical lines on the directional walls (`dir_wall.png`)

### Rim Wall Settings

Rim walls are the outer boundary walls of the arena.

#### `MOVIEPACK_RIM_WALL_STRETCH_X` (real)
- **Description**: Horizontal extension/stretch of one square of rim wall texture
- **Default**: `50.0`
- **Type**: Real number (positive)
- **Unit**: Game units
- **Note**: Controls how far horizontally one texture square extends. Lower values = more repetition, higher values = less repetition

#### `MOVIEPACK_RIM_WALL_STRETCH_Y` (real)
- **Description**: Vertical extension/stretch of rim wall texture
- **Default**: `50.0`
- **Type**: Real number (positive)
- **Unit**: Game units
- **Note**: Controls how far vertically the texture extends. Lower values = more repetition, higher values = less repetition

**Note**: The rim walls use 4 alternating textures (`rim_wall_a.png`, `rim_wall_b.png`, `rim_wall_c.png`, `rim_wall_d.png`) that cycle based on position.

## Texture Files

All texture files should be placed in the `moviepack/` directory within the game's data directory. Supported image format: PNG

### Required Textures

#### Floor Textures
- **`floor.png`** - Main floor texture (used for menu background and general floor)
- **`floor_a.png`** - Alternate floor texture A (used for checkerboard pattern)
- **`floor_b.png`** - Alternate floor texture B (used for checkerboard pattern)

#### Wall Textures
- **`dir_wall.png`** - Directional wall texture (used for cycle walls)
  - This texture is stretched horizontally based on `MOVIEPACK_WALL_STRETCH`

#### Rim Wall Textures
- **`rim_wall_a.png`** - Rim wall texture variant A
- **`rim_wall_b.png`** - Rim wall texture variant B
- **`rim_wall_c.png`** - Rim wall texture variant C
- **`rim_wall_d.png`** - Rim wall texture variant D
  - These four textures cycle along the rim wall based on position
  - Stretching controlled by `MOVIEPACK_RIM_WALL_STRETCH_X` and `MOVIEPACK_RIM_WALL_STRETCH_Y`

### Optional Textures

#### Sky Textures
- **`sky.png`** - Lower sky texture (fallback to default if not present)
- **`upper_sky.png`** - Upper sky texture (fallback to default if not present)

#### Cycle Textures
- **`bike.png`** - Alternative cycle texture (moviepack-style bike)
- **`cycle_body.png`** - Cycle body texture
- **`cycle_wheel.png`** - Cycle wheel texture

**Note**: If cycle textures are not provided, the game falls back to default textures from the `textures/` directory.

## Configuration File Format

The `moviepack/settings.cfg` file uses the standard Armagetron configuration format:

```
# Moviepack Configuration
# Comments start with #

MOVIEPACK_FLOOR_RED 0.5
MOVIEPACK_FLOOR_GREEN 0.5
MOVIEPACK_FLOOR_BLUE 0.5

GRID_SIZE_MOVIEPACK 2.0

MOVIEPACK_WALL_STRETCH 4.0

MOVIEPACK_RIM_WALL_STRETCH_X 50.0
MOVIEPACK_RIM_WALL_STRETCH_Y 50.0
```

## Behavior Notes

### Sky Behavior
- When moviepack is active, the game uses a black sky (`BlackSky()` returns `true`)
- The upper sky height is clamped to `lower_height` when moviepack is active
- Sky textures (`sky.png`, `upper_sky.png`) are optional and will fall back to defaults if missing

### Floor Behavior
- Floor color is determined by `MOVIEPACK_FLOOR_*` settings when moviepack is active
- Grid size uses `GRID_SIZE_MOVIEPACK` instead of `GRID_SIZE` when moviepack is active
- Floor textures (`floor.png`, `floor_a.png`, `floor_b.png`) are required

### Wall Behavior
- Cycle walls use `dir_wall.png` with horizontal stretching based on `MOVIEPACK_WALL_STRETCH`
- Rim walls cycle through 4 textures (`rim_wall_a.png` through `rim_wall_d.png`) based on position
- Rim wall stretching is controlled by `MOVIEPACK_RIM_WALL_STRETCH_X` and `MOVIEPACK_RIM_WALL_STRETCH_Y`

## Example Configuration

```cfg
# Example Moviepack Configuration

# Floor color - dark blue-gray tint
MOVIEPACK_FLOOR_RED 0.1
MOVIEPACK_FLOOR_GREEN 0.15
MOVIEPACK_FLOOR_BLUE 0.2

# Grid spacing - tighter grid
GRID_SIZE_MOVIEPACK 1.5

# Wall line spacing - closer lines
MOVIEPACK_WALL_STRETCH 3.0

# Rim wall texture stretching
MOVIEPACK_RIM_WALL_STRETCH_X 100.0
MOVIEPACK_RIM_WALL_STRETCH_Y 40.0
```

## File Structure

A complete moviepack should have the following structure:

```
data/
└── moviepack/
    ├── settings.cfg          # Configuration file (required for detection)
    ├── floor.png             # Main floor texture (required)
    ├── floor_a.png           # Floor texture A (required)
    ├── floor_b.png           # Floor texture B (required)
    ├── dir_wall.png          # Cycle wall texture (required)
    ├── rim_wall_a.png        # Rim wall texture A (required)
    ├── rim_wall_b.png        # Rim wall texture B (required)
    ├── rim_wall_c.png        # Rim wall texture C (required)
    ├── rim_wall_d.png        # Rim wall texture D (required)
    ├── sky.png               # Lower sky texture (optional)
    ├── upper_sky.png         # Upper sky texture (optional)
    ├── bike.png              # Cycle texture (optional)
    ├── cycle_body.png        # Cycle body texture (optional)
    └── cycle_wheel.png       # Cycle wheel texture (optional)
```

## Implementation Notes for Frontend Generator

When creating a moviepack generator frontend, consider:

1. **Validation**: Ensure all required texture files are provided
2. **Color Pickers**: Provide RGB color pickers (0.0-1.0 range) for floor colors
3. **Slider Controls**: Use sliders for stretch values with appropriate ranges:
   - `GRID_SIZE_MOVIEPACK`: 0.1 to 10.0 (recommended: 0.5 to 5.0)
   - `MOVIEPACK_WALL_STRETCH`: 0.1 to 20.0 (recommended: 1.0 to 10.0)
   - `MOVIEPACK_RIM_WALL_STRETCH_X`: 1.0 to 500.0 (recommended: 10.0 to 200.0)
   - `MOVIEPACK_RIM_WALL_STRETCH_Y`: 1.0 to 500.0 (recommended: 10.0 to 200.0)
4. **File Upload**: Allow users to upload texture files (PNG format)
5. **Preview**: If possible, show previews of how settings affect visuals
6. **Export**: Generate the `settings.cfg` file with all configured values
7. **Packaging**: Create a zip file containing all textures and the config file

## Related Settings (Non-Moviepack)

For reference, these are the equivalent non-moviepack settings:

- `FLOOR_RED`, `FLOOR_GREEN`, `FLOOR_BLUE` - Floor colors (default: 0.15, 0.3, 0.15)
- `GRID_SIZE` - Grid spacing (default: 1.0)
- `RIM_WALL_STRETCH_X` - Rim wall horizontal stretch (default: 100.0)
- `RIM_WALL_STRETCH_Y` - Rim wall vertical stretch (default: 100.0)
- `RIM_WALL_WRAP_Y` - Rim wall vertical wrapping (0 or 1)

## Version Compatibility

This specification is based on the current Armagetron Advanced codebase. The moviepack system has been stable for many versions, but always test with the target game version.

