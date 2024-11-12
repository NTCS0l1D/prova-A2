// src/app/page.js
'use client';

import { Button, Card, Col, Row, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Pagina from '../components/Pagina';

// Componente principal da página inicial
export default function HomePage() {
  // Definindo estados para armazenar dados de clientes, fornecedores, pedidos, funcionários e produtos
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [produtos, setProdutos] = useState([]);

  // useEffect para carregar dados do localStorage quando a página é carregada
  useEffect(() => {
    if (typeof window !== 'undefined') { // Verificação para garantir que está no ambiente do navegador
      setClientes(JSON.parse(localStorage.getItem("clientes")) || []);
      setFornecedores(JSON.parse(localStorage.getItem("fornecedores")) || []);
      setPedidos(JSON.parse(localStorage.getItem("pedidos")) || []);
      setFuncionarios(JSON.parse(localStorage.getItem("funcionarios")) || []);
      setProdutos(JSON.parse(localStorage.getItem("produtos")) || []);
    }
  }, []);

  // Array contendo as informações principais de cada categoria para exibir como cards na tela
  const lista = [
    { nome: "Clientes", imagem: "/img/cliente.png", quantidade: clientes.length, link: "/cliente" },
    { nome: "Fornecedores", imagem: "/img/fornecedor.png", quantidade: fornecedores.length, link: "/fornecedor" },
    { nome: "Pedidos", imagem: "/img/pedido.png", quantidade: pedidos.length, link: "/pedido" },
    { nome: "Funcionários", imagem: "/img/funcionario.png", quantidade: funcionarios.length, link: "/funcionario" },
    { nome: "Produtos", imagem: "/img/produto.png", quantidade: produtos.length, link: "/produto" },
    { nome: "Relatório", imagem: "/img/relatorio.png", quantidade: "", link: "/relatorio" }
  ];

  return (
    // Componente Pagina que envolve a barra de navegação e o conteúdo principal
    <Pagina>
      <Container fluid style={styles.container}>
        {/* Renderização dos cards com informações */}
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

// Estilos CSS em JS para a página e elementos visuais
const styles = {
  container: {
    backgroundColor: '#f4f6f8', // Cor de fundo da página
    paddingTop: '20px',
    paddingBottom: '40px',
    minHeight: '100vh', // Altura mínima para ocupar a tela inteira
  },
  row: {
    gap: '10px', // Espaçamento entre os cards
  },
  card: {
    height: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave para os cards
    borderRadius: '10px', // Bordas arredondadas nos cards
    overflow: 'hidden',
    transition: 'transform 0.2s', // Transição suave ao passar o mouse sobre o card
  },
  cardImage: {
    height: '180px',
    objectFit: 'contain',
    backgroundColor: '#f8f9fa',
    padding: '15px', // Espaçamento interno ao redor da imagem
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40', // Cor do título do card
  },
  quantity: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#6c757d',
    marginTop: '5px', // Espaçamento superior
  },
  cardFooter: {
    backgroundColor: '#f1f1f1', // Cor de fundo do rodapé do card
  },
  button: {
    backgroundColor: '#4a90e2', // Cor do botão
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '8px 16px',
  },
};
