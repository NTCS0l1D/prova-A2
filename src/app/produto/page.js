// src/app/produtos/list/page.js
'use client';

import Pagina from '@/components/Pagina'; // Importa o componente de navegação padrão
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ProdutosListPage() {
  const router = useRouter(); // Roteamento para navegar entre páginas
  const [produtos, setProdutos] = useState([]); // Estado para armazenar os produtos listados

  // Carrega os produtos salvos do localStorage quando o componente é montado
  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);
  }, []);

  // Função para deletar um produto pelo ID
  const deletarProduto = (id) => {
    const novosProdutos = produtos.filter(produto => produto.id !== id); // Filtra os produtos para excluir o produto específico
    setProdutos(novosProdutos); // Atualiza o estado de produtos
    localStorage.setItem('produtos', JSON.stringify(novosProdutos)); // Salva a nova lista de produtos no localStorage
  };

  // Função para editar um produto
  const editarProduto = (id) => {
    router.push(`/produto/form?id=${id}`); // Redireciona para a página de edição do produto com o ID na URL
  };

  return (
    <div style={styles.pageContainer}>
      <Pagina /> {/* Componente de navegação */}
      <h1 className="text-center">Lista de Produtos</h1>      
      <Table striped bordered hover className='mt-3' variant='dark'>
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Preço Unitário</th>
            <th>Localização</th> {/* Coluna de localização do produto */}
            <th>Fornecedor</th>
            <th>Data de Cadastro</th> {/* Coluna para data de cadastro do produto */}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.codigoProduto || '-'}</td>
                <td>{produto.nomeProduto || '-'}</td>
                <td>{produto.descricao || '-'}</td>
                <td>{produto.categoria || '-'}</td>
                <td>
                  {produto.precoUnitario
                    ? produto.precoUnitario.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : '-'}
                </td>
                <td>{produto.localizacao || '-'}</td> {/* Exibe a localização do produto */}
                <td>{produto.fornecedor || '-'}</td>
                <td>{produto.dataCadastro ? new Date(produto.dataCadastro).toLocaleDateString() : '-'}</td>
                <td>
                  <Button variant="warning" onClick={() => editarProduto(produto.id)}>
                    <FaEdit />
                  </Button>{' '}
                  <Button variant="danger" onClick={() => deletarProduto(produto.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Nenhum produto cadastrado</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/produto/form')}>Novo Produto</Button>
      </div>
    </div>
  );
}

// Estilos personalizados para a página de listagem de produtos
const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Cor de fundo suave em azul claro
    minHeight: '100vh', // Altura mínima para cobrir toda a tela
  },
  table: {
    borderRadius: '8px', // Bordas arredondadas na tabela
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave na tabela
    backgroundColor: '#fff', // Fundo branco para a tabela
  },
  button: {
    margin: '0 10px', // Espaçamento entre os botões
    padding: '10px 20px', // Tamanho maior para os botões
  }
};
