// CollegeAPI Integration Service - Working Indian Colleges API
const COLLEGE_API_BASE_URL = 'https://colleges-api.onrender.com';

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
  let url = `${COLLEGE_API_BASE_URL}/colleges`;
  
  if (state) {
    url += `/${encodeURIComponent(state)}`;
  }
  
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (params.toString()) {
    url += '?' + params.toString();
  }

  const response = await fetchWithCache(url);
  return response.colleges || [];
}

// Search colleges by name or type
export async function searchColleges(searchTerm, limit = 50) {
  let url = `${COLLEGE_API_BASE_URL}/colleges`;
  
  const params = new URLSearchParams();
  if (searchTerm) params.append('search', searchTerm);
  if (limit) params.append('limit', limit);
  
  if (params.toString()) {
    url += '?' + params.toString();
  }

  const response = await fetchWithCache(url);
  return response.colleges || [];
}

// Get all available states
export async function getStates() {
  const url = `${COLLEGE_API_BASE_URL}/states`;
  return await fetchWithCache(url);
}

// Get colleges by state and district
export async function getCollegesByLocation(state, district = null, limit = 100) {
  let url = `${COLLEGE_API_BASE_URL}/colleges/${encodeURIComponent(state)}`;
  
  if (district) {
    url += `/${encodeURIComponent(district)}`;
  }
  
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  
  if (params.toString()) {
    url += '?' + params.toString();
  }

  const response = await fetchWithCache(url);
  return response.colleges || [];
}

// Get colleges by category using search
export async function getCollegesByCategory(category, state = null, limit = 100) {
  const searchTerms = {
    engineering: 'engineering technology institute polytechnic',
    medical: 'medical college AIIMS hospital',
    management: 'management business MBA institute',
    science: 'science university college',
    arts: 'arts college university',
    all: ''
  };

  const searchTerm = searchTerms[category] || '';
  
  if (state) {
    return await getCollegesByLocation(state, null, limit);
  } else {
    return await searchColleges(searchTerm, limit);
  }
}

// Normalize API data to match our internal structure
export function normalizeCollegeData(apiCollege) {
  return {
    name: apiCollege.college_name || apiCollege.name || 'Unknown College',
    location: apiCollege.district || apiCollege.city || apiCollege.location || 'Unknown',
    state: apiCollege.state || 'Unknown',
    courses: inferCoursesFromName(apiCollege.college_name || apiCollege.name || ''),
    cutoff: inferCutoffFromType(apiCollege.type, apiCollege.college_name),
    hostel: true, // Assume most colleges have hostel facilities
    budget: inferBudgetFromType(apiCollege.type),
    rank: apiCollege.nirf_rank || null,
    category: inferCategoryFromName(apiCollege.college_name || apiCollege.name || ''),
    website: apiCollege.website || null,
    type: apiCollege.type || 'Unknown',
    university: apiCollege.university,
    id: apiCollege.id,
    score: 0 // Will be calculated by recommendation algorithm
  };
}

// Helper functions to infer data from college names
function inferCoursesFromName(name) {
  const nameLower = name.toLowerCase();
  const courses = [];
  
  if (nameLower.includes('engineering') || nameLower.includes('technology') || nameLower.includes('polytechnic')) {
    courses.push('B.Tech', 'Diploma');
  }
  if (nameLower.includes('medical') || nameLower.includes('mbbs') || nameLower.includes('medicine')) {
    courses.push('MBBS', 'BDS');
  }
  if (nameLower.includes('management') || nameLower.includes('business')) {
    courses.push('BBA', 'MBA');
  }
  if (nameLower.includes('science') || nameLower.includes('college')) {
    courses.push('B.Sc', 'M.Sc');
  }
  if (nameLower.includes('arts') || nameLower.includes('university')) {
    courses.push('BA', 'MA');
  }
  
  return courses.length > 0 ? courses : ['B.Sc', 'BA', 'BCA'];
}

function inferCutoffFromType(type, name) {
  if (!type && !name) return 70;
  
  const combined = `${type} ${name}`.toLowerCase();
  
  if (combined.includes('iit') || combined.includes('nit') || combined.includes('iiit')) return 95;
  if (combined.includes('medical') || combined.includes('aiims')) return 90;
  if (combined.includes('engineering') || combined.includes('technology')) return 80;
  if (combined.includes('management')) return 75;
  if (combined.includes('government')) return 70;
  
  return 65;
}

function inferBudgetFromType(type) {
  if (!type) return 'Medium';
  
  const typeLower = type.toLowerCase();
  if (typeLower.includes('government') || typeLower.includes('central')) return 'Low';
  if (typeLower.includes('private')) return 'High';
  
  return 'Medium';
}

function inferCategoryFromName(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('engineering') || nameLower.includes('technology') || nameLower.includes('polytechnic')) return 'engineering';
  if (nameLower.includes('medical') || nameLower.includes('mbbs') || nameLower.includes('medicine')) return 'medical';
  if (nameLower.includes('management') || nameLower.includes('business')) return 'management';
  if (nameLower.includes('arts')) return 'arts';
  
  return 'general';
}

