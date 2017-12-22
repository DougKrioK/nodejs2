module.exports = (app) => {

    app.get('/pagamentos',(req,res) => {
        console.log('recebida requisição de pagamentos');
        res.send('oks')
        
    });
    // ;id é o parametro que recebe na url
    app.put('/pagamentos/pagamento/:id', (req,res) => {
        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = 'confirmado';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro,resultado) => {
            if(erro){
                res,status(500).send(erro);
                return;
            }
            res.send(pagamento);
        });

    });

    app.delete('/pagamentos/pagamento/:id', (req,res) => {
        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = 'cancelado';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro,resultado) => {
            if(erro){
                res,status(500).send(erro);
                return;
            }
            res.status(204).send(pagamento);
        });

    })

    app.post('/pagamentos/pagamento', (req,res) => {
        var pagamento = req.body;
        console.log('processando uma requisicao de um novo pagamento');


        req.assert('forma_de_pagamento','Forma de pagamento é obrigatório').notEmpty();
        req.assert('valor','Valor é obrigatorio e deve ser um decimal').notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

        var erros = req.validationErrors();

        if(erros){
            console.log('Erros de validação encontrados: '+erros);
            res.status(400).send(erros);
            return;
        }

        pagamento.status='criado';
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, (erro, resultado) => {

            if(erro){
                //caso de erro, altero o status para 400 e envio o erro
                console.log('erro ao inserir no banco: '+erro);
                
                res.status(400).send(erro)

            } else {
                console.log('Pagamento criado');
                pagamento.id = resultado.insertId;
                res.location('/pagamentos/pagamento/' + resultado.insertId)
                    .status(201)
                    .json(pagamento);
            }

            
        });
    })
}

