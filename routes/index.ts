import app = require("teem");

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
		res.render("index/produtos");
	}

	public async listar(req: app.Request, res: app.Response) {
		let produtos: any[];

		await app.sql.connect(async (sql) => {
			produtos = await sql.query("select id, nome, quantidade FROM produtos order by nome asc");
		});

		res.json(produtos);
	}

	public async obter(req: app.Request, res: app.Response) {
		let idtexto = req.query["id"] as string;
		let id = parseInt(idtexto);

		let produtos: any[];

		await app.sql.connect(async (sql) => {
			produtos = await sql.query("select id, nome, quantidade FROM produtos where id = ?", [id]);
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
		await app.sql.connect(async (sql) => {
			await sql.query("INSERT INTO produtos (nome, quantidade) VALUES (?, ?)", [produtos.nome, produtos.quantidade]);
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

		
		let linhasAlteradas = 0;
		await app.sql.connect(async (sql) => {
			await sql.query("UPDATE produtos SET nome = ?, quantidade = ? WHERE id = ?", [produto.nome, produto.quantidade, produto.id]);
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
