document.addEventListener('DOMContentLoaded', iniciarApp);

const selectCategoria = document.querySelector('#categorias');
selectCategoria.addEventListener('change', SeleccionarCategoria)

function iniciarApp() {
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
    }) 
}