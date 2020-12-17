class CarroController{
    constructor(){
        this.formEl = document.querySelector("#formulario");
        this.tabelaEl = document.querySelector("#tabela");
        this.modeloEl = document.querySelector("#modelo");
        this.placaEl = document.querySelector("#placa");
        this.carros = [];
        this.inserirCarroNaTabela();
        this.retornaCarros();
        this.filtraTabela();
        this.mascaraPlaca();
    }

    //cria um carro com a instancia da classe carro
    criaCarro(){
        let modelo = this.modeloEl.value;
        let placa = this.placaEl.value;
        let hora = Hora.pegaHora();
        let carro = new Carro(modelo,placa,hora);
        return carro;
    }

    //insere carro na tabela de acordo com os requisitos
    inserirCarroNaTabela(){
        this.formEl.addEventListener("submit", e=>{
            e.preventDefault();
            if(this.validarCampo() && this.validaPlacaCheckBox()){
                let carro = this.criaCarro();
                if(this.verificarPlaca(carro.placa)){
                    this.criaTr(carro);
                    this.salvaCarro(carro);
                    this.formEl.reset();
                    this.mensagemErro("");
                }
            }
        });
    }

    // cria tr adicionando o carro visualmente na tabela
    criaTr(carro){
        let tr = document.createElement("tr");
        if(!carro.modelo){
            carro.modelo = carro._modelo;
            carro.placa = carro._placa;
            carro.hora = carro._hora;
            carro.carroID = carro._carroID;
        }
        tr.innerHTML = `
            <th scope="row">${carro.modelo.toUpperCase()}</th>
            <td class="placa">${carro.placa.toUpperCase()}</td>
            <td>${carro.hora}</td>
            <td><button class="${carro.carroID} btn btn-danger">Finalizar</button></td>
        `;
        this.tabelaEl.appendChild(tr);
        
        let button = document.querySelector(`.${carro.carroID}`);
        button.addEventListener("click",e=>{
            let alvo = e.target.parentNode.parentNode;
            this.mostraModal(alvo,carro);
        });
    }

    //salva carro no localStorage
    salvaCarro(carro){
        this.carros.push(carro);
        let carros = JSON.stringify(this.carros);
        localStorage.setItem("carros", carros);
    }

    //retorna os carros salvos no localStorage
    retornaCarros(){
        let carros = localStorage.getItem("carros");
        if(carros){
            carros = JSON.parse(carros);
            carros.forEach(carro=>{
                this.carros.push(carro);
                this.criaTr(carro);
            });
        }
    }

    //exclui carro do localStorage
    excluirCarro(alvo,carroID){
        this.carros.forEach((carro, index)=>{
            if(carro.carroID == carroID){
                this.carros.splice(index,1);
            }
        });
        let carros = JSON.stringify(this.carros);
        localStorage.setItem("carros", carros);
        alvo.remove();
    }

    //realiza a pesquisa da placa na tabela
    filtraTabela(){
        let buscar = document.querySelector("#buscar");
        buscar.addEventListener("keyup",(function(e){
            let placas = document.querySelectorAll(".placa");
            let busca = $("#buscar").val();
            placas.forEach(placa=>{
                let texto = placa.textContent;
                let regExp = new RegExp(busca, "i");
                if(!regExp.test(texto)){
                    placa.parentNode.style.display= "none";
                }else{
                    placa.parentNode.style.display= "table-row";
                }
            });
        }));
    }

    //verifica a placa e retorna mensagem de erro
    validaPlacaCheckBox(){
        let campoPlaca = document.querySelector("#placa");
        let check = document.querySelector("#exampleCheck1");
        campoPlaca = campoPlaca.value;
    
        if(check.checked && campoPlaca.length === 7){
            return true;
        }else if(!check.checked && campoPlaca.length === 8){
            return true;
        }else{
            this.mensagemErro("A placa deve conter no mínimo 7 caracteres");
            return false;
        }
    }   
    
    //adiciona mascara na placa caso ela seja de modelo antigo
    mascaraPlaca(){
        let campoPlaca = document.querySelector("#placa");
        let check = document.querySelector("#exampleCheck1");

        //faz as alteracoes conforme o usuario digita
        campoPlaca.oninput = function (){
            let placa = campoPlaca.value;
            if(!check.checked){
                if(placa.length === 3){
                    campoPlaca.value += "-";
                    campoPlaca.setAttribute("maxlength", 8);
                    campoPlaca.setAttribute("minlength", 8);
                }
            }else{
                campoPlaca.value = placa.replace("-","");
                campoPlaca.setAttribute("maxlength", 7);
                campoPlaca.setAttribute("minlength", 7);
            }
        }

        //faz as alteracoes conforme muda o checkbox
        check.addEventListener("change", e=>{
            let placa = campoPlaca.value;
            if(!check.checked){
                if(placa.length >= 3){
                    let hifen = placa.substr(0,3)+"-"+placa.substr(3);
                    campoPlaca.value = hifen;
                }
                campoPlaca.setAttribute("maxlength", 8);
                campoPlaca.setAttribute("minlength", 8);

            }else{
                campoPlaca.value = placa.replace("-","");
                campoPlaca.setAttribute("maxlength", 7);
                campoPlaca.setAttribute("minlength", 7);
            }
        });
    }

    //faz validacao nos campos de input
    validarCampo(){
        var modelo = document.querySelector("#modelo").value;
        var placa = document.querySelector("#placa").value;
        if(modelo.length <= 0 || placa.length <= 0){
            this.mensagemErro("Preencha todos os campos!");
            return false;
        }else{
            return true;
        }
    }

    //adiciona erro na tela
    mensagemErro(mensagem){
        document.querySelector("#mensagem").innerHTML = mensagem;
    }

    //verifica se placa ja foi adicionada
    verificarPlaca(placa){
        let placas = document.querySelectorAll(".placa");
        let ehValida = true
        placas.forEach(placaTabela=>{
            if(placaTabela.textContent == placa){
                this.mensagemErro("Placa já existente!");
                ehValida = false;
                return;
            }
        }); 
        return ehValida;
    }

    //mostra modal com os dados do carro antes de exlui-lo
    mostraModal(alvo,carro){
        let modal = document.querySelector("#modal-index");

        modal.classList.add("mostrar-modal");
        modal.innerHTML = `
            <div class="index-modal">
                <h3 class="titulo_modal text-center">Informações do carro</h3>
                
                <p>MODELO: </p>
                <p class="text-warning" id="modelo_modal">${carro.modelo.toUpperCase()}</p>
    
                <p>PLACA: </p>
                <p class="text-warning" id="placa_modal">${carro.placa.toUpperCase()}</p>
    
                <p>HORA: </p>
                <p class="text-warning" id="hora_modal">${carro.hora}</p>
                <div class="calcular">
                    <label for="tempo">Fraçõe(s) usada(s):</label>
                    <input id="tempo"type="text"> <br>
                    <label for="valor_hora" >Valor fração:</label>
                    <input id="valor_hora" type="text"> <br>
                    <p id="calcular" class="btn btn-primary btn-lg btn-block">Calcular</p>
                </div>
                <div>
                    <p class="dinheiro text-success"></p>
                </div>
                <div class="botoes">
                    <button id="excluir-carro" class="excluir btn btn-danger">Excluir carro</button>
                    <button id="cancelar"class="cancelar btn btn-primary">Cancelar exclusão</button>
                </div>    
            </div>
        `;

        //mostra o calculo das fracoes usadas 
        document.querySelector("#calcular").addEventListener("click", e=>{
            let valorHora = document.querySelector("#valor_hora").value;
            let tempo = document.querySelector("#tempo").value;
    
            let valor = valorHora * tempo;
            document.querySelector(".dinheiro").innerHTML = `R$: ${valor}`;
        });

        //remove o modal
        document.querySelector(".cancelar").addEventListener("click", e=>{
            modal.classList.remove("mostrar-modal");
        });

        //exclui carro visualmente e chama funcao para excluir no localStorage
        document.querySelector(".excluir").addEventListener("click",e=>{
            this.excluirCarro(alvo,carro.carroID);
            modal.classList.remove("mostrar-modal");
        }); 
    }
}