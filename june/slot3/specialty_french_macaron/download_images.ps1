$htmlFiles = Get-ChildItem -Path "d:\Projects\Templates\Kaviyarasan\June-26\specialty_french_macaron" -Filter "*.html" -Recurse
$imgDir = "d:\Projects\Templates\Kaviyarasan\June-26\specialty_french_macaron\assets\images"
if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

$urlMap = @{}

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $matches = [regex]::Matches($content, 'https://images\.unsplash\.com/[^\s"''<>]+')
    
    foreach ($match in $matches) {
        $url = $match.Value
        $downloadUrl = $url.Replace("&amp;", "&")
        
        if (-not $urlMap.ContainsKey($url)) {
            $hash = [BitConverter]::ToString((New-Object Security.Cryptography.MD5CryptoServiceProvider).ComputeHash([Text.Encoding]::UTF8.GetBytes($url))).Replace("-", "").ToLower().Substring(0, 8)
            $filename = "img_$hash.jpg"
            $localPath = Join-Path $imgDir $filename
            
            Write-Host "Downloading $downloadUrl to $filename"
            try {
                Invoke-WebRequest -Uri $downloadUrl -OutFile $localPath -UseBasicParsing
                $urlMap[$url] = $filename
            } catch {
                Write-Host "Failed to download $downloadUrl"
            }
        }
        
        if ($urlMap.ContainsKey($url)) {
            $filename = $urlMap[$url]
            $relPath = ""
            if ($file.Directory.Name -eq "pages") {
                $relPath = "../assets/images/$filename"
            } else {
                $relPath = "./assets/images/$filename"
            }
            $content = $content.Replace($url, $relPath)
        }
    }
    
    Set-Content -Path $file.FullName -Value $content
}
Write-Host "Done"
