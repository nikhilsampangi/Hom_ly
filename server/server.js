const express= require('express');
const cors= require('cors');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const app= express();
const port= 8008;


app.use(cors());


mongoose.connect('mongodb://localhost:27017/ciodb', {useNewUrlParser: true});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connection = mongoose.connection;

connection.once('open', function(){
    console.log("connected");
});

const route = require('./routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/user', route);
app.listen(port, () => console.info('REST API running on port '+ port));
