export const  getCurrentDateTime = () =>   {
    const now = new Date();
  
    const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
  
    return formattedDateTime;
  }