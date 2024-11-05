// src/app/fornecedores/form/page.js
'use client';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagina from '@/components/Pagina';

export default function FornecedorFormPage() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    // Carrega fornecedores do localStorage ao montar o componente
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedoresSalvos);
  }, []);

  const initialValues = {
    empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    categoria: ''
  };

  const validationSchema = Yup.object().shape({
    empresa: Yup.string().required("Campo obrigatório"),
    cnpj: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    endereco: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    categoria: Yup.string().required("Campo obrigatório")
  });

  function salvarFornecedor(dados) {
    const novosFornecedores = [...fornecedores, { ...dados, id: uuidv4() }];
    localStorage.setItem('fornecedores', JSON.stringify(novosFornecedores));
    alert("Fornecedor cadastrado com sucesso!");
    router.push("/fornecedor"); // Navega para a lista de fornecedores
  }

  return (
    <div>
    <Pagina />
      <h1>Cadastro de Fornecedor</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={salvarFornecedor}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Nome da Empresa:</Form.Label>
                <Form.Control
                  name='empresa'
                  type='text'
                  value={values.empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.empresa && errors.empresa}
                />
                <Form.Control.Feedback type='invalid'>{errors.empresa}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>CNPJ:</Form.Label>
                <Form.Control
                  name='cnpj'
                  type='text'
                  value={values.cnpj}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.cnpj && errors.cnpj}
                />
                <Form.Control.Feedback type='invalid'>{errors.cnpj}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className='mb-2'>
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

              <Form.Group as={Col}>
                <Form.Label>Telefone:</Form.Label>
                <Form.Control
                  name='telefone'
                  type='text'
                  value={values.telefone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.telefone && errors.telefone}
                />
                <Form.Control.Feedback type='invalid'>{errors.telefone}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Endereço:</Form.Label>
                <Form.Control
                  name='endereco'
                  type='text'
                  value={values.endereco}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.endereco && errors.endereco}
                />
                <Form.Control.Feedback type='invalid'>{errors.endereco}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Cidade:</Form.Label>
                <Form.Control
                  name='cidade'
                  type='text'
                  value={values.cidade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.cidade && errors.cidade}
                />
                <Form.Control.Feedback type='invalid'>{errors.cidade}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Estado:</Form.Label>
                <Form.Control
                  name='estado'
                  type='text'
                  value={values.estado}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.estado && errors.estado}
                />
                <Form.Control.Feedback type='invalid'>{errors.estado}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Categoria:</Form.Label>
                <Form.Control
                  as="select"
                  name='categoria'
                  value={values.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.categoria && errors.categoria}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Material">Material</option>
                  <option value="Serviço">Serviço</option>
                </Form.Control>
                <Form.Control.Feedback type='invalid'>{errors.categoria}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" className='mt-3'>Salvar</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
