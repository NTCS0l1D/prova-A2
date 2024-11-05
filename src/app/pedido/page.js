// src/app/pedidos/list/page.js
'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagina from '@/components/Pagina';

export default function PedidosListPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Carrega pedidos do localStorage ao montar o componente
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosSalvos);
  }, []);

  // Função para deletar um pedido
  const deletarPedido = (id) => {
    const novosPedidos = pedidos.filter(pedido => pedido.id !== id);
    setPedidos(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
  };

  // Função para redirecionar para a página de edição com os dados do pedido
  const editarPedido = (id) => {
    router.push(`/pedido/form/${id}`);
  };

  return (
    <div>
      <Pagina />
      <h1>Lista de Pedidos</h1>
      <Button variant="primary" onClick={() => router.push('/pedido/form')}>Novo Pedido</Button>
      
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th>Número do Pedido</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.numeroPedido}</td>
                 <td>{pedido.cliente}</td> 
                 <td>{new Date(pedido.dataPedido).toLocaleDateString()}</td> 
                 <td>{pedido.produto}</td> 
                 <td>{pedido.quantidade}</td> 
                 <td>{pedido.precoUnitario.toFixed(2)}</td> 
                 <td>{pedido.total.toFixed(2)}</td> 
                 <td>{pedido.status}</td> 
                 <td>
                 <Button variant="warning" onClick={() => editarPedido(pedido.id)}> 
                    <FaEdit /> {/* Ícone de editar */} 
                </Button> 

                <Button variant="danger" onClick={() => deletarPedido(pedido.id)}> 
                    <FaTrash /> {/* Ícone de deletar */} 
                </Button> 
                </td> 
                </tr> 
                ))
             ) : ( 
             <tr> 
                <td colSpan="9" className="text-center">Nenhum pedido cadastrado</td> 
            </tr> 
            )} 
            </tbody>
        </Table>
    </div> 
    );
 }
