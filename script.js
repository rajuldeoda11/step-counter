// ===== APP STATE =====
const APP_STATE = {
    steps: 0,
    goal: 10000,
    strideLength: 75, // cm
    weight: 70, // kg
    waterGlasses: 0,
    autoWalkInterval: null,
    streak: 0,
    longestStreak: 0,
    xp: 0,
    level: 1,
    currentChallenge: null,
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear(),
    hourlySteps: new Array(24).fill(0),
    history: {},
    achievements: {},
    settings: {
        notifications: true,
        sound: true,
        reminders: false,
        units: 'metric'
    },
    profile: {
        name: '',
        age: '',
        gender: 'male'
    },
    mood: null,
    theme: 'light'
};

// ===== CONSTANTS =====
const CHALLENGES = [
    { id: 1, name: '5K Steps Sprint', emoji: '🏃', target: 5000, desc: 'Walk 5,000 steps today', xp: 100 },
    { id: 2, name: '10K Champion', emoji: '🏆', target: 10000, desc: 'Reach 10,000 steps in a day', xp: 250 },
    { id: 3, name: 'Half Marathon', emoji: '🥇', target: 15000, desc: 'Walk 15,000 steps today', xp: 400 },
    { id: 4, name: 'Marathon Master', emoji: '💪', target: 20000, desc: 'Achieve 20,000 steps in one day', xp: 600 },
    { id: 5, name: 'Ultra Walker', emoji: '🦸', target: 30000, desc: 'An incredible 30,000 steps!', xp: 1000 },
    { id: 6, name: 'Quick Start', emoji: '⚡', target: 2000, desc: 'Walk 2,000 steps to warm up', xp: 50 },
    { id: 7, name: 'Evening Stroll', emoji: '🌙', target: 3000, desc: 'A relaxing 3,000 step walk', xp: 75 },
];

const ACHIEVEMENTS_LIST = [
    { id: 'first_step', name: 'First Step', emoji: '👣', desc: 'Take your first step!', condition: (s) => s.steps >= 1 },
    { id: 'century', name: 'Century', emoji: '💯', desc: 'Reach 100 steps', condition: (s) => s.steps >= 100 },
    { id: 'thousand', name: '1K Club', emoji: '🎯', desc: 'Walk 1,000 steps', condition: (s) => s.steps >= 1000 },
    { id: 'five_k', name: '5K Walker', emoji: '🚶', desc: 'Walk 5,000 steps', condition: (s) => s.steps >= 5000 },
    { id: 'ten_k', name: '10K Hero', emoji: '🦸', desc: 'Walk 10,000 steps', condition: (s) => s.steps >= 10000 },
    { id: 'twenty_k', name: '20K Legend', emoji: '🏅', desc: 'Walk 20,000 steps', condition: (s) => s.steps >= 20000 },
    { id: 'fifty_k', name: '50K Ultra', emoji: '⭐', desc: 'Walk 50,000 steps', condition: (s) => s.steps >= 50000 },
    { id: 'streak_3', name: 'On Fire', emoji: '🔥', desc: '3-day streak', condition: (s) => s.streak >= 3 },
    { id: 'streak_7', name: 'Week Warrior', emoji: '⚔️', desc: '7-day streak', condition: (s) => s.streak >= 7 },
    { id: 'streak_30', name: 'Monthly Master', emoji: '👑', desc: '30-day streak', condition: (s) => s.streak >= 30 },
    { id: 'hydrated', name: 'Hydrated', emoji: '💧', desc: 'Drink 8 glasses of water', condition: (s) => s.waterGlasses >= 8 },
    { id: 'goal_met', name: 'Goal Getter', emoji: '🎯', desc: 'Meet your daily step goal', condition: (s) => s.steps >= s.goal },
];

const LEVEL_TITLES = [
    'Beginner Walker', 'Casual Stroller', 'Daily Walker', 'Active Mover',
    'Fitness Enthusiast', 'Step Master', 'Walking Champion', 'Elite Walker',
    'Ultra Athlete', 'Legendary Stepper'
];

const DAILY_TIPS = [
    "💡 Take the stairs instead of the elevator to add extra steps!",
    "🎵 Listen to upbeat music while walking to boost your mood and pace.",
    "🌳 Walking in nature can reduce stress and improve mental clarity.",
    "⏰ Set hourly reminders to take short walking breaks during work.",
    "👟 Invest in good walking shoes to prevent injuries and stay comfortable.",
    "🥗 Pair your walking routine with a balanced diet for best results.",
    "🧘 Try walking meditation - focus on each step for mindfulness.",
    "📱 Park farther away from entrances to add extra steps to your day.",
    "💪 Walking 10,000 steps burns approximately 400-500 calories!",
    "🌅 Morning walks help regulate your sleep cycle and boost energy.",
    "🤝 Walk with a friend to make it more enjoyable and consistent.",
    "📊 Track your progress weekly to stay motivated and see improvements.",
    "🏠 Walk around your home during phone calls to add steps.",
    "🎯 Set small, achievable goals before working up to bigger ones.",
    "💦 Stay hydrated! Drink water before, during, and after walking."
];

