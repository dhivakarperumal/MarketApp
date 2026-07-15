$source = Resolve-Path (Join-Path $PSScriptRoot '..')
$target = 'D:\s'

if (Test-Path $target) {
  Remove-Item $target -Force -Recurse -ErrorAction SilentlyContinue
}

New-Item -ItemType Junction -Path $target -Target $source.Path -Force | Out-Null

Set-Location $target
npx react-native run-android --no-packager --active-arch-only
