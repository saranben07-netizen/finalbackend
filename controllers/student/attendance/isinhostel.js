// Haversine check function
function isInHostel(userLat, userLng, hostelLat, hostelLng, radiusMeters) {
  const R = 6371000; // Earth radius in meters

  // Convert degrees to radians
  const dLat = toRadians(hostelLat - userLat);
  const dLon = toRadians(hostelLng - userLng);

  const lat1 = toRadians(userLat);
  const lat2 = toRadians(hostelLat);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance <= radiusMeters;
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}


export default isInHostel
