const futureDate = new Date();
futureDate.setDate(futureDate.getDate() +Number(process.env.JWT_EXPIRES_IN));
const pad = n => n.toString().padStart(2, '0');
export const mysqlDateTime = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())} ${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}:${pad(futureDate.getSeconds())}`;