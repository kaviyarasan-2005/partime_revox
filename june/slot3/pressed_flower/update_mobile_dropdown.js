const fs = require('fs');
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

    // Find the mobile-menu section
    // We want to replace the first two a tags (Home 1 and Home 2) with the dropdown wrapper
    content = content.replace(/<a href="([^"]+)" class="mobile-nav-link([^"]*)">Home 1<\/a>\s*<a href="([^"]+)" class="mobile-nav-link([^"]*)">Home 2<\/a>/g, 
`<div class="mobile-nav-dropdown">
          <button class="mobile-nav-link mobile-dropdown-toggle" style="width: 100%; display: flex; justify-content: space-between; align-items: center; border: none; background: none; text-align: left; cursor: pointer; padding: var(--sp-3) 0;">
            Home
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-chevron" style="transition: transform 0.3s ease;"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="mobile-dropdown-menu" style="display: none; padding-left: var(--sp-6);">
            <a href="$1" class="mobile-nav-link$2">Home 1</a>
            <a href="$3" class="mobile-nav-link$4">Home 2</a>
          </div>
        </div>`);

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
});
