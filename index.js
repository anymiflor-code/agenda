require('dotenv').config()
const express = require("express") //libreria
const morgan = require("morgan") //importar morgan
const app = express() //levantar
const Person = require('./models/person')
//le agregué
const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

// Crear token personalizado para Morgan
morgan.token('post-data', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(express.json())
// Configurar Morgan con formato personalizado
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

/*
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  console.log('---------------------');
  next()
}

app.use(requestLogger)
*/
/*
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number : "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number : "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number : "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number : "39-23-6423122"
    }
]
    */

//pagina principal
app.get('/', (request, response) => {
    response.send('<h1>API REST FROM Notes</h1>')
})


// INFO ENDPOINT - ACTUALIZADO
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const currentTime = new Date().toString();
    const phonebookEntries = persons.length;
    
    const infoHTML = `
        <div>
            <p>Phonebook has info for ${phonebookEntries} people</p>
            <p>${currentTime}</p>
        </div>
    `;
    
    response.send(infoHTML);
  })
})

// GET TODAS LAS PERSONAS - ACTUALIZADA
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Obtener una persona específica - ACTUALIZADO
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})



// Eliminar una persona - ACTUALIZADO
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Crear una nueva persona - ACTUALIZADO
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'nonmre y numero son requeridos' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Actualizar persona - ACTUALIZADO
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
/*
const badPath = (request, response, next) => {
    response.status(404).send({error: 'Ruta desconocida'})
}
app.use(badPath)
*/

// MANEJO DE ERRORES
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// RUTA NO ENCONTRADA - ACTUALIZADO
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server runing in port ${PORT}`)
})