// This script will be used to update CORS settings after frontend deployment
// You'll need to update the CORS origins in server.js with your actual frontend URL

const corsOrigins = [
  'https://mybankingwebsitekrish.vercel.app', // Replace with your actual frontend URL
  'https://your-frontend-domain.netlify.app', // Replace with your actual frontend URL
  'http://localhost:3000'
];

console.log('CORS Origins to add to server.js:', corsOrigins);
console.log('Update the CORS configuration in server.js with your actual frontend URL');
