// Importações necessárias de pacotes e componentes
'use client' // Diretiva do Next.js para indicar que este componente deve ser renderizado no lado do cliente
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiLocalidades from '@/services/apiLocalidades';
import InputMask from 'react-input-mask';
import Pagina from '@/components/Pagina';

// Componente principal do formulário de clientes
export default function ClienteFormPage() {
  const router = useRouter(); // Para navegação entre páginas
  const searchParams = useSearchParams(); // Para acessar parâmetros da URL
  const clienteId = searchParams.get('id'); // Obtém o ID do cliente, se houver, para edição

  // Estados para armazenar dados do formulário e listas de clientes, estados e cidades
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  
  // Valores iniciais do formulário (vazio ou preenchido, caso esteja editando)
  const [initialValues, setInitialValues] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    cidade: '',
    estado: ''
  });

  // Carrega os clientes salvos e, se for edição, preenche o formulário com os dados existentes
  useEffect(() => {
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    if (clienteId) {
      const clienteExistente = clientesSalvos.find(cliente => cliente.id === clienteId);
      if (clienteExistente) {
        setInitialValues(clienteExistente);
      }
    }
  }, [clienteId]);

  // Carrega a lista de estados do serviço de API de localidades
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados');
        setEstados(response.data); // Define os estados no estado do componente
      } catch (error) {
        console.error("Erro ao carregar os estados:", error);
      }
    };
    fetchEstados();
  }, []);

  // Carrega as cidades com base no estado selecionado pelo usuário
  const fetchCidades = async (estadoId) => {
    try {
      const response = await apiLocalidades.get(`/estados/${estadoId}/municipios`);
      setCidades(response.data); // Define as cidades no estado do componente
    } catch (error) {
      console.error("Erro ao carregar as cidades:", error);
    }
  };

  // Esquema de validação do formulário com Yup para garantir que todos os campos obrigatórios estão preenchidos
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    cpf: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    dataNascimento: Yup.date().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório")
  });

  // Função para salvar os dados do cliente (novo ou atualizado) no localStorage
  function salvarCliente(dados) {
    let novosClientes;
    if (clienteId) {
      // Atualiza cliente existente
      novosClientes = clientes.map(cliente => (cliente.id === clienteId ? { ...dados, id: clienteId } : cliente));
    } else {
      // Adiciona novo cliente com um ID único
      novosClientes = [...clientes, { ...dados, id: uuidv4() }];
    }

    // Armazena a lista atualizada de clientes no localStorage
    localStorage.setItem('clientes', JSON.stringify(novosClientes));
    alert("Cliente salvo com sucesso!"); // Mensagem de confirmação
    router.push("/cliente"); // Redireciona para a página de lista de clientes
  }

  return (
    // Envolve o conteúdo do formulário dentro do componente Pagina para layout padrão
    <Pagina>
      <Container fluid style={styles.container}>
        <Card className="mx-auto" style={styles.card}>
          <Card.Body>
            <h1 style={styles.title}>{clienteId ? 'Editar Cliente' : 'Cadastrar Cliente'}</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize // Permite reinicializar valores quando initialValues mudarem
              onSubmit={salvarCliente} // Função de submissão
            >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Form onSubmit={handleSubmit} style={styles.form}>
                <Row className='mb-3'>
                  <Form.Group as={Col}>
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                      name='nome'
                      type='text'
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.nome && errors.nome} // Validação de erro
                    />
                    <Form.Control.Feedback type='invalid'>{errors.nome}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Sobrenome:</Form.Label>
                    <Form.Control
                      name='sobrenome'
                      type='text'
                      value={values.sobrenome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.sobrenome && errors.sobrenome}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.sobrenome}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* Máscara para o CPF */}
                <Row className='mb-3'>
                  <Form.Group as={Col}>
                    <Form.Label>CPF:</Form.Label>
                    <InputMask
                      mask="999.999.999-99"
                      value={values.cpf}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={initialValues.cpf}
                    >
                      {() => (
                        <Form.Control
                          name="cpf"
                          type="text"
                          isInvalid={touched.cpf && errors.cpf}
                        />
                      )}
                    </InputMask>
                    <Form.Control.Feedback type='invalid'>{errors.cpf}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      name='email'
                      type='email'
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && errors.email}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* Máscara para telefone */}
                <Row className='mb-3'>
                  <Form.Group as={Col}>
                    <Form.Label>Telefone:</Form.Label>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={values.telefone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={initialValues.telefone}
                    >
                      {() => (
                        <Form.Control
                          name="telefone"
                          type="text"
                          isInvalid={touched.telefone && errors.telefone}
                        />
                      )}
                    </InputMask>
                    <Form.Control.Feedback type='invalid'>{errors.telefone}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Data de Nascimento:</Form.Label>
                    <Form.Control
                      name='dataNascimento'
                      type='date'
                      value={values.dataNascimento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dataNascimento && errors.dataNascimento}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.dataNascimento}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* Seleciona estado e cidade */}
                <Row className='mb-3'>
                  <Form.Group as={Col}>
                    <Form.Label>Estado:</Form.Label>
                    <Form.Select
                      name='estado'
                      value={values.estado}
                      onChange={(e) => {
                        handleChange(e);
                        fetchCidades(e.target.value); // Carrega cidades ao selecionar estado
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.estado && errors.estado}
                    >
                      <option value="">Selecione o Estado</option>
                      {estados.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                          {estado.nome}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.estado}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Cidade:</Form.Label>
                    <Form.Select
                      name='cidade'
                      value={values.cidade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cidade && errors.cidade}
                    >
                      <option value="">Selecione a Cidade</option>
                      {cidades.map((cidade) => (
                        <option key={cidade.id} value={cidade.nome}>
                          {cidade.nome}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.cidade}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* Botão de submissão centralizado */}
                <div className="d-flex justify-content-center">
                  <Button type="submit" style={styles.submitButton}>Salvar</Button>
                </div>
              </Form>
            )}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </Pagina>
  );
}

// Estilos em JavaScript para elementos do formulário e página
const styles = {
  container: {
    backgroundColor: "#f8f9fa", // Fundo claro
    minHeight: "100vh",
    paddingTop: "30px"
  },
  card: {
    maxWidth: "1000px", // Largura máxima do card
    padding: "20px",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    color: "#007bff" // Título com cor azul
  },
  submitButton: {
    padding: "10px 30px" // Botão de salvar com padding para melhor usabilidade
  }
};
