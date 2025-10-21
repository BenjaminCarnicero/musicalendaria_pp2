// 🔐 Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
  alert('Access denied. Please log in as an artist.');
  window.location.href = 'login.html';
}

// 📥 Load artist profile data
async function loadProfile() {
  try {
    const res = await fetch('http://localhost:3000/api/artist/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const artist = await res.json();

    document.getElementById('name').value = artist.name || '';
    document.getElementById('email').value = artist.email || '';
    document.getElementById('photo').value = artist.photo || '';
    document.getElementById('portfolio').value = artist.portfolio || '';
    document.getElementById('spotify').value = artist.spotify || '';
    document.getElementById('youtube').value = artist.youtube || '';
    document.getElementById('instagram').value = artist.instagram || '';
  } catch (err) {
    console.error('Error loading profile:', err);
    alert('Failed to load your profile.');
  }
}

// 💾 Save profile changes
async function saveProfile() {
  const payload = {
    photo: document.getElementById('photo').value,
    portfolio: document.getElementById('portfolio').value,
    spotify: document.getElementById('spotify').value,
    youtube: document.getElementById('youtube').value,
    instagram: document.getElementById('instagram').value
  };

  try {
    const res = await fetch('http://localhost:3000/api/artist/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Profile updated successfully.');
    } else {
      alert(data.error || 'Failed to save changes.');
    }
  } catch (err) {
    console.error('Error saving profile:', err);
    alert('Could not save your profile.');
  }
}

// 🎭 Load artist events
async function loadEvents() {
  try {
    const res = await fetch('http://localhost:3000/api/artist/events', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const events = await res.json();

    const container = document.getElementById('events');
    container.innerHTML = events.map(e => `
      <div class="event">
        <h3>${e.name}</h3>
        <p>${e.date} ${e.time} - ${e.location}</p>
        <p>${e.entryType} ${e.price ? `- $${e.price}` : ''}</p>
        ${e.flyer ? `<a href="${e.flyer}" target="_blank">Flyer</a>` : ''}
        ${e.tickets ? `<a href="${e.tickets}" target="_blank">Tickets</a>` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading events:', err);
    document.getElementById('events').innerHTML = '<p>Could not load your events.</p>';
  }
}

// ➕ Show event creation form
function showEventForm() {
  document.getElementById('eventForm').style.display = 'block';
}

// 📝 Save new event
async function saveEvent() {
  const payload = {
    name: document.getElementById('eventName').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    location: document.getElementById('location').value,
    entryType: document.getElementById('entryType').value,
    price: document.getElementById('price').value,
    flyer: document.getElementById('flyer').value,
    tickets: document.getElementById('tickets').value
  };

  try {
    const res = await fetch('http://localhost:3000/api/artist/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Event saved successfully.');
      loadEvents();
    } else {
      alert(data.error || 'Failed to save event.');
    }
  } catch (err) {
    console.error('Error saving event:', err);
    alert('Could not save the event.');
  }
}

// 🔚 Log out
function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

// 🚀 Initialize dashboard
loadProfile();
loadEvents();