// Mock API call for recommendations - replace with Firebase function URL
export async function getRecommendations(answers) {
  // For now, using local algorithm since Firebase functions aren't deployed
  const colleges = [
    {"name":"University of Kashmir","location":"Srinagar","courses":["B.Sc","BA","B.Tech"],"cutoff":70,"hostel":true,"budget":"Medium"},
    {"name":"GC Jammu","location":"Jammu","courses":["BBA","BA","B.Sc"],"cutoff":65,"hostel":false,"budget":"Low"},
    {"name":"NIT Srinagar","location":"Srinagar","courses":["B.Tech"],"cutoff":80,"hostel":true,"budget":"High"},
    {"name":"University of Jammu","location":"Jammu","courses":["B.Tech","B.Sc","BBA"],"cutoff":75,"hostel":true,"budget":"Medium"},
    {"name":"Government Medical College Jammu","location":"Jammu","courses":["MBBS"],"cutoff":90,"hostel":true,"budget":"Low"},
    {"name":"Cluster University Srinagar","location":"Srinagar","courses":["BA","BBA","Diploma"],"cutoff":60,"hostel":false,"budget":"Low"}
  ]

  // Simple scoring algorithm
  const scoredColleges = colleges.map(college => {
    let score = 0;
    
    // Stream preference scoring
    if (answers[1] === "Science" && college.courses.some(c => ["B.Tech", "B.Sc", "MBBS"].includes(c))) {
      score += 30;
    }
    if (answers[1] === "Commerce" && college.courses.some(c => ["BBA", "BCom"].includes(c))) {
      score += 30;
    }
    if (answers[1] === "Arts" && college.courses.some(c => ["BA"].includes(c))) {
      score += 30;
    }
    if (answers[1] === "Engineering" && college.courses.some(c => ["B.Tech"].includes(c))) {
      score += 30;
    }

    // Course preference scoring
    if (answers[2] && college.courses.includes(answers[2])) {
      score += 25;
    }

    // Location preference scoring
    if (answers[3] === college.location) {
      score += 20;
    }
    if (answers[3] === "Anywhere in J&K") {
      score += 10;
    }

    // Practical labs preference
    if (answers[4] === "High" && college.courses.some(c => ["B.Tech", "B.Sc", "MBBS"].includes(c))) {
      score += 15;
    }

    // Add some randomness for variety
    score += Math.floor(Math.random() * 10);

    return { ...college, score: Math.min(score, 100) };
  });

  // Sort by score and return top 5
  scoredColleges.sort((a, b) => b.score - a.score);
  return scoredColleges.slice(0, 5);

  // Uncomment below when Firebase functions are deployed:
  /*
  try {
    const res = await fetch("YOUR_FIREBASE_FUNCTION_URL/recommendColleges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAnswers: answers })
    });
    const data = await res.json();
    return data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
  */
}