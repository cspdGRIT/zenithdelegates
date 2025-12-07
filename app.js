/* ==================== DATA ==================== */
const existing = [
  { name: "Goutham", flat: "E2104", month: "Jan", day: 10, phone: "9052323232", party2025: "Yes", notes: "" },
  { name: "Ravindra", flat: "F1605", month: "Jan", day: 21, phone: "9160061456", party2025: "Yes", notes: "" },
  { name: "Nagi", flat: "J1701", month: "March", day: 7, phone: "7674014433", party2025: "Yes", notes: "" },
  { name: "Varun", flat: "B2308", month: "March", day: 7, phone: "7406269369", party2025: "Yes", notes: "" },
  { name: "Damoder", flat: "E901", month: "Apr", day: 27, phone: "9573868588", party2025: "Yes", notes: "" },
  { name: "Mogili", flat: "A901", month: "May", day: 10, phone: "7337328671", party2025: "No", notes: "" },
  { name: "Raj", flat: "F1003", month: "Jun", day: 11, phone: "9949531325", party2025: "Yes", notes: "" },
  { name: "Srikanth", flat: "L904", month: "Jun", day: 15, phone: "9618567876", party2025: "Yes", notes: "" },
  { name: "Vijay", flat: "H1904", month: "July", day: 12, phone: "9000277757", party2025: "Yes", notes: "" },
  { name: "Srinivasu B", flat: "F1008", month: "Jul", day: 28, phone: "9160026888", party2025: "Yes", notes: "" },
  { name: "Chait", flat: "G1008", month: "Aug", day: 6, phone: "9704007409", party2025: "Yes", notes: "" },
  { name: "Ramesh", flat: "C2104", month: "Sep", day: 4, phone: "8886438888", party2025: "No", notes: "" },
  { name: "Bhargav", flat: "H505", month: "Sep", day: 25, phone: "8886178468", party2025: "No", notes: "" },
  { name: "Mohan", flat: "F408", month: "Jun", day: 1, phone: "9916666931", party2025: "Yes", notes: "" },
  { name: "Sandeep", flat: "M903", month: "Nov", day: 18, phone: "6303726803", party2025: "Yes", notes: "" },
  { name: "PD", flat: "C2306", month: "Nov", day: 19, phone: "8341346818", party2025: "Yes", notes: "" },
  { name: "Sanjay", flat: "I1202", month: "Nov", day: 30, phone: "9182001190", party2025: "No", notes: "" },
  { name: "Nagesh", flat: "F701", month: "Dec", day: 3, phone: "9908000038", party2025: "No", notes: "" },
  { name: "Suryprakash", flat: "I1903", month: "Dec", day: 6, phone: "", party2025: "No", notes: "" },
  { name: "Jagannadh", flat: "F906", month: "Dec", day: 16, phone: "9989044670", party2025: "No", notes: "" },
  { name: "Sunil KSK", flat: "E1708", month: "July", day: 15, phone: "9885674917", party2025: "Yes", notes: "" }
];

let list = [];
let phonesVisible = false;
let sortDirection = {};
let currentView = 'table';

/* ==================== INITIALIZATION ==================== */
function init() {
  loadData();
  setupEventListeners();
  updateStats();
  render();
  checkUpcomingBirthdays();
}

function loadData() {
  const extra = JSON.parse(localStorage.getItem('extra') || '[]');
  list = [...existing, ...extra];
}

function saveExtra() {
  const extra = list.filter((_, idx) => idx >= existing.length);
  localStorage.setItem('extra', JSON.stringify(extra));
}

/* ==================== EVENT LISTENERS ==================== */
function setupEventListeners() {
  document.getElementById('search').addEventListener('input', render);
  document.getElementById('partyFilter').addEventListener('change', render);
  document.getElementById('monthFilter').addEventListener('change', render);
  document.getElementById('darkToggle').addEventListener('click', toggleDarkMode);
  document.getElementById('statsBtn').addEventListener('click', () => openModal('statsModal'));
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id));
    }
  });
  
  // Load theme preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    document.querySelector('#darkToggle i').classList.replace('fa-moon', 'fa-sun');
  }
}

/* ==================== UTILS ==================== */
function getDays(month, day) {
  if (!month || !day) return 9999;
  
  const monthMap = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthdayThisYear = new Date(currentYear, monthMap[month.toLowerCase()], day);
  
  if (birthdayThisYear < today) {
    birthdayThisYear.setFullYear(currentYear + 1);
  }
  
  return Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24));
}

