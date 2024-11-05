'use client'

import Pagina from '@/components/Pagina';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Form, Row } from 'react-bootstrap';
import apiLocalidades from '@/services/apiLocalidades';

export default function ClienteFormPage() {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

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

  const initialValues = {
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    estado: '',
    cidade: '',
    categoria: '',
    cpfCnpj: '',
    dataNascimento: ''
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    categoria: Yup.string().required("Campo obrigatório"),
    cpfCnpj: Yup.string().required("Campo obrigatório"),
    dataNascimento: Yup.date().required("Campo obrigatório")
  });

  function salvarCliente(dados) {
    // Obter clientes salvos anteriormente do localStorage
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Adicionar o novo cliente à lista
    clientes.push(dados);

    // Salvar a lista atualizada de clientes no localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));

    alert('Cliente salvo com sucesso!');
  }

  return (
    <div>
      <Pagina />
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
                <Form.Label>CPF/CNPJ:</Form.Label>
                <Form.Control
                  name='cpfCnpj'
                  type='text'
                  value={values.cpfCnpj}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.cpfCnpj && errors.cpfCnpj}
                />
                <Form.Control.Feedback type='invalid'>{errors.cpfCnpj}</Form.Control.Feedback>
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

            <Row className='mb-2'>
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

            <Button variant="primary" type="submit" className='mt-3'>Salvar</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
