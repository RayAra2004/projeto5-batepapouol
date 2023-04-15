axios.defaults.headers.common['Authorization'] = "pYMibMjkB0MmSoYOvynCYRRB";

let nome;
function capturaMensagens(){
    const resposta = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    resposta.then(rederizaMesangens);
    resposta.catch( error =>{
        alert(`${error.message} \nNão foi possível carregar as mensagens. Por favor tente mais tarde!`);
    });
    
}

function rederizaMesangens(msgs){
    const mensagens = msgs.data;
    const ul = document.querySelector('ul');
    ul.innerHTML = '';
    mensagens.forEach(mensagem => {
        ul.innerHTML += `
        <li class="msg_all" data-test="message">   
            <p class="hora">${mensagem.time}</p><p class="msg"> 
            <span class="user">${mensagem.from}</span> para <span class="user">${mensagem.to}:
            </span> ${mensagem.text}</p>
        </li>
        `
    });
}

function userAtivo(){
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', {name: nome});
}

function entrarSala(){
    nome = prompt("Informe seu nome:");

    const promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', {name: nome});
    promisse.then(function(){
        setInterval(capturaMensagens, 3000);
        setInterval(userAtivo, 5000);
    });
    promisse.catch(entrarSala);
}

function enviarMensagem(){
    const textoDigitado = document.querySelector('input').value;
    const request =
        {
            from: nome,
            to: "Todos",
            text: textoDigitado,
            type: "message"
        };

    const promisse = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", request);
    promisse.then(function(){
        document.querySelector('input').value = '';
    })

    promisse.catch(res => window.location.reload());
}

entrarSala();
