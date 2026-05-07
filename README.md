# Garren Dullas - Machine Learning Engineer Portfolio

A modern, responsive e-portfolio website showcasing machine learning projects, cloud computing expertise, and software development skills.

## 🚀 Live Demo

Visit the live site: [https://acteus.github.io](https://acteus.github.io)

## ✨ Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Project Showcase** - Highlights machine learning and cloud computing projects
- **Interactive Elements** - Project filtering, smooth scrolling, and dynamic content
- **Contact Form** - Easy way for visitors to get in touch
- **Performance Optimized** - Fast loading times and smooth interactions

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom styles with Tailwind CSS framework
- **JavaScript (ES6+)** - Interactive functionality
- **AOS (Animate On Scroll)** - Scroll animations
- **Font Awesome** - Icon library
- **GitHub Pages** - Hosting and deployment

## 📁 Project Structure

```
E-Portfolio/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Custom CSS styles
├── js/
│   └── main.js        # JavaScript functionality
├── assets/            # Images and other assets (optional)
├── Resume.pdf         # Resume file
├── README.md          # This file
└── .gitignore        # Git ignore file
```

## 🚀 Deployment to GitHub Pages

### Option 1: Using Repository Settings (Recommended)

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Create a new repository named `Acteus.github.io` (or `yourusername.github.io`)
   - Make it public

2. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ML Engineer Portfolio"
   git branch -M main
   git remote add origin https://github.com/Acteus/Acteus.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select `main` branch
   - Click "Save"
   - Your site will be available at `https://acteus.github.io`

### Option 2: Using GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Option 3: Using a Project Repository

If you don't want to use `username.github.io`:

1. Create any repository (e.g., `portfolio`)
2. Push your code
3. Go to Settings → Pages
4. Select `main` branch
5. Your site will be at `https://acteus.github.io/portfolio`

## 📝 Customization Guide

### Update Personal Information

1. **Contact Details** - Edit [index.html](index.html) lines with email, phone, GitHub
2. **Profile Picture** - Replace the gradient circle with an image
3. **Resume** - Add your PDF to the project and link it

### Add More Projects

In [index.html](index.html), copy a project card template:

```html
<div class="project-card" data-category="ml" data-aos="fade-up">
    <div class="project-image bg-gradient-to-br from-blue-500 to-purple-600">
        <i class="fas fa-icon-name text-6xl text-white"></i>
    </div>
    <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">Project Name</h3>
        <p class="text-gray-600 mb-4">Project description...</p>
        <div class="flex flex-wrap gap-2 mb-4">
            <span class="tech-badge">Tech 1</span>
            <span class="tech-badge">Tech 2</span>
        </div>
        <div class="flex gap-3">
            <a href="github-link" target="_blank" class="btn-sm-primary">
                <i class="fab fa-github mr-1"></i>GitHub
            </a>
        </div>
    </div>
</div>
```

### Modify Colors

Update the Tailwind config in [index.html](index.html):

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',    // Change to your color
                secondary: '#8b5cf6',  // Change to your color
            }
        }
    }
}
```

### Add Contact Form Integration

Replace the form submission in [js/main.js](js/main.js) with:

**Using Formspree:**
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

**Using EmailJS:**
```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data)
    .then(() => { /* success */ });
```

## 🎨 Customization Tips

### Add Custom Fonts

Add Google Fonts in `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Update [css/style.css](css/style.css):

```css
body {
    font-family: 'Inter', sans-serif;
}
```

### Add Dark Mode

Add this to [css/style.css](css/style.css):

```css
@media (prefers-color-scheme: dark) {
    body {
        background: #0f172a;
        color: #f1f5f9;
    }
}
```

## 📊 SEO Optimization

The site includes:
- Meta descriptions
- Open Graph tags
- Semantic HTML
- Mobile-friendly design
- Fast loading times

To improve SEO further:
1. Add a `sitemap.xml`
2. Create a `robots.txt`
3. Add structured data (JSON-LD)
4. Optimize images with WebP format

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Acteus/Acteus.github.io.git
   cd Acteus.github.io
   ```

2. **Open with a local server**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (http-server):
   ```bash
   npx http-server
   ```
   
   Or simply open [index.html](index.html) in your browser

3. **Make changes** and test locally before pushing

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a personal portfolio, but feel free to:
- Fork the repository
- Use it as a template for your own portfolio
- Submit issues or suggestions

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 📧 Contact

- **Email**: garrendullas@gmail.com
- **GitHub**: [@Acteus](https://github.com/Acteus)
- **Phone**: 0947 497 4843

## 🎯 Future Enhancements

- [ ] Add blog section
- [ ] Integrate with CMS (Contentful/Strapi)
- [ ] Add project detail pages
- [ ] Implement dark mode toggle
- [ ] Add more animations
- [ ] Create downloadable resume feature
- [ ] Add visitor analytics
- [ ] Implement i18n (multi-language support)

---

**Built with ❤️ by Garren Dullas**

⭐ If you found this helpful, please star the repository!
