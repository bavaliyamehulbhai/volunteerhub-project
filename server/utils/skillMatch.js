const calculateSkillMatch = (userSkills = [], eventSkills = []) => {
  if (!eventSkills || !eventSkills.length) {
    return {
      score: 100,
      matchedSkills: []
    };
  }

  const uSkills = userSkills || [];

  const matchedSkills = eventSkills.filter(skill =>
    uSkills.includes(skill)
  );

  const score = Math.round(
    (matchedSkills.length / eventSkills.length) * 100
  );

  return {
    score,
    matchedSkills
  };
};

module.exports = calculateSkillMatch;
