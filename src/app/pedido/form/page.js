'use client'

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Container, Button, Col, Form, Row, Card } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagina from '@/components/Pagina';

export default function PedidoFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoId = searchParams ? searchParams.get('id') : null;

  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [pedido, setPedido] = useState({
    numeroPedido: '',
    cliente: '',
    funcionario: '',
    produto: '',
    quantidade: '',
    precoUnitario: '',
    total: '',
    status: ''
  });

  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosSalvos);

    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);

    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);

    if (pedidoId) {
      const pedidoExistente = pedidosSalvos.find(pedido => pedido.id === pedidoId);
      if (pedidoExistente) {
        setPedido(pedidoExistente);
      }
    }
  }, [pedidoId]);

  const validationSchema = Yup.object().shape({
    numeroPedido: Yup.string().required("Campo obrigatório"),
    cliente: Yup.string().required("Campo obrigatório"),
    funcionario: Yup.string().required("Campo obrigatório"),
    produto: Yup.string().required("Campo obrigatório"),
    quantidade: Yup.number().required("Campo obrigatório").positive().integer(),
    precoUnitario: Yup.number().required("Campo obrigatório").positive(),
    total: Yup.number().required("Campo obrigatório").positive(),
    status: Yup.string().required("Campo obrigatório")
  });

  function formatCurrency(value) {
    const numero = Number(value);
    return `R$ ${isNaN(numero) ? "0,00" : numero.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  }

  function salvarPedido(dados) {
    let novosPedidos = [...pedidos];
    
    if (pedidoId) {
      novosPedidos = pedidos.map(pedido => 
        pedido.id === pedidoId ? { ...pedido, ...dados } : pedido
      );
    } else {
      novosPedidos.push({ id: uuidv4(), ...dados });
    }

    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
    alert("Pedido salvo com sucesso!");
    router.push("/pedido");
  }

  return (
 <Pagina>
      <Container fluid style={styles.container}>
        <Card className="mx-auto" style={styles.card}>
        <h1 style={styles.title}>{pedidoId ? 'Editar' : 'Cadastrar'}  Pedido</h1>
          <Formik
            initialValues={pedido}
            validationSchema={validationSchema}
            onSubmit={salvarPedido}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Número do Pedido:</Form.Label>
                    <Form.Control
                      name='numeroPedido'
                      type='text'
                      value={values.numeroPedido}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.numeroPedido && errors.numeroPedido}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.numeroPedido}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Cliente:</Form.Label>
                    <Form.Select
                      name='cliente'
                      value={values.cliente}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.cliente && errors.cliente}
                    >
                      <option value="">Selecione...</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.cliente}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Funcionário:</Form.Label>
                    <Form.Select
                      name='funcionario'
                      value={values.funcionario}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.funcionario && errors.funcionario}
                    >
                      <option value="">Selecione...</option>
                      {funcionarios.map(funcionario => (
                        <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.funcionario}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Produto:</Form.Label>
                    <Form.Select
                      name='produto'
                      value={values.produto}
                      onChange={e => {
                        handleChange(e);
                        const produtoSelecionado = produtos.find(produto => produto.id === e.target.value);
                        if (produtoSelecionado) {
                          setFieldValue('precoUnitario', produtoSelecionado.precoUnitario);
                          setFieldValue('total', produtoSelecionado.precoUnitario * (values.quantidade || 0));
                        }
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.produto && errors.produto}
                    >
                      <option value="">Selecione...</option>
                      {produtos.map(produto => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nomeProduto}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.produto}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Quantidade:</Form.Label>
                    <Form.Control
                      name='quantidade'
                      type='number'
                      value={values.quantidade}
                      onChange={(e) => {
                        handleChange(e);
                        const quantidade = parseFloat(e.target.value) || 0;
                        const precoUnitario = parseFloat(values.precoUnitario) || 0;
                        setFieldValue('total', quantidade * precoUnitario);
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.quantidade && errors.quantidade}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.quantidade}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Preço Unitário:</Form.Label>
                    <Form.Control
                      name="precoUnitario"
                      type="text"
                      value={formatCurrency(values.precoUnitario)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                      isInvalid={touched.precoUnitario && errors.precoUnitario}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.precoUnitario}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Total:</Form.Label>
                    <Form.Control
                      name="total"
                      type="text"
                      value={formatCurrency(values.total)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly
                      isInvalid={touched.total && errors.total}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.total}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Status:</Form.Label>
                    <Form.Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.status && errors.status}
                    >
                      <option value="">Selecione...</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.status}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <div className="text-center mt-3">
                  <Button type="submit" style={styles.submitButton}>
                    {pedidoId ? 'Editar' : 'Cadastrar'} Pedido
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </Container>
    </Pagina>
  ); 
}
const styles = {
  container: { 
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
  },
  submitButton: {
    display: 'block',
    margin: '0 auto',
    marginTop: '20px',
    padding: '10px 30px',
  },
};