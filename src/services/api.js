import axios from "axios";

const API = axios.create({
baseURL: "baseURL: https://smart-student-service-production-5060.up.railway.app/api"});

export default API;