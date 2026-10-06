// ===== DELETE (Delete) - Buscar por CPF e excluir =====
const API = '/pessoas';
const ROTULOS = {
    id: 'ID', cpf: 'CPF', rg: 'RG', nome: 'Nome', sobrenome: 'Sobrenome', email: 'E-mail', idade: 'Idade',
    telefone: 'Telefone', rua: 'Rua', bairro: 'Bairro', cidade: 'Cidade', estado: 'Estado'
};
let pessoaSelecionada = null;

function formatarCpf(valor) {
    const n = valor.replace(/\D/g, '');
    if (n.length !== 11) return valor.trim();
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mostrarMensagem(texto, tipo) {
    const msg = document.getElementById('mensagem');
    msg.innerHTML = texto;
    msg.className = texto ? `mensagem ${tipo}` : 'mensagem';
}

function cancelar() {
    pessoaSelecionada = null;
    document.getElementById('cpf').value = '';
    document.getElementById('detalhes').classList.remove('visivel');
    mostrarMensagem('', '');
}

// GET /pessoas?cpf=... - mostra os dados antes de excluir
function buscarDados() {
    const cpf = formatarCpf(document.getElementById('cpf').value);
    if (!cpf) { mostrarMensagem('Digite um CPF para buscar.', 'erro'); return; }

    fetch(`${API}?cpf=${encodeURIComponent(cpf)}`)
        .then(r => r.json())
        .then(dados => {
            pessoaSelecionada = dados[0] || null;
            const detalhes = document.getElementById('detalhes');
            if (!pessoaSelecionada) {
                detalhes.classList.remove('visivel');
                mostrarMensagem(`Pessoa com CPF ${cpf} não encontrada!`, 'erro');
                return;
            }
            document.getElementById('lista-detalhes').innerHTML = Object.keys(ROTULOS)
                .map(k => `<dt>${ROTULOS[k]}</dt><dd>${esc(pessoaSelecionada[k])}</dd>`).join('');
            detalhes.classList.add('visivel');
            mostrarMensagem('', '');
        })
        .catch(() => mostrarMensagem('Erro na busca.', 'erro'));
}

// DELETE /pessoas/:id
function deletarDados() {
    if (!pessoaSelecionada) return;
    const { id, nome } = pessoaSelecionada;

    fetch(`${API}/${id}`, { method: 'DELETE' })
        .then(resposta => {
            if (!resposta.ok) throw new Error();
            cancelar();
            mostrarMensagem(`${esc(nome)} foi excluído(a) com sucesso! <a href="/get/">Ver lista</a>`, 'sucesso');
        })
        .catch(() => mostrarMensagem('Erro ao excluir. Tente novamente.', 'erro'));
}

document.getElementById('cpf').addEventListener('keydown', e => { if (e.key === 'Enter') buscarDados(); });

// Se veio da página GET (botão Excluir), já busca o CPF da URL
const cpfDaUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfDaUrl) {
    document.getElementById('cpf').value = cpfDaUrl;
    buscarDados();
}
