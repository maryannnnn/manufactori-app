Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot 'assets\ivikom-logo-en.png'
$bmp = New-Object System.Drawing.Bitmap 1600, 360, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$blue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 19, 22, 165))
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$orange = [System.Drawing.Color]::FromArgb(255, 255, 140, 0)
$metal = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 90, 96, 108))
$slash = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 40, 42, 48))

$barY = 78
$barH = 200

$family = New-Object System.Drawing.FontFamily 'Arial Black'
$format = [System.Drawing.StringFormat]::GenericTypographic
$em = 132
$origin = New-Object System.Drawing.PointF 56, 108

function Draw-Word([string]$text, [System.Drawing.PointF]$at) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddString($text, $family, [int][System.Drawing.FontStyle]::Bold, $em, $at, $format)
  $stroke = New-Object System.Drawing.Pen $orange, 10
  $stroke.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawPath($stroke, $path)
  $g.FillPath($white, $path)
  $stroke.Dispose()
  $path.Dispose()
}

$probe = New-Object System.Drawing.Font $family, $em, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$leftWidth = $g.MeasureString('IVIK', $probe, 2000, $format).Width
$mWidth = $g.MeasureString('M', $probe, 2000, $format).Width
$circle = 118
$gap = 18
$cx = 56 + $leftWidth + $gap + ($circle / 2)
$cy = $barY + ($barH / 2)
$barRight = $cx + ($circle / 2) + $gap + $mWidth + 36
$g.FillRectangle($blue, 24, $barY, ($barRight - 24), $barH)

Draw-Word 'IVIK' $origin
$ring = New-Object System.Drawing.Pen $orange, 12
$g.FillEllipse($metal, ($cx - $circle / 2), ($cy - $circle / 2), $circle, $circle)
$g.DrawEllipse($ring, ($cx - $circle / 2), ($cy - $circle / 2), $circle, $circle)
$g.TranslateTransform($cx, $cy)
$g.RotateTransform(-42)
$g.FillRectangle($slash, -16, -($circle / 2) + 16, 32, $circle - 32)
$g.ResetTransform()

$mAt = New-Object System.Drawing.PointF ($cx + ($circle / 2) + $gap), 108
Draw-Word 'M' $mAt

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$probe.Dispose()
$family.Dispose()
Write-Output $out
