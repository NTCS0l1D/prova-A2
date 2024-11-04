'use client'

import Pagina from '@/components/Pagina'
import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FaArrowLeft, FaCheck } from "react-icons/fa"
import { v4 } from 'uuid'
import * as Yup from 'yup'

export default function CursoFormPage(props) {

  // router -> hook para navegação de telas
  const router = useRouter()

  // Busca a lista de faculdades para usar no select
  const faculdades = JSON.parse(localStorage.getItem('faculdades')) || []

  // Buscar a lista de cursos no localStorage, se não existir, inicializa uma lista vazia
  const cursos = JSON.parse(localStorage.getItem('cursos')) || []

  // Recuperando id para edição
  const id = props.searchParams.id
  console.log(props.searchParams.id)
  // Buscar na lista a faculdade com o ID recebido no parametro
  const cursoEditado = cursos.find(item => item.id == id)
  console.log(cursoEditado)


  // função para salvar os dados do form
  function salvar(dados) {
    // Se cursoEditado existe, mudar os dados e gravar no localStorage
    if (cursoEditado) {
      Object.assign(cursoEditado, dados)
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem('cursos', JSON.stringify(cursos))
    } else {
      // se cursoEditado não existe, é criação de uma nova
      // gerar um ID (Identificador unico)
      dados.id = v4()
      // Adiciona a nova faculdade na lista de faculdades
      cursos.push(dados)
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem('cursos', JSON.stringify(cursos))
    }

    alert("Curso criado com sucesso!")
    router.push("/cursos")
  }

  // Lista de Áreas
  const listaAreas = [
    "Ciências Exatas",
    "Ciências Humanas",
    "Tecnologia da Informação",
    "Engenharia"
  ]

  // Campos do form e valores iniciais(default)
  const initialValues = {
    nome: '',
    descricao: '',
    area: '',
    nota: '',
    status: '',
    faculdade: ''
  }

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    descricao: Yup.string().required("Campo obrigatório"),
    area: Yup.string().required("Campo obrigatório"),
    nota: Yup.number().min(1, "Nota inválida").max(5, "Nota inválida").required("Campo obrigatório"),
    status: Yup.string().required("Campo obrigatório"),
    faculdade: Yup.string().required("Campo obrigatório")
  })

  return (
    <Pagina titulo={"Cadastro de Curso"}>

      {/* Formulário */}

      <Formik
        // Atributos do formik
        // Se for edição, coloca os dados de cursoEditado
        // Se for nova, colocar o initialValues com os valores vazios
        initialValues={cursoEditado || initialValues}
        validationSchema={validationSchema}
        onSubmit={salvar}
      >
        {/* construção do template do formulário */}
        {
          // os valores e funções do formik
          ({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {

            // ações do formulário
            // debug
            // console.log("DEBUG >>>")
            // console.log({values, errors, touched})


            // retorno com o template jsx do formulário
            return (
              <Form onSubmit={handleSubmit}>
                {/* Campos do form */}
                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                      name='nome'
                      type='text'
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.nome && !errors.nome}
                      isInvalid={touched.nome && errors.nome}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.nome}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Descricao:</Form.Label>
                    <Form.Control
                      name='descricao'
                      type='text'
                      value={values.descricao}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.descricao && !errors.descricao}
                      isInvalid={touched.descricao && errors.descricao}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.descricao}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Area:</Form.Label>
                    <Form.Select
                      name='area'
                      value={values.area}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.area && !errors.area}
                      isInvalid={touched.area && errors.area}
                    >
                      <option value=''>Selecione</option>
                      {listaAreas.map(area => <option value={area}>{area}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.area}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Nota:</Form.Label>
                    <Form.Control
                      name='nota'
                      type='number'
                      min={1}
                      max={5}
                      value={values.nota}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.nota && !errors.nota}
                      isInvalid={touched.nota && errors.nota}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.nota}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Status:</Form.Label>
                    <Form.Select
                      name='status'
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.status && !errors.status}
                      isInvalid={touched.status && errors.status}
                    >
                      <option value=''>Selecione</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.status}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Faculdade:</Form.Label>
                    <Form.Select
                      name='faculdade'
                      value={values.faculdade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.faculdade && !errors.faculdade}
                      isInvalid={touched.faculdade && errors.faculdade}
                    >
                      <option value=''>Selecione</option>
                      {faculdades.map(faculdade => <option value={faculdade.nome}>{faculdade.nome}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.faculdade}</Form.Control.Feedback>
                  </Form.Group>
                </Row>


                {/* botões */}
                <Form.Group className='text-end'>
                  <Button className='me-2' href='/faculdades'><FaArrowLeft /> Voltar</Button>
                  <Button type='submit' variant='success'><FaCheck /> Enviar</Button>
                </Form.Group>



              </Form>
            )

          }
        }
      </Formik>

    </Pagina>
  )
}
