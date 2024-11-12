'use client'

// Importa os módulos necessários para a funcionalidade do formulário
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Container, Button, Col, Form, Row, Card } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagina from '@/components/Pagina';

// Componente principal para o formulário de pedidos
export default function PedidoFormPage() {
  const router = useRouter(); // Hook para navegar entre as páginas
  const searchParams = useSearchParams(); // Hook para acessar parâmetros de busca na URL
  const pedidoId = searchParams ? searchParams.get('id') : null; // Obtém o ID do pedido, caso seja edição

  // Declaração dos estados locais para gerenciar os dados dos pedidos, produtos, clientes e funcionários
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

  // Hook para carregar dados do localStorage e o pedido específico (se for edição)
  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosSalvos);

    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);

    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientes(clientesSalvos);

    const funcionariosSalvos = JSON.parse(localStorage.getItem('funcionarios')) || [];
    setFuncionarios(funcionariosSalvos);

    // Se um pedidoId é fornecido, busca o pedido correspondente para edição
    if (pedidoId) {
      const pedidoExistente = pedidosSalvos.find(pedido => pedido.id === pedidoId);
      if (pedidoExistente) {
        setPedido(pedidoExistente);
      }
    }
  }, [pedidoId]);

  // Define o esquema de validação com Yup para os campos do formulário
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

  // Função para formatar valores monetários (exibe o valor com símbolo de moeda e separadores)
  function formatCurrency(value) {
    const numero = Number(value);
    return `R$ ${isNaN(numero) ? "0,00" : numero.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  }

  // Função para salvar um novo pedido ou atualizar um existente no localStorage
  function salvarPedido(dados) {
    let novosPedidos = [...pedidos];
    
    if (pedidoId) {
      // Atualiza o pedido existente caso seja uma edição
      novosPedidos = pedidos.map(pedido => 
        pedido.id === pedidoId ? { ...pedido, ...dados } : pedido
      );
    } else {
      // Adiciona um novo pedido caso não seja edição
      novosPedidos.push({ id: uuidv4(), ...dados });
    }

    localStorage.setItem('pedidos', JSON.stringify(novosPedidos)); // Salva no localStorage
    alert("Pedido salvo com sucesso!"); // Alerta de sucesso
    router.push("/pedido"); // Redireciona para a página de pedidos
  }

  return (
    <Pagina>
      {/* Layout principal da página */}
      <Container fluid style={styles.container}>
        <Card className="mx-auto" style={styles.card}>
          <h1 style={styles.title}>{pedidoId ? 'Editar' : 'Cadastrar'} Pedido</h1>
          {/* Formik para gerenciamento do formulário com validação e estado inicial */}
          <Formik
            initialValues={pedido}
            validationSchema={validationSchema}
            onSubmit={salvarPedido}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                {/* Campos de entrada do formulário para cada propriedade do pedido */}
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

                {/* Outros campos semelhantes, incluindo Produto e Quantidade, com cálculo automático do total */}
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

                {/* Campo de quantidade com atualização automática do total baseado na quantidade e preço unitário */}
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

                {/* Campo de total com valor calculado automaticamente */}
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
                      <option value="Concluído">Concluído</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Em Andamento">Em Andamento</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.status}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* Botão para submeter o formulário */}
                <div className="text-center mt-3">
                  <Button variant="primary" type="submit">
                    {pedidoId ? 'Atualizar' : 'Salvar'}
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

// Estilos personalizados aplicados diretamente no componente
const styles = {
  container: {
    backgroundColor: '#d1e7dd', // Define o fundo da página como verde claro
    padding: '20px'
  },
  card: {
    padding: '20px',
    backgroundColor: '#f7f7f7', // Define o fundo do card como cinza claro
    maxWidth: '600px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  }
};
