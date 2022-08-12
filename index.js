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

app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {  
    let reply = '<p>Phonebook has info for '
    reply += persons.length.toString()
    reply += '</p><p>'
    reply += new Date()
    reply += '</p>'
    response.send(reply)
  }).catch(error => next(error))
})
  
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {  
    response.json(persons)
  })
  })
  
app.get('/api/persons/:id', (request, response, next) => {
  const {id}  = request.params
    Person.findById(id)
      .then((person) => {
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      }).catch(error => next(error))
    
  })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result =>{
    response.status(204).end()
      })
      .catch(error => next(error))
  })

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name is missing' 
        })
      }    
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }

  person.save().then(savedPerson => {
    response.json(savedPerson)
        })
        .catch(error => next(error))
  })
    
  app.put('/api/persons/:id', (request, response, next) =>{
    const body = request.body
    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(request.params.id,person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'malformatted id or person not found' })
    }else if (error.name === 'ValidatorError') {
      return response.status(400).json({ error: error.message })
    }
    else {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })