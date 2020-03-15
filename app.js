class App {
  /**
   *Creates an instance of App.
   * @param {string} [host='http://localhost']
   * @param {number} [porta=8080]
   * @memberof App
   */
  constructor(host = "http://localhost", porta = 8080) {
    //this.server = `${host}:${porta}`;
    this.server = "https://api-mdb-atlas.herokuapp.com/";
    this.formEl = document.getElementById("formCadastro");
    this.social = document.getElementsByName("fsocial");
    this.socialToggle = document.getElementById("socialToggle");
    this.manipuladorFormulario();
  }

  /**
   * @memberof App
   */
  manipuladorFormulario() {
    this.formEl.onsubmit = event => this.enviarFormulario(event);
    this.formEl.oninput = event => this.validarFormulario(event);
    this.formEl.social.oninput = event => this.alternanciaFormulario(event);
    this.formEl.telefone.oninput = event => this.normalizarTelefone(event);
    
    // this.formEl.midia.checkbox

    for (const item of this.social) {
      item.oninput = () => {
        this.socialToggle.style.display === "none"
          ? (this.socialToggle.style.display = "block")
          : (this.socialToggle.style.display = "none");
      };
    }
  }

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
            validade? console.log(event): console.log(validade);
            this.verificarRequired(validade)
            break;

        case 'social':
            validade = regexSocial.test(event.target.checked);
            this.verificarCheckbox()
            break;

        default:
            validade = null;
            break;
    }
    /*
    validade
        ? event.target.setAttribute('style', 'background-color: #ddffdd;')
        : event.target.setAttribute('style', 'background-color: #ffdddd;');
    */
   validade
        ? event.target.style['background-color'] = "#ddffdd"
        : event.target.style['background-color'] = "#ffdddd";
    
    document.getElementById("submit-form").disabled = !this.formEl.checkValidity();

  }
  verificarRequired(validade){
      validade
        ? this.formEl.social.forEach(elemento => elemento.required = validade)
        : this.formEl.social.forEach(elemento => {
            elemento.removeAttribute('required');
            elemento.checked = false;
        })
  }

  verificarCheckbox(){
    let check = 0;
    this.formEl.social.forEach((elemento) => {
        if (elemento.checked) check++;
        console.log(check)
    })

    this.formEl.social.forEach((elemento) => {
        check<1
            ? elemento.required = true
            : elemento.removeAttribute('required')
    })

    
  }

  normalizarTelefone = ({ target }) => {
    target.value = target.value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d{8})/, "$1-$2");
  };


  mensagemSpan(msg, duration, elemento) {
    console.log(msg)
    var el = elemento.innerHTML;
    console.log(el)
    elemento.setAttribute(
      "style",
      "color:green; border-style: solid; border-color: green; text-align: center;"
    );
    elemento.innerHTML = msg;
    setTimeout(function() {
        elemento.setAttribute(
            "style",
            "color:black;"
        );
        elemento.innerHTML = el;
    }, duration);
        

  }

  /**
   * @param {*} event
   * @memberof App
   */
  enviarFormulario(event) {
    event.preventDefault();

    const formData = new FormData(this.formEl);
    const searchParams = new URLSearchParams();
    const social = [];

    const objeto = {};
    formData.forEach((v, k) => {
      k == "social" ? social.push(v) : (objeto[k] = v.toString());
    });
    social.length > 1 ? (objeto["social"] = social) : null;

    delete objeto["fsocial"];
    console.log(objeto);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var raw = JSON.stringify({
      nome: "Bunda Mole",
      telefone: "12-55445544",
      midia: "tv",
      social: ["Facebook", "Instagram"]
    });
    console.log(raw);

    const requestOptions = {
      headers: myHeaders,
      method: "POST",
      body: JSON.stringify(objeto),
      redirect: "follow",
      mode: "cors"
    };

    fetch(this.server, requestOptions)
      .then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(({ mensagem }) => {
        console.log(mensagem);
        this.mensagemSpan(mensagem, 5000, document.getElementById('mensagem'));
      })
      .catch(error => console.log("error", error));
  }
}

new App();
