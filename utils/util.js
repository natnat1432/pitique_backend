import crypto from "crypto"

export function capitalizeWords(str) {
    // Split the string into words based on spaces

    if(str === null)
      return null
    
    const words = str.split(' ');
  
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => {
      if (word.length === 0) {
        return word; // Skip empty words
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  
    // Join the capitalized words back together with spaces
    return capitalizedWords.join(' ').trim();
  }


  export function generateRandomPassword(){
    var length = 7
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  }
  