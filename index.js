const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=386'; // URL till Pokémon API för att hämta säsong 1-3
const pokemonDiv = document.getElementById('pokemon'); // Div för att visa Pokémon-data
const pokemonListDiv = document.getElementById('pokemonList'); // Div för att visa lista med Pokémon

// Funktion: Hämta och logga listan med Pokémon
function fetchPokemonList() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log('Pokémon list:', data.results);
            displayPokemonList(data.results); // Skicka vidare listan för att visas i DOM
        })
        .catch(error => console.error('Error:', error));
}

// Funktion: Visa Pokémon-listan i DOM
function displayPokemonList(pokemonList) {
    pokemonListDiv.innerHTML = ''; // Töm listan först
    pokemonList.forEach(pokemon => {
        const pokemonItem = document.createElement('p'); // Skapa ett nytt <p>-element
        pokemonItem.textContent = pokemon.name; // Lägg till Pokémon-namnet
        pokemonListDiv.appendChild(pokemonItem); // Lägg till <p> i listan
    });
}

// Funktion: Hämta data om en specifik Pokémon
function searchPokemon() {
    const name = document.getElementById('search').value.toLowerCase(); // Hämta sökfältets värde
    if (!name) return; // Om inget namn anges, gör inget

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon not found'); // Kasta ett fel om Pokémon inte hittas
            }
            return response.json();
        })
        .then(data => displayPokemonDetails(data)) // Skicka vidare data för att visas
        .catch(error => showError(error.message));
}

// Funktion: Visa felmeddelanden i DOM
function showError(message) {
    pokemonDiv.innerHTML = `<p>${message}</p>`;
}

// Funktion: Visa Pokémon-data (namn, vikt, typ, bild)
function displayPokemonDetails(data) {
    pokemonDiv.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <p><strong>Weight:</strong> ${data.weight}lbs</p>
        <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
        <img src="${data.sprites.front_default}" alt="${data.name}">
    `;
    fetchSpeciesData(data.species.url); // Hämta artens data för att få evolution chain
}

// Funktion: Hämta artens data för att hitta evolution chain
function fetchSpeciesData(speciesUrl) {
    fetch(speciesUrl)
        .then(response => response.json())
        .then(speciesData => fetchEvolutionChain(speciesData.evolution_chain.url))
        .catch(error => showError('Error fetching species data'));
}

// Funktion: Hämta och visa evolution chain
function fetchEvolutionChain(evolutionChainUrl) {
    fetch(evolutionChainUrl)
        .then(response => response.json())
        .then(evolutionData => {
            const evolutions = getEvolutions(evolutionData.chain);
            displayEvolutionChain(evolutions); // Visa evolutionerna
        })
        .catch(error => showError('Error fetching evolution chain'));
}

// Funktion: Hämta alla evolutioner i kedjan
function getEvolutions(chain) {
    const evolutions = [];
    let current = chain;
    while (current) {
        evolutions.push(current.species.name.toUpperCase());
        current = current.evolves_to[0]; // Gå till nästa evolution
    }
    if (evolutions.length === 1) {
        return ["This Pokémon does not evolve!"];
    }
    return evolutions;
}

// Funktion: Visa evolution chain i DOM
function displayEvolutionChain(evolutions) {
    const evolutionHtml = `<p><strong>Evolution Chain:</strong> ${evolutions.join(' ➡️ ')}</p>`;
    pokemonDiv.innerHTML += evolutionHtml; // Lägg till evolutionkedjan i Pokémon-diven
}

// Kör vid sidladdning: Hämta och visa Pokémon-listan
fetchPokemonList();



let team = []; // Array för att lagra Pokémon i laget
let currentPokemon = null; // För att lagra den Pokémon som visas just nu

// Funktion: Lägg till Pokémon till laget
function addToTeam() {
    if (!currentPokemon) {
        alert("Välj en Pokémon först!");
        return;
    }

    if (team.length >= 6) {
        alert("Du kan bara ha 6 Pokémon i ditt lag!");
        return;
    }

    if (team.some(pokemon => pokemon.name === currentPokemon.name)) {
        alert(`${currentPokemon.name.toUpperCase()} är redan i ditt lag!`);
        return;
    }

    team.push(currentPokemon); // Lägg till Pokémon i laget
    updateTeamDisplay(); // Uppdatera visningen av laget
}

// Funktion: Uppdatera lagets visning
function updateTeamDisplay() {
    const teamDiv = document.getElementById('team');
    teamDiv.innerHTML = ''; // Töm lagets innehåll

    team.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'team-pokemon';
        pokemonCard.innerHTML = `
            <h4>${pokemon.name.toUpperCase()}</h4>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
            <button onclick="removeFromTeam('${pokemon.name}')">Remove</button>
        `;
        teamDiv.appendChild(pokemonCard);
    });
}

// Funktion: Ta bort Pokémon från laget
function removeFromTeam(pokemonName) {
    team = team.filter(pokemon => pokemon.name !== pokemonName); // Filtrera bort Pokémon
    updateTeamDisplay(); // Uppdatera visningen
}

// Modifiera displayPokemonDetails för att spara aktuell Pokémon
function displayPokemonDetails(data) {
    currentPokemon = data; // Spara den aktuella Pokémon
    pokemonDiv.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <p><strong>Weight:</strong> ${data.weight}lbs</p>
        <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
        <img src="${data.sprites.front_default}" alt="${data.name}">
    `;

    fetchSpeciesData(data.species.url); // Hämta artens data för att få evolution chain
}

// Lägg till en event listener för "Lägg till i laget"-knappen
document.getElementById('addToTeam').addEventListener('click', addToTeam);




// Funktion: Generera 6 slumpmässiga Pokémon från generation 1-3
function generateRandomPokemon() {
    const randomPokemon = []; // För att lagra slumpmässiga Pokémon

    for (let i = 0; i < 6; i++) {
        const randomId = Math.floor(Math.random() * 386) + 1; // Generation 1-3 (ID 1-386)
        randomPokemon.push(randomId);
    }

    fetchRandomPokemonDetails(randomPokemon);
}

// Funktion: Hämta detaljer för slumpmässiga Pokémon
function fetchRandomPokemonDetails(ids) {
    const promises = ids.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));

    Promise.all(promises)
        .then(pokemonData => displayRandomSuggestions(pokemonData))
        .catch(error => console.error('Error fetching random Pokémon:', error));
}

// Funktion: Visa slumpmässiga Pokémon-förslag i listan
function displayRandomSuggestions(pokemonList) {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = ''; // Töm listan först

    pokemonList.forEach(pokemon => {
        const listItem = document.createElement('li');
        listItem.textContent = pokemon.name.toUpperCase();
        listItem.style.cursor = 'pointer';

        // Lägg till en klickhändelse för att visa detaljer om Pokémon
        listItem.addEventListener('click', () => displayPokemonDetails(pokemon));

        suggestionList.appendChild(listItem);
    });
}

// Lägg till händelselyssnare för "Generera 6 Pokémon"-knappen
document.getElementById('generateRandom').addEventListener('click', generateRandomPokemon);

  

 