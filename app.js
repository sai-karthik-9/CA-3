document.addEventListener('DOMContentLoaded', function() {
    const randomMealSection = document.getElementById('randomMeal');
    const searchedMealsSection = document.getElementById('searchedMeals');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('modal');
    const searchedMealList = document.getElementById('searchedMealList');
    const closeBtn = document.querySelector('.close');

    // Fetch random meal on page load
    fetchRandomMeal();

    // Event listener for search input
    searchInput.addEventListener('input', function() {
        const searchQuery = this.value.trim();
        if (searchQuery !== '') {
            fetchMealByCategory(searchQuery);
        } else {
            hideSearchedMeals();
        }
    });

    // Event listener to open modal when random meal is clicked
    randomMealSection.addEventListener('click', function(event) {
        if (event.target.classList.contains('meal')) {
            const mealId = event.target.dataset.id;
            fetchIngredients(mealId);
        }
    });

    // Event listener to close modal
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Fetch a random meal
    function fetchRandomMeal() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                displayRandomMeal(meal);
            })
            .catch(error => console.error('Error fetching random meal:', error));
    }

    // Display random meal in the UI
    function displayRandomMeal(meal) {
        randomMealSection.innerHTML = `
            <div class="meal" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2>${meal.strMeal}</h2>
            </div>
        `;
    }

    // Fetch meals by category
    function fetchMealByCategory(category) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                const meals = data.meals;
                displaySearchedMeals(meals);
            })
            .catch(error => console.error('Error fetching meals by category:', error));
    }

    // Display searched meals in the UI
    function displaySearchedMeals(meals) {
        searchedMealList.innerHTML = '';
        meals.forEach(meal => {
            const mealElement = document.createElement('div');
            mealElement.innerHTML = `
                <div class="meal" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            `;
            searchedMealList.appendChild(mealElement);
        });
        searchedMealsSection.classList.remove('hidden');
    }

    // Hide searched meals section
    function hideSearchedMeals() {
        searchedMealsSection.classList.add('hidden');
    }

    // Fetch ingredients for a meal
    function fetchIngredients(mealId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const ingredients = getIngredientsArray(data.meals[0]);
                displayIngredientsModal(ingredients);
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    }

    // Extract ingredients from meal object
    function getIngredientsArray(meal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            } else {
                break;
            }
        }
        return ingredients;
    }

    // Display ingredients modal
    function displayIngredientsModal(ingredients) {
        const ingredientList = document.getElementById('ingredientList');
        ingredientList.innerHTML = '';
        ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientList.appendChild(li);
        });
        modal.style.display = 'block';
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
    }
});