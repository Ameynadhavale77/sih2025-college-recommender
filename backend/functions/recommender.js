const colleges = require("../../data/jk_colleges.json");
const quiz = require("../../data/quiz.json");

function recommend(userAnswers) {
    let scoredColleges = colleges.map(college => {
        let score = 0;
        quiz.forEach(q => {
            const ans = userAnswers[q.id];
            if(ans){
                if(Array.isArray(ans)){
                    ans.forEach(a => { score += q.score[a] || 0; });
                } else {
                    score += q.score[ans] || 0;
                }
            }
            // Boost if college has preferred courses
            if(college.courses.includes(ans)) score += 1;
            if(college.location === userAnswers[3]) score += 2;
        });
        return {...college, score};
    });
    scoredColleges.sort((a,b)=>b.score - a.score);
    return scoredColleges.slice(0,5); // top 5
}

module.exports = { recommend };