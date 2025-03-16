# BloomTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.6.

I structured the application into two root folders:
- `filter` folder: Contains components and services related to filtering.
- `shared` folder: Stores reusable components that can be used across a larger application.

The `Autocomplete` component includes a feature that allows changing the header of the autocomplete dropdown by providing a custom template using the `customHeaderTemplate` variable. This enables customization of the layout for different scenarios while keeping the core autocomplete functionality minimal.

The `ContainsSelectorComponent` — based on its label—suggests that it should load data from a separate API. Therefore, I separated it into its own component.

The form is built using custom form controls that implement `ControlValueAccessor`. This allows us to leverage all the benefits of the `ReactiveFormsModule`.