function maskPhone(phone) {
  if (!phone) return '-';
  return phone.slice(0, 2) + '•••••' + phone.slice(-2);
}

function monthName(dateStr) {
  return new Date(dateStr).toLocaleString('en', { month: 'short' });
}

function dayNum(dateStr) {
  return new Date(dateStr).getDate();
}

function scrollToForm() {
  document.getElementById('addCard').scrollIntoView({ behavior: 'smooth' });
}

/* ==================== DARK MODE ==================== */
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const icon = document.querySelector('#darkToggle i');
  const isDark = document.body.classList.contains('dark');
  
  icon.classList.toggle('fa-moon', !isDark);
  icon.classList.toggle('fa-sun', isDark);
  
  localStorage.setItem('darkMode', isDark);
}

/* ==================== PHONE VISIBILITY ==================== */
function togglePhones(force) {
  phonesVisible = force !== undefined ? force : !phonesVisible;
  
  document.querySelectorAll('.phone-masked').forEach(el => el.hidden = phonesVisible);
  document.querySelectorAll('.phone-real').forEach(el => el.hidden = !phonesVisible);
  document.getElementById('phoneBtn').innerHTML = phonesVisible 
    ? '<i class="fas fa-eye-slash"></i> Hide Phones' 
    : '<i class="fas fa-eye"></i> Show Phones';
}

/* ==================== RENDER ==================== */
function render() {
  const searchTerm = document.getElementById('search').value.trim().toLowerCase();
  const partyFilter = document.getElementById('partyFilter').value;
  const monthFilter = document.getElementById('monthFilter').value;
  
  const filtered = list.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm) ||
      (item.flat && item.flat.toLowerCase().includes(searchTerm));
    
    const matchesParty = !partyFilter || item.party2025.toLowerCase() === partyFilter;
    
    const matchesMonth = !monthFilter || 
      item.month.toLowerCase().startsWith(monthFilter);
    
    return matchesSearch && matchesParty && matchesMonth;
  });
  
  if (currentView === 'table') {
    renderTable(filtered);
  } else {
    renderCalendar(filtered);
  }
  
  updateStats();
}

