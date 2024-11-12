// Diretiva do Next.js para renderizar este componente no lado do cliente
'use client';

// Importação de hooks e componentes necessários para o funcionamento da página
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades';

// Componente principal que exibe a lista de clientes
export default function ClientesListPage() {
  const router = useRouter(); // Hook do Next.js para navegação entre páginas
  const [clientes, setClientes] = useState([]); // Estado para armazenar a lista de clientes
  const [estados, setEstados] = useState({}); // Estado para armazenar os estados com IDs e nomes

  // useEffect para carregar os clientes e os estados quando o componente for montado
  useEffect(() => {
    // Carrega clientes do localStorage (ou um array vazio, se não houver clientes salvos)
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    // Função para buscar os estados do serviço de API de localidades
    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados');
        // Mapeia a resposta para um objeto com ID e nome do estado
        const estadosMap = response.data.reduce((acc, estado) => {
          acc[estado.id] = estado.nome;
          return acc;
        }, {});
        setEstados(estadosMap); // Atualiza o estado 'estados' com o mapa criado
      } catch (error) {
        console.error("Erro ao carregar os estados:", error); // Exibe erro no console, se ocorrer
      }
    };

    fetchEstados(); // Chama a função para buscar os estados
  }, []);

  // Função para deletar um cliente da lista e do localStorage
  const deletarCliente = (id) => {
    const novosClientes = clientes.filter(cliente => cliente.id !== id); // Remove o cliente pelo ID
    setClientes(novosClientes); // Atualiza o estado 'clientes'
    localStorage.setItem('clientes', JSON.stringify(novosClientes)); // Atualiza o localStorage
  };

  // Função para navegar para a página de edição de um cliente específico
  function editarCliente(clienteid) {
    router.push(`/cliente/form?id=${clienteid}`); // Redireciona para a página de edição
  }

  // Função para formatar CPF (xxx.xxx.xxx-xx)
  function formatarCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"); // Aplica máscara de CPF
  }

  // Função para formatar número de telefone ((xx) xxxxx-xxxx)
  function formatarTelefone(telefone) {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"); // Aplica máscara de telefone
  }

  // Função para formatar data (dd/mm/aaaa)
  function formatarData(data) {
    const [ano, mes, dia] = data.split('-'); // Divide a data em ano, mês e dia
    return `${dia}/${mes}/${ano}`; // Reorganiza e retorna a data formatada
  }

  return (
    // Container da página com estilos específicos
    <div style={styles.pageContainer}>
      {/* Componente de layout padrão da página */}
      <Pagina />
      <h1 className="text-center">Lista de Clientes</h1>
      
      {/* Tabela para exibir a lista de clientes */}
      <Table striped bordered hover className="mt-3" style={styles.table} variant='dark'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Data de Nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Renderiza a lista de clientes ou uma mensagem caso não haja clientes */}
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.sobrenome}</td>
                <td>{cliente.email}</td>
                <td>{formatarTelefone(cliente.telefone)}</td>
                <td>{formatarCPF(cliente.cpf)}</td>
                <td>{cliente.cidade}</td>
                <td>{estados[cliente.estado] || "Estado desconhecido"}</td> {/* Exibe nome do estado ou mensagem se não encontrado */}
                <td>{formatarData(cliente.dataNascimento)}</td>
                <td>
                  {/* Botão para editar cliente */}
                  <Button className="me-2" variant="warning" onClick={() => editarCliente(cliente.id)} aria-label="Editar cliente">
                    <FaPen />
                  </Button>
                  {/* Botão para excluir cliente */}
                  <Button variant="danger" size="sm" onClick={() => deletarCliente(cliente.id)} aria-label="Excluir cliente">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Nenhum cliente cadastrado</td> {/* Mensagem caso não haja clientes */}
            </tr>
          )}
        </tbody>
      </Table>

      {/* Botão posicionado abaixo da tabela para adicionar um novo cliente */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/cliente/form')}>Novo Cliente</Button>
      </div>
    </div>
  );
}

// Estilos para a página e tabela
const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Fundo suave em azul claro
    paddingBottom: '40px',
    minHeight: '100vh', // Ocupa toda a altura da tela
  },
  table: {
    borderRadius: '8px', // Bordas arredondadas na tabela
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave para destacar a tabela
    backgroundColor: '#fff', // Fundo branco da tabela
  },
  button: {
    margin: '0 10px', // Espaçamento entre os botões
    padding: '10px 20px', // Tamanho maior para o botão
  }
};
