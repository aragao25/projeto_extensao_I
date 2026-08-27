/* Preview das imagens anexadas */

const imagensInput = document.getElementById('imagens');
const previewContainer = document.getElementById('preview-container');
let arquivosSelecionados = [];

imagensInput.addEventListener('change', (e) => {
  const arquivos = Array.from(e.target.files);
  
  // valida tamanho/tipo antes de aceitar
  const validos = arquivos.filter(arquivo => {
    const tamanhoOk = arquivo.size <= 5 * 1024 * 1024; // 5MB
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
    div.innerHTML = `
      <img src="${url}" width="100">
      <button type="button" data-index="${index}">Remover</button>
    `;
    div.querySelector('button').addEventListener('click', () => {
      arquivosSelecionados.splice(index, 1);
      renderPreview();
    });
    previewContainer.appendChild(div);
  });
}

/* Envio dos arquivos com Formdata */

document.getElementById('form-doacao').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('titulo', document.getElementById('titulo').value);
  formData.append('descricao', document.getElementById('descricao').value);
  formData.append('keywords', keywords.join(','));

  arquivosSelecionados.forEach((arquivo) => {
    formData.append('imagens', arquivo); // mesmo nome pra cada arquivo = array no backend
  });

  try {
    const response = await fetch('/api/doacoes', {
      method: 'POST',
      body: formData
      // NÃO defina Content-Type manualmente — o browser define
      // automaticamente o multipart/form-data com o boundary correto
    });

    if (!response.ok) throw new Error('Erro ao publicar doação');

    const resultado = await response.json();
    console.log('Doação criada:', resultado);

  } catch (erro) {
    console.error(erro);
  }
});