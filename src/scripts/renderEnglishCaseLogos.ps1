Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot 'assets'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-Color([int]$r, [int]$g, [int]$b, [int]$a = 255) {
  return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::Transparent)
  return @{ Bitmap = $bmp; Graphics = $g }
}

function Save-Canvas($canvas, [string]$name) {
  $path = Join-Path $outDir $name
  $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
  Write-Output $path
}

function New-Font([string]$name, [single]$size, [string]$style) {
  $fontStyle = [System.Drawing.FontStyle]::$style
  return New-Object System.Drawing.Font $name, $size, $fontStyle, ([System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-Tracked($g, [string]$text, $font, $brush, [single]$x, [single]$y, [single]$tracking) {
  $format = [System.Drawing.StringFormat]::GenericTypographic
  $cursor = $x
  foreach ($ch in $text.ToCharArray()) {
    $s = [string]$ch
    if ($s -eq ' ') {
      $cursor += ($font.Size * 0.36) + $tracking
      continue
    }
    $g.DrawString($s, $font, $brush, $cursor, $y, $format)
    $size = $g.MeasureString($s, $font, 4000, $format)
    $cursor += $size.Width + $tracking
  }
}

$format = [System.Drawing.StringFormat]::GenericTypographic

# PakTradeMash — blue and gold C, English name and the original two lines.
$pak = New-Canvas 1680 360
$g = $pak.Graphics
$blue = New-Object System.Drawing.SolidBrush (New-Color 0 122 214)
$gold = New-Object System.Drawing.SolidBrush (New-Color 245 176 18)
$ink = New-Object System.Drawing.SolidBrush (New-Color 16 36 58)
$muted = New-Object System.Drawing.SolidBrush (New-Color 36 92 148)
$g.FillEllipse($blue, 36, 36, 288, 288)
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$clear = New-Object System.Drawing.SolidBrush (New-Color 0 0 0 0)
$g.FillEllipse($clear, 98, 98, 164, 164)
$g.FillPie($clear, 36, 36, 288, 288, -34, 68)
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
$g.FillEllipse($gold, 156, 96, 156, 156)
$name = New-Font 'Segoe UI Semibold' 92 'Bold'
$tag = New-Font 'Segoe UI' 32 'Regular'
$g.DrawString('PakTradeMash', $name, $ink, 390, 78, $format)
$g.DrawString('Packaging technology', $tag, $muted, 394, 196, $format)
$g.DrawString('Systems, equipment, materials', $tag, $muted, 394, 242, $format)
Save-Canvas $pak 'paktrademash-logo-en.png'

# Nesko — stacked descriptor and the red wordmark, without the photograph.
$nesko = New-Canvas 1680 340
$g = $nesko.Graphics
$red = New-Object System.Drawing.SolidBrush (New-Color 196 0 8)
$black = New-Object System.Drawing.SolidBrush (New-Color 18 18 18)
$label = New-Font 'Segoe UI Semibold' 34 'Bold'
$word = New-Font 'Segoe UI' 168 'Bold'
$g.DrawString('NATIONAL', $label, $black, 36, 78, $format)
$g.DrawString('ENERGY SERVICE', $label, $black, 36, 126, $format)
$g.DrawString('COMPANY', $label, $black, 36, 174, $format)
$g.DrawString('NESKO', $word, $red, 520, 62, $format)
Save-Canvas $nesko 'nesko-logo-en.png'

# Vimpel Engineering — English lockup in the red and gold of the source header.
$vimpel = New-Canvas 1120 300
$g = $vimpel.Graphics
$plaque = New-Object System.Drawing.SolidBrush (New-Color 176 32 42)
$white = New-Object System.Drawing.SolidBrush (New-Color 255 250 244)
$goldInk = New-Object System.Drawing.SolidBrush (New-Color 242 196 92)
$g.FillRectangle($plaque, 0, 0, 1120, 300)
$eye = New-Font 'Segoe UI Semibold' 28 'Bold'
$title = New-Font 'Segoe UI Semibold' 78 'Bold'
Draw-Tracked $g 'INNOVATION CENTER' $eye $goldInk 72 58 6
$rule = New-Object System.Drawing.Pen (New-Color 242 196 92), 3
$g.DrawLine($rule, 72, 112, 430, 112)
$g.DrawString('Vimpel Engineering', $title, $white, 68, 148, $format)
Save-Canvas $vimpel 'vimpel-logo-en.png'

# Merkan — the gradient word, cleaned of the watermark, with the English company line.
$merkan = New-Canvas 1560 320
$g = $merkan.Graphics
$rect = New-Object System.Drawing.Rectangle 0, 40, 1500, 180
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (New-Color 3 78 118), (New-Color 18 186 168), 0
$merkanName = New-Font 'Segoe UI' 132 'Bold'
$sub = New-Font 'Segoe UI Semibold' 32 'Bold'
$deep = New-Object System.Drawing.SolidBrush (New-Color 6 78 108)
$g.DrawString('MERKAN', $merkanName, $grad, 24, 28, $format)
Draw-Tracked $g 'INVEST STROY' $sub $deep 32 210 8
Save-Canvas $merkan 'merkan-logo-en.png'

# Anhor — navy quotation wordmark, city photograph removed.
$anhor = New-Canvas 1480 300
$g = $anhor.Graphics
$navy = New-Object System.Drawing.SolidBrush (New-Color 8 12 92)
$navySoft = New-Object System.Drawing.SolidBrush (New-Color 28 42 120)
$anhorName = New-Font 'Segoe UI' 120 'Bold'
$anhorSub = New-Font 'Segoe UI Semibold' 30 'Bold'
$g.DrawString([string]([char]0x201C) + 'ANHOR' + [string]([char]0x201D), $anhorName, $navy, 24, 36, $format)
Draw-Tracked $g 'SECURITY SYSTEMS' $anhorSub $navySoft 36 200 5
Save-Canvas $anhor 'anhor-logo-en.png'

# Ovik Montag — the five-petal mark, English name and the five service words.
$ovik = New-Canvas 1760 380
$g = $ovik.Graphics
$cyan = New-Object System.Drawing.SolidBrush (New-Color 0 164 214)
$orange = New-Object System.Drawing.SolidBrush (New-Color 240 138 0)
$ovikInk = New-Object System.Drawing.SolidBrush (New-Color 16 20 26)
$ovikMuted = New-Object System.Drawing.SolidBrush (New-Color 55 64 74)
$cx = 190
$cy = 190
$angles = @(250, 322, 34, 106, 178)
for ($i = 0; $i -lt $angles.Length; $i++) {
  $state = $g.Save()
  $g.TranslateTransform($cx, $cy)
  $g.RotateTransform($angles[$i])
  $brush = $(if ($i -eq 2) { $orange } else { $cyan })
  $g.FillEllipse($brush, -34, -150, 68, 150)
  $g.Restore($state)
}
$g.FillEllipse((New-Object System.Drawing.SolidBrush (New-Color 255 255 255)), ($cx - 28), ($cy - 28), 56, 56)
$ovikName = New-Font 'Segoe UI Semibold' 84 'Bold'
$ovikTag = New-Font 'Segoe UI' 30 'Regular'
$g.DrawString('Ovik Montag', $ovikName, $ovikInk, 400, 78, $format)
$g.DrawString('Heating, ventilation, air conditioning', $ovikTag, $ovikMuted, 404, 190, $format)
$g.DrawString('Design and installation', $ovikTag, $ovikMuted, 404, 236, $format)
Save-Canvas $ovik 'ovik-logo-en.png'

# NPK BINAR — typographic mark in charcoal and copper, the roofing palette.
$binar = New-Canvas 1560 340
$g = $binar.Graphics
$charcoal = New-Object System.Drawing.SolidBrush (New-Color 28 32 36)
$copperPen = New-Object System.Drawing.Pen (New-Color 176 96 48), 10
$copperPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$copperPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$copperPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawLines($copperPen, @(
  (New-Object System.Drawing.Point 48, 86),
  (New-Object System.Drawing.Point 390, 28),
  (New-Object System.Drawing.Point 732, 86)
))
$binarName = New-Font 'Segoe UI Semibold' 108 'Bold'
$binarSub = New-Font 'Segoe UI Semibold' 28 'Bold'
$copperInk = New-Object System.Drawing.SolidBrush (New-Color 176 96 48)
$g.DrawString('NPK BINAR', $binarName, $charcoal, 40, 108, $format)
Draw-Tracked $g 'ROOFING SYSTEMS' $binarSub $copperInk 48 246 4
Save-Canvas $binar 'npk-binar-logo-en.png'

# Aleks SF — same red mark, English name and the retail-equipment line.
$aleks = New-Canvas 1680 340
$g = $aleks.Graphics
$aleksRed = New-Color 196 8 16
$aleksBrush = New-Object System.Drawing.SolidBrush $aleksRed
$lobsterPath = Join-Path $outDir 'logo-sources\aleks-lobster-clear.png'
$lobster = [System.Drawing.Image]::FromFile($lobsterPath)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($lobster, 24, 48, 132, 168)
$lobster.Dispose()
$aleksName = New-Font 'Segoe UI' 108 'Bold'
$aleksTag = New-Font 'Segoe UI Semibold' 32 'Bold'
$g.DrawString('ALEKS', $aleksName, $aleksBrush, 280, 48, $format)
$line = New-Object System.Drawing.Pen $aleksRed, 4
$g.DrawLine($line, 286, 180, 760, 180)
Draw-Tracked $g 'RETAIL EQUIPMENT' $aleksTag $aleksBrush 286 206 3
Save-Canvas $aleks 'aleks-sf-logo-en.png'

Write-Output 'done'
