'use client'

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades'; // Certifique-se de importar o serviço para buscar estados

export default function ClientesListPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState({});

  useEffect(() => {
    // Carrega clientes do localStorage ao montar o componente
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    // Busca estados e cria um dicionário de código para nome
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

  // Função para deletar um cliente
  const deletarCliente = (id) => {
    const novosClientes = clientes.filter(cliente => cliente.id !== id);
    setClientes(novosClientes);
    localStorage.setItem('clientes', JSON.stringify(novosClientes));
  };

  // Função para redirecionar para a página de edição com os dados do cliente
  function editarCliente(clienteid) {
    router.push(`/cliente/form?id=${clienteid}`); // Certifique-se de usar o ID correto aqui
  }

  // Função para formatar CPF
function formatarCPF(cpf) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

// Função para formatar Telefone
function formatarTelefone(telefone) {
  return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}


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
                {/* Exibe o nome do estado usando o dicionário `estados` */}
                <td>{estados[cliente.estado] || "Estado desconhecido"}</td>
                <td>{cliente.dataNascimento}</td>
                <td>
                  {/* Modificação aqui: usaremos router.push para navegar para o formulário de edição */}
                  <Button className='me-2' variant="warning" onClick={() => editarCliente(cliente.id)}>
                    <FaPen />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deletarCliente(cliente.id)}>
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
    </div>
  );
}
