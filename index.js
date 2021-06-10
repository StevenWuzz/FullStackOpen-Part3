const express = require('express')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

let contacts = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
    },
    { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
    },
    { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
    }
]

const errorHandler = (error, request, response, next) => {
    if(error.name === 'CastError'){
        response.status(400).send({error: 'Malformatted id'})
    }
    next(error)
}

app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(contacts => response.json(contacts))
})

app.get('/info', (request,response) => {
    const date = new Date()
    console.log(date)
    response.send(
        `<p> Phonebook has info for ${contacs.length} people </p>
         <p> ${date} </p>`
    )
})

app.get('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    
    if(contact){
        response.json(contact)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    Contact.findByIdAndRemove(id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/contacts', (request,response) => {
    if(!(request.body.name)){
        return response.status(400).json({error: 'Name is missing'})
    }
    else if(!(request.body.number)){
        return response.status(400).json({error: 'Number is missing'})
    }
    else if(!(request.body.name) && !(request.body.number)){
        return response.status(400).json({error: 'Name and number are missing'})
    }
    else{
        const duplicate = contacts.some(contact => contact.name === request.body.name)
        if(duplicate){
            return response.status(400).json({error: 'Name already exists '})
        }
    }

    const id = crypto.randomBytes(16).toString("hex");

    const newContact = new Contact({
        name: request.body.name,
        number: request.body.number,
        id: id
    })

    newContact.save().then(savedContacts => {
        response.json(savedContacts)
    })
})

app.use(errorHandler)

/*
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('tiny', {stream: accessLogStream}))
app.get('/', (request, response) => {
    response.send('Hello World')
})
*/

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
