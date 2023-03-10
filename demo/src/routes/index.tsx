import {SolSelect, Option} from '@sol-select';
import {For} from 'solid-js';
import {COUNTRIES} from '~/mock/countries';

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Select ui component
      </h1>

      <section class="w-[400px] mx-auto flex flex-col gap-2">
        <SolSelect placeholder="Disabled" disabled></SolSelect>

        <SolSelect placeholder="Placeholder">
          <Option value="One">One</Option>
          <Option value="Two">Two</Option>
          <Option value="Three">Three</Option>
          <Option value="Four">Four</Option>
          <Option value="Five">Five</Option>
          <Option value="Six">Six</Option>
          <Option value="Seven">Seven</Option>
        </SolSelect>

        <SolSelect placeholder="Countries" multiple dropdownAsSelect>
          <For each={COUNTRIES}>
            {country => (
              <Option
                value={`${country['alpha-3']} - ${country.name}`}
                subtext={`${country.region} - ${country['sub-region']}`}
              />
            )}
          </For>
        </SolSelect>
      </section>
    </main>
  );
}
