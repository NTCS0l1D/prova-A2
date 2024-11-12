'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades'; 

export default function FuncionariosListPage() {
  const router = useRouter(); // Hook para navegação programática no Next.js
  const [funcionarios, setFuncionarios] = useState([]); // Estado para armazenar a lista de funcionários
  const [estados, setEstados] = useState({}); // Estado para armazenar o mapeamento de estados (ID para nome)

  useEffect(() => {
    // Carrega funcionários do localStorage ao montar o componente
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);

    // Busca estados e cria um dicionário de código para nome
    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados'); // Faz a chamada para obter os estados
        const estadosMap = response.data.reduce((acc, estado) => {
          acc[estado.id] = estado.nome; // Cria um dicionário de ID do estado para o nome
          return acc;
        }, {});
        setEstados(estadosMap); // Armazena o mapeamento no estado `estados`
      } catch (error) {
        console.error("Erro ao carregar os estados:", error); // Exibe um erro no console se a chamada falhar
      }
    };
    
    fetchEstados(); // Chama a função para buscar os estados
  }, []);

  // Função para deletar um funcionário
  const deletarFuncionario = (id) => {
    const novosFuncionarios = funcionarios.filter(funcionario => funcionario.id !== id); // Filtra para remover o funcionário com o ID fornecido
    setFuncionarios(novosFuncionarios); // Atualiza a lista de funcionários
    localStorage.setItem('funcionarios', JSON.stringify(novosFuncionarios)); // Atualiza o localStorage
  };

  // Função para redirecionar para a página de edição com o ID do funcionário
  const editarFuncionario = (id) => {
    router.push(`/funcionario/form?id=${id}`); // Navega para a página de formulário com o ID do funcionário para edição
  };

  // Função para formatar Telefone
  function formatarTelefone(telefone) {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"); // Aplica máscara de telefone
  }

  // Função para formatar Data de Nascimento (ano-mes-dia para dia/mes/ano)
  function formatarData(data) {
    const [ano, mes, dia] = data.split('-'); // Separa a data em ano, mês e dia
    return `${dia}/${mes}/${ano}`; // Retorna no formato DD/MM/AAAA
  }

  return (
    <div style={styles.pageContainer}> {/* Estilização da página */}
      <Pagina /> {/* Componente de layout comum */}
      <h1 className="text-center">Lista de Funcionários</h1>      
      <Table striped bordered hover className='mt-3' variant='dark'> {/* Tabela de listagem com Bootstrap */}
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Cargo</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Data de Nascimento</th> {/* Substituído Endereço por Data de Nascimento */}
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
                <td>{formatarTelefone(funcionario.telefone)}</td> {/* Exibe telefone formatado */}
                <td>{formatarData(funcionario.dataNascimento)}</td> {/* Exibe data formatada */}
                <td>{funcionario.cidade}</td>
                {/* Exibe o nome do estado usando o dicionário `estados` */}
                <td>{estados[funcionario.estado] || "Estado desconhecido"}</td>
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
              <td colSpan="9" className="text-center">Nenhum funcionário cadastrado</td> {/* Mensagem caso não haja funcionários */}
            </tr>
          )}
        </tbody>
      </Table>
      <div className="text-center mt-3">
        <Button variant="primary" onClick={() => router.push('/funcionario/form')}>Novo Funcionário</Button> {/* Botão para novo funcionário */}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#f4f6f8', // Cor de fundo suave em azul claro
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
