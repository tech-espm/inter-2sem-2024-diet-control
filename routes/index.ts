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

	@app.http.post()
	public async Lista(req: app.Request, res: app.Response) {
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

	public async produtos(req: app.Request, res: app.Response) {
		let produtos: any[];

		await app.sql.connect(async (sql) => {
			produtos = await sql.query("select id, nome, quantidade FROM produtos");
		});

		let opcoes = {
			produtos: produtos
		}
		
		res.render("index/produtos", opcoes);
	}
}

export = IndexRoute;
