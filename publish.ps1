# Publica uma nova versão: sobe a versão, gera o APK assinado, cria a Release no GitHub e atualiza release/version.json.
# Uso:  .\publish.ps1 -Notes "Novas questões de LRF e correções"            (incrementa 1.6 -> 1.7 e versionCode +1)
#       .\publish.ps1 -Notes "..." -Version 2.0                                (define a versão manualmente)
#       .\publish.ps1 -ContentOnly                                             (só publica release/extra.json: conteúdo sem reinstalar)
param(
  [string]$Notes = "Atualização",
  [string]$Version = "",
  [switch]$ContentOnly
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$repo = "alexsynvia/estuda-ssprev"

if ($ContentOnly) {
  node -e "JSON.parse(require('fs').readFileSync('release/extra.json','utf8')); console.log('extra.json ok')"
  git add release/extra.json
  git commit -m "Conteúdo extra: $Notes" | Out-Null
  git push origin main
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
Set-Content android/app/build.gradle $gradle -Encoding UTF8
Write-Host "Versão $name ($code) -> $Version ($newCode)"

# 2) testes + APK
npm test | Select-Object -Last 3
.\build-apk.ps1

# 3) version.json
$apkUrl = "https://github.com/$repo/releases/download/v$Version/EstudaSSPREV.apk"
$json = [ordered]@{ versionName = $Version; versionCode = $newCode; date = (Get-Date -Format 'yyyy-MM-dd'); notes = $Notes; apkUrl = $apkUrl }
($json | ConvertTo-Json) | Set-Content release/version.json -Encoding UTF8

# 4) commit, tag, release
git add -A
git commit -m "v$Version - $Notes" | Out-Null
git tag "v$Version"
git push origin main --tags
gh release create "v$Version" EstudaSSPREV.apk --repo $repo --title "Estuda SSPREV v$Version" --notes $Notes
Write-Host ""
Write-Host "Publicado: $apkUrl"
Write-Host "Quem tiver o app instalado verá o aviso de atualização na tela inicial."
