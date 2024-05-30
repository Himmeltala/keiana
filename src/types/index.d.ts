declare interface IComment {
  value?: string;
  type?: "支" | "收";
  text?: string;
  cost?: number;
  id?: string;
}

declare interface IBalance {
  cost?: number;
  text?: string;
  type?: "支" | "收";
}

declare interface IMonth {
  surplus?: number;
  budget?: number;
  balance?: IBalance[];
}

declare type IRecord = {
  id: string;
  items: Record<string, IMonth>;
};

declare type ViewDate = {
  Y: string;
  M: string
}