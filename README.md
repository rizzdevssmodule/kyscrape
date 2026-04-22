# 🚀 KyScrape

[![NPM Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/)
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
    // 1. Just fetch data
    const response = await kyscrape('https://example.com');
    console.log(response.text());

    // 2. Or destructure for more control
    const { data, engine, json } = await kyscrape('https://api.site.com/data');
    console.log(`Bypassed using ${engine} engine`);
    
    // Always close sessions when done
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

# Save to file
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

Built with ❤️ by **Antigravity** and **The Community**.
