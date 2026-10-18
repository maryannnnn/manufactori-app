Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot 'assets\areks-logo-en.png'

function New-Color([int]$r, [int]$g, [int]$b) {
  return [System.Drawing.Color]::FromArgb(255, $r, $g, $b)
}

$bmp = New-Object System.Drawing.Bitmap 1500, 320
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$brown = New-Object System.Drawing.SolidBrush (New-Color 110 42 32)
$seat = New-Object System.Drawing.SolidBrush (New-Color 196 154 108)
$ink = New-Object System.Drawing.SolidBrush (New-Color 74 32 24)

$state = $g.Save()
$g.TranslateTransform(36, 48)
$g.ScaleTransform(1.15, 1.15)
# Arms and base of the original brown sofa.
$g.FillEllipse($brown, 8, 78, 46, 78)
$g.FillEllipse($brown, 196, 78, 46, 78)
$g.FillRectangle($brown, 28, 108, 194, 52)
# Domed back.
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc(18, 8, 214, 150, 200, 140)
$path.AddLine(214, 118, 214, 150)
$path.AddLine(36, 150, 36, 118)
$path.CloseFigure()
$g.FillPath($brown, $path)
# Seat cushion, the lighter band on the original mark.
$g.FillRectangle($seat, 48, 132, 154, 16)
$g.Restore($state)

$format = [System.Drawing.StringFormat]::GenericTypographic
$name = New-Object System.Drawing.Font 'Georgia', 108, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$tag = New-Object System.Drawing.Font 'Segoe UI Semibold', 28, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('AREKS', $name, $ink, 390, 62, $format)

$cursor = 396
$tracking = 5
foreach ($ch in 'UPHOLSTERED FURNITURE'.ToCharArray()) {
  $s = [string]$ch
  if ($s -eq ' ') { $cursor += ($tag.Size * 0.42); continue }
  $g.DrawString($s, $tag, $brown, $cursor, 210, $format)
  $size = $g.MeasureString($s, $tag, 2000, $format)
  $cursor += $size.Width + $tracking
}

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output $out
