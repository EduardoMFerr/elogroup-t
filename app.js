class App {
  /**
   *Creates an instance of App.
   * @param {string} [host='http://localhost']
   * @param {number} [porta=8080]
   * @memberof App
   */
  constructor(host = "http://localhost", porta = 8080) {
    this.server = `${host}:${porta}`;
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
    this.formEl.fsocial.oninput = event => this.alternanciaFormulario(event);
    this.formEl.ftelefone.oninput = event => this.normalizarTelefone(event);
    this.formEl.fmidia.checkbox
    
    for (const item of this.social) {
        item.oninput = () => {
            this.socialToggle.style.display === 'none' ?
                this.socialToggle.style.display = 'block' :
                this.socialToggle.style.display = 'none'
        }
    }
  }


  validarFormulario(event) {
    const regexNome = /[A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ'-][a-záéíóúàâêôãõüç'-].* [A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ'-][a-záéíóúàâêôãõüç'-].*/;
    const regexTelefone = /(\d{2})(\d{4})(\d{4})/;
    const regexMidia = /\w*/;
    const regexSocial = /true/;

    const vnome = regexNome.test(this.formEl.fnome.value);
    const vtelefone = regexTelefone.test(this.formEl.ftelefone.value);
    const vmidia = regexMidia.test(this.formEl.fmidia.value);
    const vsocial = regexSocial.test(this.formEl.fsocial.value);

    this.formEl.checkValidity()
      ? (document.getElementById("submit-form").disabled = false)
      : null;
        /*
        console.log('nome',this.formEl.fnome.validity.valid);
        console.log('tel', this.formEl.ftelefone.validity.valid);
        console.log('midia',this.formEl.fmidia.validity.valid);
        console.log('social',this.formEl.fsocial[0].validity.valid);
        console.log('social',this.formEl.fsocial[1].validity.valid);
        */
  }
  normalizarTelefone = ({ target }) => {
    target.value = target.value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2$3");
  };

  /**
   * @param {*} event
   * @memberof App
   */
  enviarFormulario(event) {
    event.preventDefault();

    const formData = new FormData(this.formEl);
    const searchParams = new URLSearchParams();
    const social = [];

    for (const data of formData) {
      data[0].includes("social")
        ? social.push(data[1])
        : searchParams.append(data[0], data[1]);
    }
    social.length > 1
      ? searchParams.append("social", social)
      : console.log("Sem rede social");

    //var urlencoded = new URLSearchParams()
    //urlencoded.append("campo", "valor")

    const requestOptions = {
      method: "POST",
      body: searchParams,
      redirect: "follow",
      mode: "no-cors"
    };

    fetch(this.server, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log("error", error));
  }
}

new App();
