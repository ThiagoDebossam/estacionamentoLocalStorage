class Hora{
    //esta classe nao deve ser intanciada
    static pegaHora(){
        let data = new Date();
        let hora = `${data.getHours()}:${data.getMinutes()}`;
        return hora;
    }
}