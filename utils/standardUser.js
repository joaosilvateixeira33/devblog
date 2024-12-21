const bcrypt = require('bcryptjs');
const conn = require('../db/conn');

const createDefaultUser = async () => {
    const username = 'admin';
    const password = 'admin123';  

    conn.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Erro ao consultar banco de dados:', err);
            return;
        }

        if (results.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
            const data = [username, hashedPassword, email];

            conn.query(query, data, (err) => {
                if (err) {
                    console.error('Erro ao criar o usuário:', err);
                } else {
                    console.log('Usuário padrão criado com sucesso!');
                }
            });
        } else {
            console.log('Usuário já existe no banco de dados.');
        }
    });
};


module.exports = createDefaultUser;