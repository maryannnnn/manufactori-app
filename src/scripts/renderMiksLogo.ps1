Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot 'assets\miks-logo-en.png'
$bmp = New-Object System.Drawing.Bitmap 1400, 420, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$yellow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 236, 0))
$inkBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 17, 17, 17))
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 17, 17, 17)), 16
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter

function New-Pt([single]$x, [single]$y) {
  return New-Object System.Drawing.PointF $x, $y
}

# Yellow diamond from the source mark, with its black border.
$cx = 168
$cy = 188
$r = 148
$diamond = @(
  (New-Pt $cx ($cy - $r)),
  (New-Pt ($cx + $r) $cy),
  (New-Pt $cx ($cy + $r)),
  (New-Pt ($cx - $r) $cy)
)
$g.FillPolygon($yellow, $diamond)
$g.DrawPolygon($pen, $diamond)

# Structural glyph inside the diamond: verticals and a base, the same building-like mark.
$g.FillRectangle($inkBrush, 92, 118, 22, 108)
$g.FillRectangle($inkBrush, 132, 96, 18, 130)
$g.FillRectangle($inkBrush, 168, 78, 22, 148)
$g.FillRectangle($inkBrush, 78, 214, 132, 16)
$g.FillRectangle($inkBrush, 78, 198, 36, 16)

$format = [System.Drawing.StringFormat]::GenericTypographic
$name = New-Object System.Drawing.Font 'Arial Black', 112, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$textX = 360
$textY = 78
$g.DrawString('MIKS', $name, $inkBrush, $textX, $textY, $format)
$measured = $g.MeasureString('MIKS', $name, 2000, $format)
$ruleY = $textY + $measured.Height + 6
$g.FillRectangle($yellow, $textX, $ruleY, $measured.Width, 14)
$g.FillRectangle($inkBrush, $textX, ($ruleY + 18), $measured.Width, 6)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output $out
