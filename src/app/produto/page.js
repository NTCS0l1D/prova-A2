'use client'


import Pagina from '@/components/Pagina'
import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa'

export default function ProfessoresPage() {

  const [professores, setProfessores] = useState([])

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const professoresLocalStorage = JSON.parse(localStorage.getItem("professores")) || []
    // guarda a lista no estado
    setProfessores(professoresLocalStorage)
    console.log(professoresLocalStorage)
  }, [])

  // Função para exclusão do item
  function excluir(professor) {
    // Confirma com o usuário a exclusão
    if (window.confirm(`Deseja realmente excluir o professor ${professor.nome}?`)) {
      // filtra a lista antiga removando o professor recebido
      const novaLista = professores.filter(item => item.id !== professor.id)
      // grava no localStorage a nova lista
      localStorage.setItem('professores', JSON.stringify(novaLista))
      // grava a nova lista no estado para renderizar na tela
      setProfessores(novaLista)
      alert("Professor excluído com sucesso!")
    }
  }


  return (
    <Pagina titulo={"Lista de Professores"}>
      <div className='text-end mb-2'>
        <Button href='/professores/form'><FaPlusCircle /> Novo</Button>
      </div>

      {/* Tabela com os Professores */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matricula</th>
            <th>Status</th>
            <th>Curso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {professores.map(professor => {
            return (
              <tr>
                <td>{professor.nome}</td>
                <td>{professor.matricula}</td>
                <td>{professor.status}</td>
                <td>{professor.curso}</td>
                <td className='text-center'>
                  {/* Botões das ações */}
                  <Button className='me-2' href={`/professores/form?id=${professor.id}`}><FaPen /></Button>
                  <Button variant='danger' onClick={() => excluir(professor)}><FaTrash /></Button>

                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>



    </Pagina>
  )
}
