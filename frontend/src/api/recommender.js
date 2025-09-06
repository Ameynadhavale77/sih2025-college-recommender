import { getCollegesForRecommendation } from './collegeAPI';

// Enhanced recommendation algorithm using CollegeAPI
export async function getRecommendations(answers) {
  try {
    // Extract user preferences from answers
    const userPreferences = {
      stream: answers[1], // Science, Commerce, Arts, Engineering, etc.
      location: answers[3], // Location preference
      coursePreference: answers[2], // Specific course preference
      practicalWork: answers[4] // Practical work interest level
    };

    // Fetch colleges from API based on preferences
    const colleges = await getCollegesForRecommendation(userPreferences);

    // Enhanced scoring algorithm
    const scoredColleges = colleges.map(college => {
      let score = 0;
      
      // NIRF Ranking bonus (higher rank = more points)
      if (college.rank) {
        const rankBonus = Math.max(0, 50 - college.rank / 10);
        score += rankBonus;
      }

      // Stream preference scoring
      if (answers[1] === "Science") {
        if (college.category === 'engineering' || college.name.toLowerCase().includes('science')) {
          score += 35;
        }
        if (college.courses && college.courses.some(c => ["B.Tech", "B.Sc", "MBBS", "BCA"].includes(c))) {
          score += 30;
        }
      }
      
      if (answers[1] === "Commerce") {
        if (college.category === 'management' || college.name.toLowerCase().includes('management')) {
          score += 35;
        }
        if (college.courses && college.courses.some(c => ["BBA", "BCom", "MBA", "BCA"].includes(c))) {
          score += 30;
        }
      }
      
      if (answers[1] === "Arts") {
        if (college.name.toLowerCase().includes('arts') || college.name.toLowerCase().includes('university')) {
          score += 35;
        }
        if (college.courses && college.courses.some(c => ["BA", "MA", "B.Ed"].includes(c))) {
          score += 30;
        }
      }
      
      if (answers[1] === "Engineering") {
        if (college.category === 'engineering' || college.name.toLowerCase().includes('engineering') || college.name.toLowerCase().includes('nit') || college.name.toLowerCase().includes('iit')) {
          score += 40;
        }
        if (college.courses && college.courses.some(c => ["B.Tech", "B.E.", "M.Tech"].includes(c))) {
          score += 35;
        }
      }

      if (answers[1] === "Medical") {
        if (college.category === 'medical' || college.name.toLowerCase().includes('medical') || college.name.toLowerCase().includes('aiims')) {
          score += 40;
        }
        if (college.courses && college.courses.some(c => ["MBBS", "BDS", "BAMS", "BHMS"].includes(c))) {
          score += 35;
        }
      }

      // Location preference scoring
      if (answers[3] && answers[3] !== "Anywhere") {
        if (college.location && college.location.toLowerCase().includes(answers[3].toLowerCase())) {
          score += 25;
        }
        if (college.state && college.state.toLowerCase().includes(answers[3].toLowerCase())) {
          score += 20;
        }
      } else if (answers[3] === "Anywhere") {
        score += 10; // Small bonus for flexibility
      }

      // Course preference scoring (if specific course mentioned)
      if (answers[2] && college.courses && college.courses.includes(answers[2])) {
        score += 30;
      }

      // Practical work preference
      if (answers[4] === "High") {
        if (college.category === 'engineering' || college.name.toLowerCase().includes('polytechnic') || college.name.toLowerCase().includes('institute of technology')) {
          score += 20;
        }
      }

      // Budget considerations (if specified in future quiz updates)
      if (college.budget === "Low") {
        score += 10; // Bonus for affordable options
      }

      // Hostel facility bonus
      if (college.hostel) {
        score += 8;
      }

      // Add small randomness for variety in similar scores
      score += Math.floor(Math.random() * 5);

      return { ...college, score: Math.min(score, 100) };
    });

    // Sort by score and return top 5
    scoredColleges.sort((a, b) => b.score - a.score);
    return scoredColleges.slice(0, 5);

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    
    // Fallback to local J&K data if API fails
    const fallbackColleges = [
      {"name":"University of Kashmir","location":"Srinagar","state":"Jammu and Kashmir","courses":["B.Sc","BA","B.Tech"],"cutoff":70,"hostel":true,"budget":"Medium"},
      {"name":"NIT Srinagar","location":"Srinagar","state":"Jammu and Kashmir","courses":["B.Tech"],"cutoff":80,"hostel":true,"budget":"High","rank":50},
      {"name":"University of Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["B.Tech","B.Sc","BBA"],"cutoff":75,"hostel":true,"budget":"Medium"},
      {"name":"Government Medical College Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["MBBS"],"cutoff":90,"hostel":true,"budget":"Low"},
      {"name":"GC Jammu","location":"Jammu","state":"Jammu and Kashmir","courses":["BBA","BA","B.Sc"],"cutoff":65,"hostel":false,"budget":"Low"}
    ];

    // Apply same scoring logic to fallback data
    const scoredFallback = fallbackColleges.map(college => {
      let score = 0;
      
      // Stream preference scoring for fallback
      if (answers[1] === "Science" && college.courses.some(c => ["B.Tech", "B.Sc", "MBBS"].includes(c))) {
        score += 30;
      }
      if (answers[1] === "Engineering" && college.courses.some(c => ["B.Tech"].includes(c))) {
        score += 35;
      }
      if (answers[1] === "Medical" && college.courses.some(c => ["MBBS"].includes(c))) {
        score += 35;
      }
      if (answers[1] === "Commerce" && college.courses.some(c => ["BBA"].includes(c))) {
        score += 30;
      }
      
      // Location preference
      if (answers[3] === college.location) {
        score += 20;
      }
      
      score += Math.floor(Math.random() * 5);
      return { ...college, score: Math.min(score, 100) };
    });

    scoredFallback.sort((a, b) => b.score - a.score);
    return scoredFallback.slice(0, 5);
  }
}