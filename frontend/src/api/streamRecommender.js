// Stream Recommendation Algorithm
// Analyzes academic capabilities and suggests best-fit streams

export function getStreamRecommendations(answers) {
  // Initialize stream scores
  const streamScores = {
    Engineering: 0,
    Medical: 0,
    Management: 0,
    Science: 0,
    Arts: 0
  };

  // Question 1: Mathematics skills
  const mathSkill = answers[1];
  if (mathSkill === "Excellent (Love complex problems)") {
    streamScores.Engineering += 25;
    streamScores.Science += 20;
    streamScores.Management += 10;
  } else if (mathSkill === "Good (Comfortable with formulas)") {
    streamScores.Engineering += 15;
    streamScores.Science += 15;
    streamScores.Management += 15;
    streamScores.Medical += 10;
  } else if (mathSkill === "Average (Basic calculations only)") {
    streamScores.Management += 20;
    streamScores.Arts += 15;
    streamScores.Medical += 10;
  } else if (mathSkill === "Struggle with math") {
    streamScores.Arts += 25;
    streamScores.Management += 10;
  }

  // Question 2: Subject interests (can be multiple)
  const subjects = Array.isArray(answers[2]) ? answers[2] : [answers[2]];
  subjects.forEach(subject => {
    switch(subject) {
      case "Physics & Chemistry":
        streamScores.Engineering += 20;
        streamScores.Science += 15;
        break;
      case "Biology & Life Sciences":
        streamScores.Medical += 25;
        streamScores.Science += 15;
        break;
      case "Economics & Business":
        streamScores.Management += 25;
        break;
      case "History & Literature":
        streamScores.Arts += 20;
        streamScores.Management += 5;
        break;
      case "Computer Science":
        streamScores.Engineering += 25;
        streamScores.Science += 10;
        break;
      case "Arts & Design":
        streamScores.Arts += 25;
        break;
    }
  });

  // Question 3: Work environment preference
  const workEnv = answers[3];
  switch(workEnv) {
    case "Laboratory & Research":
      streamScores.Science += 25;
      streamScores.Medical += 15;
      streamScores.Engineering += 10;
      break;
    case "Hospitals & Healthcare":
      streamScores.Medical += 30;
      break;
    case "Corporate Offices":
      streamScores.Management += 25;
      streamScores.Engineering += 10;
      break;
    case "Creative Studios":
      streamScores.Arts += 30;
      break;
    case "Technology Companies":
      streamScores.Engineering += 25;
      streamScores.Science += 10;
      break;
    case "Government & Public Service":
      streamScores.Management += 15;
      streamScores.Arts += 10;
      streamScores.Science += 10;
      break;
  }

  // Question 4: Problem-solving style
  const problemSolving = answers[4];
  switch(problemSolving) {
    case "Logical reasoning & analysis":
      streamScores.Engineering += 20;
      streamScores.Science += 15;
      streamScores.Medical += 10;
      break;
    case "Creative thinking & innovation":
      streamScores.Arts += 20;
      streamScores.Engineering += 10;
      streamScores.Management += 10;
      break;
    case "Following proven methods":
      streamScores.Medical += 15;
      streamScores.Management += 10;
      streamScores.Science += 10;
      break;
    case "Collaborative discussion":
      streamScores.Management += 20;
      streamScores.Arts += 10;
      break;
  }

  // Question 5: Career aspirations
  const career = answers[5];
  switch(career) {
    case "Become a technical expert/engineer":
      streamScores.Engineering += 30;
      break;
    case "Work in healthcare/medicine":
      streamScores.Medical += 30;
      break;
    case "Start my own business":
      streamScores.Management += 30;
      break;
    case "Pursue research & academics":
      streamScores.Science += 25;
      streamScores.Engineering += 10;
      break;
    case "Work in government/civil services":
      streamScores.Management += 20;
      streamScores.Arts += 15;
      break;
    case "Creative fields (media, design, arts)":
      streamScores.Arts += 30;
      break;
  }

  // Question 7: Learning style
  const learningStyle = answers[7];
  switch(learningStyle) {
    case "Hands-on practical work":
      streamScores.Engineering += 15;
      streamScores.Medical += 10;
      streamScores.Arts += 10;
      break;
    case "Theoretical study & concepts":
      streamScores.Science += 20;
      streamScores.Management += 10;
      break;
    case "Mix of both theory and practice":
      streamScores.Engineering += 10;
      streamScores.Medical += 15;
      streamScores.Science += 10;
      streamScores.Management += 10;
      break;
    case "Group projects & teamwork":
      streamScores.Management += 15;
      streamScores.Arts += 10;
      break;
  }

  // Convert to array and sort by score
  const streamRecommendations = Object.entries(streamScores)
    .map(([stream, score]) => ({
      stream,
      score,
      percentage: Math.min(Math.round((score / 150) * 100), 100),
      description: getStreamDescription(stream),
      careers: getStreamCareers(stream),
      topCourses: getStreamCourses(stream)
    }))
    .sort((a, b) => b.score - a.score);

  return streamRecommendations;
}

function getStreamDescription(stream) {
  const descriptions = {
    Engineering: "Perfect for analytical minds who love problem-solving, mathematics, and building innovative solutions. Combines technical knowledge with practical applications.",
    Medical: "Ideal for those passionate about healthcare, helping others, and working in life sciences. Requires dedication to continuous learning and patient care.",
    Management: "Great for future leaders interested in business, entrepreneurship, and organizational success. Develops strategic thinking and leadership skills.",
    Science: "Excellent for curious minds who enjoy research, experimentation, and understanding how things work. Opens doors to diverse research opportunities.",
    Arts: "Perfect for creative individuals who value self-expression, cultural understanding, and innovative thinking. Offers diverse creative career paths."
  };
  return descriptions[stream] || "";
}

function getStreamCareers(stream) {
  const careers = {
    Engineering: ["Software Engineer", "Mechanical Engineer", "Data Scientist", "Product Manager", "Research Scientist"],
    Medical: ["Doctor", "Surgeon", "Medical Researcher", "Healthcare Administrator", "Public Health Specialist"],
    Management: ["Business Analyst", "Entrepreneur", "Marketing Manager", "Financial Advisor", "Operations Manager"],
    Science: ["Research Scientist", "Lab Technician", "Environmental Scientist", "Quality Analyst", "Academic Professor"],
    Arts: ["Graphic Designer", "Writer", "Media Producer", "Cultural Coordinator", "Art Director"]
  };
  return careers[stream] || [];
}

function getStreamCourses(stream) {
  const courses = {
    Engineering: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Electrical", "B.E Civil", "B.Tech Electronics"],
    Medical: ["MBBS", "BDS", "BAMS", "BHMS", "B.Pharm"],
    Management: ["BBA", "B.Com", "MBA", "PGDM", "BCA"],
    Science: ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics", "B.Sc Biology", "M.Sc Research"],
    Arts: ["BA Literature", "BA History", "BA Psychology", "Fine Arts", "Mass Communication"]
  };
  return courses[stream] || [];
}

export function getTopStreamRecommendation(answers) {
  const recommendations = getStreamRecommendations(answers);
  return recommendations[0]; // Return top recommendation
}