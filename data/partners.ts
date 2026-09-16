export type PartnerType = "partner" | "collaboration" | "support";

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  logo?: string;
  url?: string;
};

// type:
//  partner       = 正式に業務提携契約を締結している企業
//  collaboration = イベント等で連携・協力いただいた実績
//  support       = 後援・協賛など
//
// 確認が取れていない企業を "partner" として掲載しないこと。
// 正式情報が確定するまでは空配列のままにする。
export const partners: Partner[] = [];
