// Navigation functionality
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = item.getAttribute('data-page');
    
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Update active nav item
    navItems.forEach(navItem => {
      navItem.classList.remove('active');
    });
    item.classList.add('active');
    
    // Close mobile menu if open
    navLinks.classList.remove('active');
  });
});

// Demo page functionality
const fileInput = document.getElementById('audioFile');
const predictButton = document.getElementById('predictButton');
const filenameDisplay = document.getElementById('filename');

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    predictButton.disabled = false;
    filenameDisplay.textContent = `Selected: ${e.target.files[0].name}`;
  } else {
    predictButton.disabled = true;
    filenameDisplay.textContent = '';
  }
});

// Add event listener to the predict button
predictButton.addEventListener('click', uploadAndPredict);

async function uploadAndPredict() {
  const file = fileInput.files[0];
  if (!file) return;
  
  predictButton.disabled = true;
  predictButton.textContent = 'Analyzing...';
  
  // Show loading animation
  const resultContainer = document.querySelector('.result-container');
  resultContainer.innerHTML = `
    <div class="loading-wave">
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
    </div>
    <p style="text-align: center; margin-top: 1rem;">Analyzing voice patterns...</p>
  `;

  const formData = new FormData();
  formData.append("file", file);

  // Record start time for minimum delay
  const startTime = Date.now();
  const minimumDelay = 2000; // 2 seconds minimum delay

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData
    });

    // Calculate remaining time to fulfill minimum delay
    const elapsedTime = Date.now() - startTime;
    const remainingDelay = Math.max(0, minimumDelay - elapsedTime);

    // Wait for remaining delay time if needed
    if (remainingDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingDelay));
    }

    const result = await response.json();
    if (result.prediction) {
      resultContainer.innerHTML = `
        <h2 id="result" class="result-animation">
          Detected emotion: <strong>${result.prediction}</strong>
        </h2>
      `;
    } else {
      resultContainer.innerHTML = `
        <h2 id="result" class="result-animation">
          Error: ${result.error || "Unknown error occurred"}
        </h2>
      `;
    }
  } catch (error) {
    console.error(error);
    resultContainer.innerHTML = `
      <h2 id="result" class="result-animation">
        Network error: Please try again
      </h2>
    `;
  } finally {
    predictButton.disabled = false;
    predictButton.textContent = 'Analyze Emotion';
  }
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// Settings page functionality
const audioQualitySelect = document.getElementById('audioQuality');
const languageSelect = document.getElementById('languageSelect');

// Load saved settings
if (localStorage.getItem('audioQuality')) {
  audioQualitySelect.value = localStorage.getItem('audioQuality');
}

if (localStorage.getItem('language')) {
  languageSelect.value = localStorage.getItem('language');
}

// Save settings when changed
audioQualitySelect.addEventListener('change', () => {
  localStorage.setItem('audioQuality', audioQualitySelect.value);
});

languageSelect.addEventListener('change', () => {
  localStorage.setItem('language', languageSelect.value);
});