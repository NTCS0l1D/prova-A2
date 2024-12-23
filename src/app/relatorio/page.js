// Ativa o modo client-side do Next.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Pagina from '@/components/Pagina';

// Registra todos os componentes necessários do Chart.js
Chart.register(...registerables);

const Relatorio = () => {
  // Estados para armazenar dados de pedidos e clientes
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  // Refs para armazenar as instâncias dos gráficos
  const graficoStatusRef = useRef(null);
  const graficoValoresRef = useRef(null);

  // useEffect para carregar dados do localStorage quando o componente é montado
  useEffect(() => {
    const pedidosData = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const clientesData = JSON.parse(localStorage.getItem('clientes') || '[]');
    setPedidos(pedidosData);
    setClientes(clientesData);
  }, []);

  // useEffect para configurar gráficos ao detectar mudanças em pedidos ou clientes
  useEffect(() => {
    if (
      pedidos.length > 0 &&
      clientes.length > 0 &&
      document.getElementById('graficoPedidosStatus') &&
      document.getElementById('graficoPedidosValores')
    ) {
      configurarGraficos();
    }

    // Limpeza: destrói gráficos antigos antes de recriar ao desmontar componente
    return () => {
      if (graficoStatusRef.current) graficoStatusRef.current.destroy();
      if (graficoValoresRef.current) graficoValoresRef.current.destroy();
    };
  }, [pedidos, clientes]);

  // Configuração de gráficos: chama funções de configuração de cada gráfico
  const configurarGraficos = () => {
    configurarGraficoStatus();
    configurarGraficoValores();
  };

  // Função para configurar o gráfico de status dos pedidos
  const configurarGraficoStatus = () => {
    const ctxStatus = document.getElementById('graficoPedidosStatus').getContext('2d');

    if (graficoStatusRef.current) graficoStatusRef.current.destroy();

    // Conta quantos pedidos existem em cada status
    const statusCount = pedidos.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {});

    // Cria gráfico de barras com a contagem de status
    graficoStatusRef.current = new Chart(ctxStatus, {
      type: 'bar',
      data: {
        labels: Object.keys(statusCount),
        datasets: [
          {
            label: 'Pedidos por Status',
            data: Object.values(statusCount),
            backgroundColor: ['#4caf50', '#f44336', '#2196f3'], // cores para cada status
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  // Função para configurar o gráfico de valores dos pedidos por cliente
  const configurarGraficoValores = () => {
    const ctxValores = document.getElementById('graficoPedidosValores').getContext('2d');

    if (graficoValoresRef.current) graficoValoresRef.current.destroy();

    // Calcula o valor total dos pedidos de cada cliente
    const valorPorCliente = pedidos.reduce((acc, pedido) => {
      const cliente = clientes.find((c) => c.id === pedido.cliente)?.nome || 'Desconhecido';
      acc[cliente] = (acc[cliente] || 0) + pedido.total;
      return acc;
    }, {});

    // Cria gráfico de barras com os valores totais por cliente
    graficoValoresRef.current = new Chart(ctxValores, {
      type: 'bar',
      data: {
        labels: Object.keys(valorPorCliente),
        datasets: [
          {
            label: 'Valor dos Pedidos por Cliente',
            data: Object.values(valorPorCliente),
            backgroundColor: '#ff9800', // cor das barras
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  // Função para exportar os dados e gráficos em um PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Pedidos', 14, 20);

    // Formata os dados dos pedidos para a tabela do PDF
    const pedidosFormatados = pedidos.map((pedido) => [
      pedido.numeroPedido,
      clientes.find((cliente) => cliente.id === pedido.cliente)?.nome,
      pedido.status,
      pedido.total,
    ]);

    // Adiciona a tabela ao PDF
    doc.autoTable({
      head: [['Número do Pedido', 'Cliente', 'Status', 'Total']],
      body: pedidosFormatados,
      startY: 30,
    });

    // Converte gráficos para imagens e adiciona ao PDF
    const canvasStatus = document.getElementById('graficoPedidosStatus');
    const imgDataStatus = canvasStatus.toDataURL('image/png');
    doc.addImage(imgDataStatus, 'PNG', 15, doc.autoTable.previous.finalY + 10, 90, 60);

    const canvasValores = document.getElementById('graficoPedidosValores');
    const imgDataValores = canvasValores.toDataURL('image/png');
    doc.addImage(imgDataValores, 'PNG', 105, doc.autoTable.previous.finalY + 10, 90, 60);

    doc.save('relatorio_pedidos.pdf');
  };

  // useEffect para aplicar estilos personalizados
  useEffect(() => {
    // Estiliza título
    const titulo = document.querySelector('h1');
    titulo.style.textAlign = 'center';
    titulo.style.color = '#333';

    // Estiliza a tabela de pedidos
    const tabela = document.querySelector('table');
    tabela.style.width = '100%';
    tabela.style.borderCollapse = 'collapse';
    tabela.style.border = '1px solid #ddd';

    const cabecalhoTabela = document.querySelector('table thead tr');
    cabecalhoTabela.style.backgroundColor = '#3f51b5';
    cabecalhoTabela.style.color = '#fff';

    // Aplica estilo em cada linha da tabela
    const linhasTabela = document.querySelectorAll('table tbody tr');
    linhasTabela.forEach((linha, index) => {
      linha.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
    });

    // Estiliza gráficos
    const graficos = document.querySelectorAll('canvas');
    graficos.forEach((grafico) => {
      const graficoContainer = grafico.parentNode;
      graficoContainer.style.width = '48%';
      graficoContainer.style.height = '320px';
      graficoContainer.style.border = '1px solid #d0d0d0';
    });

    // Estiliza botão de exportação
    const botaoExportar = document.querySelector('.exportar-btn');
    if (botaoExportar) {
      botaoExportar.style.display = 'block';
      botaoExportar.style.backgroundColor = '#ff6347';
      botaoExportar.style.margin = '0 auto'; // Centraliza em relação ao contêiner pai
      botaoExportar.style.textAlign = 'center';
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

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px', marginBottom: '20px' }}>
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
