class Carro{
    constructor(modelo,placa,hora){
        this._modelo = modelo;
        this._placa = placa;
        this._hora = hora;
        this._carroID = this.geradorID();
    }

    get modelo(){
        return this._modelo;
    }

    get placa(){
        return this._placa;
    }

    get hora(){
        return this._hora;
    }

    get carroID(){
        return this._carroID;
    }

    geradorID(){
        let caracteres = "AHMEQTYOPC";
        let id = "";
        for(let i = 0; i < 11; i++){
            id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        id = id.substr(0,5) + this.placa + id.substr(5,10);
        return id;
    }
}