const input = document.querySelector('.inputi-tarefa');
const botao = document.querySelector('.abtn-taref');

let itemArrastado = null;

// ENTER
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!input.value) return;
    criarTarefa(input.value, 'todo');
  }
});

// BOTÃO
botao.addEventListener('click', () => {
  if (!input.value) return;
  criarTarefa(input.value, 'todo');
});

// CRIAR LI
function criarLi() {
  return document.createElement('li');
}

// BOTÕES
function botaoApagar(li) {
  const btn = document.createElement('button');
  btn.innerText = 'Apagar';
  btn.type = 'button';
  btn.classList.add('apagar');
  li.appendChild(btn);
}

function botaoMover(li) {
  const btn = document.createElement('button');
  btn.innerText = '➡';
  btn.type = 'button';
  btn.classList.add('mover');
  li.appendChild(btn);
}

// CRIAR TAREFA
function criarTarefa(texto, status = 'todo', salvar = true) {
  const li = criarLi();

  const span = document.createElement('span');
  span.innerText = texto;
  li.appendChild(span);

  li.draggable = true;

  botaoApagar(li);
  botaoMover(li);

  const lista = document.querySelector(`.tarefas[data-status="${status}"]`);
  lista.appendChild(li);

  if (salvar) {
    input.value = '';
    salvarTarefas();
  }
}

// CLICK (SEM BUG)
document.addEventListener('click', (e) => {
  const el = e.target;

  // APAGAR
  if (el.classList.contains('apagar')) {
    el.parentElement.remove();
    salvarTarefas();
    return;
  }

  // MOVER
  if (el.classList.contains('mover')) {
    const li = el.parentElement;
    const status = li.parentElement.dataset.status;

    let novo;
    if (status === 'todo') novo = 'doing';
    else if (status === 'doing') novo = 'done';
    else return;

    document
      .querySelector(`.tarefas[data-status="${novo}"]`)
      .appendChild(li);

    salvarTarefas();
  }
});

// 🔥 DRAG CORRIGIDO (SEM BUG COM BOTÃO)
document.addEventListener('dragstart', (e) => {
  const li = e.target.closest('li');

  if (!li) return;

  // 🚫 impede drag se clicar em botão
  if (e.target.tagName === 'BUTTON') {
    e.preventDefault();
    return;
  }

  itemArrastado = li;
  li.style.opacity = '0.5';
});

document.addEventListener('dragend', (e) => {
  const li = e.target.closest('li');
  if (li) li.style.opacity = '1';
});

// DROP
document.querySelectorAll('.tarefas').forEach(lista => {

  lista.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  lista.addEventListener('drop', (e) => {
    e.preventDefault();

    if (itemArrastado) {
      lista.appendChild(itemArrastado);
      salvarTarefas();
    }
  });

});

// SALVAR
function salvarTarefas() {
  const listas = document.querySelectorAll('.tarefas');
  const dados = [];

  listas.forEach(lista => {
    const status = lista.dataset.status;

    lista.querySelectorAll('li').forEach(li => {
      const texto = li.querySelector('span').innerText;
      dados.push({ texto, status });
    });
  });

  localStorage.setItem('tarefas', JSON.stringify(dados));
}

// CARREGAR
function carregarTarefas() {
  const dados = JSON.parse(localStorage.getItem('tarefas')) || [];

  dados.forEach(t => {
    criarTarefa(t.texto, t.status, false);
  });
}

carregarTarefas();
