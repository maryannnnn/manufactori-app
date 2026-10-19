Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot 'assets\sauna-shop-logo-en.png'
$bmp = New-Object System.Drawing.Bitmap 1680, 420, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$flameBmp = New-Object System.Drawing.Bitmap 1680, 300, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$fg = [System.Drawing.Graphics]::FromImage($flameBmp)
$rect = New-Object System.Drawing.Rectangle 0, 0, 1680, 300
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 255, 236, 70)), ([System.Drawing.Color]::FromArgb(255, 150, 20, 8)), ([System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$blend = New-Object System.Drawing.Drawing2D.ColorBlend 4
$blend.Colors = @(
  [System.Drawing.Color]::FromArgb(255, 255, 244, 120),
  [System.Drawing.Color]::FromArgb(255, 255, 150, 20),
  [System.Drawing.Color]::FromArgb(255, 220, 50, 8),
  [System.Drawing.Color]::FromArgb(255, 120, 12, 6)
)
$blend.Positions = @(0, 0.38, 0.72, 1)
$grad.InterpolationColors = $blend
$fg.FillRectangle($grad, $rect)
$hot = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 255, 210, 40))
for ($i = 0; $i -lt 18; $i++) {
  $x = 40 + ($i * 92)
  $fg.FillEllipse($hot, $x, 8, 46, 170)
}
$fg.Dispose()
$grad.Dispose()
$hot.Dispose()
$flame = New-Object System.Drawing.TextureBrush $flameBmp

$shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(120, 70, 70, 70))
$ink = [System.Drawing.Color]::FromArgb(255, 20, 12, 8)
$subColor = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 128, 24, 16))
$family = New-Object System.Drawing.FontFamily 'Impact'
$andFamily = New-Object System.Drawing.FontFamily 'Georgia'
$subFamily = New-Object System.Drawing.FontFamily 'Arial'
$format = [System.Drawing.StringFormat]::GenericTypographic

function Draw-Flame([string]$text, [System.Drawing.FontFamily]$face, [single]$em, [single]$x, [single]$y, [single]$stroke) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddString($text, $face, [int][System.Drawing.FontStyle]::Bold, $em, (New-Object System.Drawing.PointF $x, $y), $format)
  $saved = $g.Save()
  $g.TranslateTransform(7, 8)
  $g.FillPath($shadow, $path)
  $g.Restore($saved)
  $pen = New-Object System.Drawing.Pen $ink, $stroke
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawPath($pen, $path)
  $g.FillPath($flame, $path)
  $pen.Dispose()
  $path.Dispose()
}

$probe = New-Object System.Drawing.Font $family, 188, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$andProbe = New-Object System.Drawing.Font $andFamily, 72, ([System.Drawing.FontStyle]::Italic), ([System.Drawing.GraphicsUnit]::Pixel)
$bathW = $g.MeasureString('BATH', $probe, 2000, $format).Width
$andW = $g.MeasureString('and', $andProbe, 2000, $format).Width
$saunaW = $g.MeasureString('SAUNA', $probe, 2000, $format).Width
$total = $bathW + 28 + $andW + 28 + $saunaW
$start = [single]((1680 - $total) / 2)

Draw-Flame 'BATH' $family 188 $start 18 16
Draw-Flame 'and' $andFamily 72 ($start + $bathW + 28) 78 8
Draw-Flame 'SAUNA' $family 188 ($start + $bathW + 28 + $andW + 28) 18 16

$subFont = New-Object System.Drawing.Font $subFamily, 54, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$sub = 'EQUIPMENT, MATERIALS'
$subW = $g.MeasureString($sub, $subFont, 2000, $format).Width
$g.DrawString($sub, $subFont, $subColor, [single]((1680 - $subW) / 2), 292, $format)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$flame.Dispose()
$flameBmp.Dispose()
$probe.Dispose()
$andProbe.Dispose()
$subFont.Dispose()
Write-Output $out
