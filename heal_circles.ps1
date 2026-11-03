Add-Type -AssemblyName System.Drawing

$frame = New-Object System.Drawing.Bitmap("d:\DharaniHerbbals-web-main\DharaniHerbbals-web-main\src\assets\wild_turmeric_hero_clean.jpg")
$w = $frame.Width
$h = $frame.Height
$clean = New-Object System.Drawing.Bitmap($frame)

# 1. Clean left arrow circle: center (52, 154), radius 42.
# Sample from the leaves above: y - 55
for ($y = 110; $y -le 198; $y++) {
    for ($x = 10; $x -le 95; $x++) {
        $dx = $x - 52
        $dy = $y - 154
        $dist = [Math]::Sqrt($dx*$dx + $dy*$dy)
        if ($dist -le 42) {
            $sy = [Math]::Max(0, $y - 58)
            $sample = $frame.GetPixel($x, $sy)
            if ($dist -le 30) {
                $clean.SetPixel($x, $y, $sample)
            } else {
                $t = ($dist - 30.0) / 12.0
                $orig = $frame.GetPixel($x, $y)
                $r = [int]($sample.R * (1.0 - $t) + $orig.R * $t)
                $g = [int]($sample.G * (1.0 - $t) + $orig.G * $t)
                $b = [int]($sample.B * (1.0 - $t) + $orig.B * $t)
                $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
}

# 2. Clean right arrow circle: center (575, 154), radius 42.
# Sample from the bokeh above: y - 55
for ($y = 110; $y -le 198; $y++) {
    for ($x = 530; $x -le 618; $x++) {
        $dx = $x - 575
        $dy = $y - 154
        $dist = [Math]::Sqrt($dx*$dx + $dy*$dy)
        if ($dist -le 42) {
            $sy = [Math]::Max(0, $y - 58)
            $sample = $frame.GetPixel($x, $sy)
            if ($dist -le 30) {
                $clean.SetPixel($x, $y, $sample)
            } else {
                $t = ($dist - 30.0) / 12.0
                $orig = $frame.GetPixel($x, $y)
                $r = [int]($sample.R * (1.0 - $t) + $orig.R * $t)
                $g = [int]($sample.G * (1.0 - $t) + $orig.G * $t)
                $b = [int]($sample.B * (1.0 - $t) + $orig.B * $t)
                $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
}

$tmpPath = "d:\DharaniHerbbals-web-main\DharaniHerbbals-web-main\src\assets\wild_turmeric_hero_clean_tmp.jpg"
$clean.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$clean.Dispose()
$frame.Dispose()

Move-Item -Path $tmpPath -Destination "d:\DharaniHerbbals-web-main\DharaniHerbbals-web-main\src\assets\wild_turmeric_hero_clean.jpg" -Force
Write-Host "Circles healed seamlessly!"

