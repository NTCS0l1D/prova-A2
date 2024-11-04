'use client'

import Pagina from '@/components/Pagina'
import { Table, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaEdit, FaTrash } from "react-icons/fa"

export default function ListaAlunosPage() {
  const router = useRouter()
  const [alunos, setAlunos] = useState([])

  useEffect(() => {
    const alunosSalvos = JSON.parse(localStorage.getItem('alunos')) || []
    setAlunos(alunosSalvos)
  }, [])

  const editarAluno = (id) => {
    router.push(`/alunos/form?id=${id}`)
  }

  const excluirAluno = (id) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      const alunosAtualizados = alunos.filter(aluno => aluno.id !== id)
      setAlunos(alunosAtualizados)
      localStorage.setItem('alunos', JSON.stringify(alunosAtualizados))
    }
  }

  return (
    <Pagina titulo="Lista de Alunos">
      <Button variant="primary" className="mb-3" href="/alunos/form">Novo Aluno</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Data de Nascimento</th>
            <th>Telefone</th>
            <th>Faculdade</th>
            <th>Curso</th>
            <th>Período</th>
            <th>Matrícula</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.sobrenome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.dataNascimento}</td>
              <td>{aluno.telefone}</td>
              <td>{aluno.faculdade}</td>
              <td>{aluno.curso}</td>
              <td>{aluno.periodo}</td>
              <td>{aluno.matricula}</td>
              <td>
                {aluno.foto ? <img src={aluno.foto} alt="Foto do Aluno" width="50" /> : "Sem Foto"}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => editarAluno(aluno.id)}>
                  <FaEdit /> Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => excluirAluno(aluno.id)}>
                  <FaTrash /> Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Pagina>
  )
}

