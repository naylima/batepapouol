
let mensagens = [];
getData();

let nome = prompt("Qual seu nome de usuário?");
entrarNaSala();

function entrarNaSala() {

    let name = {
        name: nome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", name)

    setInterval(manterConexao, 5000);
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

function processarResposta(resposta) {
    console.log(resposta.data);
    mensagens = resposta.data;

    renderizarMensagens()
}

function renderizarMensagens() {

    let container = document.querySelector(".container");

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
}

function cadastrarMensagem() {

    let mensagem = document.querySelector("#mensagem").value;

    const novaMensagem = {
        from: nome,
		to: "Todos",
		text: mensagem,
		type: "message",
    };

    console.log(novaMensagem);

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
    promessa.then(getData);
    promessa.catch(alertaErro);   
}

function alertaErro(error) {
    console.log(error.response.status);
    if (error.response.status === 400) {
      nome = prompt("Nome de usuário existente. Digite outro nome de usuário");
    }
  }

function chamarMenu () {

    let menu = document.querySelector(".menu");
    menu.style.visibility = 'visible';    
}

function fecharMenu() {
    let menu = document.querySelector(".menu");
    menu.style.visibility = 'hidden';  
}