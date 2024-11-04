'use client'


import Pagina from '@/components/Pagina'
import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FaPen, FaPlusCircle, FaTrash } from 'react-icons/fa'

export default function FaculdadesPage() {

  const [faculdades, setFaculdades] = useState([])

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const faculdadesLocalStorage = JSON.parse(localStorage.getItem("faculdades")) || []
    // guarda a lista no estado faculdades
    setFaculdades(faculdadesLocalStorage)
    console.log(faculdadesLocalStorage)
  }, [])

  // Função para exclusão do item
  function excluir(faculdade) {
    // Confirma com o usuário a exclusão
    if (window.confirm(`Deseja realmente excluir a faculdade ${faculdade.nome}?`)) {
      // filtra a lista antiga removando a faculdade recebida
      const novaLista = faculdades.filter(item => item.id !== faculdade.id)
      // grava no localStorage a nova lista
      localStorage.setItem('faculdades', JSON.stringify(novaLista))
      // grava a nova lista no estado para renderizar na tela
      setFaculdades(novaLista)
      alert("Faculdade excluída com sucesso!")
    }
  }


  return (
    <Pagina titulo={"Lista de Faculdades"}>
      <div className='text-end mb-2'>
        <Button href='/faculdades/form'><FaPlusCircle /> Novo</Button>
      </div>

      {/* Tabela com as faculdades */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>País</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {faculdades.map(faculdade => {
            return (
              <tr>
                <td>{faculdade.nome}</td>
                <td>{faculdade.endereco}</td>
                <td>{faculdade.pais}</td>
                <td>{faculdade.estado}</td>
                <td>{faculdade.cidade}</td>
                <td className='text-center'>
                  {/* Botões das ações */}
                  <Button className='me-2' href={`/faculdades/form?id=${faculdade.id}`}><FaPen /></Button>
                  <Button variant='danger' onClick={() => excluir(faculdade)}><FaTrash /></Button>

                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>



    </Pagina>
  )
}