// Get comprehensive college data for recommendations
export async function getCollegesForRecommendation(userPreferences = {}) {
  try {
    const { stream, location } = userPreferences;
    let colleges = [];
    
    // Determine API category based on user stream preference
    let apiCategory = 'all';
    if (stream === 'Engineering') {
      apiCategory = 'engineering';
    } else if (stream === 'Medical') {
      apiCategory = 'medical';
    } else if (stream === 'Management' || stream === 'Commerce') {
      apiCategory = 'management';
    } else if (stream === 'Science') {
      apiCategory = 'science';
    } else if (stream === 'Arts') {
      apiCategory = 'arts';
    }

    // Fetch colleges based on preferences
    if (location && location !== 'Anywhere in India' && location !== 'Anywhere') {
      colleges = await getCollegesByLocation(location, null, 200);
    } else {
      colleges = await getCollegesByCategory(apiCategory, null, 200);
    }

    // If we got empty results, try a broader search
    if (!colleges || colleges.length === 0) {
      colleges = await getAllColleges(null, null, 200);
    }

    // Normalize and return data
    const normalizedColleges = colleges.map(normalizeCollegeData);
    
    // Add some variety if we have results
    if (normalizedColleges.length > 0) {
      return normalizedColleges;
    } else {
      throw new Error('No colleges found from API');
    }
    
  } catch (error) {
    console.error('Error fetching colleges for recommendation:', error);
    // Fallback to enhanced local data
    return getFallbackColleges();
  }
}

// Enhanced fallback data with nationwide colleges
function getFallbackColleges() {
  return [
    {"name":"Indian Institute of Technology Delhi","location":"New Delhi","state":"Delhi","courses":["B.Tech","M.Tech","PhD"],"cutoff":98,"hostel":true,"budget":"Medium","rank":2,"category":"engineering"},
    {"name":"Indian Institute of Technology Bombay","location":"Mumbai","state":"Maharashtra","courses":["B.Tech","M.Tech","PhD"],"cutoff":98,"hostel":true,"budget":"Medium","rank":1,"category":"engineering"},
    {"name":"All India Institute of Medical Sciences","location":"New Delhi","state":"Delhi","courses":["MBBS","MD","MS"],"cutoff":95,"hostel":true,"budget":"Low","rank":1,"category":"medical"},
    {"name":"Indian Institute of Management Ahmedabad","location":"Ahmedabad","state":"Gujarat","courses":["MBA","PGDM"],"cutoff":95,"hostel":true,"budget":"High","rank":1,"category":"management"},
    {"name":"University of Delhi","location":"Delhi","state":"Delhi","courses":["BA","B.Sc","B.Com","MA"],"cutoff":85,"hostel":true,"budget":"Low","category":"general"},
    {"name":"Jadavpur University","location":"Kolkata","state":"West Bengal","courses":["B.Tech","B.Sc","BA","M.Tech"],"cutoff":88,"hostel":true,"budget":"Medium","category":"general"},
    {"name":"Banaras Hindu University","location":"Varanasi","state":"Uttar Pradesh","courses":["B.Tech","BA","B.Sc","MBBS"],"cutoff":82,"hostel":true,"budget":"Medium","category":"general"},
    {"name":"Indian Institute of Technology Madras","location":"Chennai","state":"Tamil Nadu","courses":["B.Tech","M.Tech","PhD"],"cutoff":97,"hostel":true,"budget":"Medium","rank":3,"category":"engineering"},
    {"name":"Vellore Institute of Technology","location":"Vellore","state":"Tamil Nadu","courses":["B.Tech","MBA","B.Sc"],"cutoff":85,"hostel":true,"budget":"High","category":"engineering"},
    {"name":"Manipal Academy of Higher Education","location":"Manipal","state":"Karnataka","courses":["MBBS","B.Tech","BBA"],"cutoff":83,"hostel":true,"budget":"High","category":"medical"},
    {"name":"Anna University","location":"Chennai","state":"Tamil Nadu","courses":["B.Tech","M.Tech","MBA"],"cutoff":80,"hostel":true,"budget":"Medium","category":"engineering"},
    {"name":"Jamia Millia Islamia","location":"New Delhi","state":"Delhi","courses":["BA","B.Tech","MBA","B.Arch"],"cutoff":78,"hostel":true,"budget":"Medium","category":"general"},
    {"name":"Aligarh Muslim University","location":"Aligarh","state":"Uttar Pradesh","courses":["BA","B.Tech","MBBS","MBA"],"cutoff":76,"hostel":true,"budget":"Medium","category":"general"},
    {"name":"Indian Institute of Technology Kanpur","location":"Kanpur","state":"Uttar Pradesh","courses":["B.Tech","M.Tech","PhD"],"cutoff":96,"hostel":true,"budget":"Medium","rank":4,"category":"engineering"},
    {"name":"Birla Institute of Technology and Science","location":"Pilani","state":"Rajasthan","courses":["B.Tech","MBA","M.Sc"],"cutoff":92,"hostel":true,"budget":"High","category":"engineering"},
    {"name":"University of Kashmir","location":"Srinagar","state":"Jammu and Kashmir","courses":["B.Sc","BA","B.Tech"],"cutoff":70,"hostel":true,"budget":"Medium","category":"general"},
    {"name":"NIT Srinagar","location":"Srinagar","state":"Jammu and Kashmir","courses":["B.Tech","M.Tech"],"cutoff":85,"hostel":true,"budget":"Medium","rank":45,"category":"engineering"},
    {"name":"Government Medical College Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["MBBS","MD"],"cutoff":88,"hostel":true,"budget":"Low","category":"medical"},
    {"name":"Shri Mata Vaishno Devi University","location":"Katra","state":"Jammu and Kashmir","courses":["B.Tech","MBA","B.Arch"],"cutoff":75,"hostel":true,"budget":"Medium","category":"engineering"},
    {"name":"University of Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["B.Tech","B.Sc","BBA","BA"],"cutoff":72,"hostel":true,"budget":"Medium","category":"general"}
  ];
}