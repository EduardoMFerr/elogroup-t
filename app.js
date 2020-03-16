class App {
  constructor() {
    this.server = "http://localhost:8080";
    this.formEl = document.getElementById("formCadastro");
    this.social = document.getElementsByName("fsocial");
    this.socialToggle = document.getElementById("socialToggle");
    this.manipuladorFormulario();
  }
  //Método para manipular eventos do formulário
  manipuladorFormulario() {
    this.formEl.onsubmit = event => this.enviarFormulario(event);
    this.formEl.oninput = event => this.validarFormulario(event);
    this.formEl.telefone.oninput = event => this.normalizarTelefone(event);

    for (const item of this.social) {
      item.oninput = () => {
        this.socialToggle.style.display === "none"
          ? (this.socialToggle.style.display = "block")
          : (this.socialToggle.style.display = "none");
      };
    }
  }

  //Método responsável validar o formulário
  validarFormulario(event) {
    const regexNome = /[A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ'-][a-záéíóúàâêôãõüç'-].* [A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ'-][a-záéíóúàâêôãõüç'-].*/;
    const regexTelefone = /(\d{2})-(\d{8})/;
    const regexMidia = /\w*/;
    const regexSocial = /true/;

    let validade = false;
    switch (event.target.name) {
        case 'nome':
            validade = regexNome.test(event.target.value);
            break;
    
        case 'telefone':
            validade = regexTelefone.test(event.target.value);
            break;

        case 'midia':
            validade = regexMidia.test(event.target.value);
            break;

        case 'fsocial':
            validade = regexSocial.test(event.target.value);
            this.verificarRequired(validade);
            break;

        case 'social':
            validade = regexSocial.test(event.target.checked);
            this.verificarCheckbox();
            break;

        default:
            validade = null;
            break;
    }
   validade
        ? event.target.style['background-color'] = "#ddffdd"
        : event.target.style['background-color'] = "#ffdddd";
    
    document.getElementById("submit-form").disabled = !this.formEl.checkValidity();
  }
  
  //Auxilia a validação do checkbox
  verificarRequired(validade){
      validade
        ? this.formEl.social.forEach(elemento => elemento.required = validade)
        : this.formEl.social.forEach(elemento => {
            elemento.removeAttribute('required');
            elemento.checked = false;
        })
  }
 
  //Auxilia a validação do checkbox
  verificarCheckbox(){
    let check = 0;
    this.formEl.social.forEach((elemento) => {
        if (elemento.checked) check++;
    })

    this.formEl.social.forEach((elemento) => {
        check<1
            ? elemento.required = true
            : elemento.removeAttribute('required')
    })  
  }

  //Normaliza o formato da entrada do input do telefone
  normalizarTelefone = ({ target }) => {
    target.value = target.value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d{8})/, "$1-$2");
  }

  //Exibe a mensagem de confirmação de envio do POST
  mensagemSpan(msg, duration, elemento) {
    var el = elemento.innerHTML;
    elemento.setAttribute(
      "style",
      "color:green; border-style: solid; border-color: green; text-align: center;"
    );
    elemento.innerHTML = msg;
    setTimeout(() => {
        elemento.setAttribute(
            "style",
            "color:black;"
        );
        elemento.innerHTML = el;
    }, duration);
  }

  //Reinicia/prepara o formulário para nova submissão
  resetarForm(){
    this.formEl.reset();
    document.getElementById("submit-form").disabled = true;
    this.verificarRequired(false);
    this.socialToggle.style.display = "none";
  }

  //Manipula a submição do formulário
  enviarFormulario(event) {
    event.preventDefault();
    const formData = new FormData(this.formEl);
    const social = [];
    const objeto = {};

    formData.forEach((v, k) => {
      k == "social" ? social.push(v) : (objeto[k] = v.toString());
    });
    social.length > 0 ? (objeto["social"] = social) : null;

    delete objeto["fsocial"];

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
      headers: myHeaders,
      method: "POST",
      body: JSON.stringify(objeto),
      redirect: "follow",
      mode: "cors"
    };

    fetch(this.server, requestOptions)
      .then(function(response) {
        return response.json();
      })
      .then(({ mensagem }) => {
        this.mensagemSpan(mensagem, 5000, document.getElementById('mensagem'));
        this.resetarForm()

      })
      .catch(error => console.log("error", error));
  }
}

new App();

