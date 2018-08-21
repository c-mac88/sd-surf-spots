function getTrack(trackId) {
  switch (trackId) {
    case 'track2':
      return [
        'Introduction to Programming with NodeJS (NODE100)',
        'HTML/CSS Basics (WEB100)',
        'JavaScript in the DOM (WEB101)',
        'Data Structures/Algorithms (ALG100)',
        'JavaScript Projects Intro (WEB102)',
        'Intro to Express (NODE101)',
        'Git/ChromeDevtools (OPS100)',
        'Beginner React (REACT100)',
        'Building and Deploying Apps (OPS200)',
        'Relational Databases (DB100)',
        'NO-SQL Databases (DB200)',
        'Intermediate Express (NODE200)',
        'Intermediate React (REACT200)'
      ];
    default: // track1
      return [
        'Introduction to Programming with NodeJS (NODE100)',
        'HTML/CSS Basics (WEB100)',
        'JavaScript in the DOM (WEB101)',
        'Intro to Express (NODE101)',
        'Git/ChromeDevtools (OPS100)',
        'Beginner React (REACT100)',
        'Building and Deploying Apps (OPS200)',
        'Relational Databases (DB100)',
        'NO-SQL Databases (DB200)',
        'Intermediate Express (NODE200)',
        'Intermediate React (REACT200)'
      ];
  }
}

module.exports = {
  getTrack
};
