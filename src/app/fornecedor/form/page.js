'use client';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades';

export default function FornecedorFormPage() {
  const router = useRouter();
  const [fornecedores, setFornecedores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    // Carrega clientes do localStorage ao montar o componente
    const fornecedorSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    setFornecedores(fornecedorSalvos);
  }, []);

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
    empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    categoria: '',
    servicoEspecializado: '',
    prazoEntrega: ''
  };

  const validationSchema = Yup.object().shape({
    empresa: Yup.string().required("Campo obrigatório"),
    cnpj: Yup.number().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.number().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    prazoEntrega: Yup.number().typeError("Deve ser um número").required("Campo obrigatório"),
    empresa: Yup.string().required("Campo obrigatório")
  });

  function salvarFornecedor(dados) {
    const novoFornecedor = { ...dados, id: uuidv4() };
    const novosFornecedores = [...fornecedores, novoFornecedor];
    setFornecedores(novosFornecedores); // Atualiza o estado antes de salvar
    localStorage.setItem('fornecedores', JSON.stringify(novosFornecedores)); // Salva no localStorage
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
        onSubmit={salvarFornecedor} // Certifique-se de que está chamando a função correta
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

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Produto:</Form.Label>
                <Form.Control
                  name='produto'
                  type='text'
                  value={values.produto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.produto && errors.produto}
                />
                <Form.Control.Feedback type='invalid'>{errors.produto}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Prazo Médio de Entrega (dias):</Form.Label>
                <Form.Control
                  name='prazoEntrega'
                  type='number'
                  value={values.prazoEntrega}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.prazoEntrega && errors.prazoEntrega}
                />
                <Form.Control.Feedback type='invalid'>{errors.prazoEntrega}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" className='mt-3'>Salvar</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
