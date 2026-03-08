# luci-theme-glass

A modern glassmorphism theme for OpenWrt's LuCI web interface, inspired by Apple's visionOS and macOS design language. Every panel, sidebar, button, and input is built with true frosted-glass effects — translucent backgrounds, multi-stop gradients, backdrop blur, and subtle inset highlights.

![License](https://img.shields.io/badge/license-GPL--3.0%20%2F%20Commercial-blue.svg)
![OpenWrt](https://img.shields.io/badge/OpenWrt-23.05%2B-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/rchen14b)

## Screenshots

| Login | Overview (Light) |
|:---:|:---:|
| ![Login](screenshots/Login_page_light.png) | ![Overview Light](screenshots/Overview_page_light.png) |

| Overview (Dark) | Software |
|:---:|:---:|
| ![Overview Dark](screenshots/Overview_page_dark.png) | ![Software](screenshots/Software_page_light.png) |

| Traffic Graph |
|:---:|
| ![Traffic](screenshots/Traffic_graph_light.png) |

## Features

### Design
- **True glassmorphism** — Multi-stop gradient overlays with `backdrop-filter: blur() saturate()`, translucent backgrounds, inset glow highlights, and 0.5px glass borders throughout the entire UI
- **Glass buttons** — All buttons use the glass-ui pattern: neutral buttons are translucent glass, primary buttons are blue-tinted glass, danger buttons are red-tinted glass — no solid-color buttons anywhere
- **Frosted sidebar** — Fixed sidebar with 30px blur, multi-directional gradient, and inset light diffusion
- **Glass header bar** — Top navigation bar with glass pill badges for page title and status indicators
- **Glass login card** — Frosted login page with translucent inputs and glass-styled submit button

### Theming
- **Auto / Light / Dark mode** — One-click theme toggle in the header bar cycles through three modes: **Auto** (follows your OS `prefers-color-scheme` setting), **Light** (force light), and **Dark** (force dark). Available on every page including the login screen. Preference is saved in `localStorage` and survives browser restarts
- **Dark mode glass** — Dark variant uses lower-opacity gradients (`rgba(255,255,255,0.05-0.08)`) with adjusted shadows for a subtle glass look on dark backgrounds
- **Server-side default** — Set the default mode via UCI config (`option mode 'dark'`, `'light'`, or `'normal'` for auto). Client-side toggle overrides the server default per browser
- **Configurable accent color** — Primary color, blur radius, and glass transparency are all adjustable via UCI config
- **Custom wallpapers** — Drop an image or video into the background folder and it becomes the page backdrop, visible through every glass panel

### Layout
- **Responsive** — Desktop sidebar collapses to a slide-out drawer on mobile with hamburger toggle and overlay
- **Sub-navigation bar** — CBI tab menus are lifted into a secondary glass bar below the header, keeping content area clean
- **Sticky header** — Fixed header with smooth transitions when sidebar state changes

### Compatibility
- **Full LuCI coverage** — Styles all CBI components: sections, tables, forms, dropdowns, checkboxes, textareas, progress bars, tooltips, modals, and tab menus
- **Page-specific fixes** — Overrides inline CSS from LuCI view JS files (software/package manager page layout, port status grid, network status cards)
- **OpenWrt 23.05+** — Uses ucode `.ut` templates (the modern LuCI template engine)
- **No external dependencies** — Pure CSS glassmorphism, no JavaScript frameworks required

## Installation

### From release (recommended)

Download the latest `.ipk` from [Releases](../../releases) and install:

```sh
opkg install luci-theme-glass_*.ipk
```

### From source

```sh
# Add to your OpenWrt build tree
cd /path/to/openwrt
git clone https://github.com/user/luci-theme-glass.git package/luci-theme-glass

# Build
make package/luci-theme-glass/compile V=s
```

### Manual install (development)

```sh
# Copy theme files to router
scp -r htdocs/luci-static/glass/ root@router:/www/luci-static/glass/
scp htdocs/luci-static/resources/menu-glass.js root@router:/www/luci-static/resources/
scp -r ucode/template/themes/glass/ root@router:/usr/share/ucode/luci/template/themes/glass/

# Register and activate the theme
ssh root@router "uci set luci.themes.Glass=/luci-static/glass && \
  uci set luci.main.mediaurlbase=/luci-static/glass && \
  uci commit luci"
```

## Configuration

After installation, select **Glass** in **System > System > Language and Style**.

### Theme config

Create `/etc/config/glass` on the router for advanced customization:

```
config global
    option mode 'normal'
    option primary '#007AFF'
    option dark_primary '#0A84FF'
    option blur '20'
    option transparency '0.72'
    option blur_dark '25'
    option transparency_dark '0.30'
```

| Option | Default | Description |
|--------|---------|-------------|
| `mode` | `normal` | `normal` (auto light/dark), `dark`, or `light` |
| `primary` | `#007AFF` | Accent color (light mode) |
| `dark_primary` | `#0A84FF` | Accent color (dark mode) |
| `blur` | `20` | Backdrop blur radius in px (light mode) |
| `transparency` | `0.72` | Glass panel opacity 0-1 (light mode) |
| `blur_dark` | `25` | Backdrop blur radius in px (dark mode) |
| `transparency_dark` | `0.30` | Glass panel opacity 0-1 (dark mode) |

### Custom wallpapers

Place a background file named `bg.*` in `/www/luci-static/glass/background/` on the router.

Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.mp4`, `.webm`

The background is visible through all glass panels, giving the theme its signature frosted look.

## Development

### Prerequisites

- Node.js with `lessc`: `npm install -g less`

### Building CSS

```sh
# Main stylesheet
lessc less/cascade.less htdocs/luci-static/glass/css/cascade.css

# Dark mode overrides
lessc less/dark.less htdocs/luci-static/glass/css/dark.css
```

### Project structure

```
luci-theme-glass/
├── Makefile                              # OpenWrt package build
├── htdocs/luci-static/
│   ├── glass/
│   │   ├── css/                          # Compiled CSS output
│   │   ├── img/                          # Theme logo and icons
│   │   └── background/                   # User wallpapers (bg.jpg, etc.)
│   └── resources/
│       └── menu-glass.js                 # Client-side menu renderer
├── less/                                 # LESS source
│   ├── cascade.less                      # Master import file
│   ├── variables.less                    # CSS custom properties (design tokens)
│   ├── normalize.less                    # CSS reset
│   ├── glass.less                        # Glassmorphism mixins
│   ├── layout.less                       # Sidebar, header, footer, content
│   ├── components.less                   # CBI forms, tables, buttons, alerts
│   ├── sysauth.less                      # Login page
│   ├── page-fix.less                     # LuCI page-specific overrides
│   ├── dark.less                         # Dark mode overrides
│   └── responsive.less                   # Mobile breakpoints
├── ucode/template/themes/glass/          # Server-side ucode templates
│   ├── header.ut                         # HTML head + sidebar + header
│   ├── header_login.ut                   # Login page variant
│   ├── footer.ut                         # Footer + scripts
│   ├── footer_login.ut                   # Login footer variant
│   └── sysauth.ut                        # Login page
├── root/                                 # Files installed to device root
│   ├── etc/uci-defaults/                 # First-boot theme registration
│   └── usr/share/rpcd/acl.d/            # ACL permissions
└── screenshots/                          # Beta release screenshots
```

### Design system

All design tokens are defined as CSS custom properties in `variables.less`. The glass effects use three LESS mixins:

| Mixin | Use | Blur | Opacity |
|-------|-----|------|---------|
| `.glass-effect()` | Standard panels, cards | `var(--glass-blur)` | `var(--glass-bg)` |
| `.glass-frosted()` | Sidebar, login card | 30px | Higher |
| `.glass-subtle()` | Secondary elements | Lower | Minimal |

Buttons follow the [glass-ui](https://github.com/crenspire/glass-ui) pattern:

```css
/* Glass button base */
background-image: linear-gradient(135deg,
  rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.12) 25%,
  rgba(240,248,255,0.13) 50%, rgba(255,255,255,0.11) 75%,
  rgba(230,240,255,0.12) 100%);
background-color: transparent;
backdrop-filter: blur(10px) saturate(180%);
border: 0.5px solid rgba(255,255,255,0.12);
```

### Version bump checklist

When releasing a new version, update these files:

1. `Makefile` — `PKG_VERSION`
2. `README.md` — version badge
3. `ucode/template/themes/glass/sysauth.ut` — login version text
4. `ucode/template/themes/glass/header.ut` — sidebar version text
5. `ucode/template/themes/glass/footer.ut` — footer version text

## Credits

- Architecture inspired by [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon)
- Glass effects based on [glass-ui](https://github.com/crenspire/glass-ui)
- Design language inspired by Apple's visionOS and macOS

## License

This project is dual-licensed:

- **Open Source**: [GNU General Public License v3.0](LICENSE) — free for personal, educational, and open-source use. Any derivative work must also be released under GPL-3.0.
- **Commercial**: For proprietary/closed-source commercial use, a separate commercial license is required. Contact the author for details.
