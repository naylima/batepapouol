
let mensagens = [];
let contatos = [];
getData();

let nome = prompt("Qual seu nome de usuário?");
entrarNaSala();

function entrarNaSala() {

    let name = {
        name: nome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", name);
    promessa.catch(alertaErro); 

    promessa.then(setInterval(manterConexao, 5000));
}

function manterConexao() {
    let name = {
        name: nome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", name);
}

function getData() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promessa.then(processarResposta); 
    
    const promessaContatos = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promessaContatos.then(processarRespostaContatos);
}

setInterval(getData, 10000);

function processarResposta(resposta) {
    console.log(resposta.data);
    mensagens = resposta.data;

    renderizarMensagens();
}

function processarRespostaContatos(resposta) {
    console.log(resposta.data);
    contatos = resposta.data;

    buscarContatos();
}

function renderizarMensagens() {

    let container = document.querySelector(".container");

    container.innerHTML = "";

    for(let i = 0; i < mensagens.length; i++) {

        switch (mensagens[i].type) {

            case "status" : container.innerHTML += 
            `<div class = "status"> 
                <p>
                    <hora>(${mensagens[i].time})</hora> <b>${mensagens[i].from}</b> ${mensagens[i].text}
                </p>
            </div>`
            break;
            case "message" : container.innerHTML += 
            `<div class = "publico"> 
                <p>
                    <hora>(${mensagens[i].time})</hora> <b>${mensagens[i].from}</b> para <b>${mensagens[i].to}</b>: ${mensagens[i].text}
                </p>
            </div>`
            break;
            case "private_message" : container.innerHTML += 
            `<div class = "reservado"> 
                <p>
                    <hora>(${mensagens[i].time})</hora> <b>${mensagens[i].from}</b> para <b>${mensagens[i].to}</b>: ${mensagens[i].text}
                </p>
            </div>`
            break;

        }
    }

    let ultimaMensagem =  document.querySelector(".container>div:last-child");
    ultimaMensagem.scrollIntoView();    
}

function cadastrarMensagem() {

    let mensagem = document.querySelector("#mensagem").value;

    const novaMensagem = {
        from: nome,
		to: "Todos",
		text: mensagem,
		type: "message"
    };

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
    promessa.then(getData).catch(() => console.log(window.location.reload()));
}

function alertaErro(error) {
    console.log(error.response.status);
    if (error.response.status === 400) {
      nome = prompt("Nome de usuário existente. Digite outro nome de usuário:");
      entrarNaSala();
    }
}

document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        const btn = document.querySelector(".enviar");
        btn.click();
    }
});


function chamarMenu () {

    let menu = document.querySelector(".menu");
    menu.style.visibility = 'visible';    
}

function fecharMenu() {
    let menu = document.querySelector(".menu");
    menu.style.visibility = 'hidden';  
}

function buscarContatos() {
     
    let contatosDisplay = document.querySelector(".contatos");

    contatosDisplay.innerHTML = `<div>
                                    <ion-icon name="people"></ion-icon> 
                                    Todos 
                                    <ion-icon class="check" name="checkmark-sharp"></ion-icon>
                                </div>`;

    for(let i = 0; i < contatos.length; i++) {
        
        contatosDisplay.innerHTML += `<div>
                                        <ion-icon name="person-circle"></ion-icon> 
                                        ${contatos[i].name} 
                                        <ion-icon class="check" name="checkmark-sharp"></ion-icon>
                                    </div>`
                                    }
    
    let visibilidade = document.querySelector(".visibilidade");

};