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
    /*
    mensagens.forEach(mensagem => {
        ul.innerHTML += `
        <li class="msg_all" data-test="message">   
            <p class="hora">${mensagem.time}</p><p class="msg"> 
            <span class="user">${mensagem.from}</span> para <span class="user">${mensagem.to}:
            </span> ${mensagem.text}</p>
        </li>
        `
    });*/
    mensagens.forEach(mensagem => {
        ul.innerHTML += `
        <li class="msg_all" data-test="message">   
            <p class="hora">(${mensagem.time})</p><p class="msg"> <span class="user">${mensagem.from}</span> para <span class="user">${mensagem.to}:</span>  ${mensagem.text}</p>
        </li>
        `
    });
}

function userAtivo(){
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', {name: nome});
}


function entrarSala(){
    nome = document.querySelector(".tela_entrada input").value;

    const promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', {name: nome});
    promisse.then(function(){
        const tela_entrada = document.querySelector('.tela_entrada');
        tela_entrada.style.display = 'none';
        capturaMensagens();
        setTimeout(function(){
            const tela_loading = document.querySelector('.tela_loading');
            tela_loading.style.display = 'none';
        }, 1000);
        setInterval(capturaMensagens, 3000);
        setInterval(userAtivo, 5000);
    });
    promisse.catch(function(){
        alert("Nome já em uso");
        document.querySelector(".tela_entrada input").value = '';
    });
}

function enviarMensagem(){
    const footer = document.querySelector('.footer');
    const textoDigitado = footer.querySelector('input').value;
    const request =
        {
            from: nome,
            to: "Todos",
            text: textoDigitado,
            type: "message"
        };

    const promisse = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", request);
    promisse.then(function(){
        footer.querySelector('input').value = '';
        capturaMensagens();
    })

    promisse.catch(function() {
        window.location.reload()
    });
}


function teste(event){
    var x = event.keyCode; // Obtém o valor Unicode (decimal)
    if(x === 13){
        enviarMensagem();
    }
}
