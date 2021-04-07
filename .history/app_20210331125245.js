const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT, globalVariables} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

/* Konfiguracja Mongoose do połączenia z MongoDB */
mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(response => {
        console.log('Połączono z bazą MongoDB');
    })
    .catch(err => {
        console.log('Połączenie z bazą MongoDB nie powiodło się.')
    })

/* Konfiguracja Express */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

/* Flash and Session*/
app.use(session ({
    secret:'cos tajemniczego',
    saveUninitialized: true,
    resave: true
}))

app.use(flash());
app.use(globalVariables);

/* Ustawienie View Engine do użycia handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');

/* Routes - ścieżki */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


/* Start serwera */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