const MOOD_MESSAGES = {
    great: "Amazing! Your positive energy will fuel a great walk! 🌟",
    good: "Nice! A good walk will make your day even better! 😊",
    okay: "A walk might be just what you need to lift your spirits! 🌤️",
    tired: "Even a short walk can boost your energy levels! ⚡",
    sad: "Walking releases endorphins - your natural mood booster! 💜"
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initApp();
    setTimeout(() => {
        document.getElementById('splashScreen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }, 3000);
});

function initApp() {
    setupSVGGradient();
    updateGreeting();
    updateDate();
    updateDisplay();
    setupEventListeners();
    renderHourlyChart();
    renderBarChart();
    renderCalendar();
    renderHistory();
    renderChallenges();
    renderAchievements();
    renderWaterGlasses();
    renderLeaderboard();
    updateLevel();
    showDailyTip();
    updateSharePreview();
    checkNewDay();
    applyTheme();

    // Update time every minute
    setInterval(() => {
        updateDate();
        updateGreeting();
    }, 60000);
}

function setupSVGGradient() {
    const svg = document.querySelector('.circular-progress');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = 'progressGradient';
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#6c5ce7');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#a29bfe');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Step Controls
    document.getElementById('addStep').addEventListener('click', () => addSteps(1));
    document.getElementById('addTenSteps').addEventListener('click', () => addSteps(10));
    document.getElementById('addHundredSteps').addEventListener('click', () => addSteps(100));
    document.getElementById('subtractSteps').addEventListener('click', () => addSteps(-10));
    document.getElementById('addCustomSteps').addEventListener('click', () => {
        document.getElementById('customStepsModal').classList.remove('hidden');
    });
    document.getElementById('confirmCustomSteps').addEventListener('click', confirmCustomSteps);
    document.getElementById('closeCustom').addEventListener('click', () => {
        document.getElementById('customStepsModal').classList.add('hidden');
    });

    // Auto Walk
    document.getElementById('autoWalkBtn').addEventListener('click', toggleAutoWalk);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Theme
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', () => {
        populateSettings();
        document.getElementById('settingsModal').classList.remove('hidden');
    });
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('hidden');
    });
    document.getElementById('saveSettings').addEventListener('click', saveSettings);

    // Profile
    document.getElementById('profileBtn').addEventListener('click', () => {
        populateProfile();
        document.getElementById('profileModal').classList.remove('hidden');
    });
    document.getElementById('closeProfile').addEventListener('click', () => {
        document.getElementById('profileModal').classList.add('hidden');
    });
    document.getElementById('saveProfile').addEventListener('click', saveProfile);

    // Period Selector
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBarChart(btn.dataset.period);
        });
    });

    // Calendar Navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        APP_STATE.calendarMonth--;
        if (APP_STATE.calendarMonth < 0) {
            APP_STATE.calendarMonth = 11;
            APP_STATE.calendarYear--;
        }
        renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        APP_STATE.calendarMonth++;
        if (APP_STATE.calendarMonth > 11) {
            APP_STATE.calendarMonth = 0;
            APP_STATE.calendarYear++;
        }
        renderCalendar();
    });

    // Water
    document.getElementById('addWaterBtn').addEventListener('click', addWaterGlass);

    // BMI
    document.getElementById('calcBmiBtn').addEventListener('click', calculateBMI);

    // Challenges
    document.getElementById('startChallengeBtn').addEventListener('click', showChallengeSelector);
    document.getElementById('closeAchieve').addEventListener('click', () => {
        document.getElementById('achievementPopup').classList.add('hidden');
    });

    // History
    document.getElementById('resetTodayBtn').addEventListener('click', resetToday);
    document.getElementById('resetAllBtn').addEventListener('click', resetAllData);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);

    // Share
    document.getElementById('shareTwitter').addEventListener('click', shareTwitter);
    document.getElementById('shareWhatsapp').addEventListener('click', shareWhatsApp);
    document.getElementById('shareCopy').addEventListener('click', shareCopy);

    // Tips
    document.getElementById('newTipBtn').addEventListener('click', showDailyTip);

    // Mood
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => selectMood(btn.dataset.mood));
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.code === 'Space') { e.preventDefault(); addSteps(1); }
    });
}

