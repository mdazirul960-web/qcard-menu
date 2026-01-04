// 1. Import your separate cafe files here
import sish from './sish.json';
// import urban from './urban.json';  <-- Uncomment this when you make the urban file

// 2. Bundle them into one list
const menuData = {
  sish,
  // urban,  <-- Add this here when you have the urban file
};

// 3. Export them to the app
export default menuData;