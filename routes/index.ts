﻿import app = require("teem");

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		res.render("index/index");
	}

	public async sobre(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Sobre"
		};

		res.render("index/sobre", opcoes);
	}

	public async produtos(req: app.Request, res: app.Response) {
		let nome = req.query["nome"] as string || "";

		let opcoes = {
			titulo: "Produtos",
			nome: nome.trim()
		};

		res.render("index/produtos", opcoes);
	}

	public async listar(req: app.Request, res: app.Response) {
		let produtos: any[];

		await app.sql.connect(async (sql) => {
			produtos = await sql.query("select id, nome, quantidade, date_format(validade, '%d/%m/%Y') validade FROM produtos");
		});

		res.json(produtos);
	}

	public async consulta(req: app.Request, res: app.Response) {
		let produtos: any[];

		await app.sql.connect(async (sql) => {
			produtos = await sql.query("select categoria, descricaoAlimento, energiaKcal, proteina, carboidrato, fibraAlimentar from cmvcoltaco3");
		});

		let opcoes = {
			titulo: "Consulta",
			produtos: produtos
		};

		res.render("index/consulta", opcoes);
	}

	public async obter(req: app.Request, res: app.Response) {
		let idtexto = req.query["id"] as string;
		let id = parseInt(idtexto);

		let produtos: any[];

		await app.sql.connect(async (sql) => {
			produtos = await sql.query("select id, nome FROM produtos where id = ?", [id]);
		});

		res.json(produtos[0] || null);
	}

	@app.http.post()
	public async criar(req: app.Request, res: app.Response) {
		let produtos = req.body;

		if(!produtos) {
			res.status(400).send("Produto não informado");
			return;
		}
		if(!produtos.nome) {
			res.status(400).send("Nome do produto não informado");
			return;
		}
		if(!produtos.quantidade) {
			res.status(400).send("Quantidade do produto não informado");
			return;
		}
		if (!produtos.validade) {
			res.status(400).send("Validade do produto não informado");
			return;
		}
		await app.sql.connect(async (sql) => {
			await sql.query("INSERT INTO produtos (nome, quantidade, validade) VALUES (?, ?, ?)", [produtos.nome, produtos.quantidade, produtos.validade]);
		});
		res.json(true);
	}

	@app.http.post()
	public async editar(req: app.Request, res: app.Response) {
		let produto = req.body;
		
		if (!produto) {
			res.status(400)
			res.json("Produto não informado");
			return;
		}

		if(!produto.id){
			res.status(400)
			res.json("Id do produto não informado");
			return;
		}

		
		if (!produto.nome) {
			res.status(400)
			res.json("Nome do produto não informado");
			return;
		}
		if (!produto.quantidade) {
			res.status(400)
			res.json("Quantidade do produto não informado");
			return;
		}
		if (!produto.validade) {
			res.status(400)
			res.json("Validade do produto não informado");
			return;
		}

		
		let linhasAlteradas = 0;
		await app.sql.connect(async (sql) => {
			await sql.query("UPDATE produtos SET nome = ?, quantidade = ?, validade = ? WHERE id = ?", [produto.nome, produto.quantidade, produto.validade, produto.id]);
			linhasAlteradas = sql.affectedRows;
		});
		if (!linhasAlteradas) {
			res.status(404)
			res.json("Produto não encontrado");
			return;
		}
		res.json(true);
	}

	@app.http.delete()
	public async excluir(req: app.Request, res: app.Response) {
		let idtexto = req.query["id"] as string;
		let id = parseInt(idtexto);

		if(isNaN(id)) {
			res.status(400).send("Id inválido");
			return;
		}
		
		let linhasAfetadas = 0;

		await app.sql.connect(async (sql) => {
			await sql.query("DELETE FROM produtos WHERE id = ?", [id]);
			linhasAfetadas = sql.affectedRows;	
		});
		if (!linhasAfetadas) {
			res.status(404)
			res.json("Produto não encontrado");
			return;
		}
		res.json(true);
	}	
}

export = IndexRoute;