// ===== CORE FUNCTIONS =====
function addSteps(count) {
    if (APP_STATE.steps + count < 0) {
        APP_STATE.steps = 0;
    } else {
        APP_STATE.steps += count;
    }

    const hour = new Date().getHours();
    if (count > 0) {
        APP_STATE.hourlySteps[hour] = (APP_STATE.hourlySteps[hour] || 0) + count;
        APP_STATE.xp += count;
    }

    // Animate step count
    const stepEl = document.getElementById('stepCount');
    stepEl.classList.add('count-up');
    setTimeout(() => stepEl.classList.remove('count-up'), 200);

    updateDisplay();
    checkAchievements();
    checkChallengeProgress();
    saveData();

    // Play sound
    if (APP_STATE.settings.sound && count > 0) {
        playClickSound();
    }

    // Check goal reached
    if (APP_STATE.steps >= APP_STATE.goal && APP_STATE.steps - count < APP_STATE.goal) {
        celebrateGoal();
    }
}

function confirmCustomSteps() {
    const input = document.getElementById('customStepInput');
    const val = parseInt(input.value);
    if (val && val > 0 && val <= 50000) {
        addSteps(val);
        input.value = '';
        document.getElementById('customStepsModal').classList.add('hidden');
        showToast(`Added ${val} steps!`, 'success');
    } else {
        showToast('Please enter a valid number (1-50,000)', 'error');
    }
}

function toggleAutoWalk() {
    const btn = document.getElementById('autoWalkBtn');
    if (APP_STATE.autoWalkInterval) {
        clearInterval(APP_STATE.autoWalkInterval);
        APP_STATE.autoWalkInterval = null;
        btn.innerHTML = '<i class="fas fa-play"></i> Start';
        btn.classList.remove('active');
        showToast('Auto walk stopped', 'info');
    } else {
        const speed = parseInt(document.getElementById('walkSpeed').value);
        APP_STATE.autoWalkInterval = setInterval(() => addSteps(1), speed);
        btn.innerHTML = '<i class="fas fa-pause"></i> Stop';
        btn.classList.add('active');
        showToast('Auto walk started!', 'success');
    }
}

// ===== DISPLAY UPDATES =====
function updateDisplay() {
    // Step count
    document.getElementById('stepCount').textContent = APP_STATE.steps.toLocaleString();
    document.getElementById('goalText').textContent = `Goal: ${APP_STATE.goal.toLocaleString()}`;

    // Circular progress
    const progress = Math.min(APP_STATE.steps / APP_STATE.goal, 1);
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (progress * circumference);
    document.getElementById('progressCircle').style.strokeDashoffset = offset;

    // Change color when goal is met
    const progressBar = document.getElementById('progressCircle');
    if (progress >= 1) {
        progressBar.style.stroke = '#00b894';
    }

    // Calories (approx 0.04 cal per step)
    const calories = Math.round(APP_STATE.steps * 0.04 * (APP_STATE.weight / 70));
    document.getElementById('caloriesBurned').textContent = calories.toLocaleString();

    // Distance
    const distanceKm = (APP_STATE.steps * APP_STATE.strideLength / 100000).toFixed(2);
    const distanceMi = (distanceKm * 0.621371).toFixed(2);
    document.getElementById('distanceCovered').textContent =
        APP_STATE.settings.units === 'imperial' ? distanceMi : distanceKm;
    document.querySelector('.stat-card.distance .stat-label').textContent =
        APP_STATE.settings.units === 'imperial' ? 'miles' : 'km';

    // Active Time (assuming 100 steps per minute average)
    const minutes = Math.round(APP_STATE.steps / 100);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    document.getElementById('activeTime').textContent =
        hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    // Pace
    const now = new Date();
    const minutesSinceStart = now.getHours() * 60 + now.getMinutes();
    const pace = minutesSinceStart > 0 ? Math.round(APP_STATE.steps / Math.max(minutesSinceStart / 60, 1)) : 0;
    document.getElementById('currentPace').textContent = Math.min(pace, 200);

    // Streak
    document.getElementById('streakCount').textContent = APP_STATE.streak;
    const streakMsg = APP_STATE.streak === 0 ? 'Start walking to build your streak!' :
        APP_STATE.streak < 3 ? 'Keep going! Build your streak!' :
        APP_STATE.streak < 7 ? `${APP_STATE.streak} days! You're on fire! 🔥` :
        `Incredible ${APP_STATE.streak}-day streak! 🏆`;
    document.getElementById('streakMessage').textContent = streakMsg;

    // Update hourly chart
    renderHourlyChart();

    // Update share preview
    updateSharePreview();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 6) greeting = '🌙 Good Night!';
    else if (hour < 12) greeting = '☀️ Good Morning!';
    else if (hour < 17) greeting = '🌤️ Good Afternoon!';
    else if (hour < 21) greeting = '🌅 Good Evening!';
    else greeting = '🌙 Good Night!';

    const name = APP_STATE.profile.name;
    document.getElementById('greetingText').textContent =
        name ? `${greeting} ${name}` : greeting;
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateText').textContent = now.toLocaleDateString('en-US', options);
}

