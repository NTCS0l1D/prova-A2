'use client';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagina from '@/components/Pagina';

export default function PedidoFormPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]); // Adicionado estado para clientes
  const [funcionarios, setFuncionarios] = useState([]); // Adicionado estado para funcionários

  useEffect(() => {
    // Carrega pedidos do localStorage ao montar o componente
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosSalvos);
    
    // Carrega produtos (simulação de dados ou fetch de API)
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);

    // Carrega clientes do localStorage
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    // Carrega funcionários do localStorage
    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);
  }, []);

  const initialValues = {
    numeroPedido: '',
    cliente: '',
    funcionario: '', // Alterado para funcionário
    dataPedido: '',  // Removido, pois foi substituído por funcionário
    produto: '',
    quantidade: '',
    precoUnitario: '',
    total: '',
    status: ''
  };

  const validationSchema = Yup.object().shape({
    numeroPedido: Yup.string().required("Campo obrigatório"),
    cliente: Yup.string().required("Campo obrigatório"),
    funcionario: Yup.string().required("Campo obrigatório"), // Alterado para funcionário
    produto: Yup.string().required("Campo obrigatório"),
    quantidade: Yup.number().required("Campo obrigatório").positive().integer(),
    precoUnitario: Yup.number().required("Campo obrigatório").positive(),
    total: Yup.number().required("Campo obrigatório").positive(),
    status: Yup.string().required("Campo obrigatório")
  });

  function salvarPedido(dados) {
    const novosPedidos = [...pedidos, { ...dados, id: uuidv4() }];
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
    alert("Pedido cadastrado com sucesso!");
    router.push("/pedido"); // Navega para a lista de pedidos
  }

  return (
    <div>
      <Pagina />
      <h1>Cadastro de Pedido</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={salvarPedido}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
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
                    // Encontra o produto selecionado
                    const produtoSelecionado = produtos.find(produto => produto.id === e.target.value);
                    // Atualiza o preço unitário com o valor do produto selecionado
                    if (produtoSelecionado) {
                      handleChange({ target: { name: 'precoUnitario', value: produtoSelecionado.precoUnitario } });
                    }
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.produto && errors.produto}
                >
                  <option value="">Selecione...</option>
                  {produtos.map(produto => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nomeProduto} {/* Exibe o nome do produto */}
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
                  onChange={e => {
                    handleChange(e);
                    // Calcula o total automaticamente
                    const total = e.target.value * values.precoUnitario;
                    handleChange({ target: { name: 'total', value: total } });
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.quantidade && errors.quantidade}
                />
                <Form.Control.Feedback type='invalid'>{errors.quantidade}</Form.Control.Feedback>
              </Form.Group>

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
            </Row>

            <Row className='mb-2'>
              <Form.Group as={Col}>
                <Form.Label>Total:</Form.Label>
                <Form.Control
                  name='total'
                  type='number'
                  step="0.01"
                  value={values.total}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.total && errors.total}
                />
                <Form.Control.Feedback type='invalid'>{errors.total}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Status do Pedido:</Form.Label>
                <Form.Select
                  name='status'
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.status && errors.status}
                >
                  <option value="">Selecione...</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Processando">Processando</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Concluído">Concluído</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.status}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" className='mt-3'>Salvar</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
