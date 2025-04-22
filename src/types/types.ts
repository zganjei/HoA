export type Styrelsemedlem = {
    namn: string;
    roll: string;
  };
  
  export type Låneinformation = {
    banknamn: string;
    lånebelopp: string;
    räntesats: string;
    löptid: string;
  };
  
  export type SummaryData = {
    föreningens_namn: string;
    styrelsemedlemmar: Styrelsemedlem[];
    sammanfattning: string;
    låneinformation: Låneinformation | Låneinformation[]; // Allow for single or multiple loans
  };