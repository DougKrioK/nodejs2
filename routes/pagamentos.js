module.exports = (app) => {

    app.get('/pagamentos',(req,res) => {
        console.log('recebida requisição de pagamentos');
        res.send('oks')
        
    });

    app.post('/pagamentos/pagamento', (req,res) => {
        var pagamento = req.body;
        console.log('processando uma requisicao de um novo pagamento');

        pagamento.status='criado';
        pagamento.data = new Date();
        
        res.send(pagamento);
        
    })
}

