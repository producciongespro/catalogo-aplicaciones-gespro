export default function mezclarArray(array) {
  const nuevo = [...array];

  for (let i = nuevo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevo[i], nuevo[j]] = [nuevo[j], nuevo[i]];
  }

  return nuevo;
}