// ===== TAB NAVIGATION =====
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.nav-item[data-tab="${tabId}"]`).classList.add('active');

    // Refresh tab-specific content
    if (tabId === 'activity') {
        renderBarChart();
        updateWeeklySummary();
        updateRecords();
    }
    if (tabId === 'history') {
        renderCalendar();
        renderHistory();
    }
    if (tabId === 'challenges') {
        renderChallenges();
        renderAchievements();
        updateLevel();
    }
}

// ===== CHARTS =====
function renderHourlyChart() {
    const container = document.getElementById('hourlyChart');
    container.innerHTML = '';

    const maxSteps = Math.max(...APP_STATE.hourlySteps, 1);
    const currentHour = new Date().getHours();

    for (let i = 0; i < 24; i++) {
        const steps = APP_STATE.hourlySteps[i] || 0;
        const height = Math.max((steps / maxSteps) * 80, 2);
        const bar = document.createElement('div');
        bar.className = 'hourly-bar';
        bar.style.height = `${height}px`;
        if (i > currentHour) bar.style.opacity = '0.3';

        bar.innerHTML = `
            <span class="bar-label">${i}h</span>
            <span class="bar-value">${steps}</span>
        `;
        container.appendChild(bar);
    }
}

function renderBarChart(period = 'week') {
    const container = document.getElementById('barChart');
    container.innerHTML = '';

    let data = [];
    let labels = [];
    const today = new Date();
    const todayKey = getDateKey(today);

    if (period === 'week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = getDateKey(d);
            const steps = key === todayKey ? APP_STATE.steps : (APP_STATE.history[key]?.steps || 0);
            data.push(steps);
            labels.push(days[d.getDay()]);
        }
    } else if (period === 'month') {
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = getDateKey(d);
            const steps = key === todayKey ? APP_STATE.steps : (APP_STATE.history[key]?.steps || 0);
            data.push(steps);
            labels.push(d.getDate().toString());
        }
    } else {
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let totalSteps = 0;
            let daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayDate = new Date(d.getFullYear(), d.getMonth(), day);
                const key = getDateKey(dayDate);
                if (key === todayKey) {
                    totalSteps += APP_STATE.steps;
                } else {
                    totalSteps += APP_STATE.history[key]?.steps || 0;
                }
            }
            data.push(totalSteps);
            labels.push(monthNames[d.getMonth()]);
        }
    }

    const maxVal = Math.max(...data, 1);
    const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    document.getElementById('avgSteps').textContent = `Avg: ${avg.toLocaleString()}`;

    data.forEach((val, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-bar-wrapper';

        const valueEl = document.createElement('span');
        valueEl.className = 'chart-bar-value';
        valueEl.textContent = val > 999 ? `${(val / 1000).toFixed(1)}k` : val;

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const height = Math.max((val / maxVal) * 120, 4);
        bar.style.height = `${height}px`;

        if (val >= APP_STATE.goal) {
            bar.style.background = 'linear-gradient(135deg, #00b894, #55efc4)';
        }

        const label = document.createElement('span');
        label.className = 'chart-bar-label';
        label.textContent = labels[i];

        wrapper.appendChild(valueEl);
        wrapper.appendChild(bar);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}

function updateWeeklySummary() {
    const today = new Date();
    const todayKey = getDateKey(today);
    let totalSteps = 0, goalsMet = 0;

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = getDateKey(d);
        const steps = key === todayKey ? APP_STATE.steps : (APP_STATE.history[key]?.steps || 0);
        totalSteps += steps;
        if (steps >= APP_STATE.goal) goalsMet++;
    }

    document.getElementById('weeklySteps').textContent = totalSteps.toLocaleString();
    document.getElementById('weeklyCalories').textContent = Math.round(totalSteps * 0.04 * (APP_STATE.weight / 70)).toLocaleString();
    const dist = (totalSteps * APP_STATE.strideLength / 100000).toFixed(1);
    document.getElementById('weeklyDistance').textContent = `${dist} km`;
    document.getElementById('weeklyGoals').textContent = `${goalsMet}/7`;
}

function updateRecords() {
    let bestDay = APP_STATE.steps;
    let totalDays = APP_STATE.steps > 0 ? 1 : 0;

    Object.values(APP_STATE.history).forEach(day => {
        if (day.steps > bestDay) bestDay = day.steps;
        if (day.steps > 0) totalDays++;
    });

    document.getElementById('bestDay').textContent = `${bestDay.toLocaleString()} steps`;
    document.getElementById('longestStreak').textContent = `${APP_STATE.longestStreak} days`;
    document.getElementById('totalActiveDays').textContent = `${totalDays} days`;
}

// ===== CALENDAR =====
function renderCalendar() {
    const container = document.getElementById('calendarDates');
    container.innerHTML = '';

    const year = APP_STATE.calendarYear;
    const month = APP_STATE.calendarMonth;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayKey = getDateKey(today);

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-date empty';
        container.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateEl = document.createElement('div');
        dateEl.className = 'calendar-date';
        dateEl.textContent = day;

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateKey === todayKey;

        if (isToday) {
            dateEl.classList.add('today');
            if (APP_STATE.steps > 0) dateEl.classList.add('has-data');
            if (APP_STATE.steps >= APP_STATE.goal) dateEl.classList.add('goal-met');
        } else if (APP_STATE.history[dateKey]) {
            dateEl.classList.add('has-data');
            if (APP_STATE.history[dateKey].steps >= APP_STATE.goal) {
                dateEl.classList.add('goal-met');
            }
        }

        dateEl.addEventListener('click', () => {
            const steps = isToday ? APP_STATE.steps : (APP_STATE.history[dateKey]?.steps || 0);
            showToast(`${dateKey}: ${steps.toLocaleString()} steps`, 'info');
        });

        container.appendChild(dateEl);
    }
}

// ===== HISTORY =====
function renderHistory() {
    const container = document.getElementById('historyList');
    container.innerHTML = '';

    const today = new Date();
    const todayKey = getDateKey(today);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let entries = [];

    // Add today
    entries.push({
        key: todayKey,
        date: today,
        steps: APP_STATE.steps,
        isToday: true
    });

    // Add history
    Object.entries(APP_STATE.history)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 30)
        .forEach(([key, data]) => {
            if (key !== todayKey) {
                const parts = key.split('-');
                entries.push({
                    key,
                    date: new Date(parts[0], parts[1] - 1, parts[2]),
                    steps: data.steps,
                    isToday: false
                });
            }
        });

    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:2rem;">No activity recorded yet. Start walking!</p>';
        return;
    }

    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const goalMet = entry.steps >= APP_STATE.goal;
        const dayName = entry.isToday ? 'Today' : days[entry.date.getDay()];
        const dateStr = entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        item.innerHTML = `
            <div class="history-date">
                <span class="history-day">${dayName}</span>
                <span class="history-full-date">${dateStr}</span>
            </div>
            <span class="history-steps">${entry.steps.toLocaleString()} steps</span>
            <span class="history-goal-badge ${goalMet ? 'met' : 'missed'}">
                ${goalMet ? '✓ Goal Met' : '✗ Missed'}
            </span>
        `;
        container.appendChild(item);
    });
}

// ===== WATER TRACKER =====
function renderWaterGlasses() {
    const container = document.getElementById('waterGlasses');
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const glass = document.createElement('div');
        glass.className = `water-glass ${i < APP_STATE.waterGlasses ? 'filled' : ''}`;
        glass.addEventListener('click', () => {
            APP_STATE.waterGlasses = i + 1;
            renderWaterGlasses();
            checkAchievements();
            saveData();
        });
        container.appendChild(glass);
    }

    document.getElementById('waterCount').textContent = `${APP_STATE.waterGlasses} / 8 glasses`;
}

function addWaterGlass() {
    if (APP_STATE.waterGlasses < 8) {
        APP_STATE.waterGlasses++;
        renderWaterGlasses();
        showToast('💧 Glass of water added!', 'success');
        checkAchievements();
        saveData();
    } else {
        showToast('You\'ve reached your daily water goal! 🎉', 'info');
    }
}

// ===== BMI CALCULATOR =====
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value);

    if (!weight || !height || weight <= 0 || height <= 0) {
        showToast('Please enter valid weight and height', 'error');
        return;
    }

    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let category = '';
    let color = '';
    let position = 0;

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#74b9ff';
        position = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
        category = 'Normal Weight';
        color = '#00b894';
        position = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#fdcb6e';
        position = 50 + ((bmi - 25) / 5) * 25;
    } else {
        category = 'Obese';
        color = '#e17055';
        position = Math.min(75 + ((bmi - 30) / 10) * 25, 98);
    }

    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('bmiCategory').style.color = color;
    document.getElementById('bmiIndicator').style.left = `${position}%`;
    document.getElementById('bmiResult').classList.remove('hidden');
}

// ===== CHALLENGES =====
function renderChallenges() {
    const container = document.getElementById('challengeList');
    container.innerHTML = '';

    CHALLENGES.forEach(ch => {
        const item = document.createElement('div');
        item.className = 'challenge-item';
        item.innerHTML = `
            <span class="challenge-emoji">${ch.emoji}</span>
            <div class="challenge-info">
                <h4>${ch.name}</h4>
                <p>${ch.desc} • ${ch.xp} XP</p>
            </div>
        `;
        item.addEventListener('click', () => startChallenge(ch));
        container.appendChild(item);
    });

    updateChallengeDisplay();
}

function startChallenge(challenge) {
    APP_STATE.currentChallenge = {
        ...challenge,
        startSteps: APP_STATE.steps,
        startTime: Date.now()
    };
    updateChallengeDisplay();
    showToast(`Challenge started: ${challenge.name}!`, 'success');
    saveData();
}

function showChallengeSelector() {
    switchTab('challenges');
    showToast('Select a challenge from the list below!', 'info');
}

function updateChallengeDisplay() {
    const ch = APP_STATE.currentChallenge;
    if (!ch) {
        document.getElementById('challengeName').textContent = 'No Active Challenge';
        document.getElementById('challengeBar').style.width = '0%';
        document.getElementById('challengePercent').textContent = '0%';
        document.getElementById('challengeTimeLeft').textContent = '--';
        return;
    }

    document.getElementById('challengeName').textContent = ch.name;

    const stepsInChallenge = APP_STATE.steps - ch.startSteps;
    const progress = Math.min((stepsInChallenge / ch.target) * 100, 100);
    document.getElementById('challengeBar').style.width = `${progress}%`;
    document.getElementById('challengePercent').textContent = `${Math.round(progress)}%`;

    const elapsed = Math.floor((Date.now() - ch.startTime) / 60000);
    document.getElementById('challengeTimeLeft').textContent = `${elapsed}min elapsed`;

    if (progress >= 100) {
        APP_STATE.xp += ch.xp;
        showAchievementPopup('🎉', 'Challenge Complete!', `${ch.name} - Earned ${ch.xp} XP!`);
        APP_STATE.currentChallenge = null;
        updateLevel();
        saveData();
    }
}

function checkChallengeProgress() {
    if (APP_STATE.currentChallenge) {
        updateChallengeDisplay();
    }
}

// ===== ACHIEVEMENTS =====
function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    container.innerHTML = '';

    ACHIEVEMENTS_LIST.forEach(ach => {
        const item = document.createElement('div');
        const unlocked = APP_STATE.achievements[ach.id];
        item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
            <span class="achievement-emoji">${ach.emoji}</span>
            <span class="achievement-name">${ach.name}</span>
        `;
        item.title = ach.desc;
        container.appendChild(item);
    });
}

