'use client'

import Pagina from '@/components/Pagina'
import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FaArrowLeft, FaCheck } from "react-icons/fa"
import { v4 } from 'uuid'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'

export default function AlunoFormPage(props) {
  const router = useRouter()

  const [faculdades, setFaculdades] = useState([])
  const [cursos, setCursos] = useState([])
  const [cursosFiltrados, setCursosFiltrados] = useState([])

  useEffect(() => {
    const faculdadesSalvas = JSON.parse(localStorage.getItem('faculdades')) || []
    const cursosSalvos = JSON.parse(localStorage.getItem('cursos')) || []
    setFaculdades(faculdadesSalvas)
    setCursos(cursosSalvos)
  }, [])

  const id = props.searchParams.id
  const alunos = JSON.parse(localStorage.getItem('alunos')) || []
  const alunoEditado = alunos.find(item => item.id == id)

  function salvar(dados) {
    const alunosAtualizados = id 
      ? alunos.map(aluno => (aluno.id === id ? dados : aluno)) 
      : [...alunos, { ...dados, id: v4() }]
    localStorage.setItem('alunos', JSON.stringify(alunosAtualizados))
    alert("Aluno salvo com sucesso!")
    router.push("/alunos")
  }

  const initialValues = {
    nome: '',
    sobrenome: '',
    email: '',
    dataNascimento: '',
    telefone: '',
    faculdade: '',
    curso: '',
    periodo: '',
    matricula: '',
    foto: ''
  }

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    dataNascimento: Yup.string().required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    faculdade: Yup.string().required("Campo obrigatório"),
    curso: Yup.string().required("Campo obrigatório"),
    periodo: Yup.string().required("Campo obrigatório"),
    matricula: Yup.string().required("Campo obrigatório"),
    foto: Yup.string().url("URL inválida").required("Campo obrigatório")
  })

  const filtrarCursosPorFaculdade = (faculdadeSelecionada) => {
    // Filtra os cursos onde o nome da faculdade coincide com o valor selecionado
    const cursosFiltrados = cursos.filter(curso => curso.faculdade === faculdadeSelecionada);
    console.log("Faculdade selecionada:", faculdadeSelecionada);
    console.log("Cursos encontrados após filtro:", cursosFiltrados);
    setCursosFiltrados(cursosFiltrados);
  };
  

  return (
    <Pagina titulo={"Cadastro de Aluno"}>
      <Formik
        initialValues={alunoEditado || initialValues}
        validationSchema={validationSchema}
        onSubmit={salvar}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
          // Define o handleFaculdadeChange no escopo correto
          const handleFaculdadeChange = (event) => {
            const faculdadeSelecionada = event.target.value;
            setFieldValue("faculdade", faculdadeSelecionada);
            filtrarCursosPorFaculdade(faculdadeSelecionada);
            setFieldValue("curso", ""); // Reseta o campo de curso ao trocar a faculdade
          };

        // Validação personalizada para o campo 'foto'
        const validateFoto = (value) => {
          let error;
          if (!value) {
            error = "É necessário fazer o upload de uma foto.";
          } else if (typeof value !== "object" || !value.type.startsWith("image/")) {
            error = "Arquivo inválido. Envie uma imagem válida.";
          }
          return error;
          };
          

          return (
            <Form onSubmit={handleSubmit}>
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
                  <Form.Label>Sobrenome:</Form.Label>
                  <Form.Control
                    name='sobrenome'
                    type='text'
                    value={values.sobrenome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.sobrenome && !errors.sobrenome}
                    isInvalid={touched.sobrenome && errors.sobrenome}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.sobrenome}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className='mb-2'>
                <Form.Group as={Col}>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    name='email'
                    type='email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Data de Nascimento:</Form.Label>
                  <Form.Control
                    name='dataNascimento'
                    type='date'
                    value={values.dataNascimento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.dataNascimento && !errors.dataNascimento}
                    isInvalid={touched.dataNascimento && errors.dataNascimento}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.dataNascimento}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className='mb-2'>
                <Form.Group as={Col}>
                  <Form.Label>Telefone:</Form.Label>
                  <Form.Control
                    name='telefone'
                    type='text'
                    value={values.telefone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.telefone && !errors.telefone}
                    isInvalid={touched.telefone && errors.telefone}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.telefone}</Form.Control.Feedback>
                </Form.Group>

                <Row className='mb-2'>
                  <Form.Group as={Col}>
                    <Form.Label>Faculdade:</Form.Label>
                    <Form.Select
                      name='faculdade'
                      value={values.faculdade}
                      onChange={handleFaculdadeChange}
                      onBlur={handleBlur}
                      isValid={touched.faculdade && !errors.faculdade}
                      isInvalid={touched.faculdade && errors.faculdade}
                    >
                      <option value=''>Selecione</option>
                      {faculdades.map(faculdade => (
                      <option key={faculdade.id} value={faculdade.nome}>{faculdade.nome}</option>
                      ))}

                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.faculdade}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Curso:</Form.Label>
                    <Form.Select
                      name='curso'
                      value={values.curso}
                      onChange={(e) => setFieldValue("curso", e.target.value)} // Atualiza o curso usando setFieldValue
                      onBlur={handleBlur}
                      isValid={touched.curso && !errors.curso}
                      isInvalid={touched.curso && errors.curso}
                    >
                      <option value=''>Selecione</option>
                      {cursosFiltrados.map(curso => (
                        <option key={curso.id} value={curso.id}>{curso.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>{errors.curso}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group as={Col}>
                  <Form.Label>Período:</Form.Label>
                  <Form.Control
                    name='periodo'
                    type='text'
                    value={values.periodo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.periodo && !errors.periodo}
                    isInvalid={touched.periodo && errors.periodo}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.periodo}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className='mb-2'>
                <Form.Group as={Col}>
                  <Form.Label>Matrícula:</Form.Label>
                  <Form.Control
                    name='matricula'
                    type='text'
                    value={values.matricula}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.matricula && !errors.matricula}
                    isInvalid={touched.matricula && errors.matricula}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.matricula}</Form.Control.Feedback>
                </Form.Group>
                </Row>

                <Form.Group as={Col}>
                <Form.Label>Foto do Imóvel</Form.Label>
                <Form.Control
                  name="foto"
                  type="file"
                  onChange={(event) => {
                    setFieldValue("foto", event.currentTarget.files[0]); // Define o arquivo no estado do Formik
                  }}
                  onBlur={handleBlur}
                />
                {/* Exibe mensagem de erro personalizada */}
                {errors.foto && touched.foto && (
                  <div className="text-danger">{errors.foto}</div>
                )}

                {/* Pré-visualização da imagem */}
                {values.foto && (
                  <img
                    src={URL.createObjectURL(values.foto)}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", marginTop: "10px" }}
                  />
                )}
                </Form.Group>

              <Button variant="primary" type="submit" className='me-2'>
                <FaCheck /> Salvar
              </Button>
              <Button variant="secondary" onClick={() => router.push('/alunos')}>
                <FaArrowLeft /> Voltar
              </Button>
            </Form>
          )
        }}
      </Formik>
    </Pagina>
  )
}
