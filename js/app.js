document.addEventListener('DOMContentLoaded', iniciarApp);

const selectCategoria = document.querySelector('#categorias');
selectCategoria.addEventListener('change', SeleccionarCategoria)

const resultado = document.querySelector('#resultado');

//instnaciar modal con bootstrap
const modal = new bootstrap.Modal('#modal', {})
;function iniciarApp() {
    obtenerCategorias();
}

function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php"
    fetch(url)
        .then(Response =>{
            return Response.json();
        })
        .then(resultado =>{
            MostrarCategoria(resultado.categories);
        })

}

function MostrarCategoria(categorias = []) {
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.strCategory
        option.textContent = categoria.strCategory;

        selectCategoria.appendChild(option);

    });
}

function SeleccionarCategoria(e) {
    const categoria = e.target.value;

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    fetch(url)
        .then(response => response.json())
        .then(resultado => mostrarRecetas(resultado.meals))

}

function mostrarRecetas(recetas=[]) {

    // limpiar el #resultado
    LimpiarHtml(resultado);

    const heading = document.createElement('h2');
    heading.classList.add('text-center','text-blank', 'my-5');
    heading.textContent = recetas.length ? 'Resultados' : 'No hay resultados';
    resultado.appendChild(heading);

    // iterar en los rezultados
    recetas.forEach(receta => {

        const {idMeal, strMeal, strMealThumb } = receta;

        const recetaContenedor = document.createElement('DIV');
        recetaContenedor.classList.add('col-md-4');

        const recetaCard = document.createElement('div');
        recetaCard.classList.add('card', 'mb-4');

        const recetaImagen = document.createElement('IMG');
        recetaImagen.classList.add('card-img-top');
        recetaImagen.alt= `Imagen de la receta ${strMeal}`;
        recetaImagen.src= strMealThumb;

        const recetaCardBody=document.createElement('div');
        recetaCardBody.classList.add('card-body');

        const recetaHeadin = document.createElement('H3');
        recetaHeadin.classList.add('card-title', 'mb-3');
        recetaHeadin.textContent = strMeal; 

        const recetaButon = document.createElement('BUTTON');
        recetaButon.classList.add('btn', 'btn-danger', 'w-100');
        recetaButon.textContent = 'Ver Receta';

        //llamar modal
        // recetaButon.dataset.bsTarget = "#modal";
        // recetaButon.dataset.bsToggle = "modal";
        recetaButon.onclick = function(){
            selecionarReceta(idMeal);
        }


        //inyectar en el Html
        recetaCardBody.appendChild(recetaHeadin);
        recetaCardBody.appendChild(recetaButon);
        
        recetaCard.appendChild(recetaImagen);
        recetaCard.appendChild(recetaCardBody);

        recetaContenedor.appendChild(recetaCard);

        //agregar al #resultado(existente en el html)
        resultado.appendChild(recetaContenedor);

        
    }) 
}
function selecionarReceta(id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url)
       .then(response => response.json())
       .then(resultado => mostrarRecetaModal(resultado.meals[0]))
}

function mostrarRecetaModal(receta) {
    console.log(receta);
    const {idMeal, strInstructions, strMeal, strMealThumb } = receta;
    const modalTitle  = document.querySelector('.modal .modal-title');
    const modalBody = document.querySelector('.modal .modal-body');
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
        <img class="img-fluid" src="${strMealThumb}" alt= "receta ${strMeal}"/>
        <h3 class="my-3">Instrucciones</h3>
        <p>${strInstructions}</p>
        <h3 class="my-3">Ingredientes y cantidades</h3>
    `;

    const listGroup = document.createElement('UL');
    listGroup.classList.add('list-group');
    //Mostrar cantidades e ingredientes

    for (let i = 0; i < 20; i++) {

        //validar si contiene algo
        if (receta[`strIngredient${i}`]) {
            const ingrediente = receta[`strIngredient${i}`];
            const cantidad = receta[`strMeasure${i}`];

            const ingredienteLi = document.createElement('li'); 
            ingredienteLi.classList.add('list-group-item');
            ingredienteLi.textContent = `${ingrediente} - ${cantidad} `
            
            listGroup.appendChild(ingredienteLi);
        }
    }
    modalBody.appendChild(listGroup);

    const modalFooter = document.querySelector('.modal-footer');
    LimpiarHtml(modalFooter)
    //Botones de cerrar y favorito

    const btnFavorito = document.createElement('button');
    btnFavorito.classList.add('btn', 'btn-danger', 'col');
    //validar texto si existe(para eliminar) y si no para guardar favorito
    btnFavorito.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';

    //localstorage
    btnFavorito.onclick = function () {
        // si no existe se guarda en favoritos
        if (existeStorage(idMeal)) {
            EliminarFavorito(idMeal)
            btnFavorito.textContent = 'Guardar Favorito';
            return

        }
        agregarFavorito({
            id: idMeal,
            strMeal: strMeal,
            strMealThumb: strMealThumb
        });
        btnFavorito.textContent = 'Eliminar Favorito';
    };

    const btnCerrar = document.createElement('button');
    btnCerrar.classList.add('btn', 'btn-secondary', 'col');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.onclick = function () {
        // cerrar ventana
        modal.hide();
    }
    
    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnCerrar);

    //mostrar modal
    modal.show();
}

function LimpiarHtml(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}

function agregarFavorito(receta) {
    //si no existe favoritos = arreglo vacio
   const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
   //agregar al local storage, a favoritos 
   localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta])); 
}

function EliminarFavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    const nuevosFavoritos = favoritos.filter(favorito => favoritos.id !== id);
    localStorage.setItem('favoritos', JSON.stringify([nuevosFavoritos])); 
}

function existeStorage(id) {
    //si no existe favoritos = arreglo vacio
   const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
   //si existe devuelve true
   return favoritos.some(favorito => favorito.id === id);
}