// src/app/funcionarios/form/page.js
'use client';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagina from '@/components/Pagina';

export default function FuncionarioFormPage() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    // Carrega funcionários do localStorage ao montar o componente
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);
  }, []);

  const initialValues = {
    nome: '',
    sobrenome: '',
    cargo: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: ''
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    cargo: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    endereco: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório")
  });

  function salvarFuncionario(dados) {
    const novosFuncionarios = [...funcionarios, { ...dados, id: uuidv4() }];
    localStorage.setItem('funcionarios', JSON.stringify(novosFuncionarios));
    alert("Funcionário cadastrado com sucesso!");
    router.push("/funcionario"); // Navega para a lista de funcionários
  }

  return (
    <div>
      <Pagina />
      <h1>Cadastro de Funcionário</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={salvarFuncionario}
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
                <Form.Label>Cargo:</Form.Label>
                <Form.Control
                  name='cargo'
                  type='text'
                  value={values.cargo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.cargo && errors.cargo}
                />
                <Form.Control.Feedback type='invalid'>{errors.cargo}</Form.Control.Feedback>
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

            <Row className='mb-2'>
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
            </Row>

            <Row className='mb-2'>
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
            </Row>

            <Button variant="primary" type="submit" className='mt-3'>Salvar</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
