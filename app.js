const MAALA_SIZE = 108;

class MaalaCounter {
  constructor() {
    this.currentCount = 0;
    this.completedMaalas = 0;
    this.lifetimeTotal = 0;
    this.todayTotal = 0;
    this.lastDate = new Date().toDateString();
    
    // For debouncing Volume Up
    this.lastPressTime = 0;
    this.isAnimatingCompletion = false;

    // DOM Elements
    this.currentCountEl = document.getElementById('current-count');
    this.remainingCountEl = document.getElementById('remaining-count');
    this.maalaCountEl = document.getElementById('maala-count');
    this.completionMessageEl = document.getElementById('completion-message');
    this.todayTotalEl = document.getElementById('today-total');
    this.lifetimeTotalEl = document.getElementById('lifetime-total');
    
    // Audio Elements for Hack
    this.startOverlay = document.getElementById('start-overlay');
    this.startButton = document.getElementById('start-button');
    this.silentAudio = document.getElementById('silent-audio');
    
    // Audio state
    this.isProgrammaticVolumeChange = false;

    this.loadStats();
    this.updateUI();
    this.setupListeners();
  }

  loadStats() {
    const savedStats = localStorage.getItem('maalaStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        
        // Reset today's total if it's a new day
        const today = new Date().toDateString();
        if (stats.lastDate !== today) {
          stats.todayTotal = 0;
          stats.lastDate = today;
        }

        this.currentCount = stats.currentCount || 0;
        this.completedMaalas = stats.completedMaalas || 0;
        this.lifetimeTotal = stats.lifetimeTotal || 0;
        this.todayTotal = stats.todayTotal || 0;
        this.lastDate = stats.lastDate;
      } catch (e) {
        console.error("Error loading stats", e);
      }
    }
  }

  saveStats() {
    const stats = {
      currentCount: this.currentCount,
      completedMaalas: this.completedMaalas,
      lifetimeTotal: this.lifetimeTotal,
      todayTotal: this.todayTotal,
      lastDate: this.lastDate
    };
    localStorage.setItem('maalaStats', JSON.stringify(stats));
  }

  updateUI() {
    this.currentCountEl.textContent = this.currentCount;
    this.remainingCountEl.textContent = MAALA_SIZE - this.currentCount;
    this.maalaCountEl.textContent = this.completedMaalas;
    this.todayTotalEl.textContent = this.todayTotal;
    this.lifetimeTotalEl.textContent = this.lifetimeTotal;
  }

  triggerPulse() {
    this.currentCountEl.classList.remove('pulse');
    // Trigger reflow to restart animation
    void this.currentCountEl.offsetWidth;
    this.currentCountEl.classList.add('pulse');
    
    setTimeout(() => {
      this.currentCountEl.classList.remove('pulse');
    }, 150);
  }

  vibrate(pattern) {
    if (navigator.vibrate) {
      // Catch errors just in case browser blocks it
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  handleVolumePress() {
    // Prevent duplicate events within 300ms (debounce)
    const now = Date.now();
    if (now - this.lastPressTime < 300) return;
    this.lastPressTime = now;

    // Don't count while animating completion
    if (this.isAnimatingCompletion) return;

    this.currentCount++;
    this.todayTotal++;
    this.lifetimeTotal++;
    
    this.triggerPulse();
    this.vibrate(50); // Subtle vibration for each count

    if (this.currentCount >= MAALA_SIZE) {
      this.handleCompletion();
    } else {
      this.updateUI();
      this.saveStats();
    }
  }

  handleCompletion() {
    this.isAnimatingCompletion = true;
    this.currentCount = MAALA_SIZE; // Ensure it shows 108
    this.completedMaalas++;
    this.updateUI();
    this.saveStats();
    
    this.vibrate([100, 50, 100]); // Stronger vibration for completion

    this.completionMessageEl.classList.remove('hidden');

    setTimeout(() => {
      this.completionMessageEl.classList.add('hidden');
      this.currentCount = 0;
      this.updateUI();
      this.saveStats();
      this.isAnimatingCompletion = false;
    }, 2500); // Show completion message for 2.5 seconds
  }

  resetVolume() {
    this.isProgrammaticVolumeChange = true;
    this.silentAudio.volume = 0.5;
    
    // Reset flag after browser processes the change
    setTimeout(() => {
      this.isProgrammaticVolumeChange = false;
    }, 50);
  }

  setupListeners() {
    // 1. Initialize Audio on Start button tap
    this.startButton.addEventListener('click', () => {
      // Play the silent audio to start hijacking media keys
      this.silentAudio.play().then(() => {
        this.startOverlay.classList.add('hidden');
        this.resetVolume();
      }).catch(err => {
        console.error("Audio playback failed:", err);
        alert("ऑडियो शुरू नहीं हो सका। कृपया सुनिश्चित करें कि आपका ब्राउज़र मीडिया प्लेबैक की अनुमति देता है।");
      });
    });

    // 2. Listen to volume changes
    this.silentAudio.addEventListener('volumechange', () => {
      if (this.isProgrammaticVolumeChange) {
        return; // Ignore our own volume resets
      }

      // We detected a physical volume button press!
      // (Note: on iOS this might not always fire reliably, but on Android Chrome it usually works if media is playing)
      
      this.handleVolumePress();
      
      // Immediately reset volume back to 50% so they can keep pressing up or down
      this.resetVolume();
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.counter = new MaalaCounter();
});