function checkAchievements() {
    ACHIEVEMENTS_LIST.forEach(ach => {
        if (!APP_STATE.achievements[ach.id] && ach.condition(APP_STATE)) {
            APP_STATE.achievements[ach.id] = true;
            showAchievementPopup(ach.emoji, ach.name, ach.desc);
            APP_STATE.xp += 50;
            renderAchievements();
            updateLevel();
        }
    });
}

function showAchievementPopup(emoji, title, desc) {
    document.getElementById('achieveIcon').textContent = emoji;
    document.getElementById('achieveTitle').textContent = title;
    document.getElementById('achieveDesc').textContent = desc;
    document.getElementById('achievementPopup').classList.remove('hidden');
    createConfetti();
}

// ===== LEVEL SYSTEM =====
function updateLevel() {
    const xpPerLevel = 1000;
    APP_STATE.level = Math.floor(APP_STATE.xp / xpPerLevel) + 1;
    const currentLevelXP = APP_STATE.xp % xpPerLevel;
    const progress = (currentLevelXP / xpPerLevel) * 100;

    document.getElementById('levelBadge').textContent = APP_STATE.level;
    document.getElementById('levelTitle').textContent =
        LEVEL_TITLES[Math.min(APP_STATE.level - 1, LEVEL_TITLES.length - 1)];
    document.getElementById('levelFill').style.width = `${progress}%`;
    document.getElementById('levelXP').textContent =
        `${currentLevelXP.toLocaleString()} / ${xpPerLevel.toLocaleString()} XP`;
}

