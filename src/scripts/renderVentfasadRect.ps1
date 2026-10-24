Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot "assets\ventfasad-logo-en.png"
$blue = [System.Drawing.Color]::FromArgb(255, 163, 201, 249)
$navy = [System.Drawing.Color]::FromArgb(255, 0, 4, 105)
$gold = [System.Drawing.Color]::FromArgb(255, 252, 180, 4)
$green = [System.Drawing.Color]::FromArgb(255, 4, 148, 4)

$mainPx = 240
$font = New-Object System.Drawing.Font("Arial", $mainPx, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$font20 = New-Object System.Drawing.Font("Arial", ([int][math]::Round($mainPx * 0.34)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$format = New-Object System.Drawing.StringFormat ([System.Drawing.StringFormat]::GenericTypographic)
$format.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap

function Get-Ink([System.Drawing.Bitmap]$bmp) {
  $w = $bmp.Width
  $h = $bmp.Height
  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $stride = $data.Stride
  $bytes = New-Object byte[] ($stride * $h)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
  $bmp.UnlockBits($data)
  $minX = $w
  $minY = $h
  $maxX = -1
  $maxY = -1
  for ($y = 0; $y -lt $h; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $w; $x++) {
      if ($bytes[$row + ($x * 4) + 3] -gt 20) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt 0) { throw "No ink" }
  return @{ X = $minX; Y = $minY; W = ($maxX - $minX + 1); H = ($maxY - $minY + 1) }
}

function New-Label([string]$text, [System.Drawing.Font]$labelFont, [System.Drawing.Color]$color) {
  $bmp = New-Object System.Drawing.Bitmap 2200, 700
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  $brush = New-Object System.Drawing.SolidBrush $color
  $g.DrawString($text, $labelFont, $brush, 80, 80, $format)
  $brush.Dispose()
  $g.Dispose()
  $ink = Get-Ink $bmp
  return @{ Bitmap = $bmp; Ink = $ink }
}

$vent = New-Label "VENT" $font $navy
$facade = New-Label "FACADE" $font $green
$fOnly = New-Label "F" $font $gold
$twenty = New-Label "20" $font20 $gold

$gap = [int][math]::Round($mainPx * 0.06)
$blockW = [Math]::Max($vent.Ink.W, $facade.Ink.W)
$blockH = $vent.Ink.H + $gap + $facade.Ink.H

# Keep "20" inside the top row, right-aligned to the wider line.
$room = $blockW - $vent.Ink.W
if ($twenty.Ink.W + 16 -gt $room) {
  throw "20 does not fit beside VENT ($($twenty.Ink.W) in $room)"
}

$canvas = New-Object System.Drawing.Bitmap $blockW, $blockH
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage(
  $vent.Bitmap,
  (New-Object System.Drawing.Rectangle 0, 0, $vent.Ink.W, $vent.Ink.H),
  (New-Object System.Drawing.Rectangle $vent.Ink.X, $vent.Ink.Y, $vent.Ink.W, $vent.Ink.H),
  [System.Drawing.GraphicsUnit]::Pixel
)
$facadeY = $vent.Ink.H + $gap
$g.DrawImage(
  $facade.Bitmap,
  (New-Object System.Drawing.Rectangle 0, $facadeY, $facade.Ink.W, $facade.Ink.H),
  (New-Object System.Drawing.Rectangle $facade.Ink.X, $facade.Ink.Y, $facade.Ink.W, $facade.Ink.H),
  [System.Drawing.GraphicsUnit]::Pixel
)
$tx = $blockW - $twenty.Ink.W
$g.DrawImage(
  $twenty.Bitmap,
  (New-Object System.Drawing.Rectangle $tx, 0, $twenty.Ink.W, $twenty.Ink.H),
  (New-Object System.Drawing.Rectangle $twenty.Ink.X, $twenty.Ink.Y, $twenty.Ink.W, $twenty.Ink.H),
  [System.Drawing.GraphicsUnit]::Pixel
)
$g.Dispose()

# Replace the green F with the same glyph drawn in gold, including its antialiased edge.
$bits = $canvas.LockBits(
  (New-Object System.Drawing.Rectangle 0, 0, $canvas.Width, $canvas.Height),
  [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)
$stride = $bits.Stride
$raw = New-Object byte[] ($stride * $canvas.Height)
[System.Runtime.InteropServices.Marshal]::Copy($bits.Scan0, $raw, 0, $raw.Length)
$fBits = $fOnly.Bitmap.LockBits(
  (New-Object System.Drawing.Rectangle 0, 0, $fOnly.Bitmap.Width, $fOnly.Bitmap.Height),
  [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)
$fStride = $fBits.Stride
$fRaw = New-Object byte[] ($fStride * $fOnly.Bitmap.Height)
[System.Runtime.InteropServices.Marshal]::Copy($fBits.Scan0, $fRaw, 0, $fRaw.Length)
$fOnly.Bitmap.UnlockBits($fBits)
for ($dy = 0; $dy -lt $facade.Ink.H; $dy++) {
  $srcY = $facade.Ink.Y + $dy
  $row = ($facadeY + $dy) * $stride
  $fRow = $srcY * $fStride
  for ($dx = 0; $dx -lt $facade.Ink.W; $dx++) {
    $srcX = $facade.Ink.X + $dx
    $fi = $fRow + ($srcX * 4)
    if ($fRaw[$fi + 3] -gt 24) {
      $i = $row + ($dx * 4)
      $raw[$i] = $fRaw[$fi]
      $raw[$i + 1] = $fRaw[$fi + 1]
      $raw[$i + 2] = $fRaw[$fi + 2]
      $raw[$i + 3] = $fRaw[$fi + 3]
    }
  }
}
[System.Runtime.InteropServices.Marshal]::Copy($raw, 0, $bits.Scan0, $raw.Length)
$canvas.UnlockBits($bits)

$ink = Get-Ink $canvas
$padX = [int][math]::Round($ink.H * 0.16)
$padY = [int][math]::Round($ink.H * 0.14)
$outW = $ink.W + ($padX * 2)
$outH = $ink.H + ($padY * 2)
$final = New-Object System.Drawing.Bitmap $outW, $outH
$g = [System.Drawing.Graphics]::FromImage($final)
$g.Clear($blue)
$g.DrawImage(
  $canvas,
  (New-Object System.Drawing.Rectangle $padX, $padY, $ink.W, $ink.H),
  (New-Object System.Drawing.Rectangle $ink.X, $ink.Y, $ink.W, $ink.H),
  [System.Drawing.GraphicsUnit]::Pixel
)
$g.Dispose()
$final.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "$outW x $outH"
$final.Dispose()
$canvas.Dispose()
$vent.Bitmap.Dispose()
$facade.Bitmap.Dispose()
$fOnly.Bitmap.Dispose()
$twenty.Bitmap.Dispose()
$font.Dispose()
$font20.Dispose()
