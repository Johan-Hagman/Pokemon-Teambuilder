const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=386'; // Hämtar säsong 1-3

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
                    <p><strong>Weight:</strong> ${data.weight}lbs</p>
                    <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                `;
                fetch(data.species.url)
                .then(response => response.json())
                .then(speciesData => {
                    const evolutionChainUrl = speciesData.evolution_chain.url;

                    // Hämta evolution chain
                    fetch(evolutionChainUrl)
                        .then(response => response.json())
                        .then(evolutionData => {
                            const evolutions = getEvolutions(evolutionData.chain);
                            const evolutionHtml = `<p><strong>Evolution Chain:</strong> ${evolutions.join(' ➡️ ')}</p>`;
                            pokemonDiv.innerHTML += evolutionHtml;
                        });
                });
            })
            .catch(error => {
                const pokemonDiv = document.getElementById('pokemon');
                pokemonDiv.innerHTML = `<p>${error.message}</p>`;
            });
        }

        function getEvolutions(chain) {
            const evolutions = [];
            let current = chain;
            while (current) {
                evolutions.push(current.species.name.toUpperCase());
                current = current.evolves_to[0]; // Gå till nästa evolution
            }
        if (evolutions.length === 1) {
return ["This pokemon does not evolve!"];
        }
            return evolutions;
        }


        const pokemonListDiv = document.getElementById('pokemonList');

// Funktion för att hämta Pokémon baserat på en URL
function fetchPokemon(API_URL) {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            pokemonListDiv.innerHTML = ''; // Töm listan först
            data.results.forEach(pokemon => {
                const pokemonItem = document.createElement('p');
                pokemonItem.textContent = pokemon.name;
                pokemonListDiv.appendChild(pokemonItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            pokemonListDiv.innerHTML = `<p>Could not fetch Pokémon: ${error.message}</p>`;
        });
}













  

 