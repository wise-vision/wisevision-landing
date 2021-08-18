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
    title: 'W chmurze…',
    description:
      'Oprogramowanie jest dostępne w chmurze, i to całkowicie bezpłatnie! Wystarczy połączenie z internetem, aby z poziomu przeglądarki zalogować się bezpiecznie do systemu. Zyskujesz wtedy dostęp do poglądu wideo na żywo, możesz przybliżać za pomocą zoomu cyfrowego interesujące Cię obiekty, zarządzać układem kamer, przeszukiwać nagrania, także archiwalne, nadawać uprawnienia itd. Sytuacje alarmujące są do Ciebie wysyłane w linku. Wystarczy w niego kliknąć, aby obejrzeć scenę, która zaniepokoiła system. ',
  },
  {
    title: '…i w aplikacji',
    description:
      'Widok z kamer i zarządzanie nimi możliwe jest także przez aplikację na smartfona, zarówno z oprogramowaniem Android, jak i iOS. Gdy korzystasz z niej, masz m.in. podgląd nagrań wideo – możesz je przeszukiwać oraz przybliżać zarejestrowane na nich obiekty. Natychmiast otrzymasz powiadomienie push o każdym niepokojącym incydencie. ',
  },
  {
    title: 'Bez serwerów!',
    description: (
      <>
        Jeśli korzystasz z opcji webowej oprogramowania WiseVision lub w aplikacji mobilnej,
        wystarczy, że posiadasz jedynie kamery. To po naszej stronie leży utrzymywanie
        infrastruktury systemu – nie potrzebujesz więc u siebie miejsca na serwerownię. To nie
        koniec plusów – dzięki temu możesz również łatwo skalować system.
        <br />
        <br /> Jeśli po naszej stronie będą aktualizowane serwery, u Ciebie pojawi się jedynie
        stosowny komunikat o możliwości zaktualizowania oprogramowania. Wystarczy tylko wyrazić
        zgodę, co czyni proces niezwykle łatwym!
      </>
    ),
  },
];

export default function ZdalnyDostep() {
  return (
    <>
      <PageBanner
        image="zdalny_dostep"
        title="Zdalny dostęp"
        styles={{
          background: {
            backgroundPosition: 'right center',
            '@media screen and (max-width: 480px)': {
              backgroundPosition: 'right -130px center',
            },
          },
        }}
      />
      <PageHeadingSection title="Zyskaj dostęp do obrazu z kamer z dowolnego miejsca, w którym jesteś. Taką możliwość daje nasze inteligentne oprogramowanie. I to nawet jeśli lokalizacje kamer są rozproszone – znajdują się w odległych od siebie miejscach, miastach, a nawet… państwach!" />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="zdalny_dostep" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Jeśli chcesz mieć zdalny dostęp do monitoringu – odezwij się do nas już teraz i zapytaj o szczegóły!"
      />
    </>
  );
}

ZdalnyDostep.seoTags = <PageSEOTags title="WiseVision | Zdalny dostęp" />;
