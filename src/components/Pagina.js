// src/components/Pagina.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

// Componente Pagina para renderizar a barra de navegação e conteúdo principal
function Pagina({ children }) {
  return (
    <div>
      {/* Barra de navegação principal */}
      <Navbar expand="lg" style={navbarStyles.container} variant="dark">
        <Container>
          {/* Link da marca/nome da aplicação na barra de navegação */}
          <Navbar.Brand href="/" style={navbarStyles.brand}>
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Links de navegação para as páginas do site */}
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

      {/* Container para o conteúdo principal da página */}
      <Container fluid style={{ padding: '20px', marginTop: '0px' }}>
        {children}
      </Container>
    </div>
  );
}

// Estilos para os elementos da barra de navegação
const navbarStyles = {
  container: {
    backgroundColor: '#2c3e50', // Cor escura para a barra de navegação
    padding: '10px 0',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.6rem',
    color: '#ecf0f1', // Cor clara para contraste com o fundo escuro
    letterSpacing: '1px',
  },
  link: {
    fontSize: '1.1rem',
    color: '#ecf0f1',
    margin: '0 12px',
    transition: 'color 0.3s ease', // Transição de cor suave para o hover
  },
  linkHover: {
    color: '#e74c3c', // Cor de destaque ao passar o mouse sobre os links
  },
};

export default Pagina;
