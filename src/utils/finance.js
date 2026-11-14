export const money = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
export const sum = (rows) => rows.reduce((total, row) => total + row.amount, 0);
export const dateLabel = (date) => date.split("-").reverse().join("/");
export const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
