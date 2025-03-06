import { useEffect, useState, useCallback, useMemo } from 'react';
import './App.css';
import gql from 'graphql-tag';
import { useLazyQuery, useQuery } from '@apollo/client';
import Pokedex from './components/Pokedex/Pokedex';
import UI from './components/UI/UI';

interface Query {
  getPokemonByDexNumber: {
    key: string;
    num: number;
    sprite: string;
    types: { name: string }[];
    cry: string;
    flavorTexts: { flavor: string }[];
  };
  getAllPokemon: MinimalPokemon[];
  getTypeMatchup: TypeMatchup;
}

interface MinimalPokemon {
  num: number;
  types: { name: string }[];
}

export interface TypeMatchup {
  normalTypes: string[];
  doubleEffectiveTypes: string[];
  doubleResistedTypes: string[];
  effectiveTypes: string[];
  effectlessTypes: string[];
  resistedTypes: string[];
}

enum TypesEnum {
  bug = 'bug',
  dark = 'dark',
  dragon = 'dragon',
  electric = 'electric',
  fairy = 'fairy',
  fighting = 'fighting',
  fire = 'fire',
  flying = 'flying',
  ghost = 'ghost',
  grass = 'grass',
  ground = 'ground',
  ice = 'ice',
  normal = 'normal',
  poison = 'poison',
  psychic = 'psychic',
  rock = 'rock',
  steel = 'steel',
  water = 'water'
}

const GET_POKEMON = gql`
  query getPokemonByDexNumber($number: Int!) {
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
`;

const GET_ALL_POKEMON_DEX_NUMBER_WITH_TYPES = gql`
  query getAllPokemonDexNumberWithTypes($offset: Int) {
    getAllPokemon(offset: $offset) {
      num
      types {
        name
      }
    }
  }
`;

const GET_TYPE_MATCHUP = gql`
  query getTypeMatchup($primaryType: TypesEnum!, $secondaryType: TypesEnum) {
    getTypeMatchup(primaryType: $primaryType, secondaryType: $secondaryType) {
      normalTypes
      doubleEffectiveTypes
      doubleResistedTypes
      effectiveTypes
      effectlessTypes
      resistedTypes
    }
  }
`;

function App() {
  const [getPokemon, { data, loading, error }] = useLazyQuery<Query>(GET_POKEMON);
  const [dexNumber, setDexNumber] = useState<number | null>(null);
  const [_type, set_type] = useState<string>('');
  const { key, num, sprite, types, flavorTexts, cry } = data?.getPokemonByDexNumber || {};
  const flavorText = flavorTexts?.[0]?.flavor || null;
  const name = key?.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); 

  const { data: allPokemonData } = useQuery<Query>(GET_ALL_POKEMON_DEX_NUMBER_WITH_TYPES, {
    variables: { offset: 89 }
  });

  const [primaryType, setPrimaryType] = useState<TypesEnum | null>(null);
  const [secondaryType, setSecondaryType] = useState<TypesEnum | null>(null);

  useEffect(() => {
    try {
      if (data?.getPokemonByDexNumber?.types) {
        const pokemonTypes = data.getPokemonByDexNumber.types;
        setPrimaryType(pokemonTypes[0]?.name as TypesEnum || null);
        setSecondaryType(pokemonTypes[1]?.name as TypesEnum || null);
      }
    } catch (error) {
      console.error("Error in useEffect for setting types:", error);
    }
  }, [data]);

  const [fetchTypeMatchup, { data: typeMatchupData }] = useLazyQuery<Query>(GET_TYPE_MATCHUP);

  useEffect(() => {
    try {
      let variables = {};
      if (secondaryType) {
        variables = {
          primaryType: primaryType?.toLowerCase(),
          secondaryType: secondaryType?.toLowerCase()
        }
      } else {
        variables = {
          primaryType: primaryType?.toLowerCase()
        }
      }
      fetchTypeMatchup({
        variables: variables
      });
      console.log("primaryType: ", primaryType);
      console.log("secondaryType: ", secondaryType);
      console.log("typeMatchupData: ", typeMatchupData);
    } catch (error) {
      console.error("Error in useEffect for fetching type matchup:", error);
    }
  }, [primaryType, secondaryType, fetchTypeMatchup]);

  const typeMap = useMemo(() => {
    const allPokemon = allPokemonData?.getAllPokemon || [];
    const createTypeMap = (allPokemon: MinimalPokemon[]) => {
      const typeMap: { [key: string]: number[] } = {};
    
      allPokemon.forEach(pokemon => {
        pokemon.types.forEach(type => {
          if (!typeMap[type.name]) {
            typeMap[type.name] = [];
          }
          typeMap[type.name].push(pokemon.num);
        });
      });
    
      return typeMap;
    };

    return createTypeMap(allPokemon);
  }, [allPokemonData]);

  const _typeSelected = (type: string) => {
    if (_type === type) {
      randomOfType(type);
    } else {
      set_type(type);
    }
  }
    
  const randomOfType = useCallback((type: string) => {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    if (typeMap[capitalizedType] && typeMap[capitalizedType].length > 0) {
      const randomDexNumber = typeMap[capitalizedType][Math.floor(Math.random() * typeMap[capitalizedType].length)];
      getPokemon({ variables: { number: randomDexNumber } });
      setDexNumber(null);
    } else {
      console.error(`Type "${type}" not found in typeMap or has no Pokémon.`);
    }
  }, [typeMap, getPokemon]);

  useEffect(() => {
    if (_type) {
      randomOfType(_type);
    }
  }, [_type, randomOfType]);
    
  const handleGetPokemon = () => {
    getPokemon({ variables: { number: dexNumber } });
    setDexNumber(null);
  };

  const randomPokemon = () => {
    const randomDexNumber = Math.floor(Math.random() * 1024) + 1;
    getPokemon({ variables: { number: randomDexNumber } });
    setDexNumber(null);
  };

  return (
    <div className="pokedex">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <Pokedex name={name} num={num} sprite={sprite} types={types} flavorText={flavorText} cry={cry} typeMatchupData={typeMatchupData?.getTypeMatchup} />
      <UI setDexNumber={setDexNumber} handleGetPokemon={handleGetPokemon} randomPokemon={randomPokemon} _typeSelected={_typeSelected} dexNumber={dexNumber} />
    </div>
  );
}

export default App;
