Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot 'assets\siblux-logo-en.png'
$bmp = New-Object System.Drawing.Bitmap 860, 920, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$brown = [System.Drawing.Color]::FromArgb(255, 118, 32, 16)
$brush = New-Object System.Drawing.SolidBrush $brown
$pen = New-Object System.Drawing.Pen $brown, 58
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Flat
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Flat
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter

$left = 90
$top = 50
$size = 680
$g.DrawArc($pen, $left, $top, $size, $size, 180, 180)
$foot = $top + ($size / 2) - 24
$bottom = 640
$g.DrawLine($pen, ($left + 29), $foot, ($left + 29), $bottom)
$g.DrawLine($pen, ($left + $size - 29), $foot, ($left + $size - 29), $bottom)
$mid = $left + ($size / 2)
$g.DrawLine($pen, $mid, ($top + 8), $mid, $bottom)

# Left pane: three diagonal bars of the original geometric mark, kept inside the arch.
function Fill-Bar([single]$x, [single]$y, [single]$w, [single]$h, [single]$angle) {
  $state = $g.Save()
  $g.TranslateTransform($x, $y)
  $g.RotateTransform($angle)
  $g.FillRectangle($brush, (-$w / 2), (-$h / 2), $w, $h)
  $g.Restore($state)
}
Fill-Bar 292 214 176 58 34
Fill-Bar 300 328 196 58 34
Fill-Bar 308 442 168 58 34

# Right pane: the X, large enough to meet the arch the way the source mark does.
Fill-Bar 575 400 300 64 46
Fill-Bar 575 400 300 64 -46

$family = New-Object System.Drawing.FontFamily 'Arial Black'
$format = [System.Drawing.StringFormat]::GenericTypographic
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$em = 108
$probe = New-Object System.Drawing.Font $family, $em, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$word = 'SIBLUX'
$wordW = $g.MeasureString($word, $probe, 2000, $format).Width
$path.AddString($word, $family, [int][System.Drawing.FontStyle]::Regular, $em, (New-Object System.Drawing.PointF ((860 - $wordW) / 2), 690), $format)
$g.FillPath($brush, $path)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$pen.Dispose()
$brush.Dispose()
$probe.Dispose()
$path.Dispose()
$family.Dispose()
Write-Output $out
