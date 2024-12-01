const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // Hämtar säsong 1

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        console.log('Pokémon list:', data.results);
        data.results.forEach(pokemon => {
            console.log(pokemon.name); // Visa namnen på Pokémon
        });
    })
    .catch(error => console.error('Error:', error));




    function searchPokemon() {
        const name = document.getElementById('search').value.toLowerCase();
        const API_URL = `https://pokeapi.co/api/v2/pokemon/${name}`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon not found');
                }
                return response.json();
            })
            .then(data => {
                const pokemonDiv = document.getElementById('pokemon');
                pokemonDiv.innerHTML = `
                    <h2>${data.name.toUpperCase()}</h2>
                    <p><strong>Weight:</strong> ${data.weight} lbs</p>
                    <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                    <img src="${data.sprites.front_default}" alt="${data.name}">`;
                    document.getElementById('pokemon-card').style.display = 'block';
                    
            })
            .catch(error => {
                document.getElementById('pokemon-card').style.display = 'block';
                const pokemonDiv = document.getElementById('pokemon');
                pokemonDiv.innerHTML = `<p>${error.message}</p>`;
               

            });
        }











  

 