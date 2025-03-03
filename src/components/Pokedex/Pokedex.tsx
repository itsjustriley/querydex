import './Pokedex.css';
import { useEffect } from "react";
import { Types } from "../../App";

interface PokemonProps {
  name: string | undefined;
  num: number | undefined;
  sprite: string | undefined;
  types: Types[] | undefined;
  flavorText: string | null;
  cry?: string | undefined;
}

function getTypeString(types: Types[]): string {
  if (types.length === 1) {
    return `a <span class="type type-${types[0].name.toLowerCase()}">${types[0].name}</span> type Pokémon.`;
  } else if (types.length === 2) {
    return `a <span class="type type-${types[0].name.toLowerCase()}">${types[0].name}</span> and <span class="type type-${types[1].name.toLowerCase()}">${types[1].name}</span> type Pokémon.`;
  } else {
    return 'an unknown type Pokémon.';
  }
}

export default function Pokedex({ name, num, sprite, types, flavorText, cry }: PokemonProps) {
  
  useEffect(() => {
    if (!cry) return;
    const audio = new Audio(cry);
    audio.play();
  }, [cry]);

  const typeStr = types ? getTypeString(types) : 'an unknown type Pokémon';

  return (
    <div className="pokediv">
      {!num ? <h1>QueryDex!</h1> : <div className="info">
        <h1>{name} - #{num}</h1>
        <img className="sprite" src={sprite} alt={name} />
        <p>{name} is <span dangerouslySetInnerHTML={{ __html: typeStr }} /></p> 
        {flavorText && (
          <p>{flavorText}</p>
        )}
      </div>}
    </div>
  );
}