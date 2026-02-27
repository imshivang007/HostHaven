// Leaflet Map Implementation for HostHaven
// Free OpenStreetMap integration

console.log('Map.js loaded');

// Initialize map on listing show page
function initShowMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.log('Show map element not found');
        return;
    }
    
    console.log('Initializing show map...');
    
    try {
        const listingData = mapElement.dataset.listing;
        console.log('Listing data:', listingData ? 'present' : 'missing');
        
        const listing = listingData ? JSON.parse(listingData) : {};
        console.log('Listing parsed:', listing.title, listing.geometry);
        
        // Check if we have coordinates
        let lat = 20.5937; // Default India
        let lng = 78.9629;
        let hasCoordinates = false;
        
        if (listing.geometry && listing.geometry.coordinates && 
            listing.geometry.coordinates.length === 2 && 
            listing.geometry.coordinates[0] !== 0) {
            // We have coordinates from geometry field
            lng = listing.geometry.coordinates[0];
            lat = listing.geometry.coordinates[1];
            hasCoordinates = true;
            console.log('Using geometry coordinates:', lat, lng);
        } else {
            console.log('No valid coordinates found, using default');
        }
        
        // Create map - Note: Leaflet uses [lat, lng] format
        const map = L.map('map').setView([lat, lng], hasCoordinates ? 12 : 5);
        
        console.log('Map created, adding tiles...');
        
        // Add OpenStreetMap tiles (free, no API key needed)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        console.log('Tiles added');
        
        // Add marker at location
        const marker = L.marker([lat, lng]).addTo(map);
        
        // Add popup
        const popupContent = listing.title 
            ? `<b>${listing.title}</b><br><p>Exact Location will be provided after booking</p>`
            : `<b>Listing Location</b><br><p>Location not set. Edit listing to add location.</p>`;
        
        marker.bindPopup(popupContent).openPopup();
        
        console.log('Marker added');
        
        // Fix map display issues
        setTimeout(() => {
            map.invalidateSize();
            console.log('Map size invalidated');
        }, 100);
        
    } catch (e) {
        console.error('Error initializing show map:', e);
    }
}

// Initialize map for new/edit listing page (location picker)
function initLocationPicker() {
    const mapElement = document.getElementById('picker-map');
    if (!mapElement) {
        console.log('Picker map element not found');
        return;
    }
    
    console.log('Initializing location picker...');
    
    try {
        // Get initial coordinates from hidden fields or default to India
        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        const coordsDisplay = document.getElementById('coordinatesDisplay');
        
        let lat = 20.5937; // Default: India
        let lng = 78.9629;
        
        if (latInput?.value && parseFloat(latInput.value) !== 0) {
            lat = parseFloat(latInput.value);
        }
        if (lngInput?.value && parseFloat(lngInput.value) !== 0) {
            lng = parseFloat(lngInput.value);
        }
        
        console.log('Initial coordinates:', lat, lng);
        
        // Create map
        const map = L.map('picker-map').setView([lat, lng], lat === 20.5937 ? 5 : 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add draggable marker
        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        
        // Function to update coordinates display
        function updateCoordinatesDisplay(latitude, longitude) {
            if (coordsDisplay) {
                coordsDisplay.textContent = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
            }
        }
        
        // Initialize display
        updateCoordinatesDisplay(lat, lng);
        
        // Update coordinates on marker drag
        marker.on('dragend', function(event) {
            const position = marker.getLatLng();
            if (latInput) latInput.value = position.lat.toFixed(6);
            if (lngInput) lngInput.value = position.lng.toFixed(6);
            updateCoordinatesDisplay(position.lat, position.lng);
        });
        
        // Also update on map click
        map.on('click', function(event) {
            marker.setLatLng(event.latlng);
            if (latInput) latInput.value = event.latlng.lat.toFixed(6);
            if (lngInput) lngInput.value = event.latlng.lng.toFixed(6);
            updateCoordinatesDisplay(event.latlng.lat, event.latlng.lng);
        });
        
        console.log('Location picker initialized');
        
        // Fix map display
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
    } catch (e) {
        console.error('Error initializing location picker:', e);
    }
}

// Initialize map on index page showing all listings
function initIndexMap() {
    const mapElement = document.getElementById('index-map');
    if (!mapElement) {
        console.log('Index map element not found');
        return;
    }
    
    console.log('Initializing index map...');
    
    try {
        const listings = JSON.parse(mapElement.dataset.listings || '[]');
        console.log('Listings for map:', listings.length);
        
        // Default center - India
        let center = [20.5937, 78.9629];
        
        // Find first listing with valid coordinates
        const firstValid = listings.find(l => l.geometry?.coordinates && l.geometry.coordinates[0] !== 0);
        if (firstValid) {
            center = [firstValid.geometry.coordinates[1], firstValid.geometry.coordinates[0]];
            console.log('Using listing coordinates:', center);
        }
        
        const map = L.map('index-map').setView(center, 5);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        let validCount = 0;
        
        // Add markers for all listings with coordinates
        listings.forEach(listing => {
            if (listing.geometry?.coordinates && listing.geometry.coordinates[0] !== 0) {
                validCount++;
                const lat = listing.geometry.coordinates[1];
                const lng = listing.geometry.coordinates[0];
                
                const marker = L.marker([lat, lng]).addTo(map);
                
                // Create popup content
                const popupContent = `
                    <div style="min-width: 200px;">
                        <a href="/listings/${listing._id}" style="text-decoration: none;">
                            ${listing.image?.url ? `<img src="${listing.image.url}" alt="${listing.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px;">` : ''}
                            <b style="color: #003049;">${listing.title || 'Listing'}</b><br>
                            <span style="color: #666;">${listing.location || ''}, ${listing.country || ''}</span><br>
                            <span style="color: #D62828; font-weight: bold;">₹${listing.price?.toLocaleString('en-IN') || 0}/night</span>
                        </a>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
            }
        });
        
        console.log('Valid markers added:', validCount);
        
        // Fit map to show all markers if we have valid coordinates
        if (validCount > 1) {
            const validCoordinates = listings
                .filter(l => l.geometry?.coordinates && l.geometry.coordinates[0] !== 0)
                .map(l => [l.geometry.coordinates[1], l.geometry.coordinates[0]]);
            
            if (validCoordinates.length > 0) {
                const bounds = L.latLngBounds(validCoordinates);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } else if (validCount === 1 && firstValid) {
            map.setView([firstValid.geometry.coordinates[1], firstValid.geometry.coordinates[0]], 12);
        }
        
        // Fix map display
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
    } catch (e) {
        console.error('Error initializing index map:', e);
    }
}

// Geocode address to coordinates using Nominatim (free OpenStreetMap geocoding)
async function geocodeAddress(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing maps...');
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        initShowMap();
        initLocationPicker();
        initIndexMap();
    }, 100);
});

// Also try on load event for cases where DOM is already loaded
window.addEventListener('load', function() {
    console.log('Window loaded, initializing maps...');
    setTimeout(() => {
        initShowMap();
        initLocationPicker();
        initIndexMap();
    }, 100);
});
