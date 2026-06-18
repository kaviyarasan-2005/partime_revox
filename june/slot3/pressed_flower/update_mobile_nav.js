const fs = require('fs');

// Use native fs functions to glob since glob might not be installed
const path = require('path');

function getFiles(dir, filter) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('assets')) {
               results = results.concat(getFiles(file, filter));
            }
        } else {
            if (file.endsWith(filter)) results.push(file);
        }
    });
    return results;
}

const files = getFiles('d:/Projects/Templates/Kaviyarasan/June-26/pressed_flower', '.html');

files.forEach(filepath => {
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Remove SVGs inside mobile-nav-link
    content = content.replace(/<a href="([^"]+)" class="mobile-nav-link([^"]*)">\s*<svg[\s\S]*?<\/svg>\s*(.*?)\s*<\/a>/g, '<a href="$1" class="mobile-nav-link$2">$3</a>');
    
    // 2. Update texts
    content = content.replace(/>About Us<\/a>/g, '>About</a>');
    content = content.replace(/>Services & Custom orders<\/a>/g, '>Service</a>');
    content = content.replace(/>Pricing Tiers<\/a>/g, '>Pricing</a>');
    content = content.replace(/>The Journal<\/a>/g, '>Blog</a>');
    content = content.replace(/>Contact Studio<\/a>/g, '>Contact</a>');
    
    // 3. Remove Other Links section
    content = content.replace(/<div class="nav-section">\s*<div class="nav-section-label">Other Links<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/nav>/g, '</div>\n  </nav>');

    // 4. Remove Studio Pages label
    content = content.replace(/<div class="nav-section-label">Studio Pages<\/div>\s*/g, '');

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
});
