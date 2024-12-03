// Navigation Logic
const welcomeScreen = document.getElementById('welcome-screen');
const setupScreen = document.getElementById('setup-screen');
const auctionScreen = document.getElementById('auction-screen');
const summaryScreen = document.getElementById('summary-screen');

const startAuctionBtn = document.getElementById('start-auction-btn');
const proceedToAuctionBtn = document.querySelector('#setup-screen #start-auction-btn');
const nextPlayerBtn = document.getElementById('next-player-btn');
const restartBtn = document.getElementById('restart-btn');

let teams = [];
let players = [];
let currentPlayerIndex = 0;
let lastBidTeam = null; // Track the last team to place a bid

// Show a specific screen and hide the others
function showScreen(screen) {
    welcomeScreen.style.display = 'none';
    setupScreen.style.display = 'none';
    auctionScreen.style.display = 'none';
    summaryScreen.style.display = 'none';
    screen.style.display = 'block';
}

// Event Listeners for Navigation
startAuctionBtn.addEventListener('click', () => {
    showScreen(setupScreen);
});

proceedToAuctionBtn.addEventListener('click', () => {
    if (teams.length === 0 || players.length === 0) {
        alert('Please add at least one team and one player to proceed.');
        return;
    }
    showScreen(auctionScreen);
    startAuction();
});

nextPlayerBtn.addEventListener('click', () => {
    nextPlayer();
});

restartBtn.addEventListener('click', () => {
    resetApp();
    showScreen(welcomeScreen);
});

// Team Management
const addTeamBtn = document.getElementById('add-team-btn');
const teamNameInput = document.getElementById('team-name');
const teamBalanceInput = document.getElementById('team-balance');  // Input for team balance
const teamList = document.getElementById('team-list');

addTeamBtn.addEventListener('click', () => {
    const teamName = teamNameInput.value.trim();
    const teamBalance = parseFloat(teamBalanceInput.value);

    // Log the inputs for debugging
    console.log('Team Name:', teamName);
    console.log('Team Balance:', teamBalance);

    // Ensure team name and balance are valid
    if (teamName === '' || isNaN(teamBalance) || teamBalance <= 0) {
        alert('Please enter a valid team name and balance.');
        return;
    }

    // Add team to teams array
    teams.push({ name: teamName, balance: teamBalance, players: [] });
    updateTeamList();

    // Clear the input fields after adding the team
    teamNameInput.value = '';
    teamBalanceInput.value = '';
});

function updateTeamList() {
    teamList.innerHTML = '';  // Clear the existing team list
    teams.forEach((team, index) => {
        const li = document.createElement('li');
        li.textContent = `${team.name} - Balance: ₹${team.balance}`;
        teamList.appendChild(li);
    });
}

// Player Management
const addPlayerBtn = document.getElementById('add-player-btn');
const playerNameInput = document.getElementById('player-name');
const playerBasePriceInput = document.getElementById('player-base-price');
const playerRoleSelect = document.getElementById('player-role');
const playerList = document.getElementById('player-list');

addPlayerBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    const basePrice = parseFloat(playerBasePriceInput.value);
    const role = playerRoleSelect.value;

    if (playerName === '' || isNaN(basePrice) || basePrice <= 0) {
        alert('Please enter valid player details.');
        return;
    }

    players.push({ name: playerName, basePrice, role, currentPrice: basePrice, team: null });
    updatePlayerList();
    playerNameInput.value = '';
    playerBasePriceInput.value = '';
});

function updatePlayerList() {
    playerList.innerHTML = '';  // Clear the existing player list
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - ${player.role} - ₹${player.basePrice}`;
        playerList.appendChild(li);
    });
}

// Auction Logic
function startAuction() {
    currentPlayerIndex = 0;
    updateAuctionScreen();
}

function updateAuctionScreen() {
    if (currentPlayerIndex >= players.length) {
        showSummary();
        return;
    }

    const player = players[currentPlayerIndex];
    document.getElementById('player-name-display').textContent = player.name;
    document.getElementById('base-price-display').textContent = player.basePrice;
    document.getElementById('current-price-display').textContent = player.currentPrice;

    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = '';

    teams.forEach((team, index) => {
        const button = document.createElement('button');
        button.textContent = `${team.name} - Balance: ₹${team.balance}`;
        button.addEventListener('click', () => {
            if (team.balance >= player.currentPrice + 10) {
                incrementBid(team);
                lastBidTeam = team; // Track the team that placed the bid
            } else {
                alert(`${team.name} does not have enough balance.`);
            }
        });
        teamsDiv.appendChild(button);
    });
}

function incrementBid(team) {
    const player = players[currentPlayerIndex];
    const bidAmount = 10; // Amount to increase the bid by
    player.currentPrice += bidAmount; // Increase the price for the next bid
    team.balance -= bidAmount; // Deduct the balance from the team
    updateAuctionScreen();
}

function nextPlayer() {
    if (lastBidTeam) {
        const player = players[currentPlayerIndex];
        player.team = lastBidTeam.name; // Register the player to the last team that placed a bid
        lastBidTeam.players.push(player); // Add the player to the team's roster
    }
    currentPlayerIndex++;
    updateAuctionScreen();
}

// Summary
function showSummary() {
    showScreen(summaryScreen);
    // No additional logic needed here for now
}

// Reset App
function resetApp() {
    teams = [];
    players = [];
    currentPlayerIndex = 0;
    updateTeamList();
    updatePlayerList();
}
