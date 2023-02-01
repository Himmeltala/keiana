declare interface IComments {
  value?: string;
  type?: "支" | "收";
  text?: string;
  cost?: number;
  id?: string;
}

declare interface ILastViewd {
  Y?: string;
  M?: string;
}

declare interface IItem {
  cost?: number;
  text?: string;
  type?: "支" | "收";
  sameat?: ISameat;
}

declare type ISameat = number[] | string[];

declare interface IMonth {
  surplus?: number;
  budget?: number;
  items?: IItem[];
}

declare type IRecord = {
  id: string;
  items: Record<string, IMonth>
};