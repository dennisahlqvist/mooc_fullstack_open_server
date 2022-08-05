require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status  :req[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
    let reply = '<p>Phonebook has info for '
    reply += persons.length.toString()
    reply += '</p><p>'
    reply += new Date()
    reply += '</p>'
    response.send(reply)
  })
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {  
    response.json(persons)
  })
  })
  
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person =>{ 
        return person.id === id
    })
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })
    if (!person.name) {
        return response.status(400).json({ 
          error: 'name is missing' 
        })
      }    
    if (!person.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }

  person.save().then(savedPerson => {
    response.json(savedPerson)
        })
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })