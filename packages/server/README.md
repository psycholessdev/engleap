## API Handlers

Base URL

```
http://localhost:3001/api
```

### Auth API

#### Sign in

Sign in an existing account using the credentials

- **URL:** `/signin`
- **Method:** `POST`

Request's body

```json
{
  "email": "string",
  "password": "string" // at least 5 characters
}
```

**Response:** `200 OK`

```json
{
  "userId": "string" // uuid
}
```

#### Sign up

Create an account

- **URL:** `/signup`
- **Method:** `POST`

Request's body

```json
{
  "username": "string",
  "email": "string",
  "password": "string" // at least 5 characters
  "proficiencyLevel": "string" // 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
}
```

**Response:** `201 Created`

```json
{
  "userId": "string" // uuid
}
```

#### Log out

- **URL:** `/logout`
- **Method:** `POST`

**Response:** `200 OK`

### Card API

#### Search for a card in the deck

- **URL:** `/cards/deck/:deckId`
- **Method:** `GET`

URL params

```json
{
  "deckId": "string" // uuid
}
```

URL query

```json
{
  "limit": "number",
  "offset": "number"
}
```

**Response:** `200 OK`

```
Card[]
```

#### Get Card by id (uuid)

You can get Cards only from a public deck or from a deck created by you

- **URL:** `/cards/:cardId`
- **Method:** `GET`

**Response:** `200 OK`

#### Create a Card

You can create Card only in a deck created by you

- **URL:** `/cards/deck/:deckId`
- **Method:** `POST`

Request's body

```json
{
  "sentence": "string",
  "targetWords": "string[]",
  "definitions": "UserDefinition[]" // optional, see UserDefinition schema
}
```

UserDefinition schema

```json
{
  "word": "string", // word from the sentence (e.g. strings)
  "sourceEntryId": "string", // precise word this definition for (e.g. string)
  "text": "string", // definition's body
  "partOfSpeech": "string", // noun | pronoun | verb | adjective | adverb | phrasal verb | idiom | preposition | conjunction | interjection
  "syllabifiedWord": "string", // sub*scrip*tion
  "pronunciationAudioUrl": "string",
  "offensive": "string", // optional, false by default
  "labels": "string", // british, derogatory, archaic, slang
  "stems": "string"
}
```

**Response:** `201 Created`

```json
{
  "card": "Card",
  "notFoundWords": "string[]",
  "inserted": "boolean"
}
```

#### Edit Card

You can edit Card only in a deck created by you

- **URL:** `/cards/:cardId`
- **Method:** `PUT`

Request's body

```json
{
  "sentence": "string", // optional
  "targetWords": "string[]", // optional if sentence was not provided
  "definitions": "UserDefinition[]" // optional, see UserDefinition schema
}
```

**Response:** `200 OK`

```json
{
  "card": "Card",
  "notFoundWords": "string[]"
}
```

#### Delete Card by id (uuid)

You can delete Cards only in a deck created by you

- **URL:** `/cards/:cardId`
- **Method:** `DELETE`

**Response:** `200 OK`

### Deck API

#### Search public Decks

- **URL:** `/decks/all`
- **Method:** `GET`

URL query

```json
{
  "query": "string", // optional
  "limit": "number", // optional
  "offset": "number" // optional
}
```

**Response:** `200 OK`

```json
[
  {
    "id": "46749710-3484-431b-a77d-5afa62df37c4",
    "title": "My super deck 1",
    "description": "follow me on inst @akkame",
    "cardCount": "16",
    "isPublic": true,
    "copiedFrom": null,
    "creatorId": "db549270-4c30-4802-af3d-d1a1af56cecd",
    "createdAt": "2025-06-01T07:35:15.058Z",
    "updatedAt": "2025-06-13T04:07:42.249Z"
  }
  // ...
]
```

#### Get my Decks

Get the Decks you are following

- **URL:** `/decks/my`
- **Method:** `GET`

URL query

```json
{
  "limit": "number", // optional
  "offset": "number" // optional
}
```

**Response:** `200 OK`

```json
[
  {
    "id": "46749710-3484-431b-a77d-5afa62df37c4",
    "title": "My super deck 1",
    "description": "follow me on inst @akkame",
    "cardCount": "16",
    "isPublic": true,
    "copiedFrom": null,
    "creatorId": "db549270-4c30-4802-af3d-d1a1af56cecd",
    "createdAt": "2025-06-01T07:35:15.058Z",
    "updatedAt": "2025-06-13T04:07:42.249Z"
  }
  // ...
]
```

