let date=new Date()
console.log(date.toLocaleDateString());
// printing Day
console.log(date.toLocaleString('default', { weekday: 'long' }));
