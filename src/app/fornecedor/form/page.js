'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import { Formik } from 'formik';
import InputMask from 'react-input-mask';
import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import apiLocalidades from '@/services/apiLocalidades';
import Pagina from '@/components/Pagina';

export default function FornecedorFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fornecedorId = searchParams.get('id');

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

  useEffect(() => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedoresSalvos);

    if (fornecedorId) {
      const fornecedorExistente = fornecedoresSalvos.find(fornecedor => fornecedor.id === fornecedorId);
      if (fornecedorExistente) {
        setInitialValues(fornecedorExistente);
        if (fornecedorExistente.estado) {
          fetchCidades(fornecedorExistente.estado);
        }
      }
    }
  }, [fornecedorId]);

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

  const handleSave = (values) => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    if (fornecedorId) {
      const fornecedorIndex = fornecedoresSalvos.findIndex(fornecedor => fornecedor.id === fornecedorId);
      if (fornecedorIndex !== -1) {
        fornecedoresSalvos[fornecedorIndex] = values;
      }
    } else {
      values.id = new Date().getTime().toString();
      fornecedoresSalvos.push(values);
    }
    localStorage.setItem('fornecedores', JSON.stringify(fornecedoresSalvos));
    alert("Fornecedor salvo com sucesso!");
    router.push('/fornecedor');
  };

  return (
    <Pagina>
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
