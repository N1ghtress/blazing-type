const init = () => {
	const wordList = 
	["encore","lequel","encore","rien","quand","chambre","prendre","faire","passer","attendre","ou","non","pays","sur","me","rester","quatre","son","rien","vingt","nouveau","comme","ciel","avant","aimer","porte","bien","chez","moins","me","il","où","deux","jeune","tête","chercher","non","venir","chambre","dieu","an","entrer","bien","moi","yeux","pied","sans","tant","te","mourir","pour","entre","être","pays","petit","quel","ne","ne","cela","chose","il","au","passer","croire","parce","que","moment","et","femme","y","trois","pays","sans","vivre","passer","contre","revenir","ville","maison","ce","quel","dont","ami","heure","eau","devenir","venir","gens","porter","rester","aimer","jamais","comprendre","dire","premier","regard","beau","nom","quel","ainsi","quand","se","dieu","oui","trois","demander","car","heure","cela","jour","depuis","entendre","ça","alors","au","le","frère","tenir","là","tête","avec","rien","votre","autre","mer","ami","maison","lequel","lui","si","chercher","jusque","oui","très","ce","chaque","aussi","bon","pendant","avoir","enfant","rendre","air","plus","gens","vieux","sembler","tout","moment","seul","monde","petit","déjà","mer","je","beau","nouveau","si","quatre","notre","falloir","tenir","cent","aimer","être","penser","fois","donner","bon","alors","croire","mari","qui","mon","comprendre","chercher","chez","dont","jour","faire","porter","tu","vie","tout","gens","enfant","ce","moi","parler","quelque","dans","père","trop","ciel","entrer","entendre","il","toi","devant","car","depuis","après","ville","comprendre","en","vieux","du","de","pas","par","voir","nuit","mais","pas","et","heure","votre","très","sous","nom","même","ni","reprendre","pouvoir","elle","au","homme","main","avec","sembler","frère","entendre","leur","dont","puis","homme","aller","parler","si","notre","autre","voix","premier","toi","oui","mari","savoir","se","tant","porter","soir","celui","jeune","pouvoir","deux","jusque","chambre","lequel","avoir","premier","chez","aussi","amour","ne","sentir","mort","nuit","encore","vivre","contre","trouver","mettre","sentir","parce","que","an","comme","entre","y","revenir","qui","puis","tu","beau","enfin","très","sans","reprendre","ville","devoir","sortir","celui","peu","de","mettre","elle","monde","pour","ni","moins","vivre","ou","vingt","vouloir","yeux","à","y","aller","arriver","vous","on","même","lui","appeler","nous","rue","avant","revenir","un","donc","contre","trop","depuis","ciel","son","mari","pour","peu","quelque","que","temps","rue","savoir","dire","aussi","vouloir","eau","ça","mourir","grand","votre","grand","arriver","entrer","regarder","terre","là","fille","à","devenir","noir","seul","ça","où","non","fille","rester","sur","jamais","côté","soir","noir","o"];
	const INITIAL_TIME = 60000 // Milliseconds
	const TIME_INTERVAL = 100	// Milliseconds
	const MINUTES_IN_A_MILLISECOND = 1 / 60000
	const INITIAL_KEYSTROKES = 0
	const INITIAL_SCORE = 0
	const NUMBER_DECIMALS = 1
	const UNIT_DISPLAY_SIZE = 2
	const NUMBER_DISPLAY_SIZE = 4 + NUMBER_DECIMALS + UNIT_DISPLAY_SIZE
	const WORD_LENGTH = wordList.reduce((acc, cur) => acc + cur.length, 0) / wordList.length

	const input_elem = document.getElementById("input")
	const words_elem = document.getElementById("words")
	const timer_elem = document.getElementById("timer")
	const score_elem = document.getElementById("score")
	const accuracy_elem = document.getElementById("accuracy")

	/**
	 * Check the equality of the typed word and the next word.
	 */
	const checkWord = () => {
		return {
			checkedColor: words_elem.children[spaces % 10].innerText.startsWith(input_elem.value.trim()) ? "#0F0" : "#F00",
			validateColor: words_elem.children[spaces % 10].innerText === input_elem.value.trim() ? "#0F0" : "#F00",
		}
	}

	const countValidKeyStrokes = () => {
		let count = 0;
		let word = words_elem.children[spaces % 10].innerText;
		let typedWord = input_elem.value.trim();

		for (let i = 0; i < Math.min(word.length, typedWord.length); i++) {
			if (word[i] === typedWord[i]) count += 1;
		}

		return count;
	}

	/**
	 * Adds the word at wordIndex from arr to the DOM as a child of elem.
	 */
	const addWordDOM = (elem, word) => {
		const child = document.createElement("span");
		child.innerText = word;
		elem.appendChild(child);
	}

	/**
	 * Removes the first children of elem.
	 */
	const removeWordDOM = (elem, nb) => {
		for (let i = 0; i < nb; i++) {
			const child = elem.children[0];
			child.remove();
		}
	}

	/**
	 * Adds nb random words to arr and elem in DOM.
	 */
	const populateListDOM = (elem, nb) => {
		for (let n = 0; n < nb; n++) {
			const index = Math.floor(Math.random() * wordList.length);
			let word = wordList[index];
			addWordDOM(elem, word);
		}
	}

	/**
	 * Updates the time.
	 */
	const updateTimer = () => {
		time -= TIME_INTERVAL;
		if (time === 0) {
			input_elem.disabled = true;
			input_elem.value = "";
			clearInterval(timerInterval);
		}
	}
	
	/**
	 * Displays the time in DOM.
	 */
	 const displayTimer = () => {
		displayNumber(timer_elem, (time / 1000));
	}

	/**
	 * Displays the score in DOM.
	 */
	const displayWPM = () => {
		displayNumber(score_elem, typedWords / (time * MINUTES_IN_A_MILLISECOND));
	}

	/**
	 * Displays accuracy in DOM.
	 */
	const displayAccuracy = () => {
		displayNumber(accuracy_elem, accuracy, "%");
	}

	/**
	 * Displays a number in DOM
	 * @param {*} element Element in which the number will be rendered
	 * @param {*} number The number to be displayed
	 * @param {*} unit The number's unit if there is any
	 * @param {*} nanValue Default value if number is NaN
	 */
	const displayNumber = (element, number, unit = "", nanValue = 0) => {
		let displayText;

		if(isNaN(number)) displayText = nanValue;
		else displayText = number;

		displayText = displayText.toFixed(NUMBER_DECIMALS)
				   .toString()
				   .padStart(NUMBER_DISPLAY_SIZE, " ")
				   + unit;
		
		element.innerText = displayText;
		element.style.fontFamily = "Roboto Mono, monospace";
	}

	const update = () => {
		updateTimer()
		displayTimer()
		displayWPM()
		displayAccuracy()
	}

	const evaluateKeyStroke = (e) => {
		if (keyStrokes === 0 ) timerInterval = setInterval(update, TIME_INTERVAL)

		let checkedWord = checkWord()

		keyStrokes += 1
		input_elem.style.color = checkedWord.checkedColor

		// Evaluate spaces
		if (e.key !== ' ') return
		
		words_elem.children[spaces % 10].style.color = checkedWord.validateColor
		
		spaces += 1
		if (spaces % 10 === 0) {
			removeWordDOM(words_elem, 10)
		}


		typedWords += 1
		validKeyStrokes += countValidKeyStrokes()
		accuracy = 100 * validKeyStrokes / keyStrokes
		input_elem.value = input_elem.value.split(" ", 2)[1]
	}

	/**
	 * Set score to 0
	 * Set time to INITIAL_TIME
	 * Starts a new timer.
	 * Empties typeArea
	 * Set focus on typeArea
	 */
	const resetGame = () => {
		typedWords = INITIAL_SCORE;
		keyStrokes = INITIAL_KEYSTROKES;
		validKeyStrokes = INITIAL_KEYSTROKES;
		accuracy = 100 * validKeyStrokes / keyStrokes;
		time = INITIAL_TIME;
		clearInterval(timerInterval);
		timerInterval = setInterval(update, TIME_INTERVAL);

		correctWords = 0;
		wrongWords = 0;
		
		input_elem.value = "";
		input_elem.disabled = false;
		input_elem.focus();
	}

	/**
	 * Executes evaluateKeyStroke each time a key is relesed.
	 */
	input_elem.addEventListener("keyup", evaluateKeyStroke);

	let typedWords = INITIAL_SCORE;
	let keyStrokes = INITIAL_KEYSTROKES;
	let validKeyStrokes = INITIAL_KEYSTROKES;
	let accuracy = 100 * validKeyStrokes / keyStrokes;
	let time = INITIAL_TIME; // Milliseconds
	let timerInterval;
	let spaces = 0;
	displayTimer();
	displayWPM();
	displayAccuracy();

	let correctWords = 0;
	let wrongWords = 0;

	populateListDOM(words_elem, 400);
}

init();