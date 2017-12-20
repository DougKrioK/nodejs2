module.exports = (app) => {

    app.get('/pagamentos',(req,res) => {
        console.log('recebida requisição de pagamentos');
        res.send('oks')
        
    });

    app.post('/pagamentos/pagamento', (req,res) => {
        var pagamento = req.body;
        console.log('processando uma requisicao de um novo pagamento');


        req.assert('forma_dePagamento','Forma de pagamento é obrigatório').notEmpty();
        req.assert('valor','Valor é obrigatorio e deve ser um decimal').notEmpty().isFloat();

        var erros = req.validationErros();

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
                res.json(pagamento);
            }

            
        });
    })
}

