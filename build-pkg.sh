#!/bin/bash
set -e

PKG_NAME="luci-theme-glass"
PKG_VERSION="1.0.0"
PKG_RELEASE="1"
MAINTAINER="Ryan Chen <rchen14b@gmail.com>"
DESCRIPTION="Glass - Apple-inspired glassmorphism theme for LuCI"
HOMEPAGE="https://github.com/rchen14b/luci-theme-glass"
LICENSE="GPL-3.0"

DIST_DIR="dist"
WORK_DIR=$(mktemp -d)

trap "rm -rf $WORK_DIR" EXIT

echo "==> Preparing file tree..."

DATA_DIR="$WORK_DIR/data"
mkdir -p "$DATA_DIR/www/luci-static/glass"
mkdir -p "$DATA_DIR/www/luci-static/resources"
mkdir -p "$DATA_DIR/usr/share/ucode/luci/template/themes/glass"
mkdir -p "$DATA_DIR/usr/share/rpcd/acl.d"
mkdir -p "$DATA_DIR/etc/uci-defaults"

cp -r htdocs/luci-static/glass/css "$DATA_DIR/www/luci-static/glass/"
cp -r htdocs/luci-static/glass/img "$DATA_DIR/www/luci-static/glass/"
mkdir -p "$DATA_DIR/www/luci-static/glass/background"
cp htdocs/luci-static/resources/menu-glass.js "$DATA_DIR/www/luci-static/resources/"
cp ucode/template/themes/glass/*.ut "$DATA_DIR/usr/share/ucode/luci/template/themes/glass/"
cp root/usr/share/rpcd/acl.d/luci-theme-glass.json "$DATA_DIR/usr/share/rpcd/acl.d/"
cp root/etc/uci-defaults/30_luci-theme-glass "$DATA_DIR/etc/uci-defaults/"

INSTALLED_SIZE=$(du -sk "$DATA_DIR" | cut -f1)
INSTALLED_BYTES=$((INSTALLED_SIZE * 1024))
BUILD_DATE=$(date +%s)

mkdir -p "$DIST_DIR"

# ============================================================
# Build IPK (opkg — OpenWrt 19.07 - 23.05)
# ============================================================
echo "==> Building IPK..."

IPK_DIR="$WORK_DIR/ipk"
mkdir -p "$IPK_DIR/control"

cat > "$IPK_DIR/control/control" <<EOF
Package: $PKG_NAME
Version: ${PKG_VERSION}-${PKG_RELEASE}
Architecture: all
Maintainer: $MAINTAINER
Section: luci
Priority: optional
Installed-Size: $INSTALLED_SIZE
Description: $DESCRIPTION
Homepage: $HOMEPAGE
License: $LICENSE
EOF

cat > "$IPK_DIR/control/postinst" <<'SCRIPT'
#!/bin/sh
if [ "$PKG_UPGRADE" != 1 ]; then
	uci get luci.themes.Glass >/dev/null 2>&1 || \
	uci batch <<-EOF
		set luci.themes.Glass=/luci-static/glass
		set luci.main.mediaurlbase=/luci-static/glass
		commit luci
	EOF
fi
exit 0
SCRIPT
chmod 755 "$IPK_DIR/control/postinst"

echo "2.0" > "$IPK_DIR/debian-binary"

(cd "$DATA_DIR" && tar --numeric-owner --owner=0 --group=0 -czf "$IPK_DIR/data.tar.gz" .)
(cd "$IPK_DIR/control" && tar --numeric-owner --owner=0 --group=0 -czf "$IPK_DIR/control.tar.gz" .)
(cd "$IPK_DIR" && ar r "$OLDPWD/$DIST_DIR/${PKG_NAME}_${PKG_VERSION}-${PKG_RELEASE}_all.ipk" debian-binary control.tar.gz data.tar.gz 2>/dev/null)

echo "    -> $DIST_DIR/${PKG_NAME}_${PKG_VERSION}-${PKG_RELEASE}_all.ipk"

# ============================================================
# Build APK (apk-tools — OpenWrt 24.10+)
# ============================================================
echo "==> Building APK..."

APK_DIR="$WORK_DIR/apk"
mkdir -p "$APK_DIR"

cat > "$APK_DIR/.PKGINFO" <<EOF
pkgname = $PKG_NAME
pkgver = ${PKG_VERSION}-r${PKG_RELEASE}
pkgdesc = $DESCRIPTION
url = $HOMEPAGE
builddate = $BUILD_DATE
packager = $MAINTAINER
size = $INSTALLED_BYTES
arch = all
license = $LICENSE
origin = $PKG_NAME
EOF

cp -r "$DATA_DIR"/* "$APK_DIR/"

(cd "$APK_DIR" && tar --numeric-owner --owner=0 --group=0 -czf "$OLDPWD/$DIST_DIR/${PKG_NAME}-${PKG_VERSION}-r${PKG_RELEASE}.apk" .PKGINFO $(ls -d */ 2>/dev/null))

echo "    -> $DIST_DIR/${PKG_NAME}-${PKG_VERSION}-r${PKG_RELEASE}.apk"

echo ""
echo "==> Done! Packages in $DIST_DIR/"
ls -lh "$DIST_DIR/"
