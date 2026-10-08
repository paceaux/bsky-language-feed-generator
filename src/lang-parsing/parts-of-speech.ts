const articleAndDemonstrativeRegex = /\b(a(?:n(?:y|other))?|some|th(?:e(?:se|ir)?|at|is|ose))\b/gi;
const possessiveRegex = /\b(my|your|his|her|its|our|their)\b/gi;
const prepositionRegex = /\b(ab(?:out|ove)|across|after|against|along|among|around|a(?:s|t)|be(?:fore|hind|low|neath|side|tween|yond)|but|by|con(?:sidering|cerning)|despite|down|during|except|excluding|for|from|in(?:side|to)?|like|near|o(?:f+)|on(?:to)?|opposite|out(?:side)?|over|past|per|regarding|since|through(?:out)?|till|to(?:wards?)?|under(?:neath)?|unlike|until|up(?:on)?|via|with(?:in|out)?)\b/gi
const adjectiveRegex = /\b(?:able|american|annoying|baby|bad|best|better|big|black|blue|brown|close|chit|chubby|dark|democrat(ic)?|different|difficult|drag|dumb|family|fat|first|foreign|formed|friendly|good|great|group|high|hot|horny|huge|important|large|late|li(?:l|ttle)|live|long|main|national|new|nice|nude|old|open|one|online|only|perfect|poor|pornhub|premium|quick|random|real|republican|right|s(?:a|o)me|safe|second|serious|similar|simple|small|social|strange|strong|stupid|sure|true|third|twitch|weird|white|worst|young)\b/gi;
const helperVerbRegex = /\b(?:let'?s|gonna|go|will|have|can|wanna)\b/gi;
const personalPronounRegex = /\b(?:i|you|s?he|it|they|we|y'all)\b/gi;

export function hasArticleOrDemonstrative(text: string): boolean {
    return articleAndDemonstrativeRegex.test(text);
}

export function hasAdjective(text: string): boolean {
    return adjectiveRegex.test(text);
}

export function hasPossessive(text: string): boolean {
    return possessiveRegex.test(text);
}

export function hasHelperVerb(text: string): boolean {
    return helperVerbRegex.test(text);
}

export function hasPreposition(text: string): boolean {
    return prepositionRegex.test(text);
}

export function hasPersonalPronoun(text: string): boolean {
    return personalPronounRegex.test(text);
}