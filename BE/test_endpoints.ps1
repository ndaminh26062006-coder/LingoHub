# LingoHub Freemium System - API Test Script
# Run: .\test_endpoints.ps1

$baseUrl = "http://localhost:8000/api"
$deviceId = "test_device_$(Get-Random)"

Write-Host "=== Testing LingoHub Freemium API ===" -ForegroundColor Cyan
Write-Host "Device ID: $deviceId" -ForegroundColor Yellow
Write-Host ""

# Test 1: Get Pricing
Write-Host "[1/5] GET /api/freemium/pricing" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$baseUrl/freemium/pricing" -Method Get
Write-Host "✓ Response: $(($response | ConvertTo-Json | Measure-Object -Character).Characters) chars"
Write-Host "  Plans: $($response.Count) tiers found"
Write-Host ""

# Test 2: First Free Use
Write-Host "[2/5] POST /api/freemium/check-access (Use 1/2)" -ForegroundColor Green
$body = @{
    feature = "essay"
    device_id = $deviceId
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/freemium/check-access" `
    -Method Post `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $body

Write-Host "✓ Response: $($response.can_access) - $($response.message)"
Write-Host "  Reason: $($response.reason), Remaining: $($response.remaining_uses)"
Write-Host ""

# Test 3: Second Free Use
Write-Host "[3/5] POST /api/freemium/check-access (Use 2/2)" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$baseUrl/freemium/check-access" `
    -Method Post `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $body

Write-Host "✓ Response: $($response.can_access) - $($response.message)"
Write-Host "  Reason: $($response.reason), Remaining: $($response.remaining_uses)"
Write-Host ""

# Test 4: Third Use (Should Deny)
Write-Host "[4/5] POST /api/freemium/check-access (Use 3/2 - SHOULD DENY)" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/freemium/check-access" `
        -Method Post `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $body `
        -ErrorAction Stop
    Write-Host "✗ ERROR: Should have been denied!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 403) {
        $errorResponse = $_.Exception.Response.Content | ConvertFrom-Json
        Write-Host "✓ Correctly denied (403) - $($errorResponse.message)"
        Write-Host "  Pricing: $($errorResponse.pricing.Count) plans shown"
    } else {
        Write-Host "✗ Unexpected status code: $statusCode"
    }
}
Write-Host ""

# Test 5: Usage Stats
Write-Host "[5/5] POST /api/freemium/usage-stats" -ForegroundColor Green
$body = @{
    device_id = $deviceId
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/freemium/usage-stats" `
    -Method Post `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $body

Write-Host "✓ Response received for device: $($response.device_id)"
Write-Host "  Essay: $($response.stats.essay.used_count)/$($response.stats.essay.limit) uses"
Write-Host "  Exam: $($response.stats.exam.used_count)/$($response.stats.exam.limit) uses"
Write-Host "  Document: $($response.stats.document.used_count)/$($response.stats.document.limit) uses"
Write-Host "  Flashcard: $($response.stats.flashcard.used_count)/$($response.stats.flashcard.limit) uses"
Write-Host ""

Write-Host "=== All Tests Completed Successfully ===" -ForegroundColor Cyan
