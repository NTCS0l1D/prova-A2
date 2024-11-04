// src/app/page.js
'use client';

import { Button, Card, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Pagina from '../components/Pagina';  // Importando a navbar renomeada

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
    {
      nome: "Clientes",
      imagem: "/img/cliente.png",
      quantidade: clientes.length,
      link: "/clientes"
    },
    {
      nome: "Fornecedores",
      imagem: "/img/fornecedor.png",
      quantidade: fornecedores.length,
      link: "/fornecedores"
    },
    {
      nome: "Pedidos",
      imagem: "/img/pedido.png",
      quantidade: pedidos.length,
      link: "/pedidos"
    },
    {
      nome: "Funcionários",
      imagem: "/img/funcionario.png",
      quantidade: funcionarios.length,
      link: "/funcionarios"
    },
    {
      nome: "Produtos",
      imagem: "/img/produto.png",
      quantidade: produtos.length,
      link: "/produtos"
    },
  ];

  return (
    <>
      <Pagina /> {/* Renderizando a Navbar */}
      <Row md={4}>
        {lista.map((item, index) => (
          <Col className='py-2' key={index}>
            <Card style={{ height: '100%' }}>
              <Card.Img src={item.imagem} style={{ height: '200px', objectFit: 'contain' }} />
              <Card.Body>
                <Card.Title>{item.nome}</Card.Title>
                Cadastrados: {item.quantidade}
              </Card.Body>
              <Card.Footer className='text-end'>
                <Button href={item.link}>Ver Lista</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );  
}
