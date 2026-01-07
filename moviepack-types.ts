/**
 * TypeScript type definitions for Armagetron Advanced Moviepack Configuration
 * 
 * This file provides type definitions for building a moviepack generator frontend.
 */

export interface MoviepackConfig {
    /** Enable or disable moviepack usage */
    MOVIEPACK?: boolean;
    
    /** Red component of the floor color (0.0 to 1.0) */
    MOVIEPACK_FLOOR_RED?: number;
    
    /** Green component of the floor color (0.0 to 1.0) */
    MOVIEPACK_FLOOR_GREEN?: number;
    
    /** Blue component of the floor color (0.0 to 1.0) */
    MOVIEPACK_FLOOR_BLUE?: number;
    
    /** Distance between grid lines on the floor (game units) */
    GRID_SIZE_MOVIEPACK?: number;
    
    /** Distance between vertical lines on cycle walls (game units) */
    MOVIEPACK_WALL_STRETCH?: number;
    
    /** Horizontal extension of rim wall texture (game units) */
    MOVIEPACK_RIM_WALL_STRETCH_X?: number;
    
    /** Vertical extension of rim wall texture (game units) */
    MOVIEPACK_RIM_WALL_STRETCH_Y?: number;
  }
  
  export const DEFAULT_CONFIG: Required<MoviepackConfig> = {
    MOVIEPACK: true,
    MOVIEPACK_FLOOR_RED: 0.5,
    MOVIEPACK_FLOOR_GREEN: 0.5,
    MOVIEPACK_FLOOR_BLUE: 0.5,
    GRID_SIZE_MOVIEPACK: 2.0,
    MOVIEPACK_WALL_STRETCH: 4.0,
    MOVIEPACK_RIM_WALL_STRETCH_X: 50.0,
    MOVIEPACK_RIM_WALL_STRETCH_Y: 50.0,
  };
  
  export interface MoviepackTexture {
    name: string;
    required: boolean;
    description: string;
    category: 'floor' | 'wall' | 'rim_wall' | 'sky' | 'cycle';
  }
  
  export const REQUIRED_TEXTURES: MoviepackTexture[] = [
    {
      name: 'floor.png',
      required: true,
      description: 'Main floor texture (used for menu background and general floor)',
      category: 'floor',
    },
    {
      name: 'floor_a.png',
      required: true,
      description: 'Alternate floor texture A (used for checkerboard pattern)',
      category: 'floor',
    },
    {
      name: 'floor_b.png',
      required: true,
      description: 'Alternate floor texture B (used for checkerboard pattern)',
      category: 'floor',
    },
    {
      name: 'dir_wall.png',
      required: true,
      description: 'Directional wall texture (used for cycle walls)',
      category: 'wall',
    },
    {
      name: 'rim_wall_a.png',
      required: true,
      description: 'Rim wall texture variant A',
      category: 'rim_wall',
    },
    {
      name: 'rim_wall_b.png',
      required: true,
      description: 'Rim wall texture variant B',
      category: 'rim_wall',
    },
    {
      name: 'rim_wall_c.png',
      required: true,
      description: 'Rim wall texture variant C',
      category: 'rim_wall',
    },
    {
      name: 'rim_wall_d.png',
      required: true,
      description: 'Rim wall texture variant D',
      category: 'rim_wall',
    },
  ];
  
  export const OPTIONAL_TEXTURES: MoviepackTexture[] = [
    {
      name: 'sky.png',
      required: false,
      description: 'Lower sky texture (fallback to default if not present)',
      category: 'sky',
    },
    {
      name: 'upper_sky.png',
      required: false,
      description: 'Upper sky texture (fallback to default if not present)',
      category: 'sky',
    },
    {
      name: 'bike.png',
      required: false,
      description: 'Alternative cycle texture (moviepack-style bike)',
      category: 'cycle',
    },
    {
      name: 'cycle_body.png',
      required: false,
      description: 'Cycle body texture',
      category: 'cycle',
    },
    {
      name: 'cycle_wheel.png',
      required: false,
      description: 'Cycle wheel texture',
      category: 'cycle',
    },
  ];
  
  export interface ConfigRange {
    min: number;
    max: number;
    default: number;
    step?: number;
    description: string;
  }
  
  export const CONFIG_RANGES: Record<keyof Required<MoviepackConfig>, ConfigRange> = {
    MOVIEPACK: {
      min: 0,
      max: 1,
      default: 1,
      description: 'Enable or disable moviepack usage',
    },
    MOVIEPACK_FLOOR_RED: {
      min: 0.0,
      max: 1.0,
      default: 0.5,
      step: 0.01,
      description: 'Red component of the floor color',
    },
    MOVIEPACK_FLOOR_GREEN: {
      min: 0.0,
      max: 1.0,
      default: 0.5,
      step: 0.01,
      description: 'Green component of the floor color',
    },
    MOVIEPACK_FLOOR_BLUE: {
      min: 0.0,
      max: 1.0,
      default: 0.5,
      step: 0.01,
      description: 'Blue component of the floor color',
    },
    GRID_SIZE_MOVIEPACK: {
      min: 0.1,
      max: 10.0,
      default: 2.0,
      step: 0.1,
      description: 'Distance between grid lines on the floor',
    },
    MOVIEPACK_WALL_STRETCH: {
      min: 0.1,
      max: 20.0,
      default: 4.0,
      step: 0.1,
      description: 'Distance between vertical lines on cycle walls',
    },
    MOVIEPACK_RIM_WALL_STRETCH_X: {
      min: 1.0,
      max: 500.0,
      default: 50.0,
      step: 1.0,
      description: 'Horizontal extension of rim wall texture',
    },
    MOVIEPACK_RIM_WALL_STRETCH_Y: {
      min: 1.0,
      max: 500.0,
      default: 50.0,
      step: 1.0,
      description: 'Vertical extension of rim wall texture',
    },
  };
  
  /**
   * Converts a MoviepackConfig object to Armagetron config file format
   */
  export function configToCfg(config: MoviepackConfig): string {
    const lines: string[] = [];
    
    // Add comment header
    lines.push('# Moviepack Configuration');
    lines.push('# Generated by Moviepack Generator');
    lines.push('');
    
    // Add each setting
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'boolean') {
          lines.push(`${key} ${value ? 1 : 0}`);
        } else {
          lines.push(`${key} ${value}`);
        }
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Parses an Armagetron config file format string into a MoviepackConfig object
   */
  export function cfgToConfig(cfgString: string): MoviepackConfig {
    const config: MoviepackConfig = {};
    const lines = cfgString.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      
      // Parse key-value pairs
      const match = trimmed.match(/^(\w+)\s+(.+)$/);
      if (match) {
        const key = match[1] as keyof MoviepackConfig;
        const value = match[2].trim();
        
        // Check if it's a boolean setting
        if (key === 'MOVIEPACK') {
          config[key] = value === '1' || value.toLowerCase() === 'true';
        } else {
          // Parse as number
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            (config as any)[key] = numValue;
          }
        }
      }
    }
    
    return config;
  }
  
  