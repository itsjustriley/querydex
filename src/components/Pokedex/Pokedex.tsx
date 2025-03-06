import './Pokedex.css';
import { useEffect, useState } from "react";
import Matchup from "../Matchup";
import { USE_SERVER } from "../../main";

interface typeMatchupData {
  normalTypes: string[];
  doubleEffectiveTypes: string[];
  effectiveTypes: string[];
  resistedTypes: string[];
  doubleResistedTypes: string[];
  effectlessTypes: string[];
}

type Types = {
  name: string;
}

interface PokemonProps {
  name: string | undefined;
  num: number | undefined;
  sprite: string | undefined;
  types: Types[] | undefined;
  flavorText: string | null;
  cry?: string | undefined;
  typeMatchupData?: typeMatchupData
}

function getTypeString(types: string[]): string {
  if (types.length === 1) {
    return `a <span class="type type-${types[0].toLowerCase()}">${types[0]}</span> type Pokémon.`;
  } else if (types.length === 2) {
    return `a <span class="type type-${types[0].toLowerCase()}">${types[0]}</span> and <span class="type type-${types[1].toLowerCase()}">${types[1]}</span> type Pokémon.`;
  } else {
    return 'an unknown type Pokémon.';
  }
}

export default function Pokedex({ name, num, sprite, types, flavorText, cry, typeMatchupData }: PokemonProps) {

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!cry) return;
    const audio = new Audio(cry);
    audio.play();
  }, [cry]);

  const typeNames = types ? types.map(type => type.name) : [];
  const typeStr = types ? getTypeString(typeNames) : '';

  console.log("typeMatchupData in Pokedex component:", typeMatchupData);

  return (
    <div className="pokediv">
      {!num ? <h1>QueryDex!</h1> : <div className="info">
        <h1>{name} - #{num}</h1>
        <img className="sprite" src={sprite} alt={name} />
        <p>{name} is <span dangerouslySetInnerHTML={{ __html: typeStr }} /></p> 
        {flavorText && (
          <p>{flavorText}</p>
        )}
        {USE_SERVER && <div>
          <button onClick={() => setShowModal(!showModal)}>
            Show Matchup
          </button>
          {showModal && typeMatchupData && (
            <div className="modal">
              <button onClick={() => setShowModal(false)}>X</button>

              <Matchup currentTypeMatchup={typeMatchupData} />
              </div>
            )
          }
          </div>
        }
      </div>}
    </div>
  );
}