document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContact");
  const lang = localStorage.getItem("lang");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const subject = form.elements["subject"].value.trim();
    const message = form.elements["message"].value.trim();

    // Validación del campo "name" (mínimo 3 caracteres)
    if (name.length < 3) {
      Swal.fire({
        icon: "error",
        title: getTranslation("Main.alerts.nameInvalid.title"),
        text: getTranslation("Main.alerts.nameInvalid.text")
      });
      return;
    }

    // Validación del campo "email"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: getTranslation("Main.alerts.emailInvalid.title"),
        text: getTranslation("Main.alerts.emailInvalid.text")
      });
      return;
    }

    // Validación del campo "subject" (mínimo 4 caracteres si está presente)
    if (subject.length < 4) {
      Swal.fire({
        icon: "error",
        title: getTranslation("Main.alerts.subjectShort.title"),
        text: getTranslation("Main.alerts.subjectShort.text")
      });
      return;
    }

    // Validación del campo "message" (mínimo 10 caracteres)
    if (message.length < 10) {
      Swal.fire({
        icon: "error",
        title: getTranslation("Main.alerts.messageShort.title"),
        text: getTranslation("Main.alerts.messageShort.text")
      });
      return;
    }

    // Si todo pasa

    emailjs.sendForm('service_portfolio', 'template_8riazfi', this)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: getTranslation("Main.alerts.messageSent.title"),
          text: getTranslation("Main.alerts.messageSent.text"),
          confirmButtonText: "Aceptar"
        }).then(() => {
          form.reset();
        });
      }, (error) => {
        alert('Error al enviar el mensaje: ' + JSON.stringify(error));
      });
  });
});