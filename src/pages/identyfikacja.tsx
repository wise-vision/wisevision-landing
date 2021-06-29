import { PageSEOTags } from 'components/HeadTags';
import {
  PageBanner,
  PageDescriptionItems,
  PageHeadingSection,
  PageInfographic,
  PageInfographicSectionWrapper,
} from 'components/PageWithInfographic';

const DESCRIPTION_ITEMS_1 = [
  {
    title: 'Powiadamia o niewłaściwych zachowaniach',
    description:
      'Oprogramowanie dokonuje analizy behawioralnej – oznacza to, że w czasie rzeczywistym rozpoznaje postawy ludzkie, np. ręce uniesione do góry, ludzi leżących na ziemi czy osoby o pozycji typowej dla strzelca. O incydencie od razu powiadamia operatorów kamer.',
  },
  {
    title: 'Rozpoznaje twarze i tablice rejestracyjne',
    description:
      'Po zidentyfikowaniu przez system twarzy lub określonych tablic rejestracyjnych operatorzy natychmiast otrzymują informację o (nie)pożądanym gościu. Dzięki temu inne osoby przebywające w obiekcie mogą czuć się bezpiecznie.',
  },
];

const DESCRIPTION_ITEMS_2 = [
  {
    title: 'Śledzi ruch ludzi i obiektów',
    description:
      'Dzięki zastosowaniu sieci neuronowych oprogramowanie niezwykle skutecznie analizuje obraz podczas śledzenia np. ludzi i pojazdów przekraczających daną linię lub wałęsających się. Po określeniu cech obiektu (jak np. kolor czy rozmiar), bez trudu go zlokalizuje.',
  },
  {
    title: 'Identyfikuje ogień',
    description:
      'Inteligentny monitoring może z powodzeniem zastąpić standardowe detektory dymu i ognia. Rozpoznaje bowiem żywioł na otwartych przestrzeniach, czyli tam, gdzie inne czujniki okazują się nieskuteczne.',
  },
  {
    title: 'Pozwala oglądać kilka momentów z nagrania jednocześnie',
    description:
      'Operatorzy oglądają ruch danych obiektów w różnych momentach – ale nie tylko po kolei, jak w innych systemach, tylko jednocześnie. A to dlatego, że mogą w prosty sposób nakładać obrazy na siebie. To pozwala im skuteczniej zidentyfikować obiekty oraz zaoszczędzić mnóstwo czasu na przewijaniu nagrań.',
  },
];

export default function Identyfikacja() {
  return (
    <>
      <PageBanner
        image="identyfikacja"
        title="Identyfikacja zdarzeń, obiektów i osób"
        styles={{
          background: {
            backgroundPosition: ['center right -135px', null, 'center right'],
          },
        }}
      />
      <PageHeadingSection
        title="Na terenie biurowca, centrum handlowego, hotelu, magazynu, placu budowy lub dowolnego
            innego obiektu przyda się inteligentny monitoring, który zidentyfikuje zagrożenia.
            Poznaj jego funkcje!"
      />
      <PageInfographicSectionWrapper>
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
        <PageInfographic image="identyfikacja" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_2} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Jeśli uważasz, że funkcje inteligentnego oprogramowania przydałyby się w Twoim obiekcie, daj nam znać!"
      />
    </>
  );
}

Identyfikacja.seoTags = <PageSEOTags title="WiseVision | Identyfikacja" />;
