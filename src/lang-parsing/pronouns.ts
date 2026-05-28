import {Methodius} from 'methodius';
import {hasArticleOrDemonstrative, hasPossessive, hasAdjective, hasPreposition, hasHelperVerb, hasPersonalPronoun} from './parts-of-speech';
/* regex: 
      first part are the words that precede the word that would clue us that it's not a pronoun:
        we're looking for common modifiers:
        a, any, another, some, the, these,their, that, this, those
      second part is the pronoun itself: 
        chat, dude, bro, bruh, guy, sis, fam
    */
const determinerExp = '(a(?:n(?:y|other))?|some|th(?:e(?:se|ir)?|at|is|ose))';
/*
  this is a way of mapping variations to their canonical forms.
*/
const pronounExps = new Map([
    ['dude', 'du+de'],
    ['bro', 'bro+'],
    ['bruh', 'bru+h+'],
    ['chat', 'cha+t'],
    ['sis', 'si+s'],
    ['fam', 'fa+m'],
    ['gurl', 'gu+[rl]+'],
    ['boi', 'bo+i+' ]
]);
const possiblePronounRegex = new RegExp(`(?<!\\b${determinerExp}\\b\\s)\\b(?:${[...pronounExps.values()].join('|')})\\b\\s?`,'i')


export function hasPossiblePronounInText(text: string): boolean {
    return possiblePronounRegex.test(text);
}

export function hasPronounInText(text: string): boolean {
    const hasPossiblePronoun = hasPossiblePronounInText(text);
    // if it doesn't have the pronoun, why keep going? 
    if (!hasPossiblePronoun) {
        return false;
    }
    // let's split into words
    const wordBigrams = Methodius.getWordNGrams(text.toLowerCase());
    // grab that word and make few assumptions
    const targetPronoun = getPronounFromText(text);
    // get bigrams that contain the pronoun
    const bigramsWithPronoun = wordBigrams.filter((wordBigram) => wordBigram.includes(targetPronoun));
    // if there's only one bigram with the pronoun, we're good. It's the start of the sentence.
    // no need to check the rest
    if (bigramsWithPronoun.length === 1) {
        return true;
    }
    // there's multiple bigrams. Fine. We want the one with a word preceding the possible pronoun;
    // that'll be the first one in this bigram array
    const [bigramWithPronounAtEnd] = bigramsWithPronoun;
    const [precedingWord] = bigramWithPronounAtEnd;
    // now we need to check if that word is any part of speech that makes the "pronoun" a noun
    const isArticleOrDemonstrative = hasArticleOrDemonstrative(precedingWord);
    const isPossessive = hasPossessive(precedingWord);
    const isAdjective = hasAdjective(precedingWord);
    const isANoun = isArticleOrDemonstrative || isPossessive || isAdjective;
    
    // assume it's not a verb
    let isAVerb = false;
    // check if the word is chat, which can be a verb
    const isTargetChat = targetPronoun.toLowerCase() === 'chat';
    if (isTargetChat) {
        const isPreposition = hasPreposition(precedingWord);
        // is there a helper verb in front?
        const isHelperVerb = hasHelperVerb(precedingWord);
        // is there a personal pronoun in front?
        const isPersonalPronoun = hasPersonalPronoun(precedingWord);

        // if there's a personal pronoun or helper verb, chat is probably a verb
        isAVerb = isHelperVerb || isPersonalPronoun || isPreposition;
    }

    return !isANoun && !isAVerb;
}

export function getPronounFromText(text: string = ''): string {
    if (!text) return '';
    let pronoun = '';
    for (const [name,exp] of pronounExps.entries()) {
        const regexp = new RegExp(`(${exp})`, 'gi');
        const result = regexp.exec(text);
        if (result) {
            pronoun = name;
            break;
        }
    }
        
    return pronoun;
}