// ===== PUT (Update) - Buscar por CPF e atualizar =====
const API = '/pessoas';
const CAMPOS = ['rg', 'nome', 'sobrenome', 'email', 'idade', 'telefone', 'rua', 'bairro', 'cidade', 'estado'];

function formatarCpf(valor) {
    const n = valor.replace(/\D/g, '');
    if (n.length !== 11) return valor.trim();
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function mostrarMensagem(texto, tipo) {
    const msg = document.getElementById('mensagem');
    msg.innerHTML = texto;
    msg.className = texto ? `mensagem ${tipo}` : 'mensagem';
}

function limparFormulario() {
    ['cpf', 'id', ...CAMPOS].forEach(c => document.getElementById(c).value = '');
    document.getElementById('btnAtualizar').disabled = true;
    mostrarMensagem('', '');
}

// GET /pessoas?cpf=... - preenche o formulário com os dados encontrados
function buscarDados() {
    const cpf = formatarCpf(document.getElementById('cpf').value);
    if (!cpf) { mostrarMensagem('Digite um CPF para buscar.', 'erro'); return; }

    fetch(`${API}?cpf=${encodeURIComponent(cpf)}`)
        .then(r => r.json())
        .then(dados => {
            const pessoa = dados[0];
            if (!pessoa) {
                document.getElementById('btnAtualizar').disabled = true;
                mostrarMensagem(`Pessoa com CPF ${cpf} não encontrada!`, 'erro');
                return;
            }
            document.getElementById('id').value = pessoa.id;
            document.getElementById('cpf').value = pessoa.cpf;
            CAMPOS.forEach(c => document.getElementById(c).value = pessoa[c] ?? '');
            document.getElementById('btnAtualizar').disabled = false;
            mostrarMensagem('', '');
        })
        .catch(() => mostrarMensagem('Erro na busca.', 'erro'));
}

// PUT /pessoas/:id - envia todos os dados atualizados
async function atualizarDados() {
    const id = document.getElementById('id').value;
    if (!id) { mostrarMensagem('Busque uma pessoa pelo CPF primeiro.', 'erro'); return; }

    const pessoa = { cpf: formatarCpf(document.getElementById('cpf').value) };
    CAMPOS.forEach(c => pessoa[c] = document.getElementById(c).value.trim());
    pessoa.estado = pessoa.estado.toUpperCase();
    pessoa.idade = pessoa.idade === '' ? '' : Number(pessoa.idade);

    try {
        // Se o CPF foi alterado, garante que não pertence a outra pessoa
        const mesmoCpf = await fetch(`${API}?cpf=${encodeURIComponent(pessoa.cpf)}`).then(r => r.json());
        if (mesmoCpf.some(p => String(p.id) !== String(id))) {
            mostrarMensagem(`O CPF ${pessoa.cpf} já pertence a outra pessoa.`, 'erro');
            return;
        }

        const resposta = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });
        if (!resposta.ok) throw new Error();

        const atualizado = await resposta.json();
        limparFormulario();
        mostrarMensagem(`Dados de ${atualizado.nome} atualizados com sucesso! <a href="/get/">Ver lista</a>`, 'sucesso');
    } catch (erro) {
        mostrarMensagem('Erro ao atualizar. Tente novamente.', 'erro');
    }
}

document.getElementById('cpf').addEventListener('keydown', e => { if (e.key === 'Enter') buscarDados(); });

// Se veio da página GET (botão Editar), já busca o CPF da URL
const cpfDaUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfDaUrl) {
    document.getElementById('cpf').value = cpfDaUrl;
    buscarDados();
}
