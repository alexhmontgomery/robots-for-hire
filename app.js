const express = require('express')
const mustache = require('mustache-express')
const app = express()

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', './views')
app.use(express.static('public'))

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/robots'

app.listen(3000, function () {
  console.log('Server ON! Go to Port: 3000')
})

app.get('/', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      throw err
    } else {
      console.log('Successfully connected to the database')
    }
    const data = require('./data')
    for (var i = 0; i < data.users.length; i++) {
      const user = data.users[i]
      db.collection('users').updateOne(
      {id: user.id},
      user,
      {upsert: true}
    )
    }
    db.collection('users').find()
    .toArray(function (err, documents) {
      res.render('index', {
        users: documents
      })
    })
  })
})

app.get('/for-hire', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      throw err
    } else {
      console.log('Successfully connected to the database')
    }
    db.collection('users').find({job: null})
    .toArray(function (err, documents) {
      console.log(documents)
      res.render('for-hire', {
        unemployed: documents
      })
    })
  })
})

app.get('/employed', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      throw err
    } else {
      console.log('Successfully connected to the database')
    }
    db.collection('users').find({job: {$ne: null}})
    .toArray(function (err, documents) {
      console.log(documents)
      res.render('employed', {
        employed: documents
      })
    })
  })
})

app.get('/user-:id', function (req, res) {
  const userId = parseInt(req.params.id)
  MongoClient.connect(url, function (err, db) {
    if (err) {
      throw err
    } else {
      console.log('Successfully connected to the database')
    }
    db.collection('users').findOne({id: userId}, function (err, documents) {
      console.log(documents)
      res.render('user', {
        user: documents
      })
    })
  })
})
