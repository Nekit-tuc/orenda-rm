export const propertyTypeOptions = [
  "Комерція",
  "Офіси",
  "Склади",
  "Квартири",
  "Маф/кіоск",
] as const;

export const propertyTypeFilters = ["Всі", ...propertyTypeOptions] as const;

