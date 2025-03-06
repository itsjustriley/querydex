import { TypeMatchup } from "../App";


interface MatchupProps {
  currentTypeMatchup: TypeMatchup;
}

export default function Matchup({ currentTypeMatchup }: MatchupProps) {

  function mapToUnorderedList(types: string[]) {
    return (
      <ul>
        {types.map((type: string) => (
          <li key={type} className={`type-${type.toLowerCase()}`}>{type}</li>
        ))}
      </ul>
    );
  }

  const typeLists = {
    normalTypes: mapToUnorderedList(currentTypeMatchup.normalTypes),
    doubleEffectiveTypes: mapToUnorderedList(currentTypeMatchup.doubleEffectiveTypes),
    doubleResistedTypes: mapToUnorderedList(currentTypeMatchup.doubleResistedTypes),
    effectiveTypes: mapToUnorderedList(currentTypeMatchup.effectiveTypes),
    effectlessTypes: mapToUnorderedList(currentTypeMatchup.effectlessTypes),
    resistedTypes: mapToUnorderedList(currentTypeMatchup.resistedTypes),
  };

  return (
    <div>
      <h3>Type Matchup</h3>
      {currentTypeMatchup.effectiveTypes?.length > 0 && (
      <>
      <h4>Effective</h4>
      {typeLists.effectiveTypes}
      </>
      )}
      {currentTypeMatchup.doubleEffectiveTypes?.length > 0 && (
      <>
      <h4>Double Effective</h4>
      {typeLists.doubleEffectiveTypes}
      </>
      )}
      {currentTypeMatchup.resistedTypes?.length > 0 && (
      <>
      <h4>Resisted</h4>
      {typeLists.resistedTypes}
      </>
      )}
      {currentTypeMatchup.doubleResistedTypes?.length > 0 && (
      <>
      <h4>Double Resisted</h4>
      {typeLists.doubleResistedTypes}
      </>
      )}
      {currentTypeMatchup.effectlessTypes?.length > 0 && (
      <>
      <h4>Effectless</h4>
      {typeLists.effectlessTypes}
      </>
      )}
      {currentTypeMatchup.normalTypes?.length > 0 && (
      <>
      <h4>Normal Damage</h4>
      {typeLists.normalTypes}
      </>
      )}
    </div>
  );
}