// ===== LEADERBOARD (Simulated) =====
function renderLeaderboard() {
    const container = document.getElementById('leaderboard');
    container.innerHTML = '';

    const fakeUsers = [
        { name: 'Alex Runner', steps: 18500 },
        { name: 'Sarah Walker', steps: 15200 },
        { name: 'Mike Strider', steps: 13800 },
        { name: 'Emma Steps', steps: 12100 },
        { name: 'Jake Trail', steps: 9500 },
    ];

    // Insert current user
    const you = {
        name: APP_STATE.profile.name || 'You',
        steps: APP_STATE.steps,
        isYou: true
    };

    const allUsers = [...fakeUsers, you].sort((a, b) => b.steps - a.steps);

    allUsers.forEach((user, i) => {
        const item = document.createElement('div');
        item.className = `leaderboard-item ${user.isYou ? 'you' : ''}`;
        item.innerHTML = `
            <span class="leaderboard-rank">${i + 1}</span>
            <span class="leaderboard-name">${user.name} ${user.isYou ? '(You)' : ''}</span>
            <span class="leaderboard-steps">${user.steps.toLocaleString()}</span>
        `;
        container.appendChild(item);
    });
}

// ===== SHARE =====
function updateSharePreview() {
    document.getElementById('shareSteps').textContent = `${APP_STATE.steps.toLocaleString()} steps today!`;
    document.getElementById('shareStreak').textContent = `🔥 ${APP_STATE.streak} day streak`;
}

