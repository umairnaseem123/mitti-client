# Automatically updates ProductDetailClient.js to support the new
# {name, hex} color format (swatch UI).
#
# HOW TO RUN:
#   1. Save this file anywhere (e.g. D:\mitti-website\client\updateProductColors.ps1)
#   2. Open PowerShell in that folder
#   3. Run:  .\updateProductColors.ps1

$path = "D:\mitti-website\client\src\app\product\[id]\ProductDetailClient.js"

if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "File not found at: $path" -ForegroundColor Red
    Write-Host "Edit the `$path variable at the top of this script if your project is in a different location." -ForegroundColor Yellow
    exit 1
}

# Backup original file first
$backupPath = "$path.bak"
Copy-Item -LiteralPath $path -Destination $backupPath -Force
Write-Host "Backup saved to: $backupPath" -ForegroundColor Cyan

# Read file and normalize line endings to \n for reliable matching
$raw = Get-Content -LiteralPath $path -Raw
$content = $raw -replace "`r`n", "`n"

# ---- Change 1: default selected color ----
$old1 = @'
    if (product.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
'@

$new1 = @'
    if (product.colors?.length) {
      setSelectedColor(product.colors[0].name);
    }
'@

# ---- Change 2: color swatch buttons ----
$old2 = @'
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <span className="text-[#6B4530] block mb-2">Color Family</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      selectedColor === color
                        ? "border-[#C1653A] text-[#C1653A] bg-[#FBF3E9]"
                        : "border-[#E5D5C3] text-[#6B4530] bg-white hover:border-[#C1653A]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
'@

$new2 = @'
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <span className="text-[#6B4530] block mb-2">Color Family</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${
                      selectedColor === color.name
                        ? "border-[#C1653A] text-[#C1653A] bg-[#FBF3E9]"
                        : "border-[#E5D5C3] text-[#6B4530] bg-white hover:border-[#C1653A]"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}
'@

$changed = $false

if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "Change 1 (default selected color) applied." -ForegroundColor Green
    $changed = $true
} else {
    Write-Host "Change 1 not applied: matching code not found (file may already be updated, or was edited manually)." -ForegroundColor Yellow
}

if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "Change 2 (color swatch UI) applied." -ForegroundColor Green
    $changed = $true
} else {
    Write-Host "Change 2 not applied: matching code not found (file may already be updated, or was edited manually)." -ForegroundColor Yellow
}

if ($changed) {
    # Convert back to Windows line endings and save
    $content = $content -replace "`n", "`r`n"
    Set-Content -LiteralPath $path -Value $content -NoNewline
    Write-Host "`nFile updated successfully: $path" -ForegroundColor Green
    Write-Host "If anything looks wrong, restore the backup:  Copy-Item '$backupPath' '$path' -Force" -ForegroundColor Cyan
} else {
    Write-Host "`nNo changes were made." -ForegroundColor Yellow
}
