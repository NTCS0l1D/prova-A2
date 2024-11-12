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
  const produtoId = searchParams ? searchParams.get('id') : null; // Obtém o ID do produto da URL (se houver)

  const [fornecedores, setFornecedores] = useState([]); // Armazena fornecedores disponíveis
  const [categorias, setCategorias] = useState([]); // Armazena categorias únicas
  const [produto, setProduto] = useState(null); // Estado do produto que está sendo editado ou novo

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Carrega fornecedores do localStorage
      const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
      
      setFornecedores(fornecedoresSalvos);
      const categoriasUnicas = [...new Set(fornecedoresSalvos.map(fornecedor => fornecedor.categoria))];
      setCategorias(categoriasUnicas); // Extrai categorias únicas dos fornecedores
    }

    if (produtoId) {
      // Carrega o produto existente do localStorage
      const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
      const produtoExistente = produtosSalvos.find(produto => produto.id === produtoId);
      if (produtoExistente) {
        setProduto(produtoExistente); // Configura o estado com os dados do produto encontrado
      }
    } else {
      // Configura o estado inicial para um novo produto
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

  // Validação do formulário usando Yup
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

  // Função para salvar o produto
  function salvarProduto(dados) {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    // Converte o preço para número, se necessário
    const precoUnitarioNumerico = typeof dados.precoUnitario === 'string' 
      ? parseFloat(dados.precoUnitario.replace(/[^\d.-]/g, '').replace(',', '.'))
      : dados.precoUnitario;
  
    const dadosConvertidos = {
      ...dados,
      precoUnitario: precoUnitarioNumerico
    };
  
    if (produtoId) {
      // Atualiza o produto existente
      const index = produtosSalvos.findIndex(produto => produto.id === produtoId);
      if (index >= 0) {
        produtosSalvos[index] = { ...dadosConvertidos, id: produtoId };
      }
    } else {
      // Adiciona um novo produto
      produtosSalvos.push({ ...dadosConvertidos, id: uuidv4() });
    }
  
    // Salva o array de produtos no localStorage e redireciona para a lista de produtos
    localStorage.setItem('produtos', JSON.stringify(produtosSalvos));
    alert("Produto salvo com sucesso!");
    router.push("/produto");
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
                        placeholder='Ex: 2499,90'
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

// Estilos personalizados para os componentes
const styles = {
  container: {
    backgroundColor: '#e9f3fb',
    paddingTop: '20px',
    paddingBottom: '40px',
    minHeight: '100vh',
  },
  card: {
    width: '60%',
    padding: '20px',
    backgroundColor: '#f7f7f7',
  },
  title: {
    color: '#0056b3',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    marginTop: '20px',
    width: '100%',
  },
};
