let nome = prompt("Qual seu nome de usuário?");


let mensagens = [];
let contatos = [];
let destinatario = "Todos";
let visibilidade = "message";

getData();
getContatos();
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
    
}

setInterval(getData, 10000);

function processarResposta(resposta) {
    console.log(resposta.data);
    mensagens = resposta.data;

    renderizarMensagens();
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
		to: destinatario,
		text: mensagem,
		type: visibilidade
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

// envio de mensagem com enter - bônus *
document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        const btn = document.querySelector(".enviar");
        btn.click();
    }
});


// menu lateral com os contatos do servidor - bônus *
function chamarMenu () {

    let menu = document.querySelector(".menu");
    menu.style.visibility = 'visible';    
}

function fecharMenu() {
    let menu = document.querySelector(".menu");
    menu.style.visibility = 'hidden';  
}

// buscar os usuários online no servidor - bônus *

function getContatos() {

    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promessa.then(processarRespostaContatos);

}

function processarRespostaContatos(resposta) {
    console.log(resposta.data);
    contatos = resposta.data;

    renderizarParticipantes();
}

setInterval(getContatos, 10000); // atualizar a lista de usuários online a casa 10 segundos

// mostrar a lista de usuários no menu lateral
function renderizarParticipantes() {

    let contatosDisplay = document.querySelector(".contatos");

    contatosDisplay.innerHTML = `<div onClick="escolherDestinatario(this)">
                                    <ion-icon name="people"></ion-icon> 
                                    <span class="nome">Todos</span>
                                    <ion-icon class="check" name="checkmark-sharp"></ion-icon>                                   
                                </div>`;

    for(let i = 0; i < contatos.length; i++) {

        contatosDisplay.innerHTML += 
                                    `<div onClick="escolherDestinatario(this)">
                                        <ion-icon name="person-circle"></ion-icon> 
                                        <span class="nome">${contatos[i].name}</span>
                                        <ion-icon class="check" name="checkmark-sharp"></ion-icon>                                       
                                    </div>`
    }
};

// escolher um destinatário para enviar mensagem
function escolherDestinatario(elemento) {
    const span = elemento.querySelector(".nome");
    destinatario = span.innerText;
    console.log(destinatario); 
    
    document.querySelector(".enviando").innerHTML = `Enviando para ${destinatario}`;
}

// escolher o tipo de mensagem: pública ou privada
function escolherVisibilidade(elemento) {
    const span = elemento.querySelector(".tipo");

    if(span.innerText === "Público") {
        visibilidade = "message";
        document.querySelector(".enviando").innerHTML = `Enviando para ${destinatario}`;

    }

    if(span.innerText === "Reservadamente") {
        visibilidade = "private_message"

        document.querySelector(".enviando").innerHTML = `Enviando para ${destinatario} (reservadamente)`;
    }
    console.log(visibilidade);
}