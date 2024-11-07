// src/app/produtos/list/page.js
'use client';

import Pagina from '@/components/Pagina';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ProdutosListPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);
  }, []);

  const deletarProduto = (id) => {
    const novosProdutos = produtos.filter(produto => produto.id !== id);
    setProdutos(novosProdutos);
    localStorage.setItem('produtos', JSON.stringify(novosProdutos));
  };

  const editarProduto = (id) => {
    router.push(`/produto/form?id=${id}`);
  };

  return (
    <div>
      <Pagina />
      <h1>Lista de Produtos</h1>
      <Button variant="primary" onClick={() => router.push('/produto/form')}>Novo Produto</Button>
      
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Preço Unitário</th>
            <th>Quantidade em Estoque</th>
            <th>Fornecedor</th>
            <th>Data de Cadastro</th>
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
                <td>{produto.quantidade || '-'}</td>
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
    </div>
  );
}
