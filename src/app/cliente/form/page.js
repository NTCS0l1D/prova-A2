'use client'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiLocalidades from '@/services/apiLocalidades';
import InputMask from 'react-input-mask';
import Pagina from '@/components/Pagina';

export default function ClienteFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteId = searchParams.get('id');

  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
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

  const fetchCidades = async (estadoId) => {
    try {
      const response = await apiLocalidades.get(`/estados/${estadoId}/municipios`);
      setCidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar as cidades:", error);
    }
  };

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

  function salvarCliente(dados) {
    let novosClientes;
    if (clienteId) {
      novosClientes = clientes.map(cliente => (cliente.id === clienteId ? { ...dados, id: clienteId } : cliente));
    } else {
      novosClientes = [...clientes, { ...dados, id: uuidv4() }];
    }

    localStorage.setItem('clientes', JSON.stringify(novosClientes));
    alert("Cliente salvo com sucesso!");
    router.push("/cliente");
  }

  return (
      <Pagina>
        <Container fluid style={styles.container}>
        <Card className="mx-auto" style={styles.card}>
          <Card.Body>
            <h1 style={styles.title}>{clienteId ? 'Editar Cliente' : 'Cadastrar Cliente'}</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={salvarCliente}
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
                      isInvalid={touched.nome && errors.nome}
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

                <Row className='mb-3'>
                  <Form.Group as={Col}>
                    <Form.Label>Estado:</Form.Label>
                    <Form.Select
                      name='estado'
                      value={values.estado}
                      onChange={(e) => {
                        handleChange(e);
                        fetchCidades(e.target.value);
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

                <Button variant="primary" type="submit" style={styles.submitButton}>Salvar</Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
      </Container>
      </Pagina>
  );
}

// Estilos adicionais para um visual mais elegante
const styles = {
  container: {
    backgroundColor: '#e9f3fb',
    paddingTop: '20px',
    paddingBottom: '40px',
    minHeight: '100vh',
  },
  card: {
    maxWidth: '1000px', // Aumenta a largura do card
    width: '100%', 
    padding: '30px', // Ajusta o padding interno do card
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8f9fa',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#007bff',
  },
  submitButton: {
    display: 'block',
    margin: '0 auto',
    marginTop: '20px',
    padding: '10px 30px',
  },
};
