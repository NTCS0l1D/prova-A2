// src/app/clientes/form/page.js
'use client';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClienteFormPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Carrega clientes do localStorage ao montar o componente
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);
  }, []);

  const initialValues = {
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    categoria: ''
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    endereco: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    categoria: Yup.string().required("Campo obrigatório")
  });

  function salvarCliente(dados) {
    const novosClientes = [...clientes, { ...dados, id: uuidv4() }];
    localStorage.setItem('clientes', JSON.stringify(novosClientes));
    alert("Cliente cadastrado com sucesso!");
    router.push("/clientes"); // Navega para a lista de clientes
  }

  return (
    <div>
      <h1>Cadastro de Cliente</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={salvarCliente}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Row className='mb-2'>
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
                  name='categoria'
                  type='text'
                  value={values.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.categoria && errors.categoria}
                />
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
