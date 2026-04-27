import axios from "axios";

const API = axios.create({
baseURL: "https://smart-student-service-production.up.railway.app/api"});

export default API;