export interface PartOfSpeechDef {
  name: string
  text: string
  examples: string[]
  sentenceExample: string
}

export const partOfSpeechDefs: Record<string, PartOfSpeechDef> = {
  noun: {
    name: 'noun',
    text: 'A person, place, thing, or idea.',
    examples: ['apple', 'car', 'teacher', 'happiness'],
    sentenceExample: 'The dog is sleeping.',
  },
  pronoun: {
    name: 'pronoun',
    text: 'A word that replaces a noun.',
    examples: ['I', 'you', 'he', 'she', 'it', 'they', 'we'],
    sentenceExample: 'They run every morning.',
  },
  verb: {
    name: 'verb',
    text: 'An action or state.',
    examples: ['run', 'eat', 'be', 'have', 'think'],
    sentenceExample: 'They run every morning.',
  },
  adjective: {
    name: 'adjective',
    text: 'A word that describes a noun.',
    examples: ['big', 'blue', 'happy', 'difficult'],
    sentenceExample: 'It’s a beautiful day.',
  },
  adverb: {
    name: 'adverb',
    text: 'A word that describes a verb, adjective, or another adverb. Often ends in -ly.',
    examples: ['quickly', 'very', 'always', 'well'],
    sentenceExample: 'He runs quickly.',
  },
  phrasalVerb: {
    name: 'phrasal verb',
    text: 'A verb + one or more words (usually a preposition or adverb) that together mean something new.',
    examples: ['give up', 'look after', 'run into', 'take off'],
    sentenceExample: 'She gave up smoking.',
  },
  idiom: {
    name: 'idiom',
    text: 'A common expression whose meaning is different from the words used.',
    examples: ['break the ice', 'spill the beans', 'under the weather'],
    sentenceExample: 'He’s under the weather today. (He’s sick)',
  },
  phrase: {
    name: 'phrase',
    text: "A group of words that work together as a single unit in a sentence but do not contain both a subject and a verb (so it's not a full sentence). Phrases can act like a noun, verb, adjective, or adverb.",
    examples: ['in the morning', 'to win the game', 'very tired', 'running down the street'],
    sentenceExample: 'The man running down the street is my uncle.',
  },
  preposition: {
    name: 'preposition',
    text: 'Shows direction, place, or time. Always comes before a noun or pronoun.',
    examples: ['on', 'in', 'at', 'by', 'under'],
    sentenceExample: 'The book is on the table.',
  },
  conjunction: {
    name: 'conjunction',
    text: 'Connects words, phrases, or sentences.',
    examples: ['and', 'but', 'or', 'because', 'so'],
    sentenceExample: 'I was tired, but I kept working.',
  },
  interjection: {
    name: 'interjection',
    text: 'A short word or phrase that shows strong emotion or surprise.',
    examples: ['wow!', 'oh!', 'ouch!', 'hey!'],
    sentenceExample: 'Wow! That’s amazing!',
  },
}
