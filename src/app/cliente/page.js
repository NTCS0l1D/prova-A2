// src/app/clientes/list/page.js
'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';

export default function ClientesListPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Carrega clientes do localStorage ao montar o componente
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);
  }, []);

  // Função para deletar um cliente
  const deletarCliente = (id) => {
    const novosClientes = clientes.filter(cliente => cliente.id !== id);
    setClientes(novosClientes);
    localStorage.setItem('clientes', JSON.stringify(novosClientes));
  };

  // Função para redirecionar para a página de edição com os dados do cliente
  const editarCliente = (id) => {
    router.push(`/clientes/form/${id}`);
  };

  return (
    <div>
    <Pagina />
      <h1>Lista de Clientes</h1>
      <Button variant="primary" onClick={() => router.push('/cliente/form')}>Novo</Button>
      
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.sobrenome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.endereco}</td>
                <td>{cliente.cidade}</td>
                <td>{cliente.estado}</td>
                <td>{cliente.categoria}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => editarCliente(cliente.id)} className="me-2">
                    <FaEdit /> {/* Ícone de editar */}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deletarCliente(cliente.id)}>
                    <FaTrash /> {/* Ícone de deletar */}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Nenhum cliente cadastrado</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
