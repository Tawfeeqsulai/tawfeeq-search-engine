let mode = "text";

const loader = document.getElementById("loader");
const results = document.getElementById("results");
const imageBox = document.getElementById("imageBox");
const voiceBox = document.getElementById("voiceBox");
const searchInput = document.getElementById("searchInput");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const searchArea = document.querySelector(".search-area");
const modeSwitcher = document.getElementById("modeSwitcher");
const micBtn = document.getElementById("micBtn");
const soundWaves = document.getElementById("soundWaves");

// ================= LOADER =================

function showLoader() {
  loader.style.display = "block";
  loader.style.animation = "fade-in-up 0.5s ease";
}

function hideLoader() {
  loader.style.animation = "fade-out 0.3s ease";
  setTimeout(() => {
    loader.style.display = "none";
  }, 300);
}

// ================= EXECUTE SEARCH =================

function executeSearch() {
  if (mode === "text") {
    textSearch();
  } else if (mode === "image") {
    searchImage();
  } else if (mode === "voice") {
    alert("Please use the microphone button to search with voice");
  }
}

// ================= TEXT SEARCH =================

async function textSearch() {
  const q = searchInput.value.trim();

  if (q === "") {
    shakeElement(searchInput);
    alert("Please type something to search");
    return;
  }

  showLoader();
  results.innerHTML = "";
  searchArea.classList.remove("show-result");

  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json`
    );

    const data = await res.json();

    hideLoader();

    // Show mode switcher and hide feature cards
    document.body.classList.add("focus-mode");
    modeSwitcher.classList.remove("hidden");
    setTimeout(() => {
      modeSwitcher.classList.add("show");
    }, 100);

    if (data.AbstractText) {
      let text = data.AbstractText;

      if (text.length > 400) {
        text = text.substring(0, 400) + "...";
      }

      results.innerHTML = `
        <h3>${data.Heading || "Search Result"}</h3>
        <p>${text}</p>
        ${data.AbstractURL ? `<a href="${data.AbstractURL}" target="_blank" rel="noopener">
          Read More →
        </a>` : ''}
      `;

      searchArea.classList.add("show-result");
      
      // Scroll to top of search area
      setTimeout(() => {
        document.getElementById("searchArea").scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      let relatedHTML = "<h3>Related Topics</h3><div style='margin-top: 20px;'>";
      
      data.RelatedTopics.slice(0, 5).forEach((topic, index) => {
        if (topic.Text && topic.FirstURL) {
          relatedHTML += `
            <div style="
              background: var(--bg-card);
              padding: 20px;
              border-radius: 15px;
              margin-bottom: 15px;
              border: 1px solid var(--border-color);
              transition: all 0.3s ease;
              animation: fade-in-up 0.5s ease backwards;
              animation-delay: ${index * 0.1}s;
            " onmouseover="this.style.transform='translateX(10px)'; this.style.borderColor='var(--accent-primary)'" 
               onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='var(--border-color)'">
              <a href="${topic.FirstURL}" target="_blank" rel="noopener" style="
                color: var(--text-primary);
                text-decoration: none;
                display: block;
              ">
                ${topic.Text.substring(0, 200)}${topic.Text.length > 200 ? '...' : ''}
              </a>
            </div>
          `;
        }
      });
      
      relatedHTML += "</div>";
      results.innerHTML = relatedHTML;
      searchArea.classList.add("show-result");
      
      // Scroll to top of search area
      setTimeout(() => {
        document.getElementById("searchArea").scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      results.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;">🔍</div>
          <h3 style="margin-bottom: 15px;">No Results Found</h3>
          <p style="color: var(--text-muted);">
            No instant result found for "${q}". Try different keywords or use web search engines for more results.
          </p>
        </div>
      `;
      searchArea.classList.add("show-result");
      
      // Scroll to top of search area
      setTimeout(() => {
        document.getElementById("searchArea").scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

  } catch (error) {
    hideLoader();

    results.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;">⚠️</div>
        <h3 style="margin-bottom: 15px;">Network Error</h3>
        <p style="color: var(--text-muted);">
          Please check your connection and try again.
        </p>
      </div>
    `;
    searchArea.classList.add("show-result");

    // Still show mode switcher
    document.body.classList.add("focus-mode");
    modeSwitcher.classList.remove("hidden");
    setTimeout(() => {
      modeSwitcher.classList.add("show");
    }, 100);
  }
}

// Enter key to search
searchInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    executeSearch();
  }
});

// ================= IMAGE SEARCH =================

imageInput.addEventListener("change", function() {
  const file = this.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function() {
    preview.src = reader.result;
    imagePreviewContainer.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
});

async function searchImage() {
  if (!preview.src || preview.src === "") {
    shakeElement(imageBox);
    alert("Please upload an image first");
    return;
  }

  showLoader();

  // Simulate image search
  setTimeout(() => {
    hideLoader();

    // Show mode switcher
    document.body.classList.add("focus-mode");
    modeSwitcher.classList.remove("hidden");
    setTimeout(() => {
      modeSwitcher.classList.add("show");
    }, 100);

    results.innerHTML = `
      <h3>🖼️ Image Search Results</h3>
      <p style="margin-bottom: 25px; color: var(--text-secondary);">
        Based on your uploaded image, here are similar findings:
      </p>
      
      <div style="
        background: var(--bg-card);
        padding: 25px;
        border-radius: 18px;
        margin-bottom: 18px;
        border: 1px solid var(--border-color);
        animation: fade-in-up 0.6s ease backwards;
        animation-delay: 0.1s;
      ">
        <h4 style="
          color: var(--text-primary);
          margin-bottom: 12px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <span style="font-size: 1.5rem;">🎯</span>
          Similar Images
        </h4>
        <p style="color: var(--text-secondary); line-height: 1.7;">
          In a production environment, this would show visually similar images from across the web using reverse image search APIs like Google Vision AI, TinEye, or Bing Visual Search.
        </p>
      </div>

      <div style="
        background: var(--bg-card);
        padding: 25px;
        border-radius: 18px;
        margin-bottom: 18px;
        border: 1px solid var(--border-color);
        animation: fade-in-up 0.6s ease backwards;
        animation-delay: 0.2s;
      ">
        <h4 style="
          color: var(--text-primary);
          margin-bottom: 12px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <span style="font-size: 1.5rem;">🤖</span>
          Object Detection
        </h4>
        <p style="color: var(--text-secondary); line-height: 1.7;">
          AI-powered object detection would identify items, people, landmarks, or text within the image using advanced machine learning models.
        </p>
      </div>

      <div style="
        background: var(--bg-card);
        padding: 25px;
        border-radius: 18px;
        border: 1px solid var(--border-color);
        animation: fade-in-up 0.6s ease backwards;
        animation-delay: 0.3s;
      ">
        <h4 style="
          color: var(--text-primary);
          margin-bottom: 12px;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <span style="font-size: 1.5rem;">🔗</span>
          Related Content
        </h4>
        <p style="color: var(--text-secondary); line-height: 1.7;">
          Find web pages, products, articles, and locations related to the image content across the internet.
        </p>
      </div>
    `;

    searchArea.classList.add("show-result");
    
    // Scroll to top of search area
    setTimeout(() => {
      document.getElementById("searchArea").scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, 1800);
}

// ================= VOICE SEARCH =================

function voiceSearch() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice search is not supported in your browser. Please try Chrome or Edge.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  const voiceText = document.getElementById("voiceText");

  voiceText.innerText = "Listening...";
  micBtn.classList.add("listening");
  soundWaves.classList.remove("hidden");

  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;

    searchInput.value = transcript;
    voiceText.innerHTML = `
      <span style="color: var(--text-muted);">You said:</span><br>
      <span style="font-size: 1.4rem; color: var(--accent-primary);">"${transcript}"</span>
    `;
    micBtn.classList.remove("listening");
    soundWaves.classList.add("hidden");

    // Perform text search with voice input
    setTimeout(() => {
      textSearch();
    }, 800);
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error:", event.error);
    voiceText.innerText = "Error: " + event.error + ". Tap to try again.";
    micBtn.classList.remove("listening");
    soundWaves.classList.add("hidden");
  };

  recognition.onend = function() {
    micBtn.classList.remove("listening");
    soundWaves.classList.add("hidden");
  };
}

// ================= THEME TOGGLE =================

function toggleTheme() {
  document.body.classList.toggle("light");
  
  // Add animation to theme button
  const themeBtn = document.getElementById("themeBtn");
  themeBtn.style.animation = "none";
  setTimeout(() => {
    themeBtn.style.animation = "spin 0.6s ease";
  }, 10);
  
  // Save preference to localStorage
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  }
});

// ================= MODE ACTIVATION =================

function activateMode(m) {
  mode = m;

  // Update active state in mode pills
  document.querySelectorAll(".mode-pills button").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.querySelector(`.mode-pills button[data-mode="${m}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  // Reset UI
  results.innerHTML = "";
  searchArea.classList.remove("show-result");

  imageBox.classList.add("hidden");
  voiceBox.classList.add("hidden");
  imagePreviewContainer.classList.add("hidden");

  // Show appropriate UI for selected mode
  if (m === "image") {
    // Show image upload box above cards
    imageBox.classList.remove("hidden");
    
  } else if (m === "voice") {
    // Show voice box above cards
    voiceBox.classList.remove("hidden");
    document.getElementById("voiceText").innerText = "Tap microphone and speak";
    
  } else if (m === "text") {
    // For text mode, just focus on input
    searchInput.focus();
  }

  // Scroll to search area
  document.getElementById("searchArea").scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ================= DRAG & DROP for Images =================

const imageBoxElement = document.getElementById("imageBox");

imageBoxElement.addEventListener("dragover", function(e) {
  e.preventDefault();
  this.style.transform = "scale(1.02)";
  this.style.opacity = "0.8";
});

imageBoxElement.addEventListener("dragleave", function(e) {
  e.preventDefault();
  this.style.transform = "scale(1)";
  this.style.opacity = "1";
});

imageBoxElement.addEventListener("drop", function(e) {
  e.preventDefault();
  this.style.transform = "scale(1)";
  this.style.opacity = "1";

  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function() {
      preview.src = reader.result;
      imagePreviewContainer.classList.remove("hidden");
    };

    reader.readAsDataURL(files[0]);
  }
});

// ================= UTILITY FUNCTIONS =================

function shakeElement(element) {
  element.style.animation = "shake 0.5s ease";
  setTimeout(() => {
    element.style.animation = "";
  }, 500);
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
  }
  @keyframes fade-out {
    to { 
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// ================= CARD TILT EFFECT =================

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// ================= CURSOR GLOW EFFECT =================

const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--glow-primary), transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 9999;
  mix-blend-mode: screen;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = (e.clientX - 150) + 'px';
  cursorGlow.style.top = (e.clientY - 150) + 'px';
  cursorGlow.style.opacity = '0.15';
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});
