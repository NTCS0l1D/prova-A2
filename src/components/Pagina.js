// components/CustomNavbar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

function CustomNavbar() {
  return (
    <Navbar expand="lg" style={navbarStyles.container} variant="dark">
      <Container>
        <Navbar.Brand href="/" style={navbarStyles.brand}>
          Apoio Microempreendedores
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/cliente" style={navbarStyles.link}>Cliente</Nav.Link>
            <Nav.Link href="/fornecedor" style={navbarStyles.link}>Fornecedor</Nav.Link>
            <Nav.Link href="/pedido" style={navbarStyles.link}>Pedido</Nav.Link>
            <Nav.Link href="/funcionario" style={navbarStyles.link}>Funcionário</Nav.Link>
            <Nav.Link href="/produto" style={navbarStyles.link}>Produto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const navbarStyles = {
  container: {
    backgroundColor: '#4a90e2',
    padding: '10px 0',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  link: {
    fontSize: '1.2rem',
    color: '#f8f9fa',
    margin: '0 10px',
  },
};

export default CustomNavbar;