function getShareText() {
    return `🏃 My StepSync Progress!\n📊 ${APP_STATE.steps.toLocaleString()} steps today\n🔥 ${APP_STATE.streak} day streak\n💪 Level ${APP_STATE.level}\n\nTrack your steps with StepSync!`;
}

function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
}

function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
}

function shareCopy() {
    navigator.clipboard.writeText(getShareText()).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// ===== DAILY TIPS =====
function showDailyTip() {
    const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    document.getElementById('dailyTip').innerHTML = `<p>${tip}</p>`;
}

// ===== MOOD TRACKER =====
function selectMood(mood) {
    APP_STATE.mood = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.mood === mood);
    });
    document.getElementById('moodMessage').textContent = MOOD_MESSAGES[mood];
    saveData();
}

// ===== SETTINGS =====
function populateSettings() {
    document.getElementById('goalInput').value = APP_STATE.goal;
    document.getElementById('strideInput').value = APP_STATE.strideLength;
    document.getElementById('weightInput').value = APP_STATE.weight;
    document.getElementById('notifToggle').checked = APP_STATE.settings.notifications;
    document.getElementById('soundToggle').checked = APP_STATE.settings.sound;
    document.getElementById('reminderToggle').checked = APP_STATE.settings.reminders;
    document.getElementById('unitSelect').value = APP_STATE.settings.units;
}

function saveSettings() {
    APP_STATE.goal = parseInt(document.getElementById('goalInput').value) || 10000;
    APP_STATE.strideLength = parseInt(document.getElementById('strideInput').value) || 75;
    APP_STATE.weight = parseInt(document.getElementById('weightInput').value) || 70;
    APP_STATE.settings.notifications = document.getElementById('notifToggle').checked;
    APP_STATE.settings.sound = document.getElementById('soundToggle').checked;
    APP_STATE.settings.reminders = document.getElementById('reminderToggle').checked;
    APP_STATE.settings.units = document.getElementById('unitSelect').value;

    updateDisplay();
    saveData();
    document.getElementById('settingsModal').classList.add('hidden');
    showToast('Settings saved!', 'success');
}

// ===== PROFILE =====
function populateProfile() {
    document.getElementById('profileName').value = APP_STATE.profile.name || '';
    document.getElementById('profileAge').value = APP_STATE.profile.age || '';
    document.getElementById('profileGender').value = APP_STATE.profile.gender || 'male';

    // Total stats
    let totalSteps = APP_STATE.steps;
    let totalCal = Math.round(APP_STATE.steps * 0.04 * (APP_STATE.weight / 70));

    Object.values(APP_STATE.history).forEach(day => {
        totalSteps += day.steps;
        totalCal += Math.round(day.steps * 0.04 * (APP_STATE.weight / 70));
    });

    const totalDist = (totalSteps * APP_STATE.strideLength / 100000).toFixed(1);

    document.getElementById('totalStepsAll').textContent = totalSteps.toLocaleString();
    document.getElementById('totalDistAll').textContent = `${totalDist} km`;
    document.getElementById('totalCalAll').textContent = totalCal.toLocaleString();
}

