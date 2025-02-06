import {Methodius} from 'methodius';
import {Word, WordNGram} from 'methodius/dist/types';

/*
fuck | s|er|ed|ing, motherfucker
shit + s|ton|ing|ting, bullshit
dick + s|head|hole|ed
ass + hole|hat|face 
cock +s
*/
const profanityRegex = /((\b)?(fuck)(\w+)?)|((\b)?shit(\w+)?)|((\b)dick(\w+|\b))|((\b)ass(\w+|\b))|((\b)cocks?\b)|((\b)cunts?\b)|((\b)twats?\b)|(wtf)|(stfu)|((\b)damn(ed|it)?\b)/gi;
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




export function getSurroundingWords( wordNgrams: WordNGram[] , searchWord: string) : Word[] {
    let adjacentWords: Word[] = [];
    const wordNGramsWithSearch: WordNGram[] = wordNgrams.filter((wordNgrams) => wordNgrams.includes(searchWord ));
    const uniqueWords = [...new Set(wordNGramsWithSearch.flat())];
    adjacentWords = uniqueWords.filter((word) => word !== searchWord  ) as Word[];
    return adjacentWords;
}

enum PronounPlacement {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
}

export function getPronounPlacement(wordList: Word[], pronoun: string = '') : PronounPlacement {
    const pronounIndex = wordList.indexOf(pronoun.toLowerCase());

    let position;

    switch (pronounIndex) {
      case 0:
        position = 'Start' as PronounPlacement;
        break;
      case wordList.length - 1:
        position = 'End' as PronounPlacement;
        break;
      default:
        position = 'Middle' as PronounPlacement;
        break;
    }
    return position; 
}

interface PronounData {
  pronoun: string;
  placement: PronounPlacement;
  surroundingWords: Word[];
}

export function getPronounData(text: string = '', pronoun: string = '') {
  let safeText = text.toLowerCase();
  let safePronoun = pronoun.toLowerCase();
  const methodius = new Methodius(safeText);
  const pronounPlacement = getPronounPlacement(methodius.words, safePronoun);
  const surroundingWords = getSurroundingWords(Methodius.getWordNGrams(safeText), safePronoun);
  const pronounData = {
    pronoun,
    pronounPlacement,
    surroundingWords
  };

  return pronounData;

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

