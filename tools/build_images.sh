#!/bin/zsh
# Resize pack photos and convert to WebP. Source: src/images-raw/koot, output: assets/img/products
set -e
cd "$(dirname "$0")/.."
OUT=assets/img/products; mkdir -p $OUT; T=$(mktemp -d)
for f in src/images-raw/koot/*/*; do
  b=$(basename "$f"); n="${b%.*}"
  slug=$(echo "$n" | sed 's/^KOOT //' | tr 'A-Z' 'a-z' | sed 's/[^a-z0-9]\{1,\}/-/g; s/^-//; s/-$//')
  for h in 600 1200; do
    sips -Z $h "$f" --out "$T/x.png" -s format png >/dev/null
    cwebp -quiet -q 82 "$T/x.png" -o "$OUT/$slug-$h.webp"
  done
done
ls $OUT | wc -l; du -sh $OUT
