import mongoose from "mongoose";

const dbUser = 'greenrise'
const dbPassword = 'greenrise123'
//Conexão com MongoDB
const connect = () =>{
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.ecdinj5.mongodb.net/bd-greenrise?retryWrites=true&w=majority&appName=Cluster0`)

}

const connection  = mongoose.connection;
connection.on("error", () =>{
    console.log("Erro ao conectar com o mongo DB")
});
connection.on("open", () =>{
    console.log("Conectado ao mongoDB com sucesso!")
});
connect()
export default mongoose