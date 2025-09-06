import { getCollegesForRecommendation } from './collegeAPI';
import { getStreamRecommendations, getTopStreamRecommendation } from './streamRecommender';

// Enhanced recommendation algorithm with stream analysis first
export async function getRecommendations(answers) {
  try {
    // First get stream recommendations based on academic capability
    const streamRecommendations = getStreamRecommendations(answers);
    const topStream = getTopStreamRecommendation(answers);
    
    // Extract user preferences from answers
    const userPreferences = {
      stream: topStream.stream, // Use recommended stream
      location: answers[6], // Location preference (question 6)
      learningStyle: answers[7], // Learning style preference
      recommendedStreams: streamRecommendations // Pass all stream recommendations
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

      // Stream preference scoring based on recommended stream
      if (topStream.stream === "Engineering") {
        if (college.category === 'engineering' || college.name.toLowerCase().includes('engineering') || college.name.toLowerCase().includes('nit') || college.name.toLowerCase().includes('iit')) {
          score += 40;
        }
        if (college.courses && college.courses.some(c => ["B.Tech", "B.E.", "M.Tech"].includes(c))) {
          score += 35;
        }
      }
      
      if (topStream.stream === "Medical") {
        if (college.category === 'medical' || college.name.toLowerCase().includes('medical') || college.name.toLowerCase().includes('aiims')) {
          score += 40;
        }
        if (college.courses && college.courses.some(c => ["MBBS", "BDS", "BAMS", "BHMS"].includes(c))) {
          score += 35;
        }
      }
      
      if (topStream.stream === "Management") {
        if (college.category === 'management' || college.name.toLowerCase().includes('management') || college.name.toLowerCase().includes('business')) {
          score += 40;
        }
        if (college.courses && college.courses.some(c => ["BBA", "MBA", "PGDM", "B.Com"].includes(c))) {
          score += 35;
        }
      }
      
      if (topStream.stream === "Science") {
        if (college.category === 'general' || college.name.toLowerCase().includes('science') || college.name.toLowerCase().includes('university')) {
          score += 35;
        }
        if (college.courses && college.courses.some(c => ["B.Sc", "M.Sc", "B.Tech", "Research"].includes(c))) {
          score += 30;
        }
      }
      
      if (topStream.stream === "Arts") {
        if (college.name.toLowerCase().includes('arts') || college.name.toLowerCase().includes('university') || college.name.toLowerCase().includes('college')) {
          score += 35;
        }
        if (college.courses && college.courses.some(c => ["BA", "MA", "B.Ed", "Fine Arts"].includes(c))) {
          score += 30;
        }
      }

      // Location preference scoring (Question 6)
      if (answers[6] && answers[6] !== "Anywhere in India") {
        if (college.location && college.location.toLowerCase().includes(answers[6].toLowerCase())) {
          score += 25;
        }
        if (college.state && college.state.toLowerCase().includes(answers[6].toLowerCase())) {
          score += 20;
        }
      } else if (answers[6] === "Anywhere in India") {
        score += 10; // Small bonus for flexibility
      }

      // Learning style preference scoring (Question 7)
      if (answers[7] === "Hands-on practical work") {
        if (college.category === 'engineering' || college.name.toLowerCase().includes('polytechnic') || college.name.toLowerCase().includes('institute of technology')) {
          score += 20;
        }
      } else if (answers[7] === "Theoretical study & concepts") {
        if (college.name.toLowerCase().includes('university') || college.name.toLowerCase().includes('research')) {
          score += 15;
        }
      }

      // Stream match confidence bonus
      if (topStream.percentage >= 80) {
        score += 15; // High confidence in stream recommendation
      } else if (topStream.percentage >= 60) {
        score += 10; // Medium confidence
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

    // Sort by score and return top 5 with stream recommendations
    scoredColleges.sort((a, b) => b.score - a.score);
    const topColleges = scoredColleges.slice(0, 5);
    
    return {
      streamRecommendations,
      topStream,
      colleges: topColleges
    };

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

    // Get stream recommendations for fallback too
    const streamRecommendations = getStreamRecommendations(answers);
    const topStream = getTopStreamRecommendation(answers);
    
    // Apply same scoring logic to fallback data
    const scoredFallback = fallbackColleges.map(college => {
      let score = 0;
      
      // Stream preference scoring for fallback using recommended stream
      if (topStream.stream === "Engineering" && college.courses.some(c => ["B.Tech"].includes(c))) {
        score += 35;
      }
      if (topStream.stream === "Medical" && college.courses.some(c => ["MBBS", "MD"].includes(c))) {
        score += 35;
      }
      if (topStream.stream === "Management" && college.courses.some(c => ["BBA", "MBA"].includes(c))) {
        score += 35;
      }
      if (topStream.stream === "Science" && college.courses.some(c => ["B.Sc", "B.Tech"].includes(c))) {
        score += 30;
      }
      if (topStream.stream === "Arts" && college.courses.some(c => ["BA", "B.Sc"].includes(c))) {
        score += 25;
      }
      
      // Location preference (Question 6)
      if (answers[6] && college.location && answers[6].includes(college.location)) {
        score += 20;
      }
      
      score += Math.floor(Math.random() * 5);
      return { ...college, score: Math.min(score, 100) };
    });

    scoredFallback.sort((a, b) => b.score - a.score);
    return {
      streamRecommendations,
      topStream,
      colleges: scoredFallback.slice(0, 5)
    };
  }
}