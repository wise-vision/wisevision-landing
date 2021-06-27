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
    title: 'Wskazuje poszukiwane obiekty',
    description:
      'Oprogramowanie na bieżąco analizuje to, co w obecnej chwili rejestrują kamery. Na tej podstawie generuje metadane w formie opisu obiektów. Wystarczy jedynie wprowadzić określone kryteria obiektu jak np. rozmiar lub kolor, aby otrzymać miniatury wszystkich kadrów, w których się znajduje.',
  },
  {
    title: 'Posiada inteligentny zoom',
    description:
      'Funkcja auto zoom pozwala powiększyć dany fragment rejestrowanej sceny. Nawet jeśli obserwowany obiekt się porusza, powiększenie nie znika, ale towarzyszy mu dalej w trakcie ruchu. Innymi słowy: przez cały czas widać zarówno scenę, jak i jej fragment w przybliżeniu.',
  },
];

const DESCRIPTION_ITEMS_2 = [
  {
    title: 'Udostępnia widok z kamer innym operatorom',
    description:
      'Zaawansowana ściana wideo z przydatnymi funkcjami sprawdza się przy rozproszonych lokalizacjach rejestratorów obrazu. Pozwala wysyłać dany układ kamer do dowolnej stacji klienckiej, prosto i szybko dzielić go między operatorami oraz zarządzać treścią wyświetlaną w stacjach.',
  },
  {
    title: 'Przewiduje ruchy śledzonych obiektów',
    description:
      'System zawiera interaktywną mapę 3D z wizualizacją lokalizacji kamer. To ułatwia operatorom rozpoznanie położenia obiektu. Oprogramowanie odciąża ich w pracy, ponieważ przewiduje miejsce, w którym wkrótce ów obiekt się pojawi. W tym celu wyświetla automatycznie obraz z kolejnej kamery.',
  },
  {
    title: 'Pokazuje panoramiczny obraz',
    description:
      'Inteligentne oprogramowanie łączy widok z trzech usytuowanych najbliżej siebie kamer. Dzięki temu operatorzy otrzymują szeroki widok panoramiczny. Mimo to mogą w dowolnej chwili wybrać i powiększyć dowolną jego część.',
  },
];

export default function WideoNaZywo() {
  return (
    <>
      <PageBanner image="wideo_na_zywo" title="Wideo na żywo" />
      <PageHeadingSection title="W prosty sposób można ułatwić operatorom śledzenie obiektów, a to dzięki wyjątkowym funkcjom naszego inteligentnego monitoringu. Zobacz, co dokładnie potrafi!" />
      <PageInfographicSectionWrapper>
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
        <PageInfographic image="wideo_na_zywo" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_2} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Sądzisz, że takie rozwiązania przydałyby się w Twojej firmie? Daj nam znać!"
      />
    </>
  );
}

WideoNaZywo.seoTags = <PageSEOTags title="WiseVision | Wideo na żywo" />;
