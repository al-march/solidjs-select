import {SolSelect} from '@sol-select';

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Select ui component
      </h1>

      <section class="w-[400px] mx-auto flex flex-col gap-2">
        <SolSelect placeholder="Placeholder">
          <SolSelect.Option value="One">One</SolSelect.Option>
          <SolSelect.Option value="Two">Two</SolSelect.Option>
          <SolSelect.Option value="Three">Three</SolSelect.Option>
          <SolSelect.Option value="Four">Four</SolSelect.Option>
          <SolSelect.Option value="Five">Five</SolSelect.Option>
          <SolSelect.Option value="Six">Six</SolSelect.Option>
          <SolSelect.Option value="Seven">Seven</SolSelect.Option>
        </SolSelect>
        <SolSelect placeholder="Disabled" disabled></SolSelect>
      </section>
    </main>
  );
}
