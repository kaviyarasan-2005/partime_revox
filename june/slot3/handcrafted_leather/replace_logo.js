const fs = require('fs');
const path = require('path');

const svgStr = `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="5" height="32" rx="2" fill="#2F5D50" />
            <rect x="9" y="4" width="28" height="36" rx="3" fill="currentColor" opacity="0.9" />
            <rect x="9" y="4" width="5" height="36" fill="currentColor" opacity="0.55" />
            <rect x="16" y="14" width="16" height="2" rx="1" fill="#C4A962" />
            <rect x="16" y="20" width="12" height="1.5" rx="0.75" fill="#C4A962" opacity="0.7" />
            <rect x="16" y="25" width="14" height="1.5" rx="0.75" fill="#C4A962" opacity="0.5" />
          </svg>`;

const svgStr2 = `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="6" width="5" height="32" rx="2" fill="#2F5D50" />
                  <rect x="9" y="4" width="28" height="36" rx="3" fill="currentColor" opacity="0.9" />
                  <rect x="9" y="4" width="5" height="36" fill="currentColor" opacity="0.55" />
                  <rect x="16" y="14" width="16" height="2" rx="1" fill="#C4A962" />
                  <rect x="16" y="20" width="12" height="1.5" rx="0.75" fill="#C4A962" opacity="0.7" />
                  <rect x="16" y="25" width="14" height="1.5" rx="0.75" fill="#C4A962" opacity="0.5" />
                </svg>`;

// The exact spacing might vary. So let's use a regex instead.
const svgRegex = /<svg viewBox="0 0 44 44" fill="none" xmlns="http:\/\/www\.w3\.org\/2000\/svg">[\s\S]*?<\/svg>/g;

function replaceInFile(filePath, imagePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(svgRegex, `<img src="${imagePath}" alt="LeatherCraft Logo" style="width: 100%; height: 100%; object-fit: contain;">`);
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated', filePath);
    }
}

// Update index.html
replaceInFile(path.join(__dirname, 'index.html'), 'assets/leather_logo.png');

// Update files in pages/
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            replaceInFile(path.join(pagesDir, file), '../assets/leather_logo.png');
        }
    }
}
