// Importa os hooks e componentes necessários do React, Bootstrap e outros serviços e ícones
'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaPen, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades';

// Componente principal que exibe a lista de fornecedores
export default function FornecedoresListPage() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState([]); // Estado para lista de fornecedores
  const [estados, setEstados] = useState({}); // Estado para mapear IDs de estados aos nomes

  // Carrega fornecedores do localStorage e estados da API ao montar o componente
  useEffect(() => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedoresSalvos);

    // Função para buscar e mapear estados
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

  // Função para deletar fornecedor da lista e atualizar o localStorage
  const deletarFornecedor = (id) => {
    const novosFornecedores = fornecedores.filter(fornecedor => fornecedor.id !== id);
    setFornecedores(novosFornecedores);
    localStorage.setItem('fornecedores', JSON.stringify(novosFornecedores));
  };

  // Formata o telefone no formato (9999-9999)
  const formatarTelefone = (telefone) => {
    return telefone.replace(/(\d{4})(\d{4})/, "$1-$2");
  };

  // Formata o CNPJ no formato (XX.XXX.XXX/XXXX-XX)
  const formatarCNPJ = (cnpj) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  return (
    <div style={styles.pageContainer}>
      <Pagina /> {/* Componente de layout para o estilo da página */}
      <h1 className="text-center">Lista de Fornecedores</h1>
      
      {/* Tabela que exibe a lista de fornecedores */}
      <Table striped bordered hover className="mt-3" style={styles.table} variant='dark'>
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
          {/* Renderiza fornecedores se houver; caso contrário, exibe mensagem */}
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
                  <Button
                    variant="danger"
                    onClick={() => deletarFornecedor(fornecedor.id)}
                    aria-label="Excluir fornecedor"
                  >
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

      {/* Botão posicionado abaixo da tabela para adicionar um novo fornecedor */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/fornecedor/form')}>Novo Fornecedor</Button>
      </div>
    </div>
  );
}

// Objeto de estilos para layout e aparência da página e da tabela
const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Fundo claro azul para toda a página
    minHeight: '100vh', // Ocupa a altura total da tela
  },
  table: {
    borderRadius: '8px', // Bordas arredondadas para a tabela
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave na tabela
    backgroundColor: '#fff', // Fundo branco para a tabela
  },
  button: {
    margin: '0 10px', // Espaçamento entre os botões de ação
    padding: '10px 20px', // Tamanho aumentado para os botões
  }
};
