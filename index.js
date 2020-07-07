const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

//RECUPERAR
app.get("/client/:cpf/:password", (req, res) => {
    let { cpf } = req.params;

    /*
        requisição ao bd para capturar o Cliente
    */
    let id = 10;
    var token = jwt.sign({ id }, "jessinsystems123456789", {
        expiresIn: 300 // expires in 5min
    });

    res.status(200).send({ cpf, token });
});

app.get("/authenticationToken/:token", (req, res) => {
    let { token } = req.params;

    jwt.verify(token, "jessinsystems123456789", function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate ' });
        console.log(decoded);
        res.status(200).send({ id: decoded.id });
    });

});

//CRIAR
app.post("/hello", (req, res) => {
    res.status(200).send({ msg: "ra tomar no cu", error: true });
});

//ATUALIZAR
app.put("/hello", (req, res) => {
    res.status(200).send({ msg: "ra tomar no cu", error: true });
});

//DELETAR
app.delete("/hello", (req, res) => {
    res.status(200).send({ msg: "ra tomar no cu", error: true });
});

app.listen(3000);