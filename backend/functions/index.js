const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Import data files
const jkColleges = require("../../data/jk_colleges.json");
const courses = require("../../data/courses.json");
const quiz = require("../../data/quiz.json");

// Enable CORS
const cors = require('cors')({origin: true});

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("SIH 2025 College Recommender API - Hello from Firebase!");
});

// Get all JK colleges
exports.getColleges = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.json(jkColleges);
  });
});

// Get courses
exports.getCourses = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.json(courses);
  });
});

// Get quiz data
exports.getQuiz = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.json(quiz);
  });
});

// Import recommender logic
const { recommend } = require("./recommender");

// College recommendation based on quiz results
exports.recommendColleges = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const { userAnswers } = req.body;
    
    // Use intelligent recommendation logic
    const recommendations = recommend(userAnswers);
    
    res.json({
      recommendations: recommendations,
      total: recommendations.length
    });
  });
});
