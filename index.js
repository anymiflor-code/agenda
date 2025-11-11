const express = require("express") //libreria
const morgan = require("morgan") //importar morgan
const app = express() //levantar
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

//pagina principal
app.get('/', (request, response) => {
    response.send('<h1>API REST FROM Notes</h1>')
})

//paso 2
app.get('/info', (request, response) => {
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

//lista todas las notas
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//Obtener una nota especifica
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(x => x.id === id)
    //response.json(person)
    if (person){
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

//Eliminar una nota
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)//solo estamos simulando el borrado
    //console.log('Delete', id);
    response.status(204).end()
})

//crear una nueva persona
app.post('/api/persons', (request, response) =>{
    const person = request.body
    
    //verificar si falta nombre o número
    if (!person.name) {
        return response.status(400).json({error: 'name is missing'})
    }
    
    if (!person.number) {
        return response.status(400).json({error: 'number is missing'})
    }
    
    //verificar si el nombre ya existe en la agenda
    const nameExists = persons.find(p => p.name.toLowerCase() === person.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({error: 'name must be unique'})
    }
    
    //generar ID aleatorio
    person.id = Math.floor(Math.random() * 1000000) + 1
    
    persons = persons.concat(person)
    response.json(person)
})

// ACTUALIZAR UNA PERSONA EXISTENTE (NUEVA FUNCIÓN)
app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const { name, number } = request.body
    
    // Validar que vengan los datos requeridos
    if (!name || !number) {
        return response.status(400).json({error: 'name and number are required'})
    }
    
    // Buscar la persona por ID
    const existingPerson = persons.find(p => p.id === id)
    
    if (!existingPerson) {
        return response.status(404).json({error: 'Person not found'})
    }
    
    // Verificar que el nombre no exista en OTRA persona (excepto la actual)
    const nameExists = persons.find(p => 
        p.name.toLowerCase() === name.toLowerCase() && p.id !== id
    )
    
    if (nameExists) {
        return response.status(400).json({error: 'name must be unique'})
    }
    
    // Actualizar la persona
    const updatedPerson = { 
        ...existingPerson, 
        name: name, 
        number: number 
    }
    
    persons = persons.map(p => p.id === id ? updatedPerson : p)
    
    response.json(updatedPerson)
})

// OPCIÓN ALTERNATIVA: PATCH para actualización parcial
app.patch('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const { name, number } = request.body
    
    // Buscar la persona por ID
    const existingPerson = persons.find(p => p.id === id)
    
    if (!existingPerson) {
        return response.status(404).json({error: 'Person not found'})
    }
    
    // Verificar unicidad del nombre si se está actualizando
    if (name) {
        const nameExists = persons.find(p => 
            p.name.toLowerCase() === name.toLowerCase() && p.id !== id
        )
        
        if (nameExists) {
            return response.status(400).json({error: 'name must be unique'})
        }
    }
    
    // Actualizar solo los campos proporcionados
    const updatedPerson = { 
        ...existingPerson, 
        ...(name && { name }), // Solo actualiza si name existe
        ...(number && { number }) // Solo actualiza si number existe
    }
    
    persons = persons.map(p => p.id === id ? updatedPerson : p)
    
    response.json(updatedPerson)
})

const badPath = (request, response, next) => {
    response.status(404).send({error: 'Ruta desconocida'})
}
app.use(badPath)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server runing in port ${PORT}`)
})