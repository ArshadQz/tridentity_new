const futureDate = new Date();
futureDate.setDate(futureDate.getDate() +Number(7));
const pad = n => n.toString().padStart(2, '0');
export const mysqlDateTime = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())} ${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}:${pad(futureDate.getSeconds())}`;

export const addDays =  (theDate, days) =>  {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}