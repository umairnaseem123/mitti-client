# Makes the checkout page include each item's selected color when
# placing an order (previously it was dropped when building orderItems).
#
# HOW TO RUN:
#   1. Save this file anywhere (e.g. D:\mitti-website\client\updateCheckoutColor.ps1)
#   2. Open PowerShell in that folder
#   3. Run:  .\updateCheckoutColor.ps1

# Adjust this path if your checkout page lives somewhere else.
$path = "D:\mitti-website\client\src\app\checkout\page.js"

if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "File not found at: $path" -ForegroundColor Red
    Write-Host "Edit the `$path variable at the top of this script to point at your checkout page." -ForegroundColor Yellow
    exit 1
}

$backupPath = "$path.bak"
Copy-Item -LiteralPath $path -Destination $backupPath -Force
Write-Host "Backup saved to: $backupPath" -ForegroundColor Cyan

$raw = Get-Content -LiteralPath $path -Raw
$content = $raw -replace "`r`n", "`n"

# ---- Change: include color when building orderItems ----
$old1 = @'
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));
'@

$new1 = @'
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        color: item.color || null,
      }));
'@

# ---- Change: show color under each line in the order summary ----
$old2 = @'
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-[#6B4530]">
                  {item.name} x{item.qty}
                </span>
                <span className="text-[#6B4530]">
                  Rs. {item.price * item.qty}
                </span>
              </div>
            ))}
'@

$new2 = @'
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-[#6B4530]">
                  {item.name} x{item.qty}
                  {item.color ? ` (${item.color})` : ""}
                </span>
                <span className="text-[#6B4530]">
                  Rs. {item.price * item.qty}
                </span>
              </div>
            ))}
'@

$changed = $false

if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "Change 1 (color included in order payload) applied." -ForegroundColor Green
    $changed = $true
} else {
    Write-Host "Change 1 not applied: matching code not found." -ForegroundColor Yellow
}

if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "Change 2 (color shown in order summary) applied." -ForegroundColor Green
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
