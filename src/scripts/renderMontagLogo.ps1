Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot 'assets\montagspecstroy-logo-en.png'
$bmp = New-Object System.Drawing.Bitmap 2200, 460, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$blue = [System.Drawing.Color]::FromArgb(255, 24, 78, 168)
$navy = [System.Drawing.Color]::FromArgb(255, 12, 36, 92)
$white = [System.Drawing.Color]::White
$blueBrush = New-Object System.Drawing.SolidBrush $blue
$whiteBrush = New-Object System.Drawing.SolidBrush $white

# Portal frame: two columns and a beam, the only symbol.
$frame = New-Object System.Drawing.Drawing2D.GraphicsPath
$frame.AddRectangle((New-Object System.Drawing.RectangleF 48, 110, 36, 250))
$frame.AddRectangle((New-Object System.Drawing.RectangleF 250, 110, 36, 250))
$frame.AddRectangle((New-Object System.Drawing.RectangleF 36, 86, 262, 36))
$g.FillPath($blueBrush, $frame)

$family = New-Object System.Drawing.FontFamily 'Arial Black'
$format = [System.Drawing.StringFormat]::GenericTypographic
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$em = 118
$path.AddString('MONTAGSPECSTROY', $family, [int][System.Drawing.FontStyle]::Regular, $em, (New-Object System.Drawing.PointF 360, 78), $format)
$outer = New-Object System.Drawing.Pen $navy, 14
$outer.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$inner = New-Object System.Drawing.Pen $white, 7
$inner.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($outer, $path)
$g.DrawPath($inner, $path)
$g.FillPath($blueBrush, $path)

$subFamily = New-Object System.Drawing.FontFamily 'Arial'
$sub = New-Object System.Drawing.Font $subFamily, 36, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('DESIGN  -  CONSTRUCTION  -  RECONSTRUCTION', $sub, $blueBrush, 364, 250, $format)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $path.Dispose(); $frame.Dispose()
$outer.Dispose(); $inner.Dispose(); $blueBrush.Dispose(); $whiteBrush.Dispose(); $sub.Dispose()
Write-Output $out
