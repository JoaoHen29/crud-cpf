// ===== GET (Read) - Listar pessoas e buscar por CPF =====
const API = '/pessoas';

function formatarCpf(valor) {
    const n = valor.replace(/\D/g, '');
    if (n.length !== 11) return valor.trim();
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

// Evita que textos digitados quebrem o HTML da tabela
function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mostrarMensagem(texto, tipo) {
    const msg = document.getElementById('mensagem');
    msg.textContent = texto;
    msg.className = texto ? `mensagem ${tipo}` : 'mensagem';
}

// Monta as linhas da tabela; os botões levam às páginas PUT e DELETE já com o CPF
function preencherTabela(lista) {
    const tabela = document.getElementById('tabela-corpo');
    tabela.innerHTML = '';
    lista.forEach(p => {
        const cpf = encodeURIComponent(p.cpf);
        tabela.innerHTML += `<tr>
            <td>${esc(p.id)}</td>
            <td>${esc(p.cpf)}</td>
            <td>${esc(p.nome)}</td>
            <td>${esc(p.sobrenome)}</td>
            <td>${esc(p.email)}</td>
            <td>${esc(p.idade)}</td>
            <td>${esc(p.telefone)}</td>
            <td>${esc(p.rua)}</td>
            <td>${esc(p.bairro)}</td>
            <td>${esc(p.cidade)}</td>
            <td>${esc(p.estado)}</td>
            <td>${esc(p.rg)}</td>
            <td>
                <a class="botao btn-amarelo btn-pequeno" href="/put/?cpf=${cpf}">Editar</a>
                <a class="botao btn-vermelho btn-pequeno" href="/delete/?cpf=${cpf}">Excluir</a>
            </td>
        </tr>`;
    });
}

// GET /pessoas - todos os registros
function listarTodos() {
    document.getElementById('cpfBusca').value = '';
    fetch(API)
        .then(r => r.json())
        .then(dados => {
            preencherTabela(dados);
            mostrarMensagem(dados.length === 0 ? 'Nenhuma pessoa cadastrada.' : '', 'erro');
        })
        .catch(() => mostrarMensagem('Erro ao carregar os dados.', 'erro'));
}

// GET /pessoas?cpf=... - busca por CPF
function buscarPorCpf() {
    const cpf = formatarCpf(document.getElementById('cpfBusca').value);
    if (!cpf) { listarTodos(); return; }
    fetch(`${API}?cpf=${encodeURIComponent(cpf)}`)
        .then(r => r.json())
        .then(dados => {
            preencherTabela(dados);
            mostrarMensagem(dados.length === 0 ? `Nenhuma pessoa encontrada com o CPF ${cpf}.` : '', 'erro');
        })
        .catch(() => mostrarMensagem('Erro na busca.', 'erro'));
}

document.getElementById('cpfBusca').addEventListener('keydown', e => { if (e.key === 'Enter') buscarPorCpf(); });

listarTodos();
