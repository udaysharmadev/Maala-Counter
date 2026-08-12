const MAALA_SIZE = 108;

class CounterApplication {
  constructor() {
    this.currentCount = 0;
    this.completedCycles = 0;
    this.lifetimeTotal = 0;
    this.todayTotal = 0;
    this.lastDate = new Date().toDateString();
    
    this.lastPressTime = 0;
    this.isAnimatingCompletion = false;

    this.currentCountEl = document.getElementById('current-count');
    this.remainingCountEl = document.getElementById('remaining-count');
    this.cycleCountEl = document.getElementById('maala-count');
    this.completionMessageEl = document.getElementById('completion-message');
    this.todayTotalEl = document.getElementById('today-total');
    this.lifetimeTotalEl = document.getElementById('lifetime-total');
    
    this.startOverlay = document.getElementById('start-overlay');
    this.startButton = document.getElementById('start-button');
    this.silentAudio = document.getElementById('silent-audio');
    
    this.isProgrammaticVolumeChange = false;

    this.loadStats();
    this.updateUI();
    this.setupListeners();
  }

  loadStats() {
    const savedStats = localStorage.getItem('counterStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        const today = new Date().toDateString();
        
        if (stats.lastDate !== today) {
          stats.todayTotal = 0;
          stats.lastDate = today;
        }

        this.currentCount = stats.currentCount || 0;
        this.completedCycles = stats.completedCycles || 0;
        this.lifetimeTotal = stats.lifetimeTotal || 0;
        this.todayTotal = stats.todayTotal || 0;
        this.lastDate = stats.lastDate;
      } catch (e) {
        console.error(e);
      }
    }
  }

  saveStats() {
    const stats = {
      currentCount: this.currentCount,
      completedCycles: this.completedCycles,
      lifetimeTotal: this.lifetimeTotal,
      todayTotal: this.todayTotal,
      lastDate: this.lastDate
    };
    localStorage.setItem('counterStats', JSON.stringify(stats));
  }

  updateUI() {
    this.currentCountEl.textContent = this.currentCount;
    this.remainingCountEl.textContent = MAALA_SIZE - this.currentCount;
    this.cycleCountEl.textContent = this.completedCycles;
    this.todayTotalEl.textContent = this.todayTotal;
    this.lifetimeTotalEl.textContent = this.lifetimeTotal;
  }

  triggerPulse() {
    this.currentCountEl.classList.remove('pulse');
    void this.currentCountEl.offsetWidth;
    this.currentCountEl.classList.add('pulse');
    
    setTimeout(() => {
      this.currentCountEl.classList.remove('pulse');
    }, 150);
  }

  vibrate(pattern) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  handleVolumePress() {
    const now = Date.now();
    if (now - this.lastPressTime < 300) return;
    this.lastPressTime = now;

    if (this.isAnimatingCompletion) return;

    this.currentCount++;
    this.todayTotal++;
    this.lifetimeTotal++;
    
    this.triggerPulse();
    this.vibrate(50);

    if (this.currentCount >= MAALA_SIZE) {
      this.handleCompletion();
    } else {
      this.updateUI();
      this.saveStats();
    }
  }

  handleCompletion() {
    this.isAnimatingCompletion = true;
    this.currentCount = MAALA_SIZE;
    this.completedCycles++;
    this.updateUI();
    this.saveStats();
    
    this.vibrate([100, 50, 100]);

    this.completionMessageEl.classList.remove('hidden');

    setTimeout(() => {
      this.completionMessageEl.classList.add('hidden');
      this.currentCount = 0;
      this.updateUI();
      this.saveStats();
      this.isAnimatingCompletion = false;
    }, 2500);
  }

  resetVolume() {
    this.isProgrammaticVolumeChange = true;
    this.silentAudio.volume = 0.5;
    
    setTimeout(() => {
      this.isProgrammaticVolumeChange = false;
    }, 50);
  }

  setupListeners() {
    this.startButton.addEventListener('click', () => {
      this.silentAudio.play().then(() => {
        this.startOverlay.classList.add('hidden');
        this.resetVolume();
      }).catch(err => {
        console.error(err);
      });
    });

    this.silentAudio.addEventListener('volumechange', () => {
      if (this.isProgrammaticVolumeChange) {
        return;
      }
      
      this.handleVolumePress();
      this.resetVolume();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.counter = new CounterApplication();
});
