# Shows each item's selected color in the admin Orders page.
#
# HOW TO RUN:
#   1. Save this file anywhere (e.g. D:\mitti-website\client\updateAdminOrderColor.ps1)
#   2. Open PowerShell in that folder
#   3. Run:  .\updateAdminOrderColor.ps1

# Adjust this path if your admin orders page lives somewhere else.
$path = "D:\mitti-website\client\src\app\admin\orders\page.js"

if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "File not found at: $path" -ForegroundColor Red
    Write-Host "Edit the `$path variable at the top of this script to point at your admin orders page." -ForegroundColor Yellow
    exit 1
}

$backupPath = "$path.bak"
Copy-Item -LiteralPath $path -Destination $backupPath -Force
Write-Host "Backup saved to: $backupPath" -ForegroundColor Cyan

$raw = Get-Content -LiteralPath $path -Raw
$content = $raw -replace "`r`n", "`n"

$old1 = @'
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-[#6B4530]">
                        {item.name} x{item.qty} &mdash; Rs.{" "}
                        {item.price * item.qty}
                      </p>
                    ))}
'@

$new1 = @'
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-[#6B4530]">
                        {item.name}
                        {item.color ? ` (${item.color})` : ""} x{item.qty}{" "}
                        &mdash; Rs. {item.price * item.qty}
                      </p>
                    ))}
'@

if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "Change applied: item color now shown in admin Orders page." -ForegroundColor Green
    $content = $content -replace "`n", "`r`n"
    Set-Content -LiteralPath $path -Value $content -NoNewline
    Write-Host "`nFile updated successfully: $path" -ForegroundColor Green
    Write-Host "If anything looks wrong, restore the backup:  Copy-Item '$backupPath' '$path' -Force" -ForegroundColor Cyan
} else {
    Write-Host "Change not applied: matching code not found (file may already differ from what was expected)." -ForegroundColor Yellow
}
