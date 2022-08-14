const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.xeclkwq.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

  })
  .catch((err) => console.log(err))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person1 = new Person({
  name: process.argv[3],
  number: process.argv[4]
})


if(process.argv.length === 3){
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name,person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {

  person1.save().then( () => {
    console.log('added ',person1.name,' number ',person1.number,' to phonebook')
    mongoose.connection.close()
  }).catch((err) => console.log(err))

}else{
  console.log('invalid parameters')
  mongoose.connection.close()
}


