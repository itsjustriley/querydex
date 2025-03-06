const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const schema = buildSchema(`
  enum TypesEnum {
    bug
    dark
    dragon
    electric
    fairy
    fighting
    fire
    flying
    ghost
    grass
    ground
    ice
    normal
    poison
    psychic
    rock
    steel
    water
  }

  type TypeMatchup {
    normalTypes: [String!]!
    doubleEffectiveTypes: [String!]!
    doubleResistedTypes: [String!]!
    effectiveTypes: [String!]!
    effectlessTypes: [String!]!
    resistedTypes: [String!]!
  }

  type Types {
    name: String!
  }

  type FlavorText {
    flavor: String!
  }

  type Pokemon {
    key: String!
    num: Int!
    sprite: String!
    types: [Types!]!
    cry: String!
    flavorTexts: [FlavorText!]!
  }

  type MinimalPokemon {
    num: Int!
    types: [Types!]!
  }

  type Query {
    getPokemonByDexNumber(number: Int!): Pokemon!
    getAllPokemon(offset: Int): [MinimalPokemon!]!
    getTypeMatchup(primaryType: TypesEnum!, secondaryType: TypesEnum): TypeMatchup!
  }
`);
  

const root = {
  getPokemonByDexNumber: async ({ number }) => {
    const url = `https://graphqlpokemon.favware.tech/v8`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query ($number: Int!) {
            getPokemonByDexNumber(number: $number) {
              key
              num
              sprite
              types {
                name
              }
              cry
              flavorTexts {
                flavor
              }
            }
          }
        `,
        variables: { number }
      })
    })
    const json = await res.json()
    const pokemon = json.data.getPokemonByDexNumber
    return pokemon
  },
  getAllPokemon: async ({ offset }) => {
    const url = `https://graphqlpokemon.favware.tech/v8`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query ($offset: Int) {
            getAllPokemon(offset: $offset) {
              num
              types {
                name
              }
            }
          }
        `,
        variables: { offset }
      })
    })
    const json = await res.json()
    const pokemon = json.data.getAllPokemon
    return pokemon
  },
  getTypeMatchup: async ({ primaryType, secondaryType }) => {
    console.log(primaryType, secondaryType)
    const url = `https://graphqlpokemon.favware.tech/v8`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query ($primaryType: TypesEnum!, $secondaryType: TypesEnum) {
            getTypeMatchup(primaryType: $primaryType, secondaryType: $secondaryType) {
              attacking {
                normalTypes
                doubleEffectiveTypes
                doubleResistedTypes
                effectiveTypes
                effectlessTypes
                resistedTypes
              }
            }
          }
        `,
        variables: { primaryType, secondaryType }
      })
    })
    const json = await res.json()
    const typeMatchup = json.data.getTypeMatchup.attacking
    return typeMatchup
  }
}

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

const port = 4141;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


