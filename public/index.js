const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            email TEXT,
            telefone TEXT,
            endereco TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS barbeiros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            email TEXT,
            telefone TEXT,
            especialidade TEXT,
            endereco TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS cervicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco TEXT NOT NULL UNIQUE,
            duracao TEXT,
            descricao TEXT
        )
    `);
    

    console.log('Tabelas criadas com sucesso.');
});


///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////
///////////////////////////// Rotas para Clientes /////////////////////////////

// Cadastrar cliente
app.post('/clientes', (req, res) => {
    const { nome, cpf, email, telefone, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send('Nome e CPF são obrigatórios.');
    }

    const query = `INSERT INTO clientes (nome, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, email, telefone, endereco], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar cliente.');
        }
        res.status(201).send({ id: this.lastID, message: 'Cliente cadastrado com sucesso.' });
    });
});

// Listar clientes
// Endpoint para listar todos os clientes ou buscar por CPF
app.get('/clientes', (req, res) => {
    const cpf = req.query.cpf || '';  // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM clientes WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar clientes.' });
            }
            res.json(rows);  // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar clientes.' });
            }
            res.json(rows);  // Retorna todos os clientes
        });
    }
});

///////////////////////////// Rotas para Barbeiro /////////////////////////////
///////////////////////////// Rotas para Barbeiro /////////////////////////////
///////////////////////////// Rotas para Barbeiro /////////////////////////////

// Atualizar barbeiros
app.put('/barbeiros/cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, especialidade, endereco } = req.body;

    const query = `UPDATE barbeiros SET nome = ?, email = ?, telefone = ?, especialidade = ? endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, endereco, especialidade, cpf], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar barbeiro.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Barbeiro não encontrado.');
        }
        res.send('B atualizado com sucesso.');
    });
});

/////////////////////////////////////////////////////////////////////////////////////
// Cadastrar barbeiros
app.post('/barbeiros', (req, res) => {
    const { nome, cpf, email, telefone, especialidade, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send('Nome e CPF são obrigatórios.');
    }

    const query = `INSERT INTO barbeiros (nome, cpf, email, telefone, especialidade, endereco) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, email, telefone, especialidade, endereco], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar barbeiro.');
        }
        res.status(201).send({ id: this.lastID, message: 'Barbeiro cadastrado com sucesso.' });
    });
});
/////////////////////////////////////////////////////////////////////
// Listar barbeiros
// Endpoint para listar todos os barbeiros ou buscar por CPF
app.get('/barbeiros', (req, res) => {
    const cpf = req.query.cpf || '';  // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca barbeiros que possuam esse CPF ou parte dele
        const query = `SELECT * FROM barbeiros WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar barbeiros.' });
            }
            res.json(rows);  // Retorna os barbeiros encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os barbeiros
        const query = `SELECT * FROM barbeiros`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar barbeiros.' });
            }
            res.json(rows);  // Retorna todos os barbeiros
        });
    }
});


// Atualizar barbeiros
app.put('/barbeiros/cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, especialidade, endereco } = req.body;

    const query = `UPDATE barbeiros SET nome = ?, email = ?, telefone = ?, especialidade = ? endereco = ? WHERE cpf = ?`;
    db.run(query, [nome, email, telefone, especialidade, endereco, cpf], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar barbeiros.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Barbeiro não encontrado.');
        }
        res.send('Barbeiro atualizado com sucesso.');
    });
});



///////////////////////////// Rotas para Serviços /////////////////////////////
///////////////////////////// Rotas para Serviços /////////////////////////////
///////////////////////////// Rotas para Serviços /////////////////////////////

// Atualizar serviços
app.put('/cervicos/nome/:nome', (req, res) => {
    const { nome } = req.params;
    const { preco, duracao, descricao } = req.body;

    const query = `UPDATE cervicos SET preco = ?, duracao = ?, descricao = ? WHERE nome = ?`;
    db.run(query, [nome, preco, duracao, descricao], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar servico.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Servico não encontrado.');
        }
        res.send('B atualizado com sucesso.');
    });
});

/////////////////////////////////////////////////////////////////////////////////////
// Cadastrar serviços
app.post('/cervicos', (req, res) => {
    const { nome, preco, duracao, descricao } = req.body;

    if (!nome || !preco) {
        return res.status(400).send('Nome e Preço são obrigatórios.');
    }

    const query = `INSERT INTO cervicos (nome, preco, duracao, descricao) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, preco, duracao, descricao], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar serviço.');
        }
        res.status(201).send({ id: this.lastID, message: 'Serviço cadastrado com sucesso.' });
    });
});
/////////////////////////////////////////////////////////////////////
// Listar serviços
// Endpoint para listar todos os serviços ou buscar por NOME
app.get('/cervicos', (req, res) => {
    const nome = req.query.nome || '';  // Recebe o NOME da query string (se houver)

    if (nome) {
        // Se NOME foi passado, busca barbeiros que possuam esse CPF ou parte dele
        const query = `SELECT * FROM cervicos WHERE nome LIKE ?`;

        db.all(query, [`%${nome}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar serviços.' });
            }
            res.json(rows);  // Retorna os serviços encontrados ou um array vazio
        });
    } else {
        // Se NOME não foi passado, retorna todos os serviços
        const query = `SELECT * FROM serviços`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar serviços.' });
            }
            res.json(rows);  // Retorna todos os serviços 
        });
    }
});


// Atualizar barbeiros
app.put('/cervicos/nome/:nome', (req, res) => {
    const { nome } = req.params;
    const { preco, duracao, descricao } = req.body;

    const query = `UPDATE cervicos SET preco = ?, duracao = ?, descricao = ? WHERE nome = ?`;
    db.run(query, [nome, preco, duracao, descricao], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar serviço.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Serviço não encontrado.');
        }
        res.send('Serviço atualizado com sucesso.');
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Rota para buscar vendas com filtros (cpf, produto, data)
app.get('/relatorios', (req, res) => {
    const { cpf, produto, dataInicio, dataFim } = req.query;

    let query = `SELECT
                    vendas.id,
                    vendas.cliente_cpf,
                    vendas.produto_id,
                    vendas.quantidade,
                    vendas.data, 
                    produtos.nome AS produto_nome,
                    clientes.nome AS cliente_nome
                 FROM vendas
                 JOIN produtos ON vendas.produto_id = produtos.id
                 JOIN clientes ON vendas.cliente_cpf = clientes.cpf
                 WHERE 1=1`;  // Começar com um WHERE sempre verdadeiro (1=1)

    const params = [];

    // Filtro por CPF do cliente
    if (cpf) {
        query += ` AND vendas.cliente_cpf = ?`;
        params.push(cpf);
    }

    // Filtro por nome do produto
    if (produto) {
        query += ` AND produtos.nome LIKE ?`;
        params.push(`%${produto}%`);
    }

    // Filtro por data
    if (dataInicio && dataFim) {
        query += ` AND vendas.data BETWEEN ? AND ?`;
        params.push(dataInicio, dataFim);
    }

    // Executa a query com os filtros aplicados
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar relatórios.', error: err.message });
        }

        res.json(rows);  // Retorna os resultados da query
    });
});

  














// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