function saveProfile() {
    APP_STATE.profile.name = document.getElementById('profileName').value;
    APP_STATE.profile.age = document.getElementById('profileAge').value;
    APP_STATE.profile.gender = document.getElementById('profileGender').value;

    updateGreeting();
    renderLeaderboard();
    saveData();
    document.getElementById('profileModal').classList.add('hidden');
    showToast('Profile saved!', 'success');
}

// ===== THEME =====
function toggleTheme() {
    APP_STATE.theme = APP_STATE.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveData();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', APP_STATE.theme);
    const icon = document.querySelector('#themeToggle i');
    icon.className = APP_STATE.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== DANGER ZONE =====
function resetToday() {
    if (confirm('Are you sure you want to reset today\'s steps?')) {
        APP_STATE.steps = 0;
        APP_STATE.hourlySteps = new Array(24).fill(0);
        APP_STATE.waterGlasses = 0;
        updateDisplay();
        renderWaterGlasses();
        saveData();
        showToast('Today\'s data has been reset', 'info');
    }
}

function resetAllData() {
    if (confirm('⚠️ Are you sure? This will delete ALL your data and cannot be undone!')) {
        if (confirm('This is your last chance. Really delete everything?')) {
            localStorage.removeItem('stepSyncData');
            location.reload();
        }
    }
}

function exportData() {
    const data = {
        exportDate: new Date().toISOString(),
        currentSteps: APP_STATE.steps,
        goal: APP_STATE.goal,
        streak: APP_STATE.streak,
        level: APP_STATE.level,
        xp: APP_STATE.xp,
        history: APP_STATE.history,
        achievements: APP_STATE.achievements,
        profile: APP_STATE.profile
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stepsync-export-${getDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
}

// ===== UTILITIES =====
function getDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const msg = document.getElementById('toastMessage');

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    icon.className = icons[type] || icons.success;
    icon.style.color = type === 'error' ? '#e17055' : type === 'info' ? '#6c5ce7' : '#00b894';
    msg.textContent = message;

    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.05;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) { }
}

function createConfetti() {
    const colors = ['#6c5ce7', '#fd79a8', '#00cec9', '#fdcb6e', '#e17055', '#00b894'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${1 + Math.random() * 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

function celebrateGoal() {
    createConfetti();
    showAchievementPopup('🎉', 'Goal Reached!', `You've reached ${APP_STATE.goal.toLocaleString()} steps!`);

    // Update streak
    APP_STATE.streak++;
    if (APP_STATE.streak > APP_STATE.longestStreak) {
        APP_STATE.longestStreak = APP_STATE.streak;
    }
    saveData();
}

// ===== NEW DAY CHECK =====
function checkNewDay() {
    const today = getDateKey(new Date());
    const lastDate = localStorage.getItem('stepSyncLastDate');

    if (lastDate && lastDate !== today) {
        // Save yesterday's data
        if (!APP_STATE.history[lastDate]) {
            APP_STATE.history[lastDate] = {
                steps: APP_STATE.steps,
                goal: APP_STATE.goal,
                waterGlasses: APP_STATE.waterGlasses
            };
        }

        // Check if streak should continue
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = getDateKey(yesterday);

        if (APP_STATE.history[yesterdayKey]?.steps >= APP_STATE.goal) {
            // Streak continues
        } else if (lastDate === yesterdayKey) {
            if (APP_STATE.steps < APP_STATE.goal) {
                APP_STATE.streak = 0;
            }
        } else {
            APP_STATE.streak = 0;
        }

        // Reset daily data
        APP_STATE.steps = 0;
        APP_STATE.hourlySteps = new Array(24).fill(0);
        APP_STATE.waterGlasses = 0;
        APP_STATE.currentChallenge = null;
        APP_STATE.mood = null;
    }

    localStorage.setItem('stepSyncLastDate', today);
    saveData();
}

// ===== DATA PERSISTENCE =====
function saveData() {
    const data = {
        steps: APP_STATE.steps,
        goal: APP_STATE.goal,
        strideLength: APP_STATE.strideLength,
        weight: APP_STATE.weight,
        waterGlasses: APP_STATE.waterGlasses,
        streak: APP_STATE.streak,
        longestStreak: APP_STATE.longestStreak,
        xp: APP_STATE.xp,
        level: APP_STATE.level,
        currentChallenge: APP_STATE.currentChallenge,
        hourlySteps: APP_STATE.hourlySteps,
        history: APP_STATE.history,
        achievements: APP_STATE.achievements,
        settings: APP_STATE.settings,
        profile: APP_STATE.profile,
        mood: APP_STATE.mood,
        theme: APP_STATE.theme
    };
    localStorage.setItem('stepSyncData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('stepSyncData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(APP_STATE, data);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}