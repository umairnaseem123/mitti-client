# Swaps the images on the "Explore Our Collections" homepage cards:
# Concrete Decor card gets candles.png, Candles card gets concrete.png.
#
# HOW TO RUN:
#   1. Save this file anywhere (e.g. D:\mitti-website\client\swapHomeImages.ps1)
#   2. Open PowerShell in that folder
#   3. Run:  .\swapHomeImages.ps1

# Adjust this path if your homepage file lives somewhere else.
$path = "D:\mitti-website\client\src\app\page.js"

if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "File not found at: $path" -ForegroundColor Red
    Write-Host "Edit the `$path variable at the top of this script to point at your homepage file." -ForegroundColor Yellow
    exit 1
}

$backupPath = "$path.bak"
Copy-Item -LiteralPath $path -Destination $backupPath -Force
Write-Host "Backup saved to: $backupPath" -ForegroundColor Cyan

$raw = Get-Content -LiteralPath $path -Raw
$content = $raw -replace "`r`n", "`n"

$old1 = @'
            <img
              src="/concrete.png"
              alt="Concrete Decor"
'@

$new1 = @'
            <img
              src="/candles.png"
              alt="Concrete Decor"
'@

$old2 = @'
            <img
              src="/candles.png"
              alt="Candles"
'@

$new2 = @'
            <img
              src="/concrete.png"
              alt="Candles"
'@

$changed = $false

if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "Concrete Decor card now uses candles.png." -ForegroundColor Green
    $changed = $true
} else {
    Write-Host "Change 1 not applied: matching code not found." -ForegroundColor Yellow
}

if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "Candles card now uses concrete.png." -ForegroundColor Green
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
