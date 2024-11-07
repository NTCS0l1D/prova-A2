'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import apiLocalidades from '@/services/apiLocalidades';
import Pagina from '@/components/Pagina'; // Importando o componente Pagina
import InputMask from 'react-input-mask'; // Importando InputMask

export default function FornecedorFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fornecedorId = searchParams ? searchParams.get('id') : null;

  const [fornecedor, setFornecedor] = useState({
    empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    categoria: '',
    prazoEntrega: '',
  });
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  const validationSchema = Yup.object({
    empresa: Yup.string().required('Nome da empresa é obrigatório'),
    cnpj: Yup.string().required('CNPJ é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    telefone: Yup.string().required('Telefone é obrigatório'),
    cidade: Yup.string().required('Cidade é obrigatória'),
    estado: Yup.string().required('Estado é obrigatório'),
    categoria: Yup.string(),
    prazoEntrega: Yup.number()
      .typeError('Deve ser um número')
      .positive('Número positivo')
      .required('Prazo de entrega é obrigatório'),
  });

  // Carrega os estados ao montar o componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados');
        setEstados(response.data);
      } catch (error) {
        console.error('Erro ao carregar os estados:', error);
      }
    };
    fetchEstados();
  }, []);

  // Carrega as cidades ao selecionar um estado
  const fetchCidades = async (estadoId) => {
    try {
      const response = await apiLocalidades.get(`/estados/${estadoId}/municipios`);
      setCidades(response.data);
    } catch (error) {
      console.error('Erro ao carregar as cidades:', error);
    }
  };

  // Carregar dados do fornecedor para edição, se necessário
  useEffect(() => {
    if (typeof window !== 'undefined' && fornecedorId) {
      const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
      const fornecedorExistente = fornecedoresSalvos.find(f => f.id === fornecedorId);
      if (fornecedorExistente) setFornecedor(fornecedorExistente);
    }
  }, [fornecedorId]);

  const handleSubmit = (values) => {
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];

    if (fornecedorId) {
      const index = fornecedoresSalvos.findIndex(f => f.id === fornecedorId);
      if (index >= 0) fornecedoresSalvos[index] = values;
    } else {
      values.id = Date.now().toString();
      fornecedoresSalvos.push(values);
    }

    localStorage.setItem('fornecedores', JSON.stringify(fornecedoresSalvos));
    router.push('/fornecedor');
  };

  return (
    <div>
      <Pagina /> {/* Adicionando o componente Pagina */}
      <h1>{fornecedorId ? 'Editar' : 'Novo'} Fornecedor</h1>
      <Formik
        initialValues={fornecedor}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Row className='mb-2'>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome da Empresa</Form.Label>
                  <Field
                    name="empresa"
                    className="form-control"
                    placeholder="Digite o nome da empresa"
                  />
                  <ErrorMessage name="empresa" component="div" className="text-danger" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>CNPJ</Form.Label>
                  <InputMask
                    mask="99.999.999/9999-99"
                    value={values.cnpj}
                    onChange={handleChange}
                  >
                    {() => (
                      <Field
                        name="cnpj"
                        className="form-control"
                        placeholder="Digite o CNPJ"
                      />
                    )}
                  </InputMask>
                  <ErrorMessage name="cnpj" component="div" className="text-danger" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Field
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Digite o email"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Telefone</Form.Label>
                  <InputMask
                    mask="9999-9999"
                    value={values.telefone}
                    onChange={handleChange}
                  >
                    {() => (
                      <Field
                        name="telefone"
                        className="form-control"
                        placeholder="Digite o telefone"
                      />
                    )}
                  </InputMask>
                  <ErrorMessage name="telefone" component="div" className="text-danger" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Field
                    as="select"
                    name="estado"
                    className="form-control"
                    onChange={(e) => {
                      const estadoSelecionado = e.target.value;
                      handleChange(e);
                      setFieldValue("cidade", "");
                      setFieldValue("estado", estadoSelecionado);
                      fetchCidades(estadoSelecionado); // Carregar cidades com base no estado selecionado
                    }}
                  >
                    <option value="">Selecione o estado</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.sigla}>
                        {estado.nome}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="estado" component="div" className="text-danger" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cidade</Form.Label>
                  <Field as="select" name="cidade" className="form-control">
                    <option value="">Selecione a cidade</option>
                    {cidades.map((cidade) => (
                      <option key={cidade.id} value={cidade.nome}>
                        {cidade.nome}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="cidade" component="div" className="text-danger" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Field
                    name="categoria"
                    className="form-control"
                    placeholder="Digite a categoria"
                  />
                  <ErrorMessage name="categoria" component="div" className="text-danger" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prazo de Entrega (em dias)</Form.Label>
                  <Field
                    name="prazoEntrega"
                    type="number"
                    className="form-control"
                    placeholder="Digite o prazo de entrega"
                  />
                  <ErrorMessage name="prazoEntrega" component="div" className="text-danger" />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
