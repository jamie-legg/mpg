"use client";

import { useState, useCallback } from "react";
import JSZip from "jszip";
import {
  MoviepackConfig,
  DEFAULT_CONFIG,
  REQUIRED_TEXTURES,
  OPTIONAL_TEXTURES,
  CONFIG_RANGES,
  configToCfg,
  MoviepackTexture,
} from "../../moviepack-types";

type TextureFiles = Record<string, File | null>;

export default function Home() {
  const [config, setConfig] = useState<MoviepackConfig>({ ...DEFAULT_CONFIG });
  const [textures, setTextures] = useState<TextureFiles>({});
  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Check if all required textures are uploaded
  const allRequiredUploaded = REQUIRED_TEXTURES.every(
    (tex) => textures[tex.name] !== undefined && textures[tex.name] !== null
  );

  // Convert 0-1 range to hex color for the color picker
  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert hex color to 0-1 range RGB values
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0.5, g: 0.5, b: 0.5 };
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    };
  };

  const handleColorChange = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    setConfig((prev) => ({
      ...prev,
      MOVIEPACK_FLOOR_RED: Math.round(r * 100) / 100,
      MOVIEPACK_FLOOR_GREEN: Math.round(g * 100) / 100,
      MOVIEPACK_FLOOR_BLUE: Math.round(b * 100) / 100,
    }));
  };

  const handleSliderChange = (key: keyof MoviepackConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleTextureUpload = useCallback(
    (textureName: string, file: File | null) => {
      setTextures((prev) => ({ ...prev, [textureName]: file }));
    },
    []
  );

  const handleExport = async () => {
    if (!allRequiredUploaded) return;

    setIsExporting(true);
    try {
      const zip = new JSZip();
      const moviepackFolder = zip.folder("moviepack");

      if (!moviepackFolder) {
        throw new Error("Failed to create moviepack folder");
      }

      // Add settings.cfg
      const cfgContent = configToCfg(config);
      moviepackFolder.file("settings.cfg", cfgContent);

      // Add all uploaded textures
      for (const [name, file] of Object.entries(textures)) {
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          moviepackFolder.file(name, arrayBuffer);
        }
      }

      // Generate and download the zip
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "moviepack.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const currentColor = rgbToHex(
    config.MOVIEPACK_FLOOR_RED ?? 0.5,
    config.MOVIEPACK_FLOOR_GREEN ?? 0.5,
    config.MOVIEPACK_FLOOR_BLUE ?? 0.5
  );

  const uploadedCount = REQUIRED_TEXTURES.filter(
    (tex) => textures[tex.name]
  ).length;

  return (
    <div className="min-h-screen bg-[#111113] text-[#e8e8e8] font-mono">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl tracking-[0.3em] font-light mb-4 uppercase">
            Moviepack Generator
          </h1>
          <p className="text-[#aaa] tracking-wide text-sm max-w-lg mx-auto leading-relaxed">
            Make your own visual pack for Armagetron Advanced. Tweak the settings, 
            drop in your textures, and download a ready-to-install zip.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <a
              href="https://wiki.armagetronad.org/index.php/Moviepacks_list"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#e8e8e8] transition-colors"
            >
              browse existing packs →
            </a>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-[#888] hover:text-[#e8e8e8] transition-colors"
            >
              {showHelp ? "hide help ↑" : "how to install →"}
            </button>
          </div>
        </header>

        {/* Help Section */}
        {showHelp && (
          <section className="mb-12 p-6 border border-[#3a3a3a] text-sm leading-relaxed">
            <h2 className="text-xs tracking-[0.2em] uppercase mb-4 text-[#aaa]">
              Installing Your Moviepack
            </h2>
            <ol className="space-y-3 text-[#aaa]">
              <li>
                <span className="text-[#888] mr-2">1.</span>
                Download the zip after uploading your textures
              </li>
              <li>
                <span className="text-[#888] mr-2">2.</span>
                Find your Armagetron data folder:
                <ul className="mt-2 ml-5 space-y-1 text-[#aaa] text-xs">
                  <li>Windows: <code className="bg-[#1a1a1a] px-1">Documents\Armagetron Advanced\</code></li>
                  <li>Linux: <code className="bg-[#1a1a1a] px-1">~/.armagetronad/</code></li>
                  <li>macOS: <code className="bg-[#1a1a1a] px-1">~/Library/Application Support/Armagetron Advanced/</code></li>
                </ul>
              </li>
              <li>
                <span className="text-[#888] mr-2">3.</span>
                Extract the zip so you have a <code className="bg-[#1a1a1a] px-1">moviepack</code> folder with your textures inside
              </li>
              <li>
                <span className="text-[#888] mr-2">4.</span>
                Launch the game — it should pick up the moviepack automatically
              </li>
            </ol>
            <p className="mt-4 text-[#888] text-xs">
              Need more help? Check the{" "}
              <a
                href="https://wiki.armagetronad.org/index.php/Customizing_the_game"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#aaa] hover:text-[#e8e8e8] transition-colors"
              >
                customization guide
              </a>{" "}
              on the wiki.
            </p>
          </section>
        )}

        {/* Main Content */}
        <div className="space-y-12">
          {/* Settings Section */}
          <section>
            <SectionTitle>Settings</SectionTitle>
            <p className="text-[#888] text-xs mb-6 -mt-4">
              These control how your textures appear in-game. The defaults work fine if you&apos;re not sure.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Floor Settings */}
              <SettingsCard title="FLOOR" hint="The arena surface">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs tracking-wider text-[#aaa] mb-3 uppercase">
                      Color Tint
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="color-picker"
                      />
                      <span className="text-xs text-[#888] font-mono">
                        multiplies with your floor texture
                      </span>
                    </div>
                  </div>

                  <SliderControl
                    label="Grid Size"
                    hint="spacing between grid lines"
                    value={config.GRID_SIZE_MOVIEPACK ?? 2.0}
                    range={CONFIG_RANGES.GRID_SIZE_MOVIEPACK}
                    onChange={(v) => handleSliderChange("GRID_SIZE_MOVIEPACK", v)}
                  />
                </div>
              </SettingsCard>

              {/* Wall Settings */}
              <SettingsCard title="WALLS" hint="Cycle trails and arena boundary">
                <div className="space-y-6">
                  <SliderControl
                    label="Wall Stretch"
                    hint="texture repeat on cycle walls"
                    value={config.MOVIEPACK_WALL_STRETCH ?? 4.0}
                    range={CONFIG_RANGES.MOVIEPACK_WALL_STRETCH}
                    onChange={(v) => handleSliderChange("MOVIEPACK_WALL_STRETCH", v)}
                  />

                  <SliderControl
                    label="Rim X Stretch"
                    hint="horizontal repeat on arena edge"
                    value={config.MOVIEPACK_RIM_WALL_STRETCH_X ?? 50.0}
                    range={CONFIG_RANGES.MOVIEPACK_RIM_WALL_STRETCH_X}
                    onChange={(v) =>
                      handleSliderChange("MOVIEPACK_RIM_WALL_STRETCH_X", v)
                    }
                  />

                  <SliderControl
                    label="Rim Y Stretch"
                    hint="vertical repeat on arena edge"
                    value={config.MOVIEPACK_RIM_WALL_STRETCH_Y ?? 50.0}
                    range={CONFIG_RANGES.MOVIEPACK_RIM_WALL_STRETCH_Y}
                    onChange={(v) =>
                      handleSliderChange("MOVIEPACK_RIM_WALL_STRETCH_Y", v)
                    }
                  />
                </div>
              </SettingsCard>
            </div>
          </section>

          {/* Textures Section */}
          <section>
            <SectionTitle>
              Textures
              <span className="text-[#aaa] font-normal ml-3">
                {uploadedCount}/{REQUIRED_TEXTURES.length} required
              </span>
            </SectionTitle>
            <p className="text-[#888] text-xs mb-6 -mt-4">
              All textures should be PNG files. The floor uses a checkerboard pattern, and the rim wall 
              cycles through all four textures around the arena.
            </p>

            {/* Required Textures */}
            <div className="mb-8">
              <h3 className="text-xs tracking-wider text-[#aaa] mb-4 uppercase">
                Required — you need all of these
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {REQUIRED_TEXTURES.map((tex) => (
                  <TextureUpload
                    key={tex.name}
                    texture={tex}
                    file={textures[tex.name] ?? null}
                    onUpload={handleTextureUpload}
                  />
                ))}
              </div>
            </div>

            {/* Optional Textures */}
            <div>
              <h3 className="text-xs tracking-wider text-[#aaa] mb-4 uppercase">
                Optional — falls back to defaults if missing
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {OPTIONAL_TEXTURES.map((tex) => (
                  <TextureUpload
                    key={tex.name}
                    texture={tex}
                    file={textures[tex.name] ?? null}
                    onUpload={handleTextureUpload}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Export Section */}
          <section className="pt-8">
            <button
              onClick={handleExport}
              disabled={!allRequiredUploaded || isExporting}
              className="w-full py-5 border border-[#3a3a3a] text-sm tracking-[0.2em] uppercase
                transition-all
                disabled:opacity-30 disabled:cursor-not-allowed
                enabled:hover:border-[#e8e8e8] enabled:hover:bg-[#e8e8e8] enabled:hover:text-[#111113]"
            >
              {isExporting ? "generating..." : "download moviepack"}
            </button>
            {!allRequiredUploaded && (
              <p className="mt-4 text-center text-xs text-[#888]">
                upload all 8 required textures to enable download
              </p>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-[#3a3a3a] text-center space-y-3">
          <p className="text-xs text-[#888]">
            for{" "}
            <a
              href="https://www.armagetronad.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#aaa] hover:text-[#e8e8e8] transition-colors"
            >
              armagetron advanced
            </a>
          </p>
          <p className="text-xs text-[#777]">
            looking for inspiration?{" "}
            <a
              href="https://wiki.armagetronad.org/index.php/Moviepacks_list"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#e8e8e8] transition-colors"
            >
              check out other moviepacks
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Section Title Component
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs tracking-[0.2em] uppercase mb-6 pb-2 border-b border-[#3a3a3a]">
      {children}
    </h2>
  );
}

// Settings Card Component
function SettingsCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 border border-[#3a3a3a]">
      <div className="mb-6">
        <h3 className="text-xs tracking-[0.15em] text-[#aaa]">{title}</h3>
        {hint && <p className="text-[10px] text-[#777] mt-1">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

// Slider Control Component
function SliderControl({
  label,
  hint,
  value,
  range,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  range: { min: number; max: number; step?: number; description: string };
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs tracking-wider text-[#aaa] uppercase">
          {label}
        </label>
        <span className="text-xs text-[#e8e8e8] font-mono">{value.toFixed(1)}</span>
      </div>
      {hint && <p className="text-[10px] text-[#777] mb-3">{hint}</p>}
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step ?? 0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider w-full"
      />
    </div>
  );
}

// Texture Upload Component
function TextureUpload({
  texture,
  file,
  onUpload,
}: {
  texture: MoviepackTexture;
  file: File | null;
  onUpload: (name: string, file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    onUpload(texture.name, selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpload(texture.name, null);
    setPreview(null);
  };

  return (
    <div className="relative group">
      <label
        className={`block aspect-square border cursor-pointer transition-all
          ${
            file
              ? "border-[#e8e8e8]"
              : "border-[#3a3a3a] hover:border-[#444]"
          }`}
        title={texture.description}
      >
        <input
          type="file"
          accept="image/png"
          onChange={handleChange}
          className="sr-only"
        />
        {preview ? (
          <img
            src={preview}
            alt={texture.name}
            className="w-full h-full object-contain bg-black/50"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl text-[#444]">+</span>
          </div>
        )}
      </label>
      <p className="mt-2 text-[10px] text-[#888] truncate">{texture.name}</p>
      {file && (
        <button
          onClick={handleRemove}
          className="absolute top-1 right-1 w-5 h-5 bg-[#111] border border-[#3a3a3a] text-[#aaa] text-xs
            opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#e8e8e8] hover:text-[#e8e8e8]"
        >
          ×
        </button>
      )}
    </div>
  );
}
