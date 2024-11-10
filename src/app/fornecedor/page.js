'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';
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

  const formatarTelefone = (telefone) => {
    return telefone.replace(/(\d{4})(\d{4})/, "$1-$2");
  };

  const formatarCNPJ = (cnpj) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  return (
    <div style={styles.pageContainer}>
      <Pagina />
      <h1 className="text-center">Lista de Fornecedores</h1>
      
      <Table striped bordered hover className="mt-3" style={styles.table}>
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
          {fornecedores.length > 0 ? (
            fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.empresa}</td>
                <td>{formatarCNPJ(fornecedor.cnpj)}</td>
                <td>{fornecedor.email}</td>
                <td>{formatarTelefone(fornecedor.telefone)}</td>
                <td>{fornecedor.cidade}</td>
                <td>{estados[fornecedor.estado] || "Estado desconhecido"}</td>
                <td>{fornecedor.categoria}</td>
                <td>{fornecedor.prazoEntrega} dias</td>
                <td>
                  <Button
                    className="me-2"
                    variant="warning"
                    onClick={() => router.push(`/fornecedor/form?id=${fornecedor.id}`)}
                    aria-label="Editar fornecedor"
                  >
                    <FaPen />
                  </Button>
                  <Button variant="danger" onClick={() => deletarFornecedor(fornecedor.id)} aria-label="Excluir fornecedor">
                    <FaTrash />
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

      {/* Botão posicionado abaixo da tabela */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/fornecedor/form')}>Novo Fornecedor</Button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#d1e7dd', // Cor de fundo suave em azul claro
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
