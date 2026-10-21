# Publica uma nova versão: sobe a versão, gera o APK assinado, cria a Release no GitHub e atualiza release/version.json.
# Uso:  .\publish.ps1 -Notes "Novas questões de LRF e correções"            (incrementa 1.6 -> 1.7 e versionCode +1)
#       .\publish.ps1 -Notes "..." -Version 2.0                                (define a versão manualmente)
#       .\publish.ps1 -ContentOnly -Notes "..."                                (só publica release/extra.json: conteúdo sem reinstalar)
param(
  [string]$Notes = "Atualização",
  [string]$Version = "",
  [switch]$ContentOnly
)
# npm, git e gradle escrevem avisos em stderr; por isso os comandos nativos rodam via cmd e checamos $LASTEXITCODE.
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot
$repo = "alexsynvia/estuda-ssprev"
function Run($cmd) { cmd /c "$cmd 2>&1"; if ($LASTEXITCODE -ne 0) { Write-Host "ERRO em: $cmd" -ForegroundColor Red; exit 1 } }

if ($ContentOnly) {
  Run "node -e ""JSON.parse(require('fs').readFileSync('release/extra.json','utf8')); console.log('extra.json ok')"""
  Run "git add release/extra.json"
  Run "git commit -q -m ""Conteudo extra: $Notes"""
  Run "git push origin main"
  Write-Host "Conteúdo publicado. O app baixa na próxima abertura com internet."
  exit 0
}

# 1) versão
$gradle = Get-Content android/app/build.gradle -Raw
$code = [int]([regex]::Match($gradle, 'versionCode (\d+)').Groups[1].Value)
$name = [regex]::Match($gradle, 'versionName "([^"]+)"').Groups[1].Value
$newCode = $code + 1
if ($Version -eq "") {
  $parts = $name.Split('.')
  $parts[-1] = [string]([int]$parts[-1] + 1)
  $Version = ($parts -join '.')
}
$gradle = $gradle -replace "versionCode $code", "versionCode $newCode" -replace "versionName `"$name`"", "versionName `"$Version`""
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'android\app\build.gradle'), $gradle, (New-Object Text.UTF8Encoding $false))  # sem BOM (Gradle rejeita)
Write-Host "Versão $name ($code) -> $Version ($newCode)"

# 2) testes + APK
Run "npm test"
.\build-apk.ps1
if (-not (Test-Path EstudaSSPREV.apk)) { Write-Host "APK não gerado" -ForegroundColor Red; exit 1 }

# 3) version.json
$apkUrl = "https://github.com/$repo/releases/download/v$Version/EstudaSSPREV.apk"
$json = [ordered]@{ versionName = $Version; versionCode = $newCode; date = (Get-Date -Format 'yyyy-MM-dd'); notes = $Notes; apkUrl = $apkUrl }
($json | ConvertTo-Json) | Set-Content release/version.json -Encoding UTF8

# 4) commit, tag, release
Run "git add -A"
Run "git commit -q -m ""v$Version - $Notes"""
Run "git tag v$Version"
Run "git push origin main --tags"
Run "gh release create v$Version EstudaSSPREV.apk --repo $repo --title ""Estuda SSPREV v$Version"" --notes ""$Notes"""
Write-Host ""
Write-Host "Publicado: $apkUrl"
Write-Host "Quem tiver o app instalado verá o aviso de atualização na tela inicial."
