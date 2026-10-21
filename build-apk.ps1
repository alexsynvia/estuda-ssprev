# Gera o APK assinado (release). Uso: .\build-apk.ps1
$ErrorActionPreference = 'Stop'
$env:JAVA_HOME = (Get-ChildItem 'C:\Program Files\Microsoft\jdk-21*' | Select-Object -First 1).FullName
$env:ANDROID_HOME = "$env:USERPROFILEndroid-sdk"
Set-Location $PSScriptRoot
npx cap copy android
Set-Location android
.\gradlew.bat assembleRelease
$apk = Join-Path $PSScriptRoot 'android\app\build\outputs\apk\release\app-release.apk'
$out = Join-Path $PSScriptRoot 'EstudaSSPREV.apk'
Copy-Item $apk $out -Force
Write-Host "APK pronto: $out"
