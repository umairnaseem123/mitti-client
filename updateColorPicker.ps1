# Replaces the inline color swatches on the product page with a
# "Choose a color" button that opens a popup showing the full color
# palette (all 23 colors from COLOR_SWATCHES) - similar to a color
# picker like MS Word's.
#
# HOW TO RUN:
#   1. Save this file anywhere (e.g. D:\mitti-website\client\updateColorPicker.ps1)
#   2. Open PowerShell in that folder
#   3. Run:  .\updateColorPicker.ps1

$path = "D:\mitti-website\client\src\app\product\[id]\ProductDetailClient.js"

if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "File not found at: $path" -ForegroundColor Red
    Write-Host "Edit the `$path variable at the top of this script if your project is in a different location." -ForegroundColor Yellow
    exit 1
}

$backupPath = "$path.bak2"
Copy-Item -LiteralPath $path -Destination $backupPath -Force
Write-Host "Backup saved to: $backupPath" -ForegroundColor Cyan

$raw = Get-Content -LiteralPath $path -Raw
$content = $raw -replace "`r`n", "`n"

# ---- Change 1: add colorPickerOpen state ----
$old1 = @'
  const [selectedColor, setSelectedColor] = useState(null);
'@

$new1 = @'
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
'@

# ---- Change 2: replace inline swatches with button + popup ----
$old2 = @'
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <span className="text-[#6B4530] block mb-2">
                Color{selectedColor ? ` \u2014 ${selectedColor}` : ""}
              </span>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                    title={color}
                    className={`w-9 h-9 rounded-full border-2 transition flex items-center justify-center ${
                      selectedColor === color
                        ? "border-[#C1653A] ring-2 ring-offset-2 ring-[#C1653A]"
                        : "border-[#E5D5C3] hover:border-[#C1653A]"
                    }`}
                    style={{ backgroundColor: getColorHex(color) }}
                  >
                    {selectedColor === color && (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        style={{
                          filter: "drop-shadow(0 0 1px rgba(0,0,0,0.6))",
                        }}
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
'@

$new2 = @'
          {colorPickerOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setColorPickerOpen(false)}
            />
          )}

          <div className="mb-6 relative inline-block">
            <span className="text-[#6B4530] block mb-2">
              Color{selectedColor ? ` \u2014 ${selectedColor}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setColorPickerOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5D5C3] bg-white hover:border-[#C1653A] transition"
            >
              <span
                className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                style={{
                  backgroundColor: selectedColor ? getColorHex(selectedColor) : "#ffffff",
                }}
              />
              <span className="text-sm text-[#6B4530]">
                {selectedColor || "Choose a color"}
              </span>
              <svg
                className="w-4 h-4 text-[#8B6F5C]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {colorPickerOpen && (
              <div className="absolute z-50 mt-2 p-4 bg-white border border-[#E5D5C3] rounded-xl shadow-lg grid grid-cols-6 gap-3 w-72">
                {COLOR_SWATCHES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.name);
                      setColorPickerOpen(false);
                    }}
                    aria-label={`Select color ${c.name}`}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition flex items-center justify-center ${
                      selectedColor === c.name
                        ? "border-[#C1653A] ring-2 ring-offset-1 ring-[#C1653A]"
                        : "border-[#E5D5C3] hover:border-[#C1653A]"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.name && (
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        style={{
                          filter: "drop-shadow(0 0 1px rgba(0,0,0,0.6))",
                        }}
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
'@

$changed = $false

if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "Change 1 (colorPickerOpen state added) applied." -ForegroundColor Green
    $changed = $true
} else {
    Write-Host "Change 1 not applied: matching code not found." -ForegroundColor Yellow
}

if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "Change 2 (color picker button + popup) applied." -ForegroundColor Green
    $changed = $true
} else {
    Write-Host "Change 2 not applied: matching code not found." -ForegroundColor Yellow
}

if ($changed) {
    $content = $content -replace "`n", "`r`n"
    Set-Content -LiteralPath $path -Value $content -NoNewline
    Write-Host "`nFile updated successfully: $path" -ForegroundColor Green
    Write-Host "If anything looks wrong, restore the backup:  Copy-Item '$backupPath' '$path' -Force" -ForegroundColor Cyan
} else {
    Write-Host "`nNo changes were made." -ForegroundColor Yellow
}
