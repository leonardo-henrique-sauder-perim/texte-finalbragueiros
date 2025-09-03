// Função para buscar o relatório com filtros
function buscarRelatorio() {
    const cpf = document.getElementById("cpf").value;
    const servico = document.getElementById("servico").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    // Construir a URL com os parâmetros de filtro
    let url = `/relatorios?`;
    if (cpf) url += `cpf=${cpf}&`;
    if (servico) url += `servico=${servico}&`;
    if (dataInicio) url += `dataInicio=${dataInicio}&`;
    if (dataFim) url += `dataFim=${dataFim}&`;

    // Remover o último "&" se presente
    url = url.slice(0, -1);

    // Fazer a requisição para o servidor
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpar a tabela
            const tabelaagendamento = document.getElementById("tabela-agendamento");
            tabelaagendamento.innerHTML = '';

            // Preencher a tabela com os dados
            data.forEach(agendamento => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${agendamento.id}</td>
                    <td>${agendamento.cliente_nome}</td>
                    <td>${agendamento.servico_nome}</td>
                    <td>${agendamento.quantidade}</td>
                    <td>${new Date(agendamento.data).toLocaleString()}</td>
                `;
                tabelaagendamento.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
        });
}