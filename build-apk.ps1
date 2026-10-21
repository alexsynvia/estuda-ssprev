# Gera o APK assinado (release). Uso: .\build-apk.ps1
$ErrorActionPreference = 'Continue'
$env:JAVA_HOME = (Get-ChildItem 'C:\Program Files\Microsoft\jdk-21*' | Select-Object -First 1).FullName
$env:ANDROID_HOME = Join-Path $env:USERPROFILE 'android-sdk'
Set-Location $PSScriptRoot
cmd /c "npx cap copy android 2>&1"
if ($LASTEXITCODE -ne 0) { Write-Host "cap copy falhou" -ForegroundColor Red; exit 1 }
Set-Location android
cmd /c ".\gradlew.bat assembleRelease 2>&1"
if ($LASTEXITCODE -ne 0) { Write-Host "gradle falhou" -ForegroundColor Red; exit 1 }
Set-Location $PSScriptRoot
$apk = Join-Path $PSScriptRoot 'android\app\build\outputs\apk\release\app-release.apk'
$out = Join-Path $PSScriptRoot 'EstudaSSPREV.apk'
Copy-Item $apk $out -Force
Write-Host "APK pronto: $out"
