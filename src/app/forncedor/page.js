'use client'


import Pagina from '@/components/Pagina'
import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa'

export default function CursosPage() {

  const [cursos, setCursos] = useState([])

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const cursosLocalStorage = JSON.parse(localStorage.getItem("cursos")) || []
    // guarda a lista no estado faculdades
    setCursos(cursosLocalStorage)
    console.log(cursosLocalStorage)
  }, [])

  // Função para exclusão do item
  function excluir(curso) {
    // Confirma com o usuário a exclusão
    if (window.confirm(`Deseja realmente excluir o curso ${curso.nome}?`)) {
      // filtra a lista antiga removando o curso recebido
      const novaLista = cursos.filter(item => item.id !== curso.id)
      // grava no localStorage a nova lista
      localStorage.setItem('cursos', JSON.stringify(novaLista))
      // grava a nova lista no estado para renderizar na tela
      setCursos(novaLista)
      alert("Curso excluído com sucesso!")
    }
  }


  return (
    <Pagina titulo={"Lista de Cursos"}>
      <div className='text-end mb-2'>
        <Button href='/cursos/form'><FaPlusCircle /> Novo</Button>
      </div>

      {/* Tabela com os Cursos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Area</th>
            <th>Nota</th>
            <th>Status</th>
            <th>Faculdade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => {
            return (
              <tr>
                <td>{curso.nome}</td>
                <td>{curso.area}</td>
                <td>{curso.nota}</td>
                <td>{curso.status}</td>
                <td>{curso.faculdade}</td>
                <td className='text-center'>
                  {/* Botões das ações */}
                  <Button className='me-2' href={`/cursos/form?id=${curso.id}`}><FaPen /></Button>
                  <Button variant='danger' onClick={() => excluir(curso)}><FaTrash /></Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>



    </Pagina>
  )
}
