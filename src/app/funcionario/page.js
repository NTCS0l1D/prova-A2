// src/app/funcionarios/list/page.js
'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';

export default function FuncionariosListPage() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    // Carrega funcionários do localStorage ao montar o componente
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);
  }, []);

  // Função para deletar um funcionário
  const deletarFuncionario = (id) => {
    const novosFuncionarios = funcionarios.filter(funcionario => funcionario.id !== id);
    setFuncionarios(novosFuncionarios);
    localStorage.setItem('funcionarios', JSON.stringify(novosFuncionarios));
  };

  // Função para redirecionar para a página de edição com o ID do funcionário
  const editarFuncionario = (id) => {
    router.push(`/funcionario/form?id=${id}`);
  };

  return (
    <div>
      <Pagina />
      <h1>Lista de Funcionários</h1>
      <Button variant="primary" onClick={() => router.push('/funcionario/form')}>Novo Funcionário</Button>
      
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Cargo</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Data</th> {/* Substituído Endereço por Data */}
            <th>Cidade</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length > 0 ? (
            funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>{funcionario.nome}</td>
                <td>{funcionario.sobrenome}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.email}</td>
                <td>{funcionario.telefone}</td>
                <td>{funcionario.dataNascimento}</td> {/* Campo data adicionado */}
                <td>{funcionario.cidade}</td>
                <td>{funcionario.estado}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => editarFuncionario(funcionario.id)} className="me-2">
                    <FaEdit /> {/* Ícone de editar */}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deletarFuncionario(funcionario.id)}>
                    <FaTrash /> {/* Ícone de deletar */}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Nenhum funcionário cadastrado</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
