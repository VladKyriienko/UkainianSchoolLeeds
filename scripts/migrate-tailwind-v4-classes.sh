#!/usr/bin/env bash
# Migrate legacy Tailwind arbitrary classes to v4-friendly utilities.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FILES=$(grep -rl --include='*.tsx' --include='*.css' -E '\[[0-9]|bg-gradient-to-|flex-shrink-|flex-grow-|\[var\(--|\[--' app components styles 2>/dev/null || true)

if [ -z "$FILES" ]; then
  echo "No files to migrate."
  exit 0
fi

for f in $FILES; do
  sed -i '' \
    -e 's/bg-gradient-to-/bg-linear-to-/g' \
    -e 's/flex-shrink-0/shrink-0/g' \
    -e 's/flex-shrink-/shrink-/g' \
    -e 's/flex-grow-0/grow-0/g' \
    -e 's/flex-grow-/grow-/g' \
    -e 's/min-h-\[var(--/min-h-(--/g' \
    -e 's/max-h-\[var(--/max-h-(--/g' \
    -e 's/min-w-\[var(--/min-w-(--/g' \
    -e 's/max-w-\[var(--/max-w-(--/g' \
    -e 's/h-\[var(--/h-(--/g' \
    -e 's/w-\[var(--/w-(--/g' \
    -e 's/min-h-\[--/min-h-(--/g' \
    -e 's/max-h-\[--/max-h-(--/g' \
    -e 's/min-w-\[--/min-w-(--/g' \
    -e 's/max-w-\[--/max-w-(--/g' \
    -e 's/h-\[--/h-(--/g' \
    -e 's/w-\[--/w-(--/g' \
    -e 's/px-\[--/px-(--/g' \
    -e 's/origin-\[--/origin-(--/g' \
    -e 's/min-h-\[2\.5rem\]/min-h-10/g' \
    -e 's/min-h-\[80px\]/min-h-20/g' \
    -e 's/min-h-\[120px\]/min-h-30/g' \
    -e 's/min-h-\[220px\]/min-h-editor/g' \
    -e 's/min-h-\[50vh\]/min-h-[50svh]/g' \
    -e 's/min-h-\[60vh\]/min-h-[60svh]/g' \
    -e 's/max-h-\[92vh\]/max-h-[92dvh]/g' \
    -e 's/h-\[1px\]/h-px/g' \
    -e 's/w-\[1px\]/w-px/g' \
    -e 's/min-w-\[60px\]/min-w-15/g' \
    -e 's/min-w-\[100px\]/min-w-25/g' \
    -e 's/min-w-\[200px\]/min-w-50/g' \
    -e 's/sm:min-w-\[200px\]/sm:min-w-50/g' \
    -e 's/w-\[60px\]/w-15/g' \
    -e 's/w-\[72px\]/w-18/g' \
    -e 's/w-\[80px\]/w-20/g' \
    -e 's/w-\[88px\]/w-22/g' \
    -e 's/w-\[90px\]/w-22/g' \
    -e 's/w-\[100px\]/w-25/g' \
    -e 's/w-\[120px\]/w-30/g' \
    -e 's/w-\[140px\]/w-35/g' \
    -e 's/w-\[160px\]/w-40/g' \
    -e 's/w-\[180px\]/w-45/g' \
    -e 's/w-\[200px\]/w-50/g' \
    -e 's/w-\[220px\]/w-55/g' \
    -e 's/w-\[260px\]/w-65/g' \
    -e 's/w-\[300px\]/w-75/g' \
    -e 's/w-\[400px\]/w-100/g' \
    -e 's/max-w-\[200px\]/max-w-50/g' \
    -e 's/max-w-\[280px\]/max-w-70/g' \
    -e 's/max-w-\[320px\]/max-w-80/g' \
    -e 's/h-\[calc(100vh-4\.5rem)\]/h-[calc(100dvh-4.5rem)]/g' \
    -e 's/!top-\[4\.5rem\]/top-18!/g' \
    -e 's/w-\[calc(100%+2rem)\]/w-[calc(100%+(--spacing(8)))]/g' \
    -e 's/w-\[calc(100%+3rem)\]/w-[calc(100%+(--spacing(12)))]/g' \
    -e 's/w-\[calc(100%+4rem)\]/w-[calc(100%+(--spacing(16)))]/g' \
    -e 's/text-\[1\.75rem\]/text-h3/g' \
    -e 's/text-\[1\.375rem\]/text-h4/g' \
    -e 's/text-\[11px\]/text-2xs/g' \
    "$f"
done

echo "Migrated $(echo "$FILES" | wc -l | tr -d ' ') files."
