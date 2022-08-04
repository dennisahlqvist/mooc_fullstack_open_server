const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status  :req[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (request, response) => {
    let reply = '<p>Phonebook has info for '
    reply += persons.length.toString()
    reply += '</p><p>'
    reply += new Date()
    reply += '</p>'
    response.send(reply)
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
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

    var max = 4503599627370495;
    //max = Number.POSITIVE_INFINITY
    const newId = Math.floor(Math.random() * (max - 0) + 0); 
    const person = request.body
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

    const personsWithName = persons.filter((person1) => person1.name.toLowerCase()==(person.name.toLowerCase()))
    if (personsWithName.length != 0) {
        
        return response.status(403).json({ 
          error: 'name already exists in the phonebook' 
        })
      }

    person.id = newId
    persons = persons.concat(person)
    response.json(person)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })