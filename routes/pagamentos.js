module.exports = (app) => {
    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";

    //consultar
    app.get('/pagamentos',(req,res) => {
        console.log('recebida requisição de pagamentos');
        res.send('oks')
        
    });
    //criar
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

        pagamento.status=PAGAMENTO_CRIADO;
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

                //na resposta, eu digo pro cliente quais possiveis caminhos ele pode seguir, alterar ou deletar.
                /**
                 *  Hateoas >
                    Hypermedia As The Engine Of Applications State >
                    "hypermedia como motor da maquina de estados da aplicação"
                 */
                var response = {
                    dados_do_pagamento: pagamento,
                    links: [
                        {
                            href:'http://localhost:3000/pagamentos/pagamento/'+pagamento.id,
                            rel:'confirmar',
                            method:'PUT'
                        },
                        {
                            href:'http://localhost:3000/pagamentos/pagamento/'+pagamento.id,
                            rel:'cancelar',
                            method:'DELETE'
                        },

                    ]

                }
                res.location('/pagamentos/pagamento/' + resultado.insertId)
                    .status(201)
                    .json(response);
            }

            
        });
    });

    //alterar ou confirmar
    // ;id é o parametro que recebe na url
    app.put('/pagamentos/pagamento/:id', (req,res) => {
        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;

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

    //deletar ou desativar
    app.delete('/pagamentos/pagamento/:id', (req,res) => {
        let pagamento = {};
        let id = req.params.id;
        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro,resultado) => {
            if(erro){
                res,status(500).send(erro);
                return;
            }
            res.status(204).send(pagamento);
        });

    });

}