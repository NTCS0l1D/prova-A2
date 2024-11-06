// src/app/fornecedores/list/page.js
'use client';

import Pagina from '@/components/Pagina';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';

export default function FornecedoresListPage() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    // Carrega fornecedores do localStorage ao montar o componente
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedoresSalvos);
  }, []);

  // Função para deletar um fornecedor
  const deletarFornecedor = (id) => {
    const novosFornecedores = fornecedores.filter(fornecedor => fornecedor.id !== id);
    setFornecedores(novosFornecedores);
    localStorage.setItem('fornecedores', JSON.stringify(novosFornecedores));
  };

  // Função para redirecionar para a página de edição com os dados do fornecedor
  const editarFornecedor = (id) => {
    router.push(`/fornecedor/form/${id}`);
  };

  return (
    <div>
      <Pagina />
      <h1>Lista de Fornecedores</h1>
      <Button variant="primary" onClick={() => router.push('/fornecedor/form')}>Novo Fornecedor</Button>
      
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Nome da Empresa</th>
            <th>CNPJ</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Produto</th>
            <th>Prazo de Entrega</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.length > 0 ? (
            fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.empresa}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.email}</td>
                <td>{fornecedor.telefone}</td>
                <td>{fornecedor.cidade}</td>
                <td>{fornecedor.estado}</td>
                <td>{fornecedor.produto}</td>
                <td>{fornecedor.prazoEntrega} dias</td>
                <td>
                <Button className='me-2' href={`fornecedor/form?id=${fornecedor.id}`} variant="warning">
                    <FaPen />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deletarFornecedor(fornecedor.id)}>
                    <FaTrash /> {/* Ícone de deletar */}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Nenhum fornecedor cadastrado</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
