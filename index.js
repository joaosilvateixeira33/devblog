const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;
const hbs = exphbs.create({
    partialsDir: ["views/partials"],
    helpers: {
        formatDate: function (date) {
            const currentDate = new Date(date);
            const formatter = new Intl.DateTimeFormat('pt-BR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            let formattedDate = formatter.format(currentDate);
            formattedDate = formattedDate.replace('.', ',');

            return formattedDate;
        }
    }
})

app.use(express.json())

app.use(
    express.urlencoded({
        extended: true
    })
)


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true
}));

function checkAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    conn.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.render('login', { error: 'Erro ao acessar o banco de dados' });
        }

        const user = results[0];
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            return res.redirect('/dashboard');  
        } else {
            return res.render('login', { error: 'Usuário ou senha incorretos' });
        }
    });
});

app.get('/dashboard', checkAuth, (req, res) => {
    conn.query('SELECT * FROM posts', (err, posts) => {
        if (err) throw err;
        res.render('dashboard', { posts });
    });
});

app.get('/edit/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    conn.query('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
        if (err) throw err;
        res.render('edit', { post: post[0] });
    });
});

app.post('/edit/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    conn.query('UPDATE posts SET title = ?, description = ? WHERE id = ?', [title, description, id], (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

app.post('/delete/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    conn.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

app.get('/', (req, res) => {
    const querySelect = 'SELECT * FROM posts';

    conn.query(querySelect, (err, data) => {
        if (err) {
            return res.send('Erro ao carregar posts');
        }
        res.render('home', { showSearch: true, posts: data });
    });
});

app.get('/create', (req, res) => {
    res.render('createPost', { showSearch: false })
})

app.post('/create', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    const currentDate = new Date();
    const createdAt = currentDate.toISOString().split('T')[0];

    const queryCreate = 'INSERT INTO posts (title, description, createdAt) VALUES (?, ?, ?)';
    const data = [title, description, createdAt];

    conn.query(queryCreate, data, (err) => {
        if (err) {
            res.send('Erro ao salvar no banco de dados');
        }

        res.redirect('/dashboard');
    })
})

app.listen(port, () => {
    console.log(`server on in http://localhost:${port}`);
})