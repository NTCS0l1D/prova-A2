'use client';

import Pagina from '@/components/Pagina';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProdutoFormPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log(produtosSalvos);
    setProdutos(produtosSalvos);

    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
    console.log(fornecedoresSalvos);
    setFornecedores(fornecedoresSalvos);
  }, []);

  const initialValues = {
    codigoProduto: '',
    nomeProduto: '',
    descricao: '',
    categoria: '',
    marca: '',
    quantidade: '',
    precoUnitario: '',
    valorUnitario: '',
    fornecedor: '',
    dataCadastro: ''
  };

  const validationSchema = Yup.object().shape({
    codigoProduto: Yup.string().required("Campo obrigatório"),
    nomeProduto: Yup.string().required("Campo obrigatório"),
    descricao: Yup.string().required("Campo obrigatório"),
    categoria: Yup.string().required("Campo obrigatório"),
    marca: Yup.string().required("Campo obrigatório"),
    quantidade: Yup.number().required("Campo obrigatório").positive().integer(),
    precoUnitario: Yup.number().required("Campo obrigatório").positive(),
    valorUnitario: Yup.number().required("Campo obrigatório").positive(),
    fornecedor: Yup.string().required("Campo obrigatório"),
    dataCadastro: Yup.date().required("Campo obrigatório")
  });

  function salvarProduto(dados) {
    const novosProdutos = [...produtos, { ...dados, id: uuidv4() }];
    localStorage.setItem('produtos', JSON.stringify(novosProdutos));
    alert("Produto cadastrado com sucesso!");
    router.push("/produto");
  }

  return (
    <div>
      <Pagina />
      <h1>Cadastro de Produto</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={salvarProduto}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Código do Produto:</Form.Label>
                <Form.Control
                  name='codigoProduto'
                  type='text'
                  value={values.codigoProduto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.codigoProduto && errors.codigoProduto}
                />
                <Form.Control.Feedback type='invalid'>{errors.codigoProduto}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Produto:</Form.Label>
                <Form.Select
                  name='nomeProduto'
                  value={values.nomeProduto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.nomeProduto && errors.nomeProduto}
                >
                  <option value="">Selecione o Produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.nomeProduto}>
                      {produto.nomeProduto}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.nomeProduto}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Descrição:</Form.Label>
                <Form.Control
                  name='descricao'
                  type='text'
                  value={values.descricao}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.descricao && errors.descricao}
                />
                <Form.Control.Feedback type='invalid'>{errors.descricao}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Categoria:</Form.Label>
                <Form.Select
                  name='categoria'
                  value={values.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.categoria && errors.categoria}
                >
                  <option value="">Selecione...</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Notebook">Notebook</option>
                  <option value="Smartwatch">Smartwatch</option>
                  <option value="Videogame">Videogame</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.categoria}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Preço Unitário:</Form.Label>
                <Form.Control
                  name='precoUnitario'
                  type='number'
                  step="0.01"
                  value={values.precoUnitario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.precoUnitario && errors.precoUnitario}
                />
                <Form.Control.Feedback type='invalid'>{errors.precoUnitario}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Quantidade em Estoque:</Form.Label>
                <Form.Control
                  name='quantidade'
                  type='number'
                  value={values.quantidade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.quantidade && errors.quantidade}
                />
                <Form.Control.Feedback type='invalid'>{errors.quantidade}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Fornecedor:</Form.Label>
                <Form.Select
                  name='fornecedor'
                  value={values.fornecedor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.fornecedor && errors.fornecedor}
                >
                  <option value="">Selecione o Fornecedor</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.empresa}>
                      {fornecedor.empresa}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.fornecedor}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Data de Cadastro:</Form.Label>
                <Form.Control
                  name='dataCadastro'
                  type='date'
                  value={values.dataCadastro}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.dataCadastro && errors.dataCadastro}
                />
                <Form.Control.Feedback type='invalid'>{errors.dataCadastro}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" className='mt-3'>Salvar</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
