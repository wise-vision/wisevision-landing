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
    title: 'Wykrywa podwyższoną temperaturę',
    description:
      'Dzięki integracji systemu z kamerą termowizyjną operatorzy mogą bez trudu odróżniać osoby o temperaturze ciała mieszczącej się w normie i tej podwyższonej. Ułatwiają to oznaczenia kolorystyczne na rejestrowanym obrazie. System rozpoznaje wyłącznie twarze, dzięki czemu nie ma ryzyka pomyłki z np. ciepłymi napojami. Dokonuje pomiaru w ledwie sekundę, z odległości dwóch metrów, z dokładnością do +/-0,5°C. ',
  },
  {
    title: 'Informuje o naruszeniu zachowania dystansu społecznego',
    description:
      'Wystarczy wcześniej zdefiniować pożądaną odległość między ludźmi, aby zaawansowana analityka behawioralna wykryła naruszenia ograniczeń dystansu społecznego. O każdym incydencie system od razu poinformuje operatorów oraz zapisze je w zdarzeniach alarmowych. ',
  },
];

const DESCRIPTION_ITEMS_2 = [
  {
    title: 'Alarmuje o braku maseczki',
    description:
      'Jeśli inteligentne oprogramowanie rozpozna osobę bez maseczki na twarzy, zaalarmuje o tym na jeden lub kilka wybranych wcześniej sposobów. Informację otrzyma każda ze zdefiniowanych uprzednio osób.',
  },
];

export default function Covid() {
  return (
    <>
      <PageBanner
        image="covid"
        title="#STOP COVID19"
        styles={{
          background: {
            backgroundPosition: 'right center',
            '@media screen and (max-width: 480px)': {
              backgroundPosition: 'right -70px center',
            },
          },
        }}
      />
      <PageHeadingSection title="Mamy czasy pandemii, co wymaga dodatkowego zaangażowania ze strony Twoich pracowników. Czy wiesz, że sztuczna inteligencja może ich odciążyć? Zobacz, co potrafi oprogramowanie od WiseVision!" />
      <PageInfographicSectionWrapper>
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
        <PageInfographic image="covid" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_2} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Potrzebujesz takich rozwiązań na terenie swojego obiektu? Jeśli tak, odezwij się do nas."
      />
    </>
  );
}

Covid.seoTags = <PageSEOTags title="WiseVision | Covid" />;
