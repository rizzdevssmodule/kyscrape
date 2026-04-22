# 🚀 KyScrape

[![NPM Version](https://img.shields.io/badge/version-1.1.2-blue.svg)](https://www.npmjs.com/package/kyscrape)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Engine: Nitro](https://img.shields.io/badge/Engine-Nitro--TLS-cyan.svg)]()
[![Stealth: Enabled](https://img.shields.io/badge/Stealth-Active-magenta.svg)]()

**KyScrape** is a next-generation Node.js scraping module designed for high performance and maximum stealth. It intelligently switches between a lightning-fast Nitro Engine (HTTP/2) and a powerful Stealth Engine (Playwright) to bypass even the toughest WAFs and Cloudflare protections.

![KyScrape Logo](./kyscrape_logo_1776862852000.png)

---

## ✨ Key Features

- **🚀 Nitro-Engine (Layer 1)**: Ultra-fast request-based scraping using `undici` with HTTP/2 and custom TLS fingerprinting.
- **🕵️ Stealth-Engine (Layer 2)**: Automatic fallback to a headless browser (Playwright) when challenges (Cloudflare/WAF) are detected.
- **🔄 Adaptive Switching**: Seamless transition between engines without any manual configuration.
- **🎭 Identity Masking**: Built-in browser fingerprinting, realistic headers, and user-agent rotation.
- **📦 Zero-Config Installation**: Automatic setup of all dependencies, including browsers, with a single command.
- **💻 Global CLI**: Run scrapers directly from your terminal with ease.

---

## 📦 Installation

Install **KyScrape** effortlessly:

```bash
npm install kyscrape
```

*Note: All necessary browser dependencies for the Stealth Engine will be installed automatically during the post-install phase.*

---

## 🚀 Quick Start

### As a Module

```javascript
const kyscrape = require('kyscrape');

(async () => {
    // 1. Scraping & Parsing with Built-in Cheerio ($)
    const { $, engine } = await kyscrape('https://example.com');
    console.log(`KyScrape v1.1.2`);
    console.log($('h1').text()); // Easy jQuery-like syntax!

    // 2. Take a full-page Screenshot
    await kyscrape.screenshot('https://google.com', 'google.png');

    // 3. Generate a PDF of the page
    await kyscrape.pdf('https://wikipedia.org', 'wiki.pdf');
    
    await kyscrape.close();
})();
```

### Via CLI

Run KyScrape globally from anywhere:

```bash
# Install globally
npm install -g .

# Simple request
kyscrape https://example.com

# Take a screenshot
kyscrape https://example.com --ss result.png

# Save as PDF
kyscrape https://example.com --pdf doc.pdf

# Save data to file
kyscrape https://example.com output.html
```

---

## 🛠 Advanced Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `autoStealth` | `boolean` | `true` | Automatically switch to Stealth Engine if Nitro is blocked. |
| `headers` | `object` | `{}` | Custom headers to override defaults. |
| `proxy` | `string` | `null` | Optional proxy URL (e.g., `http://user:pass@host:port`). |

---

## 🛡 License

This project is licensed under the **MIT License**. Feel free to use it for personal and commercial projects.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page]().
