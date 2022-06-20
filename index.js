const INITIAL_TIME = 60000;
const TIME_INTERVAL = 100;
const INITIAL_SCORE = 0;
const WORD_LENGTH = 5;

const init = () => {
	const words = ["encore","lequel","encore","rien","quand","chambre","prendre","faire","passer","attendre","ou","non","pays","sur","me","rester","quatre","son","rien","vingt","nouveau","comme","ciel","avant","aimer","porte","bien","chez","moins","me","il","où","deux","jeune","tête","chercher","non","venir","chambre","dieu","an","entrer","bien","moi","yeux","pied","sans","tant","te","mourir","pour","entre","être","pays","petit","quel","ne","ne","cela","chose","il","au","passer","croire","parce","que","moment","et","femme","y","trois","pays","sans","vivre","passer","contre","revenir","ville","maison","ce","quel","dont","ami","heure","eau","devenir","venir","gens","porter","rester","aimer","jamais","comprendre","dire","premier","regard","beau","nom","quel","ainsi","quand","se","dieu","oui","trois","demander","car","heure","cela","jour","depuis","entendre","ça","alors","au","le","frère","tenir","là","tête","avec","rien","votre","autre","mer","ami","maison","lequel","lui","si","chercher","jusque","oui","très","ce","chaque","aussi","bon","pendant","avoir","enfant","rendre","air","plus","gens","vieux","sembler","tout","moment","seul","monde","petit","déjà","mer","je","beau","nouveau","si","quatre","notre","falloir","tenir","cent","aimer","être","penser","fois","donner","bon","alors","croire","mari","qui","mon","comprendre","chercher","chez","dont","jour","faire","porter","tu","vie","tout","gens","enfant","ce","moi","parler","quelque","dans","père","trop","ciel","entrer","entendre","il","toi","devant","car","depuis","après","ville","comprendre","en","vieux","du","de","pas","par","voir","nuit","mais","pas","et","heure","votre","très","sous","nom","même","ni","reprendre","pouvoir","elle","au","homme","main","avec","sembler","frère","entendre","leur","dont","puis","homme","aller","parler","si","notre","autre","voix","premier","toi","oui","mari","savoir","se","tant","porter","soir","celui","jeune","pouvoir","deux","jusque","chambre","lequel","avoir","premier","chez","aussi","amour","ne","sentir","mort","nuit","encore","vivre","contre","trouver","mettre","sentir","parce","que","an","comme","entre","y","revenir","qui","puis","tu","beau","enfin","très","sans","reprendre","ville","devoir","sortir","celui","peu","de","mettre","elle","monde","pour","ni","moins","vivre","ou","vingt","vouloir","yeux","à","y","aller","arriver","vous","on","même","lui","appeler","nous","rue","avant","revenir","un","donc","contre","trop","depuis","ciel","son","mari","pour","peu","quelque","que","temps","rue","savoir","dire","aussi","vouloir","eau","ça","mourir","grand","votre","grand","arriver","entrer","regarder","terre","là","fille","à","devenir","noir","seul","ça","où","non","fille","rester","sur","jamais","côté","soir","noir","o"];
	const previousWords = document.getElementById("previousWords");
	const currentWord = document.getElementById("currentWord");
	const nextWords = document.getElementById("nextWords");
	const timer = document.getElementById("timer");
	const score_elem = document.getElementById("score");
	const accuracy_elem = document.getElementById("accuracy");
	const play = document.getElementById("play");

	/**
	 * Check the equality of the typed word and the next word.
	 */
	const checkWord = () => {
		return nextWordsList[0].startsWith(currentWord.value.trim()) ? "#0F0" : "#F00";
	};

	/**
	 * Adds the word to arr and as a child of elem in DOM.
	 */
	const addWord = (arr, elem, word, color = "#000") => {
		arr.push(word);
		const child = document.createElement("div");
		child.innerText = word;
		child.style.color = color;
		elem.appendChild(child);
	};

	/**
	 * Removes the first word of arr and removes it from DOM.
	 */
	const removeFirstWord = (arr, elem) => {
		arr.shift();
		const child = elem.children[0];
		child.remove();
	};

	/**
	 * Adds nb random words to arr and elem in DOM.
	 */
	const populateList = (arr, elem, nb) => {
		for (let n = 0; n < nb; n++) {
			const index = Math.floor(Math.random() * words.length);
			let word = words[index];
			addWord(arr, elem, word);
		}
	}

	/**
	 * Displays the time in DOM.
	 */
	const displayTimer = () => {
		timer.innerText = " " + (time / 1000).toFixed(1);
	}

	/**
	 * Updates the time.
	 */
	const updateTimer = () => {
		time -= TIME_INTERVAL;
		if (time === 0) {
			currentWord.disabled = true;
			currentWord.value = "";
			clearInterval(timerInterval);
		}
		displayTimer();
	}

	/**
	 * Displays the score in DOM.
	 */
	const displayScore = () => {
		let text;
		let WPM = ((score / WORD_LENGTH) / ((INITIAL_TIME - time) / INITIAL_TIME)).toFixed(2);
		if (isNaN(WPM)) {
			text = " 0.00";
		} else {
			text = " " + WPM.toString();
		}
		score_elem.innerText = text;
	}

	/**
	 * Displays accuracy in DOM.
	 */
	const displayAccuracy = () => {
		let text;
		if (isNaN(accuracy)) {
			text = " 0.00%";
		} else {
			text = " " + accuracy.toFixed(2).toString() + "%";
		}
		accuracy_elem.innerText = text;
	}

	const update = () => {
		updateTimer();
		displayScore();
		displayAccuracy();
	}

	/**
	 * Executes each time a key is released in the textarea currentWord.
	 * 
	 * 
	 */
	currentWord.addEventListener("keyup", (e) => {
		if (e.key === " ") {
			if (nextWordsList[0] === currentWord.value.trim()) {
				score += currentWord.value.trim().length;
			}

			potentialScore += nextWordsList[0].length;
			accuracy = (score / potentialScore * 100);
			if (previousWordsList.length === 10) {
				removeFirstWord(previousWordsList, previousWords);
			}
			addWord(previousWordsList, previousWords, nextWordsList[0], checkWord());
			removeFirstWord(nextWordsList, nextWords);
			currentWord.value = "";
			populateList(nextWordsList, nextWords, 1);
		} else {
			currentWord.style.color = checkWord();
		}
	});

	/**
	 * Executes when play is clicked.
	 * 
	 * Resets the game.
	 * Starts a new timer.
	 */
	play.addEventListener("click", (e) => {
		score = 0;
		potentialScore = 0;
		accuracy = (score / potentialScore * 100);
		time = INITIAL_TIME;
		clearInterval(timerInterval);
		timerInterval = setInterval(update, TIME_INTERVAL);

		previousWordsList = [];
		previousWords.innerHTML = "";
		
		currentWord.value = "";
		currentWord.disabled = false;
		currentWord.focus();
	});

	let score = INITIAL_SCORE;
	let potentialScore = INITIAL_SCORE;
	let accuracy = (score / potentialScore * 100);
	let time = INITIAL_TIME; // In milliseconds
	let timerInterval;
	displayTimer();
	displayScore();
	displayAccuracy();

	let previousWordsList = [];
	let nextWordsList = [];
	populateList(nextWordsList, nextWords, 10);
}

init();