function renderTable(filtered) {
  const tbody = document.getElementById('tableBody');
  
  tbody.innerHTML = filtered.map((item, index) => {
    const days = getDays(item.month, item.day);
    let rowClass = '';
    
    if (days === 0) rowClass = 'today';
    else if (days > 0 && days <= 30) rowClass = 'upcoming';
    
    const actualIndex = list.indexOf(item);
    
    return `
      <tr class="${rowClass}" data-index="${actualIndex}">
        <td><strong>${item.name}</strong></td>
        <td>${item.flat || '-'}</td>
        <td>${item.month} ${item.day}</td>
        <td>
          <span class="phone-masked">${maskPhone(item.phone)}</span>
          <span class="phone-real" hidden>${item.phone || '-'}</span>
        </td>
        <td><span class="status ${item.party2025.toLowerCase()}">${item.party2025}</span></td>
        <td>
          ${days === 0 ? '<strong>Today! 🎉</strong>' : `${days} days`}
        </td>
        <td>
          <button class="btn-icon" onclick="editRow(${actualIndex})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="deleteRow(${actualIndex})" title="Delete" style="background: var(--danger);">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  togglePhones(phonesVisible);
}

function renderCalendar(filtered) {
  const calendarGrid = document.getElementById('calendarGrid');
  
  const monthGroups = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  months.forEach(month => {
    monthGroups[month] = [];
  });
  
  filtered.forEach(item => {
    const monthKey = item.month.charAt(0).toUpperCase() + item.month.slice(1, 3);
    if (monthGroups[monthKey]) {
      monthGroups[monthKey].push(item);
    }
  });
  
  calendarGrid.innerHTML = months.map(month => {
    const birthdays = monthGroups[month];
    
    if (birthdays.length === 0) return '';
    
    // Sort by day
    birthdays.sort((a, b) => a.day - b.day);
    
    return `
      <div class="month-section">
        <div class="month-title">
          <i class="fas fa-calendar-day"></i>
          ${month}
        </div>
        ${birthdays.map(item => `
          <div class="birthday-item">
            <div class="birthday-name">${item.name}</div>
            <div class="birthday-details">
              ${month} ${item.day} • ${item.flat || 'No flat'} • 
              <span class="status ${item.party2025.toLowerCase()}">${item.party2025}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

/* ==================== VIEW SWITCHING ==================== */
function switchView(view) {
  currentView = view;
  
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  document.getElementById('tableView').style.display = view === 'table' ? 'block' : 'none';
  document.getElementById('calendarView').style.display = view === 'calendar' ? 'block' : 'none';
  
  render();
}

/* ==================== SORTING ==================== */
function sortTable(key) {
  sortDirection[key] = (sortDirection[key] || 1) * -1;
  
  list.sort((a, b) => {
    let val1, val2;
    
    if (key === 'days') {
      val1 = getDays(a.month, a.day);
      val2 = getDays(b.month, b.day);
    } else if (key === 'birthday') {
      val1 = getDays(a.month, a.day);
      val2 = getDays(b.month, b.day);
    } else {
      val1 = (a[key] || '').toString().toLowerCase();
      val2 = (b[key] || '').toString().toLowerCase();
    }
    
    if (val1 > val2) return sortDirection[key];
    if (val1 < val2) return -sortDirection[key];
    return 0;
  });
  
  render();
}

/* ==================== CRUD OPERATIONS ==================== */
function saveBirthday(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  const newBirthday = {
    name: data.name,
    flat: data.flat || '',
    month: monthName(data.birthday),
    day: dayNum(data.birthday),
    phone: data.phone || '',
    party2025: 'No',
    notes: data.notes || ''
  };
  
  list.push(newBirthday);
  saveExtra();
  
  e.target.reset();
  render();
  showToast('Birthday saved successfully! 🎉');
  
  // Scroll to top to see the new entry
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function editRow(index) {
  const item = list[index];
  
  document.getElementById('editIndex').value = index;
  document.getElementById('editName').value = item.name;
  document.getElementById('editFlat').value = item.flat || '';
  document.getElementById('editPhone').value = item.phone || '';
  document.getElementById('editNotes').value = item.notes || '';
  document.getElementById('editParty').value = item.party2025;
  
  // Reconstruct date
  const monthMap = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  const month = monthMap[item.month.toLowerCase().slice(0, 3)];
  const day = String(item.day).padStart(2, '0');
  document.getElementById('editBirthday').value = `2000-${month}-${day}`;
  
  openModal('editModal');
}

function updateBirthday(e) {
  e.preventDefault();
  
  const index = parseInt(document.getElementById('editIndex').value);
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  list[index] = {
    name: data.name,
    flat: data.flat || '',
    month: monthName(data.birthday),
    day: dayNum(data.birthday),
    phone: data.phone || '',
    party2025: data.party2025,
    notes: data.notes || ''
  };
  
  saveExtra();
  render();
  closeModal('editModal');
  showToast('Birthday updated successfully! ✅');
}

function deleteRow(index) {
  if (!confirm('Are you sure you want to delete this birthday?')) return;
  
  list.splice(index, 1);
  saveExtra();
  render();
  showToast('Birthday deleted');
}

/* ==================== STATISTICS ==================== */
function updateStats() {
  const total = list.length;
  const upcoming = list.filter(item => {
    const days = getDays(item.month, item.day);
    return days > 0 && days <= 30;
  }).length;
  const today = list.filter(item => getDays(item.month, item.day) === 0).length;
  
  document.getElementById('totalBirthdays').textContent = total;
  document.getElementById('upcomingCount').textContent = upcoming;
  document.getElementById('todayCount').textContent = today;
}

function openStatsModal() {
  const monthCounts = {};
  const partyStats = { yes: 0, no: 0 };
  
  list.forEach(item => {
    const month = item.month.charAt(0).toUpperCase() + item.month.slice(1, 3);
    monthCounts[month] = (monthCounts[month] || 0) + 1;
    
    if (item.party2025.toLowerCase() === 'yes') partyStats.yes++;
    else partyStats.no++;
  });
  
  const statsHTML = `
    <div style="display: grid; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem; color: var(--primary);">
          <i class="fas fa-chart-bar"></i> Birthdays by Month
        </h3>
        <div style="display: grid; gap: 0.5rem;">
          ${Object.entries(monthCounts).sort((a, b) => b[1] - a[1]).map(([month, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-sm);">
              <span><strong>${month}</strong></span>
              <span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600;">${count}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem; color: var(--primary);">
          <i class="fas fa-gift"></i> Party Statistics
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="text-align: center; padding: 1.5rem; background: var(--success); color: white; border-radius: var(--radius-md);">
            <div style="font-size: 2.5rem; font-weight: 700;">${partyStats.yes}</div>
            <div>Parties Given</div>
          </div>
          <div style="text-align: center; padding: 1.5rem; background: var(--danger); color: white; border-radius: var(--radius-md);">
            <div style="font-size: 2.5rem; font-weight: 700;">${partyStats.no}</div>
            <div>Parties Pending</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem; color: var(--primary);">
          <i class="fas fa-clock"></i> Upcoming Birthdays (Next 30 Days)
        </h3>
        <div style="display: grid; gap: 0.5rem;">
          ${list
            .filter(item => {
              const days = getDays(item.month, item.day);
              return days >= 0 && days <= 30;
            })
            .sort((a, b) => getDays(a.month, a.day) - getDays(b.month, b.day))
            .slice(0, 10)
            .map(item => {
              const days = getDays(item.month, item.day);
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                  <div>
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${item.month} ${item.day}</div>
                  </div>
                  <span style="background: var(--accent); color: var(--text-primary); padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600;">
                    ${days === 0 ? 'Today!' : `${days} days`}
                  </span>
                </div>
              `;
            }).join('') || '<p style="text-align: center; color: var(--text-muted);">No upcoming birthdays</p>'}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('statsContent').innerHTML = statsHTML;
  openModal('statsModal');
}

// Link stats button to the new function
document.getElementById('statsBtn').addEventListener('click', openStatsModal);

/* ==================== IMPORT/EXPORT ==================== */
function exportData() {
  const csv = [
    ['Name', 'Flat', 'Birthday', 'Phone', 'Party 2025', 'Notes'].join(','),
    ...list.map(item => [
      item.name,
      item.flat || '',
      `${item.month} ${item.day}`,
      item.phone || '',
      item.party2025,
      item.notes || ''
    ].map(field => `"${field}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `birthdays_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Data exported successfully! 📥');
}

function importCSV() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  
  if (!file) {
    showToast('Please select a file first', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const lines = text.split('\n').slice(1); // Skip header
      
      let imported = 0;
      lines.forEach(line => {
        if (!line.trim()) return;
        
        const [name, flat, birthday, phone, party2025, notes] = line.split(',').map(field => 
          field.replace(/^"|"$/g, '').trim()
        );
        
        if (!name || !birthday) return;
        
        // Parse birthday
        const dateMatch = birthday.match(/(\w+)\s+(\d+)/);
        if (!dateMatch) return;
        
        list.push({
          name,
          flat: flat || '',
          month: dateMatch[1],
          day: parseInt(dateMatch[2]),
          phone: phone || '',
          party2025: party2025 || 'No',
          notes: notes || ''
        });
        
        imported++;
      });
      
      saveExtra();
      render();
      closeModal('importModal');
      showToast(`Successfully imported ${imported} birthdays! 🎉`);
    } catch (err) {
      console.error(err);
      showToast('Error importing CSV file', 'error');
    }
  };
  
  reader.readAsText(file);
}

/* ==================== NOTIFICATIONS ==================== */
function checkUpcomingBirthdays() {
  const upcoming = list.filter(item => {
    const days = getDays(item.month, item.day);
    return days >= 0 && days <= 7;
  });
  
  if (upcoming.length > 0 && !sessionStorage.getItem('notificationShown')) {
    setTimeout(() => {
      const names = upcoming.map(item => `${item.name} (${getDays(item.month, item.day)} days)`).join(', ');
      showToast(`🎂 Upcoming birthdays: ${names}`, 'info', 8000);
      sessionStorage.setItem('notificationShown', 'true');
    }, 2000);
  }
}

/* ==================== MODALS ==================== */
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
  document.body.style.overflow = '';
}

/* ==================== CHAI/TIPS ==================== */
function tip(amount) {
  const upiURL = `upi://pay?pa=8341346818@ybl&pn=BirthdayBash&am=${amount}&cu=INR&tn=Thanks+for+the+chai`;
  window.location.href = upiURL;
  
  setTimeout(() => {
    closeModal('chaiModal');
    showToast('Thank you for the chai! ☕❤️', 'success');
  }, 1000);
}

function copyUPI() {
  navigator.clipboard.writeText('8341346818@ybl').then(() => {
    showToast('UPI ID copied to clipboard! 📋');
  });
}

/* ==================== TOAST NOTIFICATIONS ==================== */
function showToast(message, type = 'success', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `${icons[type] || '✅'} ${message}`;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'error' ? 'var(--danger)' : type === 'info' ? 'var(--secondary)' : 'var(--success)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: '3000',
    animation: 'slideInUp 0.3s ease-out',
    fontWeight: '600',
    maxWidth: '90%',
    textAlign: 'center'
  });
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInDown 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==================== INITIALIZE APP ==================== */
document.addEventListener('DOMContentLoaded', init);
