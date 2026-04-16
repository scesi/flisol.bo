interface YearTheme {
  fontFamily: string;
  arrowColor: string;
  arrowBg: string;
  fontSize: string;
  titleFontSize: string;
}

export const YEAR_THEMES: Record<string, YearTheme> = {
  "2025": {
    fontFamily: "'Luckiest_Guy', sans-serif",
    arrowColor: "#f4e957",
    arrowBg: "#4752ae",
    titleFontSize: "1.5rem",
    fontSize: "1.2rem",
  },
  "2026": {
    fontFamily: "'PressStart2P', sans-serif",
    arrowColor: "#e9ba2d",
    arrowBg: "#331177",
    titleFontSize: "1.2rem",
    fontSize: "0.8rem",
  }
};