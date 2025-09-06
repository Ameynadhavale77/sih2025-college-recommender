// CollegeAPI Integration Service
const COLLEGE_API_BASE_URL = 'https://collegeapi.pythonanywhere.com';

// Cache for API responses to reduce API calls
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchWithCache(url) {
  const now = Date.now();
  if (cache.has(url)) {
    const { data, timestamp } = cache.get(url);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache.set(url, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Get all colleges with optional filtering
export async function getAllColleges(state = null, city = null, limit = 100) {
  let url = `${COLLEGE_API_BASE_URL}/all`;
  
  if (state) {
    url += `/state=${encodeURIComponent(state)}`;
  } else if (city) {
    url += `/city=${encodeURIComponent(city)}`;
  }
  
  if (limit) {
    url += url.includes('?') ? '&' : '?';
    url += `limit=${limit}`;
  }

  return await fetchWithCache(url);
}

// Get engineering colleges
export async function getEngineeringColleges(state = null, city = null) {
  let url = `${COLLEGE_API_BASE_URL}/engineering_colleges`;
  
  if (state) {
    url += `/state=${encodeURIComponent(state)}`;
  } else if (city) {
    url += `/city=${encodeURIComponent(city)}`;
  }

  return await fetchWithCache(url);
}

// Get medical colleges
export async function getMedicalColleges(state = null, city = null) {
  let url = `${COLLEGE_API_BASE_URL}/medical_colleges`;
  
  if (state) {
    url += `/state=${encodeURIComponent(state)}`;
  } else if (city) {
    url += `/city=${encodeURIComponent(city)}`;
  }

  return await fetchWithCache(url);
}

// Get management colleges
export async function getManagementColleges(state = null, city = null) {
  let url = `${COLLEGE_API_BASE_URL}/management_colleges`;
  
  if (state) {
    url += `/state=${encodeURIComponent(state)}`;
  } else if (city) {
    url += `/city=${encodeURIComponent(city)}`;
  }

  return await fetchWithCache(url);
}

// Get colleges by category
export async function getCollegesByCategory(category, state = null, city = null) {
  const categoryMap = {
    engineering: getEngineeringColleges,
    medical: getMedicalColleges,
    management: getManagementColleges,
    all: getAllColleges
  };

  const fetchFunction = categoryMap[category] || getAllColleges;
  return await fetchFunction(state, city);
}

// Normalize API data to match our internal structure
export function normalizeCollegeData(apiCollege) {
  return {
    name: apiCollege.college_name || apiCollege.name,
    location: apiCollege.city || apiCollege.location,
    state: apiCollege.state,
    courses: [], // API doesn't provide specific courses, we'll infer from category
    cutoff: 75, // Default cutoff, can be improved with more data
    hostel: true, // Assume most colleges have hostel facilities
    budget: 'Medium', // Default budget category
    rank: apiCollege.nirf_rank || null,
    category: apiCollege.category || 'general',
    website: apiCollege.website || null,
    // Additional fields from API
    address: apiCollege.address,
    established: apiCollege.established,
    ownership: apiCollege.ownership,
    score: 0 // Will be calculated by recommendation algorithm
  };
}

// Get comprehensive college data for recommendations
export async function getCollegesForRecommendation(userPreferences = {}) {
  try {
    const { stream, location, category } = userPreferences;
    
    // Determine API category based on user stream preference
    let apiCategory = 'all';
    if (stream === 'Engineering' || stream === 'Science') {
      apiCategory = 'engineering';
    } else if (stream === 'Medical') {
      apiCategory = 'medical';
    } else if (stream === 'Commerce' || stream === 'Management') {
      apiCategory = 'management';
    }

    // Fetch colleges based on preferences
    const colleges = await getCollegesByCategory(
      apiCategory,
      location && location !== 'Anywhere' ? location : null
    );

    // Normalize and return data
    return colleges.map(normalizeCollegeData);
  } catch (error) {
    console.error('Error fetching colleges for recommendation:', error);
    // Fallback to local J&K data if API fails
    return getFallbackColleges();
  }
}

// Fallback data when API is unavailable
function getFallbackColleges() {
  return [
    {"name":"University of Kashmir","location":"Srinagar","state":"Jammu and Kashmir","courses":["B.Sc","BA","B.Tech"],"cutoff":70,"hostel":true,"budget":"Medium"},
    {"name":"GC Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["BBA","BA","B.Sc"],"cutoff":65,"hostel":false,"budget":"Low"},
    {"name":"NIT Srinagar","location":"Srinagar","state":"Jammu and Kashmir","courses":["B.Tech"],"cutoff":80,"hostel":true,"budget":"High"},
    {"name":"University of Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["B.Tech","B.Sc","BBA"],"cutoff":75,"hostel":true,"budget":"Medium"},
    {"name":"Government Medical College Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["MBBS"],"cutoff":90,"hostel":true,"budget":"Low"},
    {"name":"Cluster University Srinagar","location":"Srinagar","state":"Jammu and Kashmir","courses":["BA","BBA","Diploma"],"cutoff":60,"hostel":false,"budget":"Low"}
  ];
}