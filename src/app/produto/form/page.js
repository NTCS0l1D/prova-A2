'use client';

import Pagina from '@/components/Pagina';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row, Card, Container } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProdutoFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const produtoId = searchParams ? searchParams.get('id') : null;

  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
      
      // Atualizar fornecedores e categorias
      setFornecedores(fornecedoresSalvos);
      const categoriasUnicas = [...new Set(fornecedoresSalvos.map(fornecedor => fornecedor.categoria))];
      setCategorias(categoriasUnicas);
    }

    if (produtoId) {
      const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
      const produtoExistente = produtosSalvos.find(produto => produto.id === produtoId);
      if (produtoExistente) {
        setProduto(produtoExistente);
      }
    } else {
      setProduto({
        codigoProduto: '',
        nomeProduto: '',
        descricao: '',
        categoria: '',
        quantidade: '',
        precoUnitario: '',
        fornecedor: '',
        localizacao: '',
        dataCadastro: new Date().toISOString().split('T')[0],
      });
    }
  }, [produtoId]);

  const validationSchema = Yup.object().shape({
    codigoProduto: Yup.string().required("Campo obrigatório"),
    nomeProduto: Yup.string().required("Campo obrigatório"),
    descricao: Yup.string().required("Campo obrigatório"),
    categoria: Yup.string().required("Campo obrigatório"),
    precoUnitario: Yup.string().required("Campo obrigatório"),
    fornecedor: Yup.string().required("Campo obrigatório"),
    localizacao: Yup.string().required("Campo obrigatório"),
    dataCadastro: Yup.date().required("Campo obrigatório"),
  });

  function salvarProduto(dados) {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    const precoUnitarioNumerico = parseFloat(dados.precoUnitario.replace(/[^\d.-]/g, '').replace(',', '.'));

    const dadosConvertidos = {
      ...dados,
      precoUnitario: precoUnitarioNumerico
    };

    if (produtoId) {
      const index = produtosSalvos.findIndex(produto => produto.id === produtoId);
      if (index >= 0) {
        produtosSalvos[index] = { ...dadosConvertidos, id: produtoId }; // Atualiza o produto existente
      }
    } else {
      produtosSalvos.push({ ...dadosConvertidos, id: uuidv4() }); // Adiciona novo produto
    }

    localStorage.setItem('produtos', JSON.stringify(produtosSalvos)); // Salva no localStorage
    alert("Produto salvo com sucesso!");
    router.push("/produto"); // Redireciona para a lista de produtos
  }

  return (
    <Pagina>
      <Container fluid style={styles.container}>
        <Card className="mx-auto" style={styles.card}>
          <h1 style={styles.title}>{produtoId ? 'Editar' : 'Cadastrar'} Produto</h1>
          {produto && fornecedores.length > 0 && (
            <Formik
              initialValues={produto}
              enableReinitialize
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
                      <Form.Control
                        name='nomeProduto'
                        type='text'
                        value={values.nomeProduto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.nomeProduto && errors.nomeProduto}
                      />
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
                        {categorias.map((categoria, index) => (
                          <option key={index} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type='invalid'>{errors.categoria}</Form.Control.Feedback>
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
                        <option value="">Selecione...</option>
                        {fornecedores.map((fornecedor, index) => (
                          <option key={index} value={fornecedor.empresa}>
                            {fornecedor.empresa}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type='invalid'>{errors.fornecedor}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Localização:</Form.Label>
                      <Form.Control
                        name='localizacao'
                        type='text'
                        value={values.localizacao}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.localizacao && errors.localizacao}
                      />
                      <Form.Control.Feedback type='invalid'>{errors.localizacao}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className='mb-2'>
                    <Form.Group as={Col}>
                      <Form.Label>Preço Unitário:</Form.Label>
                      <Form.Control
                        name='precoUnitario'
                        type='text'
                        value={values.precoUnitario}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.precoUnitario && errors.precoUnitario}
                      />
                      <Form.Control.Feedback type='invalid'>{errors.precoUnitario}</Form.Control.Feedback>
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
                        disabled
                      />
                      <Form.Control.Feedback type='invalid'>{errors.dataCadastro}</Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Button type='submit' style={styles.submitButton}>
                    {produtoId ? 'Salvar' : 'Cadastrar'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Card>
      </Container>
    </Pagina>
  );
}

const styles = {
  container: { // Indented colon
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
    fontWeight: 'bold',
  },
  submitButton: {
    display: 'block',
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    marginTop: '20px',
  }
};
