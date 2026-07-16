$source = Resolve-Path (Join-Path $PSScriptRoot '..')
$target = 'D:\smapp'

if (Test-Path $target) {
  $item = Get-Item $target -Force
  if ($item.LinkType -in @('Junction', 'SymbolicLink')) {
    Remove-Item $target -Force -ErrorAction SilentlyContinue
  } else {
    Remove-Item $target -Force -Recurse -ErrorAction SilentlyContinue
  }
}

Remove-Item (Join-Path $source 'android/app/.cxx') -Force -Recurse -ErrorAction SilentlyContinue
New-Item -ItemType Junction -Path $target -Target $source.Path -Force | Out-Null

Set-Location $target
npx react-native run-android --no-packager --active-arch-only
