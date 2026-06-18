import os, re
import glob

# Files
files = glob.glob('d:/Projects/Templates/Kaviyarasan/June-26/pressed_flower/*.html') + glob.glob('d:/Projects/Templates/Kaviyarasan/June-26/pressed_flower/pages/*.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove SVGs inside mobile-nav-link
    new_content = re.sub(r'<a href="([^"]+)" class="mobile-nav-link([^"]*)">\s*<svg.*?</svg>\s*(.*?)\s*</a>', r'<a href="\1" class="mobile-nav-link\2">\3</a>', content, flags=re.DOTALL)
    
    # 2. Update texts
    new_content = new_content.replace('>About Us</a>', '>About</a>')
    new_content = new_content.replace('>Services & Custom orders</a>', '>Service</a>')
    new_content = new_content.replace('>Pricing Tiers</a>', '>Pricing</a>')
    new_content = new_content.replace('>The Journal</a>', '>Blog</a>')
    new_content = new_content.replace('>Contact Studio</a>', '>Contact</a>')
    
    # 3. Remove Other Links section
    new_content = re.sub(r'<div class="nav-section">\s*<div class="nav-section-label">Other Links</div>.*?</div>\s*</div>\s*</nav>', r'</div>\n  </nav>', new_content, flags=re.DOTALL)

    # 4. Remove Studio Pages label
    new_content = re.sub(r'<div class="nav-section-label">Studio Pages</div>\s*', r'', new_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Updated {filepath}')
