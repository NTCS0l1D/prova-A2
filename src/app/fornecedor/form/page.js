'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Button } from 'react-bootstrap';
import Pagina from '@/components/Pagina';

export default function FornecedorFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fornecedorId = searchParams.get('id');

  const [fornecedor, setFornecedor] = useState({
    empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    categoria: '',
    prazoEntrega: '',
  });

  useEffect(() => {
    if (fornecedorId) {
      const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];
      const fornecedorExistente = fornecedoresSalvos.find(f => f.id === fornecedorId);
      if (fornecedorExistente) setFornecedor(fornecedorExistente);
    }
  }, [fornecedorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fornecedoresSalvos = JSON.parse(localStorage.getItem('fornecedores')) || [];

    if (fornecedorId) {
      const index = fornecedoresSalvos.findIndex(f => f.id === fornecedorId);
      fornecedoresSalvos[index] = fornecedor;
    } else {
      fornecedor.id = Date.now().toString();
      fornecedoresSalvos.push(fornecedor);
    }

    localStorage.setItem('fornecedores', JSON.stringify(fornecedoresSalvos));
    router.push('/fornecedor');
  };

  return (
    <Pagina>
      <h1>{fornecedorId ? 'Editar' : 'Novo'} Fornecedor</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome da Empresa</Form.Label>
          <Form.Control
            type="text"
            name="empresa"
            value={fornecedor.empresa}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>CNPJ</Form.Label>
          <Form.Control
            type="text"
            name="cnpj"
            value={fornecedor.cnpj}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={fornecedor.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="telefone"
            value={fornecedor.telefone}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cidade</Form.Label>
          <Form.Control
            type="text"
            name="cidade"
            value={fornecedor.cidade}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            name="estado"
            value={fornecedor.estado}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            name="categoria"
            value={fornecedor.categoria}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Prazo de Entrega (em dias)</Form.Label>
          <Form.Control
            type="number"
            name="prazoEntrega"
            value={fornecedor.prazoEntrega}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Salvar
        </Button>
      </Form>
    </Pagina>
  );
}
