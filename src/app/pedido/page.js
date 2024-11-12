'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';

export default function PedidosListPage() {
  const router = useRouter(); // Inicializa o roteador para navegação
  const [pedidos, setPedidos] = useState([]); // Estado para armazenar a lista de pedidos
  const [clientes, setClientes] = useState([]); // Estado para armazenar a lista de clientes
  const [produtos, setProdutos] = useState([]); // Estado para armazenar a lista de produtos
  const [funcionarios, setFuncionarios] = useState([]); // Estado para armazenar a lista de funcionários

  useEffect(() => {
    // Carrega dados de pedidos, clientes, produtos e funcionários do localStorage
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || []; // Carrega dados de funcionários

    setPedidos(pedidosSalvos);
    setClientes(clientesSalvos);
    setProdutos(produtosSalvos);
    setFuncionarios(funcionariosSalvos); // Atualiza o estado de funcionários
  }, []);

  // Função para deletar um pedido pelo ID
  const deletarPedido = (id) => {
    const novosPedidos = pedidos.filter(pedido => pedido.id !== id);
    setPedidos(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos)); // Atualiza o localStorage com a nova lista
  };

  // Função para redirecionar para a página de edição de pedido
  const editarPedido = (id) => {
    router.push(`/pedido/form/${id}`);
  };

  // Função para buscar o nome do cliente pelo ID
  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(cliente => cliente.id === clienteId);
    return cliente ? cliente.nome : 'Desconhecido'; // Retorna o nome do cliente ou 'Desconhecido' caso não encontre
  };

  // Função para buscar o nome do produto pelo ID
  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(produto => produto.id === produtoId);
    return produto ? produto.nomeProduto : 'Desconhecido'; // Retorna o nome do produto ou 'Desconhecido'
  };

  // Função para buscar o nome do funcionário pelo ID
  const getFuncionarioNome = (funcionarioId) => {
    const funcionario = funcionarios.find(funcionario => funcionario.id === funcionarioId);
    return funcionario ? funcionario.nome : 'Desconhecido'; // Retorna o nome do funcionário ou 'Desconhecido'
  };

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`; // Formata o valor no estilo brasileiro
  };

  return (
    <div style={styles.pageContainer}>
      <Pagina /> {/* Componente de layout principal */}
      <h1 className="text-center">Lista de Pedidos</h1>
      
      {/* Tabela de pedidos */}
      <Table striped bordered hover className='mt-3' variant='dark'>
        <thead>
          <tr>
            <th>Número do Pedido</th>
            <th>Cliente</th>
            <th>Funcionário</th> {/* Coluna para exibir o nome do funcionário */}
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.numeroPedido}</td>
                <td>{getClienteNome(pedido.cliente)}</td> {/* Exibe o nome do cliente */}
                <td>{getFuncionarioNome(pedido.funcionario)}</td> {/* Exibe o nome do funcionário */}
                <td>{getProdutoNome(pedido.produto)}</td> {/* Exibe o nome do produto */}
                <td>{pedido.quantidade}</td>
                <td>{formatCurrency(pedido.precoUnitario)}</td> {/* Exibe o preço unitário formatado */}
                <td>{formatCurrency(pedido.total)}</td> {/* Exibe o total formatado */}
                <td>{pedido.status}</td>
                <td>
                  <Button
                    className='me-2'
                    variant="warning"
                    onClick={() => editarPedido(pedido.id)}>
                    <FaPen /> {/* Ícone de edição */}
                  </Button>
                  <Button variant="danger" onClick={() => deletarPedido(pedido.id)}>
                    <FaTrash /> {/* Ícone de deletar */}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">Nenhum pedido cadastrado</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Botão para adicionar novo pedido */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/pedido/form')}>Novo Pedido</Button>
      </div>
    </div>
  );
}

// Estilos personalizados aplicados diretamente no componente
const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Cor de fundo suave em azul claro
    minHeight: '100vh', // Define a altura mínima para ocupar a tela inteira
  },
  table: {
    borderRadius: '8px', // Bordas arredondadas na tabela
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave para a tabela
    backgroundColor: '#fff', // Fundo branco da tabela
  },
  button: {
    margin: '0 10px', // Espaçamento entre os botões
    padding: '10px 20px', // Tamanho maior para o botão
  }
};
