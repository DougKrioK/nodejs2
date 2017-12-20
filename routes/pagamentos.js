module.exports = (app) => {

    app.get('/pagamentos',(req,res) => {
        console.log('recebida requisição de pagamentos');
        res.send('oks')
        
    });

    app.post('/pagamentos/pagamento', (req,res) => {
        var pagamento = req.body;
        console.log(pagamento);
        res.send('ok');
        
    })
}

