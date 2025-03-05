module.exports = {
  /* for lint-staged */
  globals: {
    __dirname: true,
  },
  extends: ["expo", "prettier", "plugin:import/recommended", "plugin:testing-library/react"],
  plugins: ["prettier", "simple-import-sort", "testing-library"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "import/named": "off",
    "react/jsx-no-duplicate-props": "off",
    "testing-library/await-async-queries": "error",
    "testing-library/no-await-sync-queries": "error",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-manual-cleanup": "error",
    "testing-library/prefer-screen-queries": "error",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};
