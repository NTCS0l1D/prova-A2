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
    if (
      pedidos.length > 0 &&
      clientes.length > 0 &&
      document.getElementById('graficoPedidosStatus') &&
      document.getElementById('graficoPedidosValores')
    ) {
      configurarGraficos();
    }

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
    doc.text('Relatório de Pedidos', 14, 20);

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

    const canvasStatus = document.getElementById('graficoPedidosStatus');
    const imgDataStatus = canvasStatus.toDataURL('image/png');
    doc.addImage(imgDataStatus, 'PNG', 15, doc.autoTable.previous.finalY + 10, 90, 60);

    const canvasValores = document.getElementById('graficoPedidosValores');
    const imgDataValores = canvasValores.toDataURL('image/png');
    doc.addImage(imgDataValores, 'PNG', 105, doc.autoTable.previous.finalY + 10, 90, 60);

    doc.save('relatorio_pedidos.pdf');
  };

  useEffect(() => {
    // Estilos para o título
    const titulo = document.querySelector('h1');
    titulo.style.textAlign = 'center';
    titulo.style.color = '#333';
    titulo.style.marginBottom = '20px';
    titulo.style.fontFamily = 'Arial, sans-serif';

    // Estilos para a tabela
    const tabela = document.querySelector('table');
    tabela.style.width = '100%';
    tabela.style.marginBottom = '20px';
    tabela.style.borderCollapse = 'collapse';
    tabela.style.fontFamily = 'Arial, sans-serif';
    tabela.style.fontSize = '14px';
    tabela.style.textAlign = 'left';
    tabela.style.border = '1px solid #ddd';
    tabela.style.borderRadius = '8px';
    tabela.style.overflow = 'hidden';
    tabela.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';

    const cabecalhoTabela = document.querySelector('table thead tr');
    cabecalhoTabela.style.backgroundColor = '#3f51b5';
    cabecalhoTabela.style.color = '#fff';

    // Estilos para cada linha da tabela
    const linhasTabela = document.querySelectorAll('table tbody tr');
    linhasTabela.forEach((linha, index) => {
      linha.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
    });

    // Estilos para os gráficos
    const graficos = document.querySelectorAll('canvas');
    graficos.forEach((grafico) => {
      const graficoContainer = grafico.parentNode;
      
      graficoContainer.style.width = '48%';
      graficoContainer.style.height = '320px';
      graficoContainer.style.display = 'flex';
      graficoContainer.style.alignItems = 'center';
      graficoContainer.style.justifyContent = 'center';
      graficoContainer.style.border = '1px solid #d0d0d0';
      graficoContainer.style.borderRadius = '12px';
      graficoContainer.style.boxShadow = '0px 6px 14px rgba(0, 0, 0, 0.1)';
      graficoContainer.style.padding = '20px';
    });

    // Estilos para o botão de exportação
    const botaoExportar = document.querySelector('.exportar-btn');
    if (botaoExportar) {
      botaoExportar.style.display = 'block';
      botaoExportar.style.margin = '20px auto';
      botaoExportar.style.padding = '12px 24px';
      botaoExportar.style.fontSize = '16px';
      botaoExportar.style.color = '#fff';
      botaoExportar.style.backgroundColor = '#4caf50';
      botaoExportar.style.border = 'none';
      botaoExportar.style.borderRadius = '8px';
      botaoExportar.style.cursor = 'pointer';
      botaoExportar.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
      botaoExportar.style.fontFamily = 'Arial, sans-serif';

      botaoExportar.onmouseover = () => (botaoExportar.style.backgroundColor = '#45a049');
      botaoExportar.onmouseout = () => (botaoExportar.style.backgroundColor = '#4caf50');
    }
  }, []);

  return (
    <Pagina>
      <h1>Relatório de Pedidos</h1>

      <table border="1" cellPadding="10">
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

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div className="grafico-container">
          <canvas id="graficoPedidosStatus"></canvas>
        </div>
        <div className="grafico-container">
          <canvas id="graficoPedidosValores"></canvas>
        </div>
      </div>

      <button className="exportar-btn" onClick={exportarPDF}>
        Exportar PDF
      </button>
    </Pagina>
  );
};

export default Relatorio;
