## API Handlers

Base URL

```
http://localhost:3001/api
```

### Auth API

#### Sign in

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

- **URL:** `/cards/:cardId`
- **Method:** `GET`

**Response:** `200 OK`

#### Create a Card

- **URL:** `/cards/deck/:deckId`
- **Method:** `POST`

Request's body

```json
{
  "sentence": "string",
  "targetWords": string[],
  "definitions": UserDefinition[][] // optional, see UserDefinition schema
}
```

UserDefinition schema

```json
{
  "id": "string",
  "word": "string",
  "text": "string", // definition's body
  "partOfSpeech": "string",
  "syllabifiedWord": "string", // sub*scrip*tion
  "pronunciationAudioUrl": "string", // URL
  "offensive": "string", // optional, false by default
  "labels": "string", // british, derogatory, archaic
  "stems": "string"
}
```

**Response:** `201 Created`

```json
{
  "card": Card,
  "notFoundWords": string[],
  "inserted": "boolean"
}
```

#### Edit Card

- **URL:** `/cards/:cardId`
- **Method:** `PUT`

Request's body

```json
{
  "sentence": "string", // optional
  "targetWords": string[], // optional if sentence was not provided
  "definitions": UserDefinition[][] // optional, see UserDefinition schema
}
```

**Response:** `200 OK`

```
Card
```

#### Delete Card by id (uuid)

- **URL:** `/cards/:cardId`
- **Method:** `DELETE`

**Response:** `200 OK`

### Deck API

#### Get my Decks

- **URL:** `/decks`
- **Method:** `GET`

URL query

```json
{
  "limit": "number",
  "offset": "number"
}
```

**Response:** `200 OK`

```
Deck[]
```

#### Get Deck by id (uuid)

- **URL:** `/decks/:deckId`
- **Method:** `GET`

**Response:** `200 OK`

```json
{
  "deck": Deck,
  "cardsTotal": "number",
  "usersFollowing": "number"
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

#### Delete Deck by id (uuid)

- **URL:** `/decks/:deckId`
- **Method:** `DELETE`

**Response:** `200 OK`

### Definition API

#### Get definitions by a word

- **URL:** `/definitions/:word`
- **Method:** `GET`

**Response:** `200 OK`

```
Definition[]
```

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

- **URL:** `/user`
- **Method:** `GET`

**Response:** `200 OK`

```
User
```

#### Follow Deck

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

- **URL:** `/user/decks`
- **Method:** `DELETE`

Request's body

```json
{
  "deckId": "string" //uuid
}
```

**Response:** `200 OK`