#### Get Deck by id (uuid)

The Deck must be public or created by you

- **URL:** `/decks/:deckId`
- **Method:** `GET`

**Response:** `200 OK`

```json
{
  "id": "46749710-3484-431b-a77d-5afa62df37c4",
  "title": "My super deck 1",
  "description": "follow me on inst @akkame",
  "cardCount": "16",
  "isPublic": true,
  "copiedFrom": null,
  "creatorId": "db549270-4c30-4802-af3d-d1a1af56cecd",
  "createdAt": "2025-06-01T07:35:15.058Z",
  "updatedAt": "2025-06-13T04:07:42.249Z",
  "cardsTotal": "number",
  "usersFollowing": "number",
  "isUserFollowing": "boolean"
}
```

#### Create a Deck

- **URL:** `/decks`
- **Method:** `POST`

Request's body

```json
{
  "title": "string",
  "description": "string", // optional
  "isPublic": "boolean" // optional, true by default
}
```

**Response:** `201 Created`

```
Deck
```

#### Copy Deck

Copy a Deck as if it was created by you.
The Deck you want to copy must be public or created by you.
You can edit the copy and have full control over it.

- **URL:** `/decks/:deckId/copy`
- **Method:** `POST`

**Response:** `201 Created`

```
Deck
```

#### Update Deck

- **URL:** `/decks`
- **Method:** `PUT`

Request's body

```json
{
  "title": "string", // optional
  "description": "string", // optional
  "isPublic": "boolean" // optional
}
```

**Response:** `200 OK`

```
Deck
```

#### Delete Deck by id (uuid)

- **URL:** `/decks/:deckId`
- **Method:** `DELETE`

**Response:** `200 OK`

### DefinitionList API

#### Get definitions for a Card

- **URL:** `/definitions/card/:cardId`
- **Method:** `GET`

**Response:** `200 OK`

```
DefinitionList[]
```

#### Get definitions by a word

- **URL:** `/definitions/word/:word`
- **Method:** `GET`

**Response:** `200 OK`

```
DefinitionList[]
```

#### Delete Definition

You can only delete Definitions created by you

- **URL:** `/definitions/:defId`
- **Method:** `DELETE`

**Response:** `200 OK`

### Word API

#### Get words

Get all words that match the provided

- **URL:** `/words/:word`
- **Method:** `GET`

**Response:** `200 OK`

```
Word[]
```

### User API

#### Get User

Get your account data

- **URL:** `/user`
- **Method:** `GET`

**Response:** `200 OK`

```
User
```

#### Follow Deck

You can follow only public Decks.
You are following the Decks created by you by default.

- **URL:** `/user/decks`
- **Method:** `POST`

Request's body

```json
{
  "deckId": "string" //uuid
}
```

**Response:** `200 OK`

#### Unfollow Deck

You cannot unfollow a deck you created because you would lose your admin privileges over it.

- **URL:** `/user/decks`
- **Method:** `DELETE`

Request's body

```json
{
  "deckId": "string" //uuid
}
```

**Response:** `200 OK`

### Card progress (SRS) API

#### Get SRS Cards to review

Get cards due to review (max 20 entities).
To get Cards for a specific Deck, use deckId query.

- **URL:** `/srs/cards`
- **Query (optional):** `?deckId={deckId}`
- **Method:** `GET`

**Response:** `200 OK`

```json
[
  {
    "id": "string", // uuid
    "userId": "string", // uuid
    "cardId": "string", // uuid
    "repetitionCount": "number",
    "easinessFactor": "number",
    "intervalDays": "number",
    "nextReviewAt": "Date",
    "lastReviewedAt": "Date",
    "card": "Card"
  }
  // ...
  // max 20 entities
]
```

#### Update Card Progress

Mark card as reviewed.
You must provide a grade:

- 0: Completely forgot
- 1: Incorrect but familiar
- 2: Incorrect but remembered after hint
- 3: Correct but difficult recall
- 4: Correct response after hesitation
- 5: Perfect recall

- **URL:** `/srs/card/:cardId`
- **Method:** `POST`

Request's body

```json
{
  "grade": "number" // from 0 to 5
}
```

**Response:** `200 OK`

```json
{
  "id": "string", // uuid
  "userId": "string", // uuid
  "cardId": "string", // uuid
  "repetitionCount": "number",
  "easinessFactor": "number",
  "intervalDays": "number",
  "nextReviewAt": "Date",
  "lastReviewedAt": "Date"
}
```
