'use client';

import dynamic from 'next/dynamic';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const Pagina = dynamic(() => import('@/components/Pagina'), { ssr: false });

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
      imagem: "https://i.pinimg.com/236x/12/3a/9d/123a9d09db3b7f488f5f54c3ae1f7a5c.jpg",
      quantidade: clientes.length,
      link: "/clientes"
    },
    {
      nome: "Fornecedores",
      imagem: "https://i.pinimg.com/474x/2f/3e/1e/2f3e1ec292f443d5e91ed3e6b9c5babc.jpg",
      quantidade: fornecedores.length,
      link: "/fornecedores"
    },
    {
      nome: "Pedidos",
      imagem: "https://i.pinimg.com/736x/4b/58/72/4b5872b3bb8156e0d9f0b4b2eb15f25d.jpg",
      quantidade: pedidos.length,
      link: "/pedidos"
    },
    {
      nome: "Funcionários",
      imagem: "https://i.pinimg.com/236x/15/67/3f/15673f1ff48d5d282f71f38c3ab9cf1a.jpg",
      quantidade: funcionarios.length,
      link: "/funcionarios"
    },
    {
      nome: "Produtos",
      imagem: "https://i.pinimg.com/236x/1b/5c/6f/1b5c6f3c6adf528f4a9d8b7b6f7bcb4b.jpg",
      quantidade: produtos.length,
      link: "/produtos"
    },
  ];

  return (
    <>
      <h3>Bem-vindo</h3>
      <Row md={4}>
        {lista.map((item, index) => (
          <Col className='py-2' key={index}>
            <Card style={{ height: '100%' }}>
              <Card.Img src={item.imagem} style={{ height: '200px', objectFit: 'cover' }} />
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
