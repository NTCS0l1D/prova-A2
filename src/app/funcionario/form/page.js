'use client';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import Pagina from '@/components/Pagina';
import apiLocalidades from '@/services/apiLocalidades';

export default function FuncionarioFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const funcionarioId = searchParams.get('id');
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioData, setFuncionarioData] = useState(null);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);

    if (funcionarioId) {
      const funcionario = funcionariosSalvos.find(f => f.id === funcionarioId);
      if (funcionario) setFuncionarioData(funcionario);
    }

    const fetchEstados = async () => {
      try {
        const response = await apiLocalidades.get('/estados');
        setEstados(response.data);
        setLoadingEstados(false);
      } catch (error) {
        console.error("Erro ao carregar os estados:", error);
        setLoadingEstados(false);
      }
    };

    fetchEstados();
  }, [funcionarioId]);

  useEffect(() => {
    if (funcionarioData && funcionarioData.estado) {
      fetchCidades(funcionarioData.estado);
    }
  }, [funcionarioData]);

  const fetchCidades = async (estadoId) => {
    setLoadingCidades(true);
    try {
      const response = await apiLocalidades.get(`/estados/${estadoId}/municipios`);
      setCidades(response.data);
      setLoadingCidades(false);
    } catch (error) {
      console.error("Erro ao carregar as cidades:", error);
      setLoadingCidades(false);
    }
  };

  const initialValues = funcionarioData || {
    nome: '',
    sobrenome: '',
    cargo: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    cidade: '',
    estado: ''
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    cargo: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    dataNascimento: Yup.date().required("Campo obrigatório").nullable().typeError("Data inválida"),
    cidade: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório")
  });

  const salvarFuncionario = (dados) => {
    let novosFuncionarios;

    if (funcionarioId) {
      novosFuncionarios = funcionarios.map(f => f.id === funcionarioId ? { ...f, ...dados } : f);
    } else {
      novosFuncionarios = [...funcionarios, { ...dados, id: uuidv4() }];
    }

    localStorage.setItem('funcionarios', JSON.stringify(novosFuncionarios));
    alert(funcionarioId ? "Funcionário atualizado com sucesso!" : "Funcionário cadastrado com sucesso!");
    router.push("/funcionario");
  };

  return (
    <div>
      <Pagina />
      <h1>{funcionarioId ? "Editar Funcionário" : "Cadastro de Funcionário"}</h1>
      <Formik
        initialValues={initialValues}
        enableReinitialize
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
                <InputMask
                  mask="(99) 99999-9999"
                  value={values.telefone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {(inputProps) => (
                    <Form.Control
                      {...inputProps}
                      name="telefone"
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
                  disabled={loadingEstados}
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
                  disabled={loadingCidades}
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

            <Button variant="primary" type="submit" className='mt-3' disabled={loadingEstados || loadingCidades}>
              {loadingEstados || loadingCidades ? 'Carregando...' : 'Salvar'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
