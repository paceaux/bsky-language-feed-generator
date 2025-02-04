    /* regex: 
      first part are the words that precede the word that would clue us that it's not a pronoun:
        we're looking for common modifiers:
        a, any, another, some, the, these,their, that, this, those
      second part is the pronoun itself: 
        chat, dude, bro, bruh, guy, sis, fam
    */
const neoPronounRegex = /(?<!\b(a(n(y|other))?|some|th(e(se|ir)?|at|is|ose))\b\s)\b(chat|d(u+)de|br(o|uh)|guy|sis|fam)\b\s/gi

/*
    We want to separately identify when chat acts as a verb. 
    First part are the words that precede it that clues us in that it's a verb:
    We're looking at either auxiliary verbs or pronouns:
    lets, let's, I, you, we, the, they
    We also use in, on which suggests that chat is a noun
    Second part is the word chat itself
    we have to leave out "to" because there are cases where chat is a direct object
*/

const chatAsVerbRegex = /(?<!\b(let'?s|i|you|(w|th)ey?|gonna|in|on)\b\s?)\b\s?(chat)\b\s?/gi;
const chatAsNoun = /(?<!\b(in|on|about|small|big|large)\b\s?)\b\s?(chat)\b\s?/gi;
const guyAsNoun = /(?<!\b(small|big|large|li(l|ttle)'?)\b\s?)\b\s?(guy)\b\s?/gi;
const sisAsNoun = /(?<!\b(her|our|their|his|my|li(l|ttle)'?)\b\s?)\b\s?(guy)\b\s?/gi;

export function hasNeoPronounInText(text: string): boolean {
    return neoPronounRegex.test(text);
}

export function hasChatAsVerb(text: string): boolean {
    return chatAsVerbRegex.test(text);
}

export function hasChatAsNoun(text: string): boolean {
    return chatAsNoun.test(text);
}

export function hasGuyAsNoun(text: string): boolean {
    return guyAsNoun.test(text);
}

export function hasSisAsNoun(text: string): boolean {
    return sisAsNoun.test(text);
}

export function hasPronounInText(text: string): boolean {
    const isNeo = hasNeoPronounInText(text);
    const hasNoChatAsVerb = !hasChatAsVerb(text);
    const hasNoChatAsNoun = !hasChatAsNoun(text);
    const hasNoGuyAsNoun = !hasGuyAsNoun(text);
    const hasNoSisAsNoun = !hasSisAsNoun(text);

    return isNeo && hasNoChatAsVerb && hasNoChatAsNoun && hasNoGuyAsNoun && hasNoSisAsNoun;
}

export function getPronounFromText(text: string = ''): string {
    if (!text) return '';
    const match = text.match(neoPronounRegex);
    const pronoun = match
        ? match[0]
            ?.toLowerCase()
            ?.trim()
        : '';
        
    return pronoun;
}