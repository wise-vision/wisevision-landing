import {
  PageBanner,
  PageDescriptionItems,
  PageHeadingSection,
  PageInfographic,
  PageInfographicSectionWrapper,
} from 'components/PageWithInfographic';

const DESCRIPTION_ITEMS_1 = [
  {
    title: 'Sprawny zapis',
    description:
      'Jeśli tylko dodasz kamerę do systemu, obraz z niej będzie automatycznie wysyłany na serwer. To tam zachodzi analiza zapisu przy wykorzystaniu sztucznej inteligencji. Gdyby nastąpiła awaria internetu, brakujący obraz – po ponownym nawiązaniu połączenia – zostanie automatycznie zsynchronizowany. Nie musisz więc się martwić, że możesz coś utracić.',
  },
  {
    title: 'Inteligentny eksport ',
    description:
      'Zapisy z kamer można eksportować w chronionych hasłem plikach .zip wraz z komentarzami do nich. Jeśli obraz okaże się za duży, zostanie automatycznie podzielony na mniejsze. Co więcej, system umożliwia pominięcie eksportu określonych klatek wideo – wysyłasz tylko to, co trzeba, bez tracenia czasu na cięcie materiału.',
  },
  {
    title: 'Opcja maskowania',
    description:
      'Aby zapewnić anonimowość nagranych osób zgodnie z wymaganiami RODO, system – dzięki narzędziu do wykrywania twarzy – zakryje je. Możesz także maskować obiekty. ',
  },
];

export default function ZarzadzanieWideo() {
  return (
    <>
      <PageBanner image="zarzadzanie_wideo" title="Zarządzanie zasobami wideo" />
      <PageHeadingSection title="Dowiedz się, co możesz zrobić z zarejestrowanymi przez kamery obrazami, gdy wybierzesz inteligentne oprogramowanie do monitoringu." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="zarzadzanie_wideo" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Zainteresowały Cię możliwości naszego oprogramowania? Jest ich jeszcze więcej! Skontaktuj się z nami, a poznasz jego bardziej szczegółowe funkcje."
      />
    </>
  );
}
