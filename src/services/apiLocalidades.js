import axios from "axios";

const apiLocalidades = axios.create({
    baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades"
})

export default apiLocalidades