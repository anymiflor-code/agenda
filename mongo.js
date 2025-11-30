const mongoose = require('mongoose')
if(process.argv.length<3 || process.argv.length !==3 && process.argv.length !==5){
    console.log('Ojito:');
    console.log('Está mal escrito o te faltan parametros');
    console.log('Agregar: ');
    console.log('node mongo1.js <password> [Name] [Phone]');
    console.log('');
    console.log('Y para consultar: ');
    console.log('node mongo1.js <password>');
    console.log('_________________________________________');
    process.exit(1);
}
 
const password = process.argv[2];
 
const url = `mongodb+srv://anafal_db_user:${password}@cluster0.xbf6tu3.mongodb.net/?appName=appNote`
 
mongoose.set('strictQuery', false);
 
mongoose.connect(url);
 
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
 
const Person = mongoose.model('Person', personSchema);
 
if(process.argv.length === 5){
 
    const person = new Person ({
        name: process.argv[3],
        number: process.argv[4],
    })
 
    person.save().then(result => {
        console.log(`Added ${person.name} ${person.number} to phonebook`);
        mongoose.connection.close();
    })
} else if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('Phonebook: ');
        
        result.forEach(x => {
            console.log(`${x.name} ${x.number}`);
     const mongoose = require('mongoose')
if(process.argv.length<3 || process.argv.length !==3 && process.argv.length !==5){
    console.log('---------------------------------------------');
    console.log('Te faltan parametros o esta mal escrito');
    console.log('Agregar: ');
    console.log('node mongo1.js <password> [Name] [Phone]');
    console.log('');
    console.log('Consultar: ');
    console.log('node mongo1.js <password>');
    console.log('---------------------------------------------');
    process.exit(1);
}
 
const password = process.argv[2];   })
        mongoose.connection.close();
    })
}
