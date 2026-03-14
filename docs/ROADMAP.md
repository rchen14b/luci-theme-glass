# Roadmap — luci-theme-glass

## Completed (v1.0.2)
- ~~**Sidebar animations** — Animate menu expand/collapse~~ — Staggered slide-in with fade for sub-items, spring-easing arrow rotation
- ~~**Sliding selector** — Glass highlight slides between active sub-items~~ — Frosted slider with dark/light mode variants
- ~~**Sidebar click fix** — Parent menu expands without navigating away~~ — `preventDefault()` on parent click
- ~~**Page transitions** — Subtle fade/slide animations when navigating between pages~~ — Fade-out on click + slide-up on load for content area
- ~~**Tab duplication fix** — Save & Apply caused horizontal sub-nav tabs to double~~ — Clear menu containers before re-render
- ~~**Header/sub-nav sliding selector** — Glass slider for top nav, header tabs, and CBI sub-tabs~~ — Shared `addTabSlider` helper with MutationObserver guard
- ~~**JS view loading polish** — Hide LuCI spinner, fade-in view content~~ — `display: none` on `.spinning`, `page-enter` animation on `#view` children
- ~~**Header title fix** — Title disappeared on pages with deep tabs~~ — Selectidive element removal instead of `innerHTML` clear
- ~~**Indicator separator** — Visual divider between refresh indicator and theme toggle~~ — CSS border-left on adjacent elements

## Completed (v1.0.3)
- ~~**Modal width & scroll** — Wireless Edit and Attended Sysupgrade dialogs too narrow~~ — 900px for `.cbi-modal`/`.uci-dialog`, overflow scroll, `max-height: calc(100vh - 4em)`
- ~~**Button color diversity** — Differentiate Save from Save & Apply~~ — Blue (Apply), green (Save), red (Reset) — 3 distinct glass styles
- ~~**Log area height** — `#syslog` max-height too short~~ — Viewport-relative `calc(100vh - 350px)`
- ~~**Content width** — Remove `max-width: 1200px` cap~~ — Content fills available space like Argon
- ~~**Font sizing** — Switch from `px` to `rem` units~~ — `--font-size-sm` bumped 12px→13px to match Argon/Bootstrap density
- ~~**APK package format** — Fix "v2 package format error"~~ — Use `apk mkpkg` via Docker for proper ADB v3 format, `arch: noarch`
- ~~**Modal not showing** — Upload package and other dialogs broken~~ — `modal-overlay-active` class is on `<body>`, not `#modal_overlay`
- ~~**Interface box stretch** — `.ifacebox` stretched full width in table cells~~ — `display: inline-flex` matching Argon/Bootstrap
- ~~**Interface box glass** — Zone-colored headers as tinted glass instead of opaque~~ — `rgba(zone-color, 0.50)` with rounded top corners
- ~~**Sidebar font density** — Parent/sub-item fonts too small~~ — Parent items bumped to `--font-size-lg`, sub-items to `--font-size-base`
- ~~**Theme preview site** — GitHub Pages demo showing the theme without a router~~ — Interactive demo at rchen14b.github.io/luci-theme-glass

## Completed (v1.0.4)
- ~~**Multi-level CBI tab support** — DNS and similar plugins with nested tabmenus mixed all tabs into one flat bar~~ — Only move top-level CBI tabs to sub-nav; nested tabs (e.g. Hostnames/SRV/MX) stay in-content with glass styling
- ~~**Menu-tree tab rendering** — Firewall and other plugins with depth-3 menu items didn't render in sub-nav~~ — `renderTabMenu` now targets `#header-sub` with `.sub-tab` class and sliding selector
- ~~**Tab system conflict prevention** — CBI tab mover in footer.ut overwrote menu-tree tabs from renderTabMenu~~ — Skip CBI tab processing when `#header-sub` already has menu-tree tabs
- ~~**Nested section styling** — Sections inside sections had excessive gaps and double glass boxes~~ — Flatten nested `.cbi-section` (no padding/border/shadow) matching Argon approach
- ~~**Spinning indicator fix** — `.spinning` was hidden with `display:none`, breaking firmware updates and plugin loading~~ — Show as centered glass card with `::before` loading icon, matching Argon's approach
- ~~**System log scroll fix** — `#syslog` had `max-height` constraint causing scroll-within-scroll; "move to bottom/head" buttons scrolled the area, not the log~~ — Remove `max-height`, use `overflow-y: hidden` so full log renders and page scrolls naturally (matching Argon)
- ~~**Alert message glass styling** — Base `.alert-message` (e.g. "No changes to apply") had no glass treatment, appeared as plain white box~~ — Add default info-tinted glass background, border, and shadow to all alert messages
- ~~**Attended Sysupgrade fix** — Remove package button missing on Attended Sysupgrade page~~ — Remove overly broad `hideUpgradeCheck()` that hid any element containing "upgrade" text
- ~~**Login page favicon** — Browser tab icon missing on login page~~ — Add `<link rel="icon">` to `sysauth.ut` matching `header.ut`

## Visual Polish
- **Glass toast notifications** — Replace default LuCI alert banners with frosted toast popups that auto-dismiss
- **Status indicators** — Animated glass pill badges in header for interface up/down, WiFi signal, CPU/memory

## Functional Features
- **Dashboard widgets** — Draggable glass cards on overview page showing real-time stats (CPU, memory, traffic, connected devices). macOS widget style
- **Quick actions** — Header dropdown for common tasks: restart network, reboot, clear DNS cache
- **Search / Command palette** — Spotlight-style Cmd+K to jump to any page or setting
- **Favorites/bookmarks** — Pin frequently used pages to the sidebar

## Theming Expansion
- **Accent color presets** — Built-in color schemes (Ocean, Sunset, Forest, Rose) with one-click switching
- **Background blur preview** — Live slider in settings to preview blur intensity before saving
- **OLED dark mode** — True black variant for AMOLED screens, separate from current dark mode

## Community / Growth
- **OpenWrt package feed** — Get into official or community feed for `opkg install luci-theme-glass`
- **Wallpaper gallery** — Curate 5-10 default wallpapers that look great through glass panels

## Technical
- **CSS fallback** — Graceful degradation for browsers without `backdrop-filter` support
- **Performance audit** — Test on low-end routers (16MB RAM). Auto-reduce effects on weak hardware
- **Accessibility** — High contrast mode, keyboard focus rings, screen reader labels

## Priority (top 3)
1. Dashboard widgets
2. Command palette search
3. Accent color presets
