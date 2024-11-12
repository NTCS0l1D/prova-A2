'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades';

export default function ClientesListPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState({});

  useEffect(() => {
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados');
        const estadosMap = response.data.reduce((acc, estado) => {
          acc[estado.id] = estado.nome;
          return acc;
        }, {});
        setEstados(estadosMap);
      } catch (error) {
        console.error("Erro ao carregar os estados:", error);
      }
    };

    fetchEstados();
  }, []);

  const deletarCliente = (id) => {
    const novosClientes = clientes.filter(cliente => cliente.id !== id);
    setClientes(novosClientes);
    localStorage.setItem('clientes', JSON.stringify(novosClientes));
  };

  function editarCliente(clienteid) {
    router.push(`/cliente/form?id=${clienteid}`);
  }

  function formatarCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  function formatarTelefone(telefone) {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div style={styles.pageContainer}>
      <Pagina />
      <h1 className="text-center">Lista de Clientes</h1>
      
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
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.sobrenome}</td>
                <td>{cliente.email}</td>
                <td>{formatarTelefone(cliente.telefone)}</td>
                <td>{formatarCPF(cliente.cpf)}</td>
                <td>{cliente.cidade}</td>
                <td>{estados[cliente.estado] || "Estado desconhecido"}</td>
                <td>{formatarData(cliente.dataNascimento)}</td>
                <td>
                  <Button className="me-2" variant="warning" onClick={() => editarCliente(cliente.id)} aria-label="Editar cliente">
                    <FaPen />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deletarCliente(cliente.id)} aria-label="Excluir cliente">
                    <FaTrash />
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

      {/* Botão posicionado abaixo da tabela */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/cliente/form')}>Novo Cliente</Button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Cor de fundo suave em azul claro
    paddingBottom: '40px',
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
