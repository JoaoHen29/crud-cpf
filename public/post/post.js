// ===== POST (Create) - Cadastrar nova pessoa =====
const API = '/pessoas';
const CAMPOS = ['cpf', 'rg', 'nome', 'sobrenome', 'email', 'idade', 'telefone', 'rua', 'bairro', 'cidade', 'estado'];

// Deixa o CPF sempre no formato 000.000.000-00 (para a busca funcionar igual em todas as páginas)
function formatarCpf(valor) {
    const n = valor.replace(/\D/g, '');
    if (n.length !== 11) return valor.trim();
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function mostrarMensagem(texto, tipo) {
    const msg = document.getElementById('mensagem');
    msg.innerHTML = texto;
    msg.className = `mensagem ${tipo}`;
}

document.getElementById('form-cadastro').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Monta o objeto com todos os campos do formulário
    const pessoa = {};
    CAMPOS.forEach(campo => pessoa[campo] = document.getElementById(campo).value.trim());
    pessoa.cpf = formatarCpf(pessoa.cpf);
    pessoa.estado = pessoa.estado.toUpperCase();
    pessoa.idade = pessoa.idade === '' ? '' : Number(pessoa.idade);

    if (!pessoa.cpf || !pessoa.nome) {
        mostrarMensagem('Preencha pelo menos o CPF e o Nome.', 'erro');
        return;
    }

    try {
        // Verifica se o CPF já existe (GET /pessoas?cpf=...)
        const existe = await fetch(`${API}?cpf=${encodeURIComponent(pessoa.cpf)}`).then(r => r.json());
        if (existe.length > 0) {
            mostrarMensagem(`Já existe uma pessoa cadastrada com o CPF ${pessoa.cpf}.`, 'erro');
            return;
        }

        // Envia os dados para o JSON Server
        const resposta = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });
        if (!resposta.ok) throw new Error();

        const criado = await resposta.json();
        document.getElementById('form-cadastro').reset();
        mostrarMensagem(`${criado.nome} cadastrado(a) com sucesso! (ID ${criado.id}) <a href="/get/">Ver lista</a>`, 'sucesso');
    } catch (erro) {
        mostrarMensagem('Erro ao cadastrar. Tente novamente.', 'erro');
    }
});
