import {
  PageBanner,
  PageDescriptionItems,
  PageHeadingSection,
  PageInfographic,
  PageInfographicSectionWrapper,
} from 'components/PageWithInfographic';

const DESCRIPTION_ITEMS_1 = [
  {
    title: 'Zarządzasz efektywnie personelem',
    description:
      'System wskazuje operatorom, w którym miejscu najchętniej przebywają klienci oraz gdzie tworzy się kolejka. Dzięki temu możesz bez trudu zarządzać zasobami ludzkimi – kierując personel tam, gdzie jest najbardziej potrzebny w danej chwili.',
  },
  {
    title: 'Zbierasz dane demograficzne klientów',
    description:
      'Algorytmy potrafią szacować wiek oraz płeć ludzi. Dzięki tym informacjom wiesz się, kto odwiedza Twój sklep, a to ułatwi Twoim marketingowcom kierowanie odpowiednich, a więc skuteczniejszych, ofert i reklam do klientów.',
  },
  {
    title: 'Rozpoznajesz niepożądanych klientów ',
    description:
      'Jeśli w bazie danych posiadasz zdjęcia twarzy klientów VIP lub tych z czarnej listy (np. złodziei), inteligentne oprogramowanie ich rozpozna i powiadomi personel, że właśnie przyszli do sklepu.',
  },
  {
    title: 'Znasz współczynnik konwersji',
    description:
      'Inteligentny system liczy ludzi wchodzących do sklepu lub danego obszaru oraz tych, którzy go opuszczają. Dzięki tej funkcji (w połączeniu z danymi sprzedażowymi) otrzymasz współczynnik konwersji sprzedaży. Podczas pandemii COVID-19 wiedza o aktualnie przebywających klientach w sklepie przyda się dodatkowo – gdy nakładane są limity odwiedzających na metr kwadratowy.',
  },
  {
    title: 'Weryfikujesz transakcje POS',
    description:
      'Co daje połączenie naszego oprogramowania z kasami fiskalnymi? Po wprowadzeniu danych z określonego paragonu (np. nazwy produktu) system automatycznie odszuka nagranie z momentu zakupu.',
  },
  {
    title: 'Znasz najpopularniejsze obszary w sklepie',
    description:
      'Dzięki mapom ciepła wiesz, gdzie i jak często przebywają wszystkie osoby lub tylko te, które sam zdefiniujesz. To pozwoli Ci m.in. odkryć najpopularniejsze wśród klientów miejsca w sklepie oraz te, gdzie najczęściej przebywa personel. ',
  },
  {
    title: 'Zbierasz rozmaite dane',
    description:
      'Wszystkie dane: od transakcji POS, przez długość kolejki, po liczbę odwiedzających i ich wiek możesz wygenerować w specjalnym raporcie. Dzięki temu zyskasz użyteczną wiedzę o każdym sklepie w sieci.',
  },
];

export default function AnalitykaDlaHandlu() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="Analityka dla handlu" />
      <PageHeadingSection title="Potrzebujesz inteligentnego monitoringu do pojedynczego sklepu, a może całej sieci? Przekonaj się, co zyskujesz, wybierając nasze rozwiązanie." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Jeśli uważasz, że funkcje inteligentnego oprogramowania przydałyby się w Twoim sklepie, skontaktuj się z nami!"
      />
    </>
  );
}
