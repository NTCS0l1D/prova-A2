'use client'

import Pagina from '@/components/Pagina'
import apiLocalidades from '@/services/apiLocalidades'
import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FaArrowLeft, FaCheck } from "react-icons/fa"
import { v4 } from 'uuid'
import * as Yup from 'yup'

export default function FaculdadeFormPage(props) {

  // router -> hook para navegação de telas
  const router = useRouter()

  // Criar estados(react) para armazenar os dados dos selects
  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [cidades, setCidades] = useState([])

  // Buscar a lista de faculdades no localStorage, se não existir, inicializa uma lista vazia
  const faculdades = JSON.parse(localStorage.getItem('faculdades')) || []

  // Recuperando id para edição
  const id = props.searchParams.id
  console.log(props.searchParams.id)
  // Buscar na lista a faculdade com o ID recebido no parametro
  const faculdadeEditada = faculdades.find(item => item.id == id)
  console.log(faculdadeEditada)


  // carregar os dados na inicialização da página
  useEffect(() => {
    // buscar os paises da api, imprimi no log e guarda no armazenamento
    apiLocalidades.get('/paises').then(response => {
      console.log("paises >>> ", response.data)
      setPaises(response.data)
    })

    apiLocalidades.get("estados?orderBy=nome").then(response => {
      console.log("estados >>> ", response.data)
      setEstados(response.data)
    })

  }, [])

  // função para salvar os dados do form
  function salvar(dados) {
    // Se faculdadeEditada existe, mudar os dados e gravar no localStorage
    if(faculdadeEditada){
      Object.assign(faculdadeEditada, dados)
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem('faculdades', JSON.stringify(faculdades))
    } else {
      // se faculdadeEditada não existe, é criação de uma nova
      // gerar um ID (Identificador unico)
      dados.id = v4()
      // Adiciona a nova faculdade na lista de faculdades
      faculdades.push(dados)
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem('faculdades', JSON.stringify(faculdades))
    }

    alert("Faculdade criada com sucesso!")
    router.push("/faculdades")
  }

  // Campos do form e valores iniciais(default)
  const initialValues = {
    nome: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    endereco: ''
  }

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    pais: Yup.string().required("Campo obrigatório"),
    estado: Yup.string(),
    cidade: Yup.string(),
    endereco: Yup.string().required("Campo obrigatório")
  })

  return (
    <Pagina titulo={"Cadastro de Faculdade"}>

      {/* Formulário */}

      <Formik
        // Atributos do formik
        // Se for edição, coloca os dados da faculdadeEditada
        // Se for nova, colocar o initialValues com os valores vazios
        initialValues={faculdadeEditada || initialValues}
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

            useEffect(() => {
              console.log("Mexeu no estado >>>")
              if (values.estado !== '') {
                apiLocalidades.get(`/estados/${values.estado}/municipios`).then(response => {
                  console.log("cidades >>>", response.data)
                  setCidades(response.data)
                })
              }
            }, [values.estado])


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
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Endereco:</Form.Label>
                    <Form.Control
                      name='endereco'
                      type='text'
                      value={values.endereco}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.endereco && !errors.endereco}
                      isInvalid={touched.endereco && errors.endereco}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.endereco}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Pais:</Form.Label>
                    <Form.Select
                      name='pais'
                      value={values.pais}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.pais && !errors.pais}
                      isInvalid={touched.pais && errors.pais}
                    >
                      <option value="">Selecione</option>
                      {paises.map(pais => <option value={pais.nome}>{pais.nome}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.pais}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Estado:</Form.Label>
                    <Form.Select
                      name='estado'
                      value={values.estado}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.pais !== 'Brasil'}
                      isValid={touched.estado && !errors.estado}
                      isInvalid={touched.estado && errors.estado}
                    >
                      <option value="">Selecione</option>
                      {estados.map(estado => <option value={estado.sigla}>{estado.sigla}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.estado}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Cidade:</Form.Label>
                    <Form.Select
                      name='cidade'
                      value={values.cidade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.pais !== 'Brasil'}
                      isValid={touched.cidade && !errors.cidade}
                      isInvalid={touched.cidade && errors.cidade}
                    >
                      <option value="">Selecione</option>
                      {cidades.map(cidade => <option value={cidade.nome}>{cidade.nome}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.cidade}</Form.Control.Feedback>
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
