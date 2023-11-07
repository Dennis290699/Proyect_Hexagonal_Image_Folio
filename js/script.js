let data; // Declara la variable data en un alcance más amplio
let imageChangeTimer; // Declarar imageChangeTimer aquí

fetch('../js/info.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData; // Asigna los datos del JSON a la variable data

        const personas = data.personas;
        const personNames = document.querySelectorAll('.person-name');

        personNames.forEach((element, index) => {
            element.textContent = personas[index].nombre;
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

// Código relacionado con el modal
const modal = document.getElementById("personModal");
const modalImage = document.querySelector(".modal-image");
const modalTitle = document.querySelector(".modal-title");
const modalInfo = document.querySelector(".modal-info");
const closeModal = document.getElementById("closeModal");
const aboutButtons = document.querySelectorAll(".about-button");

modal.addEventListener("load", function () {
    modal.style.display = "none";
    modalImage.src = "";
    modalImage.onload = null;
});

aboutButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const persona = data.personas[index];

        // Aplica la clase para la animación de desplazamiento
        modalImage.classList.add("slide-left-to-right");

        modalImage.style.opacity = 0;
        modalImage.onload = null;

        //Toma las imagenes del Json
        modalImage.src = persona.imagenes[0];

        modalImage.onload = function () {
            modalImage.style.opacity = 1;
        };

        modalTitle.textContent = `${persona.nombre} ${persona.apellido} (${persona.título})`;
        modalInfo.textContent = `${persona.text_about_me}`;

        let currentImageIndex = 0;

        function showImage(index) {
            modalImage.style.opacity = 0; // Establece la opacidad a cero
            modalImage.onload = null; // Elimina el evento onload anterior
            modalImage.src = persona.imagenes[index];

            modalImage.onload = function () {
                modalImage.style.opacity = 1; // Restaura la opacidad una vez que la imagen se carga
            };
        }

        showImage(currentImageIndex);

        const imageChangeInterval = 2000;

        function autoChangeImage() {
            currentImageIndex = (currentImageIndex + 1) % persona.imagenes.length;
            showImage(currentImageIndex);
        }

        // Detén el temporizador de cambio de imágenes al hacer clic en una persona
        clearInterval(imageChangeTimer);

        // Inicia el temporizador nuevamente
        imageChangeTimer = setInterval(autoChangeImage, imageChangeInterval);

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.style.display = "none";
                clearInterval(imageChangeTimer);
            }
        });

        modal.classList.add("modal-animation");

        modal.style.display = "block";
    });
});

closeModal.addEventListener("click", () => {
    // Detén el temporizador de cambio de imágenes al cerrar el modal
    clearInterval(imageChangeTimer);

    modal.classList.add("closing"); // Agregar la clase "closing" para aplicar la animación de cierre
    setTimeout(() => {
        modal.style.display = "none"; // Ocultar el modal después de que termine la animación
        modal.classList.remove("closing"); // Quitar la clase "closing"

        // Oculta el modal y limpia las imágenes
        modal.style.display = "none";
        modalImage.src = "";
        modalImage.onload = null;

    }, 500); // Ajusta el valor en milisegundos para que coincida con la duración de la animación
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        modalImage.onload = null;
    }
});