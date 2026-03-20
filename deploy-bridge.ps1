# Deploy SecretaryOS Bridge to Fly.io (Windows)

Write-Host "Deploying SecretaryOS Bridge to Fly.io..." -ForegroundColor Green

$bridgeDir = Split-Path -Parent $PSScriptRoot
$bridgeDir = Join-Path $bridgeDir "apps\secretary-bridge"

# Check if fly CLI is installed
if (-not (Get-Command fly -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Fly CLI..."
    iwr https://fly.io/install.ps1 -useb | iex
}

# Login to Fly.io
fly auth login

# Create app if it doesn't exist
fly apps create secretaryos-bridge --org personal 2>$null

# Set secrets
Write-Host "Setting secrets..."
$SESSION_KEY = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) | ForEach-Object { [byte]$_ })
$JWT_KEY = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) | ForEach-Object { [byte]$_ })

fly secrets set SUPABASE_URL="https://eqjkpvizlcijrfcigqkt.supabase.co" --app secretaryos-bridge
fly secrets set SUPABASE_SERVICE_KEY="$env:SUPABASE_SERVICE_KEY" --app secretaryos-bridge
fly secrets set SESSION_ENCRYPTION_KEY="$SESSION_KEY" --app secretaryos-bridge
fly secrets set JWT_SECRET="$JWT_KEY" --app secretaryos-bridge

# Deploy
Write-Host "Deploying..." -ForegroundColor Cyan
fly deploy --app secretaryos-bridge

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Bridge URL: https://secretaryos-bridge.fly.dev" -ForegroundColor Cyan
