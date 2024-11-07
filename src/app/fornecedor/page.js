'use client'

import Pagina from '@/components/Pagina';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import apiLocalidades from '@/services/apiLocalidades';

export default function FornecedoresListPage() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState([]);
  const [estados, setEstados] = useState({});

  useEffect(() => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedoresSalvos);

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

  const deletarFornecedor = (id) => {
    const novosFornecedores = fornecedores.filter(fornecedor => fornecedor.id !== id);
    setFornecedores(novosFornecedores);
    localStorage.setItem('fornecedores', JSON.stringify(novosFornecedores));
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
            <th>Categoria</th>
            <th>Prazo de Entrega</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.empresa}</td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.email}</td>
              <td>{fornecedor.telefone}</td>
              <td>{fornecedor.cidade}</td>
              <td>{estados[fornecedor.estado] || fornecedor.estado}</td>
              <td>{fornecedor.categoria}</td>
              <td>{fornecedor.prazoEntrega} dias</td>
              <td>
                <Button
                  className='me-2'
                  variant="warning"
                  onClick={() => router.push(`/fornecedor/form?id=${fornecedor.id}`)}
                >
                  <FaPen />
                </Button>
                <Button variant="danger" onClick={() => deletarFornecedor(fornecedor.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
