let produtos = [];
let vendas = [];

// Carregar produtos e vendas salvos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    let produtosSalvos = localStorage.getItem('produtos');
    if (produtosSalvos) {
        produtos = JSON.parse(produtosSalvos);
        exibirProdutos();
    }

    let vendasSalvas = localStorage.getItem('vendas');
    if (vendasSalvas) {
        vendas = JSON.parse(vendasSalvas);
        exibirVendas();
    }

    // Preencher select de produtos no diálogo de venda
    let selectProduto = document.getElementById('selectProduto');
    produtos.forEach(produto => {
        let option = document.createElement('option');
        option.value = produto.nome;
        option.innerText = produto.nome;
        selectProduto.appendChild(option);
    });
});

function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function salvarVendas() {
    localStorage.setItem('vendas', JSON.stringify(vendas));
}

function adicionarProduto() {
    let nome = document.getElementById('nomeProduto').value;
    let valor = parseFloat(document.getElementById('valorProduto').value);
    let valorVenda = parseFloat(document.getElementById('valorVenda').value);
    let quantidade = parseInt(document.getElementById('quantidadeProduto').value);

    if (nome && !isNaN(valor) && !isNaN(valorVenda) && !isNaN(quantidade)) {
        // Verifica se o produto já existe na lista
        let produtoExistente = produtos.find(p => p.nome === nome);
        if (produtoExistente) {
            // Se existir, apenas soma a quantidade
            produtoExistente.quantidade += quantidade;
            document.getElementById('resultado').innerText = `Quantidade de ${nome} atualizada para ${produtoExistente.quantidade}`;
            document.getElementById('resultado').style.color = '#008000';
        } else {
            // Se não existir, adiciona um novo produto
            let id = produtos.length + 1; // Gera um ID simples para o produto
            produtos.push({ id, nome, valor, valorVenda, quantidade });
            document.getElementById('resultado').innerText = 'Produto adicionado com sucesso!';
            document.getElementById('resultado').style.color = '#008000';
        }

        salvarProdutos();
        exibirProdutos();
        document.getElementById('nomeProduto').value = '';
        document.getElementById('valorProduto').value = '';
        document.getElementById('valorVenda').value = '';
        document.getElementById('quantidadeProduto').value = '';
    } else {
        document.getElementById('resultado').innerText = 'Por favor, preencha todos os campos CORRETAMENTE.';
        document.getElementById('resultado').style.color = '#FF0000';
    }
}

function exibirProdutos() {
    let listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = '';
    produtos.forEach(produto => {
        let item = document.createElement('div');
        item.classList.add('product-item');
        item.innerHTML = `
            <span>${produto.nome}: R$${produto.valor.toFixed(2)} x ${produto.quantidade}</span>
            <div>
                <button class="edit-btn" onclick="editarProduto(${produto.id})">Editar</button>
                <button onclick="abrirDialogoRemoverProduto(${produto.id})">Remover</button>
            </div>
        `;
        listaProdutos.appendChild(item);
    });

    // Atualiza o select de produtos no diálogo de venda
    let selectProduto = document.getElementById('selectProduto');
    selectProduto.innerHTML = '';
    produtos.forEach(produto => {
        let option = document.createElement('option');
        option.value = produto.nome;
        option.innerText = produto.nome;
        selectProduto.appendChild(option);
    });
}

function editarProduto(id) {
    let produto = produtos.find(p => p.id === id);
    if (produto) {
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('valorProduto').value = produto.valor.toFixed(2);
        document.getElementById('valorVenda').value = produto.valorVenda.toFixed(2);
        document.getElementById('quantidadeProduto').value = produto.quantidade;
        produtos = produtos.filter(p => p.id !== id); // Remove o produto da lista temporária
        salvarProdutos();
        exibirProdutos(); // Atualiza a exibição da lista sem o produto editando
    }
}

function abrirDialogoRemoverProduto(id) {
    document.getElementById('dialogoRemoverProduto').style.display = 'block';
    window.produtoIdParaRemover = id; // Armazena o ID do produto a ser removido
}

function fecharDialogoRemoverProduto() {
    document.getElementById('dialogoRemoverProduto').style.display = 'none';
}

function confirmarRemocaoProduto() {
    produtos = produtos.filter(p => p.id !== window.produtoIdParaRemover);
    salvarProdutos();
    exibirProdutos();
    fecharDialogoRemoverProduto();
}

function abrirDialogo() {
    document.getElementById('dialogo').style.display = 'block';
}

