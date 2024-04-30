async function fetchRandomMeal() {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      randomMeals(data.meals[0]);
    } catch (error) {
      console.error('Error fetching random meal:', error);
    }
  }
  
  function randomMeals(meal) {
    const mealImage = document.querySelector('#meal-container img');
    const mealName = document.querySelector('#meal-name');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealName.textContent = meal.strMeal;
  }
  
  async function mealsByMenu(category) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching meals for category '${category}':`, error);
      throw error;
    }
  }
  
  function displayFoods(meals) {
    const searchedMealsContainer = document.getElementById('searched-meals-container');
    searchedMealsContainer.innerHTML = '';
    meals.forEach(meal => {
      const mealContainer = document.createElement('div');
      mealContainer.classList.add('meal');
      mealContainer.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strMeal}</p>
      `;
      mealContainer.addEventListener('click', () => {
        ingredientsList(meal.idMeal)
          .then(ingredients => displayItems(meal, ingredients))
          .catch(error => console.error('Error fetching ingredients:', error));
      });
      searchedMealsContainer.appendChild(mealContainer);
    });
    showSearchedMeals();
  }
  
  function showSearchedMeals() {
    const searchedCatogeries = document.getElementById('searched-meals');
    searchedCatogeries.style.display = 'block';
  }
  
  function hideSearchedMeals() {
    const searchedCatogeries = document.getElementById('searched-meals');
    searchedCatogeries.style.display = 'none';
  }
  
  async function ingredientsList(mealId) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();
      const meal = data.meals[0];
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
          ingredients.push(`${ingredient} - ${measure}`);
        } else if (ingredient) {
          ingredients.push(ingredient);
        }
      }
      return ingredients;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }
  
  function displayItems(meal, ingredients) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <h3>Ingredients:</h3>
      <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
    `;
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
  }
  
  window.addEventListener('click', event => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  fetchRandomMeal();
  
  const catInput = document.getElementById('search');
  catInput.addEventListener('input', () => {
    const searchValue = catInput.value.trim();
    if (searchValue) {
      mealsByMenu(searchValue)
        .then(data => displayFoods(data.meals))
        .catch(error => console.error(`Error fetching meals for category '${searchValue}':`, error));
    } else {
      hideSearchedMeals();
    }
  });  
