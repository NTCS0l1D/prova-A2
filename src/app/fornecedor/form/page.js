// Importa os hooks e componentes necessários do React, Formik e Bootstrap
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import { Formik } from 'formik';
import InputMask from 'react-input-mask';
import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import apiLocalidades from '@/services/apiLocalidades'; // API personalizada para localidades
import Pagina from '@/components/Pagina'; // Componente para renderizar a página com estilo padrão

// Componente principal da página de formulário de fornecedores
export default function FornecedorFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fornecedorId = searchParams.get('id'); // Obtém o ID do fornecedor dos parâmetros de consulta da URL

  // Define os estados para armazenar dados dos fornecedores, estados, cidades e valores iniciais do formulário
  const [fornecedores, setFornecedores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [initialValues, setInitialValues] = useState({
    empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    categoria: '',
    prazoEntrega: ''
  });

  // Carrega fornecedores do localStorage e define valores iniciais se um fornecedor existente for editado
  useEffect(() => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedoresSalvos);

    if (fornecedorId) { // Se um ID de fornecedor estiver presente na URL, carrega os dados do fornecedor
      const fornecedorExistente = fornecedoresSalvos.find(fornecedor => fornecedor.id === fornecedorId);
      if (fornecedorExistente) {
        setInitialValues(fornecedorExistente);
        if (fornecedorExistente.estado) { // Carrega cidades se o estado estiver preenchido
          fetchCidades(fornecedorExistente.estado);
        }
      }
    }
  }, [fornecedorId]);

  // Carrega estados da API quando o componente é montado
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados');
        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao carregar os estados:", error);
      }
    };
    fetchEstados();
  }, []);

  // Função para buscar cidades com base no estado selecionado
  const fetchCidades = async (estadoId) => {
    try {
      const response = await apiLocalidades.get(`/estados/${estadoId}/municipios`);
      setCidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar as cidades:", error);
    }
  };

  // Esquema de validação do formulário usando Yup
  const validationSchema = Yup.object().shape({
    empresa: Yup.string().required("Campo obrigatório"),
    cnpj: Yup.string()
      .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Formato inválido (XX.XXX.XXX/XXXX-XX)")
      .required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string()
      .matches(/^\d{4}-\d{4}$/, "Formato inválido (9999-9999)")
      .required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    categoria: Yup.string().required("Campo obrigatório"),
    prazoEntrega: Yup.number().required("Campo obrigatório")
  });

  // Função para salvar ou atualizar o fornecedor no localStorage e redirecionar o usuário
  const handleSave = (values) => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    if (fornecedorId) { // Atualiza o fornecedor se um ID for fornecido
      const fornecedorIndex = fornecedoresSalvos.findIndex(fornecedor => fornecedor.id === fornecedorId);
      if (fornecedorIndex !== -1) {
        fornecedoresSalvos[fornecedorIndex] = values;
      }
    } else { // Adiciona um novo fornecedor se não houver ID
      values.id = new Date().getTime().toString();
      fornecedoresSalvos.push(values);
    }
    localStorage.setItem('fornecedores', JSON.stringify(fornecedoresSalvos));
    alert("Fornecedor salvo com sucesso!");
    router.push('/fornecedor'); // Redireciona o usuário após o salvamento
  };

  return (
    <Pagina> {/* Container principal da página */}
      <Container fluid style={styles.container}>
        <Card className="mx-auto" style={styles.card}>
          <Card.Body>
            <h1 style={styles.title}>{fornecedorId ? "Editar Fornecedor" : "Cadastrar Fornecedor"}</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSave}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <Form onSubmit={handleSubmit} style={styles.form}>
                  {/* Linha de campos para Nome da Empresa e CNPJ */}
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Nome da Empresa</Form.Label>
                      <Form.Control
                        type="text"
                        name="empresa"
                        value={values.empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.empresa && errors.empresa}
                      />
                      <Form.Control.Feedback type="invalid">{errors.empresa}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>CNPJ</Form.Label>
                      <InputMask
                        mask="99.999.999/9999-99"
                        value={values.cnpj}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {() => (
                          <Form.Control
                            name="cnpj"
                            type="text"
                            isInvalid={touched.cnpj && errors.cnpj}
                          />
                        )}
                      </InputMask>
                      <Form.Control.Feedback type="invalid">{errors.cnpj}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  {/* Linha de campos para Email e Telefone */}
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Telefone</Form.Label>
                      <InputMask
                        mask="9999-9999"
                        value={values.telefone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {() => (
                          <Form.Control
                            name="telefone"
                            type="text"
                            isInvalid={touched.telefone && errors.telefone}
                          />
                        )}
                      </InputMask>
                      <Form.Control.Feedback type="invalid">{errors.telefone}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  {/* Linha de campos para Estado e Cidade */}
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                        name="estado"
                        value={values.estado}
                        onChange={(e) => {
                          handleChange(e);
                          fetchCidades(e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.estado && errors.estado}
                      >
                        <option value="">Selecione um estado</option>
                        {estados.map((estado) => (
                          <option key={estado.id} value={estado.id}>{estado.nome}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.estado}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Cidade</Form.Label>
                      <Form.Select
                        name="cidade"
                        value={values.cidade}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.cidade && errors.cidade}
                      >
                        <option value="">Selecione uma cidade</option>
                        {cidades.map((cidade) => (
                          <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.cidade}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  {/* Linha de campos para Categoria e Prazo de Entrega */}
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Control
                        type="text"
                        name="categoria"
                        value={values.categoria}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.categoria && errors.categoria}
                      />
                      <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Prazo de Entrega (Em Dias)</Form.Label>
                      <Form.Control
                        type="text"
                        name="prazoEntrega"
                        value={values.prazoEntrega}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.prazoEntrega && errors.prazoEntrega}
                      />
                      <Form.Control.Feedback type="invalid">{errors.prazoEntrega}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  {/* Botão para submeter o formulário */}
                  <Button variant="primary" type="submit" style={styles.submitButton}>
                    {fornecedorId ? "Salvar Alterações" : "Cadastrar Fornecedor"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </Pagina>
  );
}

// Estilos para o layout e aparência do formulário
const styles = {
  container: {
    backgroundColor: '#e9f3fb', // Cor de fundo clara para a página
    paddingTop: '20px',
    paddingBottom: '40px',
    minHeight: '100vh',
  },
  card: {
    maxWidth: '1000px', // Largura máxima do card
    width: '100%', 
    padding: '30px', // Padding interno do card para espaçamento
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Sombra suave ao redor do card
    backgroundColor: '#f8f9fa', // Cor de fundo do card
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#007bff', // Cor azul para o título
  },
  submitButton: {
    display: 'block',
    margin: '0 auto',
    marginTop: '20px',
    padding: '10px 30px',
  },
};