function fecharDialogo() {
    document.getElementById('dialogo').style.display = 'none';
}

function registrarVenda() {
    let produtoNome = document.getElementById('selectProduto').value;
    let quantidade = parseInt(document.getElementById('quantidadeVendida').value);

    if (produtoNome && !isNaN(quantidade)) {
        let produto = produtos.find(p => p.nome === produtoNome);
        if (produto && produto.quantidade >= quantidade) {
            let id = vendas.length + 1; // Gera um ID simples para a venda
            let valorVenda = produto.valorVenda * quantidade;
            vendas.push({ id, nome: produtoNome, quantidade, valorVenda });

            produto.quantidade -= quantidade;
            if (produto.quantidade === 0) {
                produtos = produtos.filter(p => p.id !== produto.id);
            }

            salvarVendas();
            salvarProdutos();
            exibirVendas();
            exibirProdutos();
            fecharDialogo();
        } else {
            alert('Quantidade insuficiente no estoque ou produto não encontrado.');
        }
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function exibirVendas() {
    let registroVendas = document.getElementById('registroVendas');
    registroVendas.innerHTML = '';
    vendas.forEach(venda => {
        let item = document.createElement('div');
        item.classList.add('sale-item');
        item.innerHTML = `
            <span>${venda.nome} - Quantidade: ${venda.quantidade} - Valor de Venda: R$${venda.valorVenda.toFixed(2)}</span>
            <div>
                <button class="edit-btn" onclick="abrirDialogoEditarVenda(${venda.id})">Editar</button>
                <button onclick="abrirDialogoRemoverVenda(${venda.id})">Remover</button>
            </div>
        `;
        registroVendas.appendChild(item);
    });
}

function abrirDialogoEditarVenda(id) {
    document.getElementById('dialogoEditarVenda').style.display = 'block';
    window.vendaIdParaEditar = id; // Armazena o ID da venda a ser editada
}

function fecharDialogoEditarVenda() {
    document.getElementById('dialogoEditarVenda').style.display = 'none';
}

function editarVenda() {
    let novaQuantidade = parseInt(document.getElementById('novaQuantidadeVenda').value);
    let venda = vendas.find(v => v.id === window.vendaIdParaEditar);

    if (venda && !isNaN(novaQuantidade)) {
        let produto = produtos.find(p => p.nome === venda.nome);
        if (produto) {
            let diferenca = novaQuantidade - venda.quantidade;
            if (produto.quantidade >= diferenca) {
                produto.quantidade -= diferenca;
                venda.quantidade = novaQuantidade;
                venda.valorVenda = produto.valorVenda * novaQuantidade;

                if (produto.quantidade === 0) {
                    produtos = produtos.filter(p => p.id !== produto.id);
                }

                salvarVendas();
                salvarProdutos();
                exibirVendas();
                exibirProdutos();
                fecharDialogoEditarVenda();
            } else {
                alert('Quantidade insuficiente no estoque.');
            }
        } else {
            alert('Produto não encontrado.');
        }
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function abrirDialogoRemoverVenda(id) {
    document.getElementById('dialogoRemoverVenda').style.display = 'block';
    window.vendaIdParaRemover = id; // Armazena o ID da venda a ser removida
}

function fecharDialogoRemoverVenda() {
    document.getElementById('dialogoRemoverVenda').style.display = 'none';
}

function confirmarRemocaoVenda() {
    let venda = vendas.find(v => v.id === window.vendaIdParaRemover);
    if (venda) {
        let produto = produtos.find(p => p.nome === venda.nome);
        if (produto) {
            produto.quantidade += venda.quantidade;
        } else {
            produtos.push({ id: produtos.length + 1, nome: venda.nome, valor: 0, quantidade: venda.quantidade });
        }

        vendas = vendas.filter(v => v.id !== window.vendaIdParaRemover);
        salvarVendas();
        salvarProdutos();
        exibirVendas();
        exibirProdutos();
        fecharDialogoRemoverVenda();
    }
}

function calcularTotal() {
    let total = produtos.reduce((acc, produto) => acc + (produto.valor * produto.quantidade), 0);
    let totalVenda = vendas.reduce((acc, venda) => acc + venda.valorVenda, 0);
    let lucro = totalVenda - total;
    document.getElementById('resultado').innerText = `Total Agregado: R$${total.toFixed(2)} | Lucro: R$${lucro.toFixed(2)}`;
    document.getElementById('resultado').style.color = 'grey';
}
