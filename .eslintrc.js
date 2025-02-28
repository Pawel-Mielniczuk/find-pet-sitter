module.exports = {
  /* for lint-staged */
  globals: {
    __dirname: true,
  },
  extends: ["expo", "prettier", "plugin:import/recommended"],
  plugins: ["prettier", "simple-import-sort"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
  },
};
