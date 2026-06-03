// Clean phone number
function cleanNumber(raw, defaultCC) {
  let s = raw.trim();
  let cleaned = s.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned.slice(1);
  }
  let digits = cleaned.replace(/\D/g, '');
  if (digits.length > 10) return digits;
  return defaultCC + digits;
}

// Send WhatsApp message
function sendWA(isBusiness) {
  const rawPhone = document.getElementById('phoneNumber').value;
  const cc = document.getElementById('countryCode').value;
  const msg = document.getElementById('message').value.trim();
  const toast = document.getElementById('toast');

  if (!rawPhone.trim()) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    return;
  }

  if (!cc) {
    toast.innerText = '⚠️ Please select a country code.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    return;
  }

  toast.classList.remove('show');

  const number = cleanNumber(rawPhone, cc);
  const encodedMsg = msg ? '?text=' + encodeURIComponent(msg) : '';
  // Use wa.me for both (works on all platforms)
  const url = 'https://wa.me/' + number + encodedMsg;
  window.location.href = url;
}

// Page navigation
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const targetPage = document.getElementById('page-' + name);
  if (targetPage) targetPage.classList.add('active');
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');
  // Scroll to top when changing page
  const contentArea = document.querySelector('.content-area');
  if (contentArea) contentArea.scrollTop = 0;
}

// Menu functions
function openMenu() { document.getElementById('menuSheet').classList.add('open'); }
function closeMenu() { document.getElementById('menuSheet').classList.remove('open'); }

// Share app
function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'DirectlyChat',
      text: 'Send WhatsApp messages without saving contacts!',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied!'))
      .catch(() => {});
  }
}

// Rate app (update with actual Play Store URL when published)
function rateApp() {
  window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
}

// Remember selected country
document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('countryCode');
  const savedCountry = localStorage.getItem('selectedCountryCode');
  if (savedCountry && countrySelect.querySelector(`option[value="${savedCountry}"]`)) {
    countrySelect.value = savedCountry;
  } else if (!countrySelect.value) {
    countrySelect.value = '1'; // Default to US/Canada +1
  }

  countrySelect.addEventListener('change', function() {
    localStorage.setItem('selectedCountryCode', this.value);
  });

  // Make brand clickable
  const brand = document.getElementById('brandHome');
  if (brand) {
    brand.addEventListener('click', () => showPage('home'));
  }

  // Enter key on phone field
  const phoneInput = document.getElementById('phoneNumber');
  if (phoneInput) {
    phoneInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendWA(false);
    });
  }
});
