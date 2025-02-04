import {
  NGramSequence,
  Word,
  NGram,
  WordNGram,
} from './types';
import {getWordNGrams} from './ngrams';
import {getWords} from './tokenizers';

/*
fuck | s|er|ed|ing, motherfucker
shit + s|ton|ing|ting, bullshit
dick + s|head|hole|ed
ass + hole|hat|face 
cock +s
*/
const profanityRegex = /((\b)?(fuck)(\w+)?)|((\b)?shit(\w+)?)|((\b)dick(\w+|\b))|((\b)ass(\w+|\b))|((\b)cocks?\b)|((\b)cunts?\b)|((\b)twats?\b)|(wtf)|(stfu)/gi;
/*
no + o, na + a, nu +u
nah, naw, nuh
nope
*/
const negationRegex = /\b(n(o+(pe)?|a+(h|w)?|uh))\b/gi;
/*
ye + e, ya + a, yu + u
yay, yah, ya
yup
yeah
*/
const affirmationRegex = /\b(y((e+|a+|u+)(a+)?(y|h|s|p)?)\b)/gi




export function getSurroundingWords( string, searchWord: string, rangeSize: number = 1) : WordNGram[] {
    let adjacentWords: WordNGram[] = [];
    const wordNGrams = getWordNGrams(string, (rangeSize * 2) + 1); // self + size on each side 
    const wordNGramsWithSearch = wordNGrams.filter((wordNgrams) => wordNgrams.includes(searchWord));
    adjacentWords = wordNGramsWithSearch.filter((wordNgramsWSearch) => wordNgramsWSearch.indexOf(searchWord) > rangeSize)

    return adjacentWords;
}

export function getPronounPlacement(text: string = '', pronoun: string = '') {
    const wordList = getWords(text.toLowerCase());
    const pronounIndex = wordList.indexOf(pronoun.toLowerCase());

    let position;

    switch (pronounIndex) {
      case 0:
        position = 'start';
        break;
      case wordList.length - 1:
        position = 'end';
        break;
      default:
        position = 'middle';
        break;
    }
    return position; 
}

export function getNegation(text: string = '') {
  if (!text) return '';

  const match = text.match(negationRegex);
  const result = match
    ? match[0]
        ?.toLowerCase()
        ?.trim()
    : '';

    return result;
}

export function getAffirmation(text: string = '') {
  if (!text) return '';

  const match = text.match(affirmationRegex);
  const result = match
    ? match[0]
        ?.toLowerCase()
        ?.trim()
    : '';

    return result;
}

export function getProfanity(text: string = '') {
  if (!text) return '';

  const match = text.match(profanityRegex);
  const result = match
    ? match[0]
        ?.toLowerCase()
        ?.trim()
    : '';

    return result;
}

interface TextData {
  profanity: string;
  negation: string;
  affirmation: string;
}

export function getDiscourseData(text: string = ''): TextData {
  return {
    profanity: getProfanity(text),
    negation: getNegation(text),
    affirmation: getAffirmation(text)
  }
}

