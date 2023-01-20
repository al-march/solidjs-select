import {SolSelect} from '@sol-select';

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Select ui component
      </h1>

      <section class="w-[400px] mx-auto">
        <SolSelect placeholder="placeholder"></SolSelect>
      </section>
    </main>
  );
}
