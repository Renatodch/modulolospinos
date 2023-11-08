export function getDay(day: number) {
  switch (day) {
    case 1:
      return "Lunes";
    case 2:
      return "Martes";
    case 3:
      return "Miercoles";
    case 4:
      return "Jueves";
    case 5:
      return "Viernes";
    case 6:
      return "Sabado";
    case 7:
      return "Domingo";
    default:
      return "Domingo";
  }
}
export function getMonth(month: number) {
  switch (month) {
    case 0:
      return "Enero";
    case 1:
      return "Febrero";
    case 2:
      return "Marzo";
    case 3:
      return "Abril";
    case 4:
      return "Mayo";
    case 5:
      return "Junio";
    case 6:
      return "Julio";
    case 7:
      return "Agosto";
    case 8:
      return "Setiembre";
    case 9:
      return "Octubre";
    case 10:
      return "Noviembre";
    case 11:
      return "Diciembre";
    default:
      return "Enero";
  }
}

export const getDateString = (date?: Date | null) =>
  `${getDay(date?.getDay() || 1)} ${date?.getDate()} de ${getMonth(
    date?.getMonth() || 1
  )} del ${date?.getFullYear()} a las ${(
    "" + (date?.getHours() || "00")
  ).padStart(2, "0")}:${("" + (date?.getMinutes() || "00")).padStart(2, "0")}`;
