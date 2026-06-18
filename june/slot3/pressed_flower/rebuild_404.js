const fs = require('fs');

const contactHtml = fs.readFileSync('d:/Projects/Templates/Kaviyarasan/June-26/pressed_flower/pages/contact.html', 'utf8');

// Extract the header (from <!DOCTYPE down to </nav>)
const headerMatch = contactHtml.match(/<!DOCTYPE html>[\s\S]*?<\/nav>/);
let header = headerMatch[0];

// Remove the "active" class from Contact in the navbar
header = header.replace(/class="nav-link active"/g, 'class="nav-link"');
header = header.replace(/class="mobile-nav-link active"/g, 'class="mobile-nav-link"');

// Extract the footer (from <!-- Footer --> down to </html>)
const footerMatch = contactHtml.match(/<!-- Footer -->[\s\S]*?<\/html>/);
const footer = footerMatch[0];

// Define the new 404 Hero Section
const heroSection = `
  <!-- 404 Hero Section -->
  <section class="page-hero" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('../assets/img/pressed_botanicals.png'); background-size: cover; background-position: center; color: white;">
    <div class="container text-center fade-up" style="max-width: 600px; padding: var(--sp-10) 0;">
      <!-- Styled Botanical Leaf Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4" style="margin: 0 auto; color: var(--color-rose);">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
      </svg>
      
      <div style="font-size: 4rem; font-weight: bold; letter-spacing: 4px; margin-bottom: 1rem; color: var(--color-rose);">404</div>
      <h1 class="mb-4" style="color: white; font-size: 3rem;">Blossom Not Found</h1>
      <p class="mb-8" style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 2.5rem;">The botanical path you followed seems to have withered away, or perhaps it was never planted in our studio garden.</p>
      
      <div class="flex-center gap-3" style="flex-wrap: wrap;">
        <a href="../index.html" class="btn btn-rose btn-rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          Return to Home
        </a>
      </div>
    </div>
  </section>
`;

// Combine them into the new 404.html content
const new404Content = `${header}\n${heroSection}\n${footer}`;

// Overwrite 404.html
fs.writeFileSync('d:/Projects/Templates/Kaviyarasan/June-26/pressed_flower/pages/404.html', new404Content, 'utf8');
console.log('404.html successfully rewritten!');
