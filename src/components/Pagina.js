// src/components/Pagina.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Pagina({ children }) {
  return (
    <div>
      <Navbar expand="lg" style={navbarStyles.container} variant="dark">
        <Container>
          <Navbar.Brand href="/" style={navbarStyles.brand}>
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/cliente" style={navbarStyles.link}>Cliente</Nav.Link>
              <Nav.Link href="/fornecedor" style={navbarStyles.link}>Fornecedor</Nav.Link>
              <Nav.Link href="/pedido" style={navbarStyles.link}>Pedido</Nav.Link>
              <Nav.Link href="/funcionario" style={navbarStyles.link}>Funcionário</Nav.Link>
              <Nav.Link href="/produto" style={navbarStyles.link}>Produto</Nav.Link>
              <Nav.Link href="/relatorio" style={navbarStyles.link}>Relatório</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid style={{ padding: '20px', marginTop: '0px' }}>
        {children}
      </Container>
    </div>
  );
}

const navbarStyles = {
  container: {
    backgroundColor: '#2c3e50', // Cor mais escura e elegante
    padding: '10px 0',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.6rem',
    color: '#ecf0f1', // Cor mais clara para contraste
    letterSpacing: '1px', // Melhor espaçamento
  },
  link: {
    fontSize: '1.1rem',
    color: '#ecf0f1',
    margin: '0 12px',
    transition: 'color 0.3s ease', // Transição suave
  },
};

// Aplicar estilos adicionais no link ao passar o mouse
navbarStyles.linkHover = {
  color: '#e74c3c', // Vermelho suave ao passar o mouse
};

export default Pagina;
