'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Pagina from '@/components/Pagina';

Chart.register(...registerables);

const Relatorio = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const graficoStatusRef = useRef(null);
  const graficoValoresRef = useRef(null);

  useEffect(() => {
    // Obter dados do localStorage
    const pedidosData = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const clientesData = JSON.parse(localStorage.getItem('clientes') || '[]');
    setPedidos(pedidosData);
    setClientes(clientesData);
  }, []);

  useEffect(() => {
    // Verificar se os dados foram carregados antes de configurar os gráficos
    if (pedidos.length > 0 && clientes.length > 0 && document.getElementById('graficoPedidosStatus') && document.getElementById('graficoPedidosValores')) {
      configurarGraficos();
    }

    // Cleanup: destrói os gráficos ao desmontar o componente ou ao atualizar dados
    return () => {
      if (graficoStatusRef.current) graficoStatusRef.current.destroy();
      if (graficoValoresRef.current) graficoValoresRef.current.destroy();
    };
  }, [pedidos, clientes]);

  const configurarGraficos = () => {
    configurarGraficoStatus();
    configurarGraficoValores();
  };

  const configurarGraficoStatus = () => {
    const ctxStatus = document.getElementById('graficoPedidosStatus').getContext('2d');

    if (graficoStatusRef.current) graficoStatusRef.current.destroy();

    const statusCount = pedidos.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {});

    graficoStatusRef.current = new Chart(ctxStatus, {
      type: 'bar',
      data: {
        labels: Object.keys(statusCount),
        datasets: [
          {
            label: 'Pedidos por Status',
            data: Object.values(statusCount),
            backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const configurarGraficoValores = () => {
    const ctxValores = document.getElementById('graficoPedidosValores').getContext('2d');

    if (graficoValoresRef.current) graficoValoresRef.current.destroy();

    const valorPorCliente = pedidos.reduce((acc, pedido) => {
      const cliente = clientes.find((c) => c.id === pedido.cliente)?.nome || 'Desconhecido';
      acc[cliente] = (acc[cliente] || 0) + pedido.total;
      return acc;
    }, {});

    graficoValoresRef.current = new Chart(ctxValores, {
      type: 'bar',
      data: {
        labels: Object.keys(valorPorCliente),
        datasets: [
          {
            label: 'Valor dos Pedidos por Cliente',
            data: Object.values(valorPorCliente),
            backgroundColor: '#ff9800',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const exportarPDF = () => {
    const doc = new jsPDF();

    // Adicionar título
    doc.text('Relatório de Pedidos', 14, 20);

    // Adicionar tabela
    const pedidosFormatados = pedidos.map((pedido) => [
      pedido.numeroPedido,
      clientes.find((cliente) => cliente.id === pedido.cliente)?.nome,
      pedido.status,
      pedido.total,
    ]);
    doc.autoTable({
      head: [['Número do Pedido', 'Cliente', 'Status', 'Total']],
      body: pedidosFormatados,
      startY: 30,
    });

    // Adicionar gráfico de pedidos por status
    const canvasStatus = document.getElementById('graficoPedidosStatus');
    const imgDataStatus = canvasStatus.toDataURL('image/png');
    doc.addImage(imgDataStatus, 'PNG', 15, doc.autoTable.previous.finalY + 10, 90, 60);

    // Adicionar gráfico de valores por cliente
    const canvasValores = document.getElementById('graficoPedidosValores');
    const imgDataValores = canvasValores.toDataURL('image/png');
    doc.addImage(imgDataValores, 'PNG', 105, doc.autoTable.previous.finalY + 10, 90, 60);

    // Exportar PDF
    doc.save('relatorio_pedidos.pdf');
  };

  return (
    <Pagina>
      <h2>Relatório de Pedidos</h2>
      
      {/* Tabela de Pedidos */}
      <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Número do Pedido</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.numeroPedido}</td>
              <td>{clientes.find((cliente) => cliente.id === pedido.cliente)?.nome}</td>
              <td>{pedido.status}</td>
              <td>{pedido.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráficos */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div style={{ width: '45%', height: '300px' }}>
          <canvas id="graficoPedidosStatus"></canvas>
        </div>
        <div style={{ width: '45%', height: '300px' }}>
          <canvas id="graficoPedidosValores"></canvas>
        </div>
      </div>

      {/* Botão para exportar PDF */}
      <button onClick={exportarPDF}>Exportar para PDF</button>
    </Pagina>
  );
};

export default Relatorio;
