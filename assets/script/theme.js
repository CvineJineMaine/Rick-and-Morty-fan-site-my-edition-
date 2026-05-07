const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const label = document.getElementById('themeLabel');

// 1. Check for saved theme or system preference
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// 2. Apply the theme on load
html.setAttribute('data-bs-theme', savedTheme);
toggle.checked = savedTheme === 'dark';
label.innerText = savedTheme === 'dark' ? '☀️' : '🌙';

// 3. Listen for toggle changes
toggle.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'dark' : 'light';
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    label.innerText = toggle.checked ? '☀️' : '🌙';
});