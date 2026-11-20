import { chamarApi } from "../../services/api.js";

const imagensInput = document.getElementById('imagens');
const previewContainer = document.getElementById('preview-container');
const formulario = document.getElementById('form-doacao');
const mensagem = document.getElementById('mensagem-doacao');
let arquivosSelecionados = [];

imagensInput.addEventListener('change', (e) => {
  const arquivos = Array.from(e.target.files);

  const validos = arquivos.filter(arquivo => {
    const tamanhoOk = arquivo.size <= 5 * 1024 * 1024;
    const tipoOk = arquivo.type.startsWith('image/');
    return tamanhoOk && tipoOk;
  });

  arquivosSelecionados = validos;
  renderPreview();
});

function renderPreview() {
  previewContainer.innerHTML = '';

  arquivosSelecionados.forEach((arquivo, index) => {
    const url = URL.createObjectURL(arquivo);
    const div = document.createElement('div');
    div.className = 'preview-item';

    const imagem = document.createElement('img');
    imagem.src = url;
    imagem.alt = `Prévia de ${arquivo.name}`;

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.textContent = 'Remover';
    botaoRemover.addEventListener('click', () => {
      URL.revokeObjectURL(url);
      arquivosSelecionados.splice(index, 1);
      renderPreview();
    });

    div.append(imagem, botaoRemover);
    previewContainer.appendChild(div);
  });
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensagem.textContent = '';

  const dados = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim() || null,
    cidade: document.getElementById('cidade').value.trim(),
    bairro: document.getElementById('bairro').value.trim() || null,
    categoria: document.getElementById('categoria').value.trim(),
    estado_conservacao: document.getElementById('estado-conservacao').value,
    quantidade: Number(document.getElementById('quantidade').value)
  };

  try {
    await chamarApi('/anuncios', {
      method: 'POST',
      body: JSON.stringify(dados)
    });

    mensagem.textContent = 'Doação publicada com sucesso!';
    formulario.reset();
    arquivosSelecionados = [];
    renderPreview();
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
});