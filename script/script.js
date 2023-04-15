axios.defaults.headers.common['Authorization'] = "pYMibMjkB0MmSoYOvynCYRRB";

function capturaMensagens(){
    console.log("oi");
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
        <li class="msg_all">   
            <p class="hora">${mensagem.time}</p><p class="msg"> 
            <span class="user">${mensagem.from}</span> para <span class="user">${mensagem.to}:
            </span> ${mensagem.text}</p>
        </li>
        `
    });
}

function userAtivo(nome){
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', {name: nome});
}

function entrarSala(){
    let nome = prompt("Informe seu nome:");

    const promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', {name: nome});
    promisse.then(function(){
        setInterval(capturaMensagens, 3000);
        setInterval(function(){
            userAtivo(nome)
        }, 5000);
    });
    promisse.catch(entrarSala);
}

entrarSala();
//setInterval(capturaMensagens, 3000);