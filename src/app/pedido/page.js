'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';

export default function PedidosListPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]); // Adicionando estado para funcionários

  useEffect(() => {
    // Carrega pedidos, clientes, produtos e funcionários do localStorage
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || []; // Carrega funcionários

    setPedidos(pedidosSalvos);
    setClientes(clientesSalvos);
    setProdutos(produtosSalvos);
    setFuncionarios(funcionariosSalvos); // Atualiza estado de funcionários
  }, []);

  // Função para deletar um pedido
  const deletarPedido = (id) => {
    const novosPedidos = pedidos.filter(pedido => pedido.id !== id);
    setPedidos(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
  };

  // Função para redirecionar para a página de edição com os dados do pedido
  const editarPedido = (id) => {
    router.push(`/pedido/form/${id}`);
  };

  // Função para buscar o nome do cliente pelo ID
  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(cliente => cliente.id === clienteId);
    return cliente ? cliente.nome : 'Desconhecido';
  };

  // Função para buscar o nome do produto pelo ID
  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(produto => produto.id === produtoId);
    return produto ? produto.nomeProduto : 'Desconhecido';
  };

  // Função para buscar o nome do funcionário pelo ID
  const getFuncionarioNome = (funcionarioId) => {
    const funcionario = funcionarios.find(funcionario => funcionario.id === funcionarioId);
    return funcionario ? funcionario.nome : 'Desconhecido'; // Retorna o nome do funcionário ou 'Desconhecido'
  };

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <div style={styles.pageContainer}>
      <Pagina />
      <h1 className="text-center">Lista de Pedidos</h1>      
      <Table striped bordered hover className='mt-3' variant='dark'>
        <thead>
          <tr>
            <th>Número do Pedido</th>
            <th>Cliente</th>
            <th>Funcionário</th> {/* Nova coluna para o funcionário */}
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
                  onClick={() => router.push(`/pedido/form?id=${pedido.id}`)}>
                  <FaPen />
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
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/pedido/form')}>Novo Pedido</Button>
        </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Cor de fundo suave em azul claro
    minHeight: '100vh', // Ocupa toda a altura da tela
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
