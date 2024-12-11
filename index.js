const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=386';
const pokemonDiv = document.getElementById('pokemon');
const pokemonListDiv = document.getElementById('pokemonList');
const teamDiv = document.getElementById('team');
const suggestionList = document.getElementById('suggestionList');

let team = [];
let currentPokemon = null;

// Hjälpfunktion för att hämta data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching data');
        return await response.json();
    } catch (error) {
        console.error(error);
        showError(error.message);
    }
}

// Funktion: Hämta och visa Pokémon-listan
async function fetchPokemonList() {
    const data = await fetchData(API_URL);
    if (data) displayPokemonList(data.results);
}

// Funktion: Visa lista med Pokémon
function displayPokemonList(pokemonList) {
    pokemonListDiv.innerHTML = pokemonList.map(pokemon => `<p>${pokemon.name}</p>`).join('');
}

// Funktion: Sök efter en Pokémon
async function searchPokemon() {
    const name = document.getElementById('search').value.toLowerCase();
    if (!name) return;

    const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (data) displayPokemonDetails(data);
}

// Funktion: Visa Pokémon-data
function displayPokemonDetails(data) {
    currentPokemon = data;
    pokemonDiv.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <p><strong>Weight:</strong> ${data.weight}lbs</p>
        <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
        <img src="${data.sprites.front_default}" alt="${data.name}">
    `;
    fetchSpeciesData(data.species.url);
}

// Funktion: Hämta och visa evolution chain
async function fetchSpeciesData(speciesUrl) {
    const speciesData = await fetchData(speciesUrl);
    if (speciesData) {
        const evolutionData = await fetchData(speciesData.evolution_chain.url);
        if (evolutionData) displayEvolutionChain(getEvolutions(evolutionData.chain));
    }
}

// Funktion: Hämta alla evolutioner i kedjan
function getEvolutions(chain) {
    const evolutions = [];
    while (chain) {
        evolutions.push(chain.species.name.toUpperCase());
        chain = chain.evolves_to[0];
    }
    return evolutions.length > 1 ? evolutions : ["This Pokémon does not evolve!"];
}

// Funktion: Visa evolution chain
function displayEvolutionChain(evolutions) {
    pokemonDiv.innerHTML += `<p><strong>Evolution Chain:</strong> ${evolutions.join(' ➡️ ')}</p>`;
}

// Funktion: Lägg till Pokémon i laget
function addToTeam() {
    if (!currentPokemon) return alert("Välj en Pokémon först!");
    if (team.length >= 6) return alert("Du kan bara ha 6 Pokémon i ditt lag!");
    if (team.some(p => p.name === currentPokemon.name)) {
        return alert(`${currentPokemon.name.toUpperCase()} är redan i ditt lag!`);
    }

    team.push(currentPokemon);
    updateTeamDisplay();
}

// Funktion: Uppdatera visning av laget
function updateTeamDisplay() {
    teamDiv.innerHTML = team.map(pokemon => `
        <div class="team-pokemon">
            <h4>${pokemon.name.toUpperCase()}</h4>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
            <button onclick="removeFromTeam('${pokemon.name}')">Remove</button>
        </div>
    `).join('');
}

// Funktion: Ta bort Pokémon från laget
function removeFromTeam(pokemonName) {
    team = team.filter(pokemon => pokemon.name !== pokemonName);
    updateTeamDisplay();
}

// Funktion: Generera slumpmässiga Pokémon
async function generateRandomPokemon() {
    const ids = Array.from({ length: 6 }, () => Math.floor(Math.random() * 386) + 1); // 6 slumpmässiga IDs
    const promises = ids.map(id => fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`)); // Hämta data
    const pokemonData = await Promise.all(promises);

    // Filtrera bort misslyckade anrop
    displayRandomSuggestions(pokemonData.filter(Boolean));
}

// Funktion: Visa slumpmässiga Pokémon-förslag
function displayRandomSuggestions(pokemonList) {
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


// Event listeners
document.getElementById('addToTeam').addEventListener('click', addToTeam);
document.getElementById('generateRandom').addEventListener('click', generateRandomPokemon);

// Initiera
fetchPokemonList();
