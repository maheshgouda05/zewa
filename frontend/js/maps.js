/**
 * ZEWA - Geolocation & Navigation Utilities
 * Manages user location, distance calculations, and Google Maps directions.
 */

window.zewaMaps = {
  // Default coordinates: Indiranagar, Bengaluru
  defaultLocation: {
    lat: 12.9784,
    lng: 77.6408,
    name: 'Indiranagar, Bengaluru'
  },

  currentLocation: null,

  async initLocation() {
    // Check localStorage first
    const saved = localStorage.getItem('zewa_user_location');
    if (saved) {
      try {
        this.currentLocation = JSON.parse(saved);
        return this.currentLocation;
      } catch (e) {}
    }

    // Attempt HTML5 Geolocation
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000
          });
        });

        this.currentLocation = {
          lat: parseFloat(pos.coords.latitude.toFixed(4)),
          lng: parseFloat(pos.coords.longitude.toFixed(4)),
          name: 'Current Location (GPS)'
        };
        localStorage.setItem('zewa_user_location', JSON.stringify(this.currentLocation));
        return this.currentLocation;
      } catch (err) {
        console.info('[Location] Geolocation prompt denied or timed out. Using default Bengaluru location.');
      }
    }

    this.currentLocation = { ...this.defaultLocation };
    return this.currentLocation;
  },

  getCurrentLocation() {
    return this.currentLocation || this.defaultLocation;
  },

  setLocation(lat, lng, name) {
    this.currentLocation = { lat, lng, name: name || `${lat}, ${lng}` };
    localStorage.setItem('zewa_user_location', JSON.stringify(this.currentLocation));
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  },

  formatDistance(km) {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  },

  getGoogleMapsDirectionsUrl(destLat, destLng, destName) {
    const origin = this.currentLocation ? `${this.currentLocation.lat},${this.currentLocation.lng}` : '';
    const destination = `${destLat},${destLng}`;
    const label = destName ? `(${encodeURIComponent(destName)})` : '';
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_place_id=${label}`;
  }
};
