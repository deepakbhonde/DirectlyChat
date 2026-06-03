// Clean phone number
function cleanNumber(raw, defaultCC) {
  let s = raw.trim();
  let cleaned = s.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned.slice(1);
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length > 10) return digits;
  return defaultCC + digits;
}

// Send WhatsApp message
function sendWA(isBusiness) {
  const raw = document.getElementById('phoneNumber').value;
  const cc = document.getElementById('countryCode').value;
  const msg = document.getElementById('message').value.trim();
  const toast = document.getElementById('toast');

  if (!raw.trim()) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    return;
  }
  toast.classList.remove('show');

  const number = cleanNumber(raw, cc);
  const encodedMsg = msg ? '?text=' + encodeURIComponent(msg) : '';
  const url = isBusiness
    ? 'whatsapp://send?phone=' + number + (msg ? '&text=' + encodeURIComponent(msg) : '')
    : 'https://wa.me/' + number + encodedMsg;

  window.location.href = url;
}

// Page navigation
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');
}

// Menu functions
function openMenu() { document.getElementById('menuSheet').classList.add('open'); }
function closeMenu() { document.getElementById('menuSheet').classList.remove('open'); }

// Share and rate
function shareApp() {
  if (navigator.share) {
    navigator.share({ title: 'DirectlyChat', text: 'Send WhatsApp messages without saving contacts!', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!')).catch(() => {});
  }
}
function rateApp() { window.open('https://play.google.com/store', '_blank'); }

// Remember selected country in localStorage
const countrySelect = document.getElementById('countryCode');
countrySelect.addEventListener('change', function () {
  localStorage.setItem('selectedCountryCode', this.value);
});
window.addEventListener('load', function () {
  const savedCountry = localStorage.getItem('selectedCountryCode');
  if (savedCountry && countrySelect.querySelector(`option[value="${savedCountry}"]`)) {
    countrySelect.value = savedCountry;
  }
});

// Enter key on phone number field
document.getElementById('phoneNumber').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendWA(false);
});

// Optional: close menu when clicking outside (handled by overlay already)

// Dynamic greeting based on time of day
function setTimeGreeting() {
  const hour = new Date().getHours();
  let greeting = "";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning! 😊";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon! 😊";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening! 😊";
  } else {
    greeting = "Good Night! 😊";
  }
  const span = document.getElementById("dynamicGreeting");
  if (span) span.innerText = greeting;
}
setTimeGreeting();
setInterval(setTimeGreeting, 60000);
