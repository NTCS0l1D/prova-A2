// src/app/page.js
'use client';

import { Button, Card, Col, Row, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Pagina from '../components/Pagina';

export default function HomePage() {
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientes(JSON.parse(localStorage.getItem("clientes")) || []);
      setFornecedores(JSON.parse(localStorage.getItem("fornecedores")) || []);
      setPedidos(JSON.parse(localStorage.getItem("pedidos")) || []);
      setFuncionarios(JSON.parse(localStorage.getItem("funcionarios")) || []);
      setProdutos(JSON.parse(localStorage.getItem("produtos")) || []);
    }
  }, []);

  const lista = [
    { nome: "Clientes", imagem: "/img/cliente.png", quantidade: clientes.length, link: "/cliente" },
    { nome: "Fornecedores", imagem: "/img/fornecedor.png", quantidade: fornecedores.length, link: "/fornecedor" },
    { nome: "Pedidos", imagem: "/img/pedido.png", quantidade: pedidos.length, link: "/pedido" },
    { nome: "Funcionários", imagem: "/img/funcionario.png", quantidade: funcionarios.length, link: "/funcionario" },
    { nome: "Produtos", imagem: "/img/produto.png", quantidade: produtos.length, link: "/produto" },
    { nome: "Relatório", imagem: "/img/relatorio.png", quantidade: "", link: "/relatorio" }
  ];

  return (
    <Pagina>
      <Container fluid style={styles.container}>
        <Row className="justify-content-center gx-2 gy-3" style={styles.row}>
          {lista.map((item, index) => (
            <Col md={4} lg={3} className='py-3' key={index}>
              <Card 
                style={styles.card} 
                onMouseEnter={(e) => e.currentTarget.style = {...styles.card, ...styles.cardHover}}
                onMouseLeave={(e) => e.currentTarget.style = styles.card}
              >
                <Card.Img src={item.imagem} style={styles.cardImage} />
                <Card.Body>
                  <Card.Title style={styles.cardTitle}>{item.nome}</Card.Title>
                  {item.quantidade && (
                    <div style={styles.quantity}>Cadastrados: {item.quantidade}</div>
                  )}
                </Card.Body>
                <Card.Footer className='text-end' style={styles.cardFooter}>
                  <Button 
                    href={item.link} 
                    style={styles.button}
                    onMouseEnter={(e) => e.currentTarget.style = {...styles.button, ...styles.buttonHover}}
                    onMouseLeave={(e) => e.currentTarget.style = styles.button}
                  >
                    Ver Lista
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Pagina>
  );
}

// Estilos CSS em JS para a página
const styles = {
  container: {
    backgroundColor: '#f4f6f8', // Cor de fundo suave em azul claro
    paddingTop: '20px',
    paddingBottom: '40px',
    minHeight: '100vh', // Ocupa toda a altura da tela
  },
  row: {
    gap: '10px',
  },
  card: {
    height: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  cardImage: {
    height: '180px',
    objectFit: 'contain',
    backgroundColor: '#f8f9fa',
    padding: '15px',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40',
  },
  quantity: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#6c757d',
    marginTop: '5px',
  },
  cardFooter: {
    backgroundColor: '#f1f1f1',
  },
  button: {
    backgroundColor: '#4a90e2',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '8px 16px',
  },
};
