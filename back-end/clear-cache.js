// clear-cache.js serve para limpar dados de importação da módulos do Node
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
console.log("✅ Cache do require limpo